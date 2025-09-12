import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geostormModel } from "./ml-model";
import { 
  insertOmni2DataSchema, 
  insertAlertSchema, 
  alertThresholds,
  getStormLevel 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // OMNI2 Data Endpoints
  app.get("/api/omni2/latest", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 24;
      const data = await storage.getLatestOmni2Data(limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch OMNI2 data" });
    }
  });

  app.post("/api/omni2/ingest", async (req, res) => {
    try {
      const validData = insertOmni2DataSchema.parse(req.body);
      const result = await storage.insertOmni2Data(validData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid OMNI2 data format" });
    }
  });

  // Forecast Endpoints (Core specification requirement)
  app.get("/api/forecast/geomagnetic/:horizon", async (req, res) => {
    try {
      const horizon = req.params.horizon as "30min" | "3hour";
      
      if (horizon !== "30min" && horizon !== "3hour") {
        return res.status(400).json({ error: "Invalid horizon. Use '30min' or '3hour'" });
      }

      // Get recent OMNI2 data for prediction
      const recentData = await storage.getLatestOmni2Data(12);
      
      if (recentData.length === 0) {
        return res.status(503).json({ error: "Insufficient data for prediction" });
      }

      // Generate prediction using ML model
      const prediction = horizon === "30min" 
        ? geostormModel.predict30Min(recentData)
        : geostormModel.predict3Hour(recentData);

      // Store forecast in database
      await storage.insertForecast({
        forecast_time: new Date(),
        horizon,
        predicted_dst: prediction.predicted_dst,
        confidence_score: prediction.confidence_score,
        storm_level: prediction.storm_level,
        model_version: prediction.model_version,
        feature_importance: prediction.feature_importance,
      });

      // Check if alert should be generated
      await checkAndGenerateAlert(prediction, horizon);

      res.json({
        predicted_dst: prediction.predicted_dst,
        confidence_score: prediction.confidence_score,
        storm_level: prediction.storm_level,
        forecast_time: new Date().toISOString(),
        horizon,
        model_version: prediction.model_version,
        feature_importance: prediction.feature_importance,
      });
    } catch (error) {
      console.error("Forecast error:", error);
      res.status(500).json({ error: "Failed to generate forecast" });
    }
  });

  app.get("/api/forecast/history/:horizon", async (req, res) => {
    try {
      const horizon = req.params.horizon as "30min" | "3hour";
      const limit = parseInt(req.query.limit as string) || 50;
      
      const history = await storage.getForecastHistory(horizon, limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forecast history" });
    }
  });

  // Model Management Endpoints (Specification requirement)
  app.get("/api/model/metrics/geomagnetic", async (req, res) => {
    try {
      const metrics = geostormModel.getModelMetrics();
      
      // Store metrics in database
      await storage.insertModelMetrics(metrics);
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch model metrics" });
    }
  });

  app.post("/api/model/train/geomagnetic", async (req, res) => {
    try {
      const { training_period_hours = 720 } = req.body; // Default 30 days
      
      // Get training data
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - training_period_hours * 3600000);
      const trainingData = await storage.getOmni2DataRange(startTime, endTime);
      
      if (trainingData.length < 100) {
        return res.status(400).json({ error: "Insufficient training data" });
      }

      // Trigger model retraining
      const success = await geostormModel.retrain(trainingData);
      
      if (success) {
        // Store new metrics after retraining
        const newMetrics = geostormModel.getModelMetrics();
        await storage.insertModelMetrics(newMetrics);
        
        res.json({ 
          message: "Model retraining completed successfully",
          metrics: newMetrics,
          training_samples: trainingData.length 
        });
      } else {
        res.status(500).json({ error: "Model retraining failed" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrain model" });
    }
  });

  // Alert Management Endpoints
  app.get("/api/alerts/active", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active alerts" });
    }
  });

  app.get("/api/alerts/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const alerts = await storage.getAlertHistory(limit);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alert history" });
    }
  });

  app.post("/api/alerts/:id/acknowledge", async (req, res) => {
    try {
      const { id } = req.params;
      const { acknowledged_by } = req.body;
      
      if (!acknowledged_by) {
        return res.status(400).json({ error: "acknowledged_by is required" });
      }

      const alert = await storage.acknowledgeAlert(id, acknowledged_by);
      
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }

      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to acknowledge alert" });
    }
  });

  // Data Sources Endpoints
  app.get("/api/sources", async (req, res) => {
    try {
      const sources = await storage.getAllDataSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data sources" });
    }
  });

  app.put("/api/sources/:name/status", async (req, res) => {
    try {
      const { name } = req.params;
      const { status, latency_ms } = req.body;
      
      const source = await storage.updateDataSourceStatus(name, status, latency_ms);
      
      if (!source) {
        return res.status(404).json({ error: "Data source not found" });
      }

      res.json(source);
    } catch (error) {
      res.status(500).json({ error: "Failed to update data source status" });
    }
  });

  // Current Conditions Summary Endpoint
  app.get("/api/conditions/current", async (req, res) => {
    try {
      const [latestData, latest30min, latest3hour, activeSources] = await Promise.all([
        storage.getLatestOmni2Data(1),
        storage.getLatestForecast("30min"),
        storage.getLatestForecast("3hour"),
        storage.getAllDataSources()
      ]);

      const current = latestData[0];
      const onlineSources = activeSources.filter(s => s.status === "online").length;
      const totalSources = activeSources.length;

      res.json({
        current_conditions: {
          dst_index: current?.dst_index || null,
          kp_index: current?.kp_index || null,
          ae_index: current?.ae_index || null,
          scalar_b: current?.scalar_b || null,
          sw_plasma_speed: current?.sw_plasma_speed || null,
          timestamp: current?.timestamp || null,
        },
        forecasts: {
          "30min": latest30min ? {
            predicted_dst: latest30min.predicted_dst,
            storm_level: latest30min.storm_level,
            confidence: latest30min.confidence_score,
            forecast_time: latest30min.forecast_time,
          } : null,
          "3hour": latest3hour ? {
            predicted_dst: latest3hour.predicted_dst,
            storm_level: latest3hour.storm_level,
            confidence: latest3hour.confidence_score,
            forecast_time: latest3hour.forecast_time,
          } : null,
        },
        system_status: {
          data_sources_online: onlineSources,
          total_data_sources: totalSources,
          health_percentage: Math.round((onlineSources / totalSources) * 100),
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch current conditions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to check if alert should be generated
async function checkAndGenerateAlert(prediction: any, horizon: "30min" | "3hour"): Promise<void> {
  const dst = prediction.predicted_dst;
  
  // Determine alert level based on Dst thresholds from specification
  let alertLevel: keyof typeof alertThresholds | null = null;
  
  if (dst <= alertThresholds.extreme.max) alertLevel = "extreme";
  else if (dst <= alertThresholds.severe.max) alertLevel = "severe";
  else if (dst <= alertThresholds.strong.max) alertLevel = "strong";
  else if (dst <= alertThresholds.moderate.max) alertLevel = "moderate";
  else if (dst <= alertThresholds.weak.max) alertLevel = "weak";

  if (alertLevel) {
    // Check if similar alert already exists to avoid spam
    const activeAlerts = await storage.getActiveAlerts();
    const existingAlert = activeAlerts.find(alert => 
      alert.alert_level === alertLevel && 
      alert.forecast_horizon === horizon &&
      Math.abs(alert.predicted_dst - dst) < 10 // Within 10 nT
    );

    if (!existingAlert) {
      const alertTitle = `${alertLevel.toUpperCase()} Geomagnetic Storm Alert (${horizon} forecast)`;
      const alertDescription = `Predicted Dst index: ${dst.toFixed(1)} nT. ${getAlertDescription(alertLevel, dst)}`;
      
      await storage.insertAlert({
        alert_level: alertLevel,
        predicted_dst: dst,
        forecast_horizon: horizon,
        title: alertTitle,
        description: alertDescription,
        confidence: prediction.confidence_score,
        affected_systems: getAffectedSystems(alertLevel),
        expires_at: new Date(Date.now() + (horizon === "30min" ? 30 * 60000 : 3 * 3600000)), // Expire when horizon passes
      });

      console.log(`[ALERT] Generated ${alertLevel} alert for ${horizon} forecast: Dst ${dst.toFixed(1)} nT`);
    }
  }
}

function getAlertDescription(level: string, dst: number): string {
  switch (level) {
    case "extreme":
      return "Severe space weather event. Significant infrastructure impacts expected. Immediate action required.";
    case "severe":
      return "Major geomagnetic storm. Power grids and satellite operations may be affected.";
    case "strong":
      return "Strong geomagnetic activity. Monitor critical systems and prepare contingency plans.";
    case "moderate":
      return "Moderate geomagnetic storm conditions. Some operational impacts possible.";
    case "weak":
      return "Minor geomagnetic disturbance. Minimal operational impacts expected.";
    default:
      return "Geomagnetic activity detected.";
  }
}

function getAffectedSystems(level: string): string[] {
  const baseSystems = ["GNSS/GPS", "HF Radio Communications"];
  
  switch (level) {
    case "extreme":
    case "severe":
      return [...baseSystems, "Power Grids", "Satellites", "Aviation (High Latitude)", "Pipelines"];
    case "strong":
      return [...baseSystems, "Satellites", "Aviation (Polar Routes)"];
    case "moderate":
      return [...baseSystems, "Satellites"];
    case "weak":
      return ["HF Radio Communications"];
    default:
      return [];
  }
}
