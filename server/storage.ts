import { 
  type User, 
  type InsertUser,
  type Omni2Data,
  type InsertOmni2Data,
  type Forecast,
  type InsertForecast,
  type Alert,
  type InsertAlert,
  type ModelMetrics,
  type InsertModelMetrics,
  type DataSource,
  type InsertDataSource,
  getStormLevel,
  users,
  omni2Data,
  forecasts,
  alerts,
  modelMetrics,
  dataSources
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

// Enhanced storage interface for space weather system
export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // OMNI2 space weather data
  getLatestOmni2Data(limit?: number): Promise<Omni2Data[]>;
  insertOmni2Data(data: InsertOmni2Data): Promise<Omni2Data>;
  getOmni2DataRange(startTime: Date, endTime: Date): Promise<Omni2Data[]>;
  
  // Forecasting
  getLatestForecast(horizon: "30min" | "3hour"): Promise<Forecast | undefined>;
  insertForecast(forecast: InsertForecast): Promise<Forecast>;
  getForecastHistory(horizon: "30min" | "3hour", limit?: number): Promise<Forecast[]>;
  
  // Alerts
  getActiveAlerts(): Promise<Alert[]>;
  getAlertHistory(limit?: number): Promise<Alert[]>;
  insertAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert | undefined>;
  
  // Model metrics
  getLatestModelMetrics(): Promise<ModelMetrics | undefined>;
  insertModelMetrics(metrics: InsertModelMetrics): Promise<ModelMetrics>;
  getModelMetricsHistory(limit?: number): Promise<ModelMetrics[]>;
  
  // Data sources
  getAllDataSources(): Promise<DataSource[]>;
  updateDataSourceStatus(name: string, status: string, latencyMs?: number): Promise<DataSource | undefined>;
  insertDataSource(source: InsertDataSource): Promise<DataSource>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private omni2Data: Map<string, Omni2Data>;
  private forecasts: Map<string, Forecast>;
  private alerts: Map<string, Alert>;
  private modelMetrics: Map<string, ModelMetrics>;
  private dataSources: Map<string, DataSource>;

  constructor() {
    this.users = new Map();
    this.omni2Data = new Map();
    this.forecasts = new Map();
    this.alerts = new Map();
    this.modelMetrics = new Map();
    this.dataSources = new Map();
    
    // Initialize with mock data sources
    this.initializeMockData();
  }

  private async initializeMockData(): Promise<void> {
    // Initialize data sources
    const mockSources: InsertDataSource[] = [
      { name: "ACE", type: "satellite", status: "online", update_frequency: 300, critical: true, url: "https://www.spaceweather.gov/", latency_ms: 150, reliability_score: 0.98 },
      { name: "WIND", type: "satellite", status: "online", update_frequency: 300, critical: true, url: "https://wind.nasa.gov/", latency_ms: 200, reliability_score: 0.95 },
      { name: "DSCOVR", type: "satellite", status: "degraded", update_frequency: 300, critical: false, url: "https://www.nesdis.noaa.gov/", latency_ms: 450, reliability_score: 0.87 },
      { name: "GOES-16", type: "satellite", status: "online", update_frequency: 60, critical: true, url: "https://www.goes.noaa.gov/", latency_ms: 100, reliability_score: 0.99 },
      { name: "SOHO", type: "satellite", status: "online", update_frequency: 600, critical: false, url: "https://soho.esac.esa.int/", latency_ms: 300, reliability_score: 0.92 }
    ];

    for (const source of mockSources) {
      await this.insertDataSource(source);
    }
    
    // Initialize with recent OMNI2 data
    const now = new Date();
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(now.getTime() - i * 3600000); // hourly data for last 100 hours
      await this.insertOmni2Data({
        timestamp,
        dst_index: -20 + Math.random() * 60 - 30, // -50 to +10
        scalar_b: 3 + Math.random() * 12, // 3-15 nT
        alpha_proton_ratio: 0.03 + Math.random() * 0.07, // 0.03-0.1
        sunspot_number: Math.floor(Math.random() * 200),
        sw_plasma_temperature: 10000 + Math.random() * 50000, // 10K-60K
        sw_plasma_speed: 300 + Math.random() * 400, // 300-700 km/s
        kp_index: Math.random() * 9,
        ae_index: Math.random() * 2000,
        source: "ACE",
        quality: Math.random() > 0.1 ? "good" : "fair"
      });
    }
  }

  // User management methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "viewer",
      email: insertUser.email || null,
      active: true, 
      created_at: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // OMNI2 data methods
  async getLatestOmni2Data(limit = 24): Promise<Omni2Data[]> {
    const allData = Array.from(this.omni2Data.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return allData;
  }

  async insertOmni2Data(data: InsertOmni2Data): Promise<Omni2Data> {
    const id = randomUUID();
    const omniData: Omni2Data = {
      id,
      timestamp: data.timestamp,
      dst_index: data.dst_index || null,
      scalar_b: data.scalar_b || null,
      alpha_proton_ratio: data.alpha_proton_ratio || null,
      sunspot_number: data.sunspot_number || null,
      sw_plasma_temperature: data.sw_plasma_temperature || null,
      sw_plasma_speed: data.sw_plasma_speed || null,
      kp_index: data.kp_index || null,
      ae_index: data.ae_index || null,
      source: data.source || "ACE",
      quality: data.quality || "good",
      created_at: new Date(),
    };
    this.omni2Data.set(id, omniData);
    return omniData;
  }

  async getOmni2DataRange(startTime: Date, endTime: Date): Promise<Omni2Data[]> {
    return Array.from(this.omni2Data.values())
      .filter(data => data.timestamp >= startTime && data.timestamp <= endTime)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Forecast methods
  async getLatestForecast(horizon: "30min" | "3hour"): Promise<Forecast | undefined> {
    const forecasts = Array.from(this.forecasts.values())
      .filter(f => f.horizon === horizon)
      .sort((a, b) => b.forecast_time.getTime() - a.forecast_time.getTime());
    return forecasts[0];
  }

  async insertForecast(forecast: InsertForecast): Promise<Forecast> {
    const id = randomUUID();
    const newForecast: Forecast = {
      id,
      forecast_time: forecast.forecast_time,
      horizon: forecast.horizon,
      predicted_dst: forecast.predicted_dst,
      confidence_score: forecast.confidence_score,
      storm_level: forecast.storm_level,
      model_version: forecast.model_version,
      feature_importance: forecast.feature_importance || {},
      created_at: new Date(),
    };
    this.forecasts.set(id, newForecast);
    return newForecast;
  }

  async getForecastHistory(horizon: "30min" | "3hour", limit = 50): Promise<Forecast[]> {
    return Array.from(this.forecasts.values())
      .filter(f => f.horizon === horizon)
      .sort((a, b) => b.forecast_time.getTime() - a.forecast_time.getTime())
      .slice(0, limit);
  }

  // Alert methods
  async getActiveAlerts(): Promise<Alert[]> {
    const now = new Date();
    return Array.from(this.alerts.values())
      .filter(alert => alert.status === 'active' && (!alert.expires_at || alert.expires_at > now))
      .sort((a, b) => b.created_at!.getTime() - a.created_at!.getTime());
  }

  async getAlertHistory(limit = 100): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.created_at!.getTime() - a.created_at!.getTime())
      .slice(0, limit);
  }

  async insertAlert(alert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const newAlert: Alert = {
      id,
      alert_level: alert.alert_level,
      predicted_dst: alert.predicted_dst,
      forecast_horizon: alert.forecast_horizon,
      title: alert.title,
      description: alert.description,
      confidence: alert.confidence,
      affected_systems: alert.affected_systems || [],
      status: alert.status || "active",
      acknowledged_by: alert.acknowledged_by || null,
      acknowledged_at: null,
      created_at: new Date(),
      expires_at: alert.expires_at || null,
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.status = 'acknowledged';
      alert.acknowledged_by = acknowledgedBy;
      alert.acknowledged_at = new Date();
      this.alerts.set(id, alert);
    }
    return alert;
  }

  // Model metrics methods
  async getLatestModelMetrics(): Promise<ModelMetrics | undefined> {
    const metrics = Array.from(this.modelMetrics.values())
      .sort((a, b) => b.training_date.getTime() - a.training_date.getTime());
    return metrics[0];
  }

  async insertModelMetrics(metrics: InsertModelMetrics): Promise<ModelMetrics> {
    const id = randomUUID();
    const newMetrics: ModelMetrics = {
      ...metrics,
      id,
      created_at: new Date(),
    };
    this.modelMetrics.set(id, newMetrics);
    return newMetrics;
  }

  async getModelMetricsHistory(limit = 20): Promise<ModelMetrics[]> {
    return Array.from(this.modelMetrics.values())
      .sort((a, b) => b.training_date.getTime() - a.training_date.getTime())
      .slice(0, limit);
  }

  // Data source methods
  async getAllDataSources(): Promise<DataSource[]> {
    return Array.from(this.dataSources.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateDataSourceStatus(name: string, status: string, latencyMs?: number): Promise<DataSource | undefined> {
    const source = Array.from(this.dataSources.values()).find(s => s.name === name);
    if (source) {
      source.status = status;
      source.last_successful_ingest = new Date();
      if (latencyMs !== undefined) {
        source.latency_ms = latencyMs;
      }
      this.dataSources.set(source.id, source);
    }
    return source;
  }

  async insertDataSource(source: InsertDataSource): Promise<DataSource> {
    const id = randomUUID();
    const newSource: DataSource = {
      id,
      name: source.name,
      type: source.type,
      url: source.url || null,
      status: source.status || "online",
      last_successful_ingest: source.last_successful_ingest || null,
      latency_ms: source.latency_ms || null,
      reliability_score: source.reliability_score || null,
      update_frequency: source.update_frequency || null,
      critical: source.critical || false,
      created_at: new Date(),
    };
    this.dataSources.set(id, newSource);
    return newSource;
  }
}

// PostgreSQL implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // User management methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // OMNI2 data methods
  async getLatestOmni2Data(limit = 24): Promise<Omni2Data[]> {
    return await db.select()
      .from(omni2Data)
      .orderBy(desc(omni2Data.timestamp))
      .limit(limit);
  }

  async insertOmni2Data(data: InsertOmni2Data): Promise<Omni2Data> {
    const [result] = await db
      .insert(omni2Data)
      .values(data)
      .returning();
    return result;
  }

  async getOmni2DataRange(startTime: Date, endTime: Date): Promise<Omni2Data[]> {
    return await db.select()
      .from(omni2Data)
      .where(and(
        gte(omni2Data.timestamp, startTime),
        lte(omni2Data.timestamp, endTime)
      ))
      .orderBy(omni2Data.timestamp);
  }

  // Forecast methods
  async getLatestForecast(horizon: "30min" | "3hour"): Promise<Forecast | undefined> {
    const [forecast] = await db.select()
      .from(forecasts)
      .where(eq(forecasts.horizon, horizon))
      .orderBy(desc(forecasts.forecast_time))
      .limit(1);
    return forecast || undefined;
  }

  async insertForecast(forecast: InsertForecast): Promise<Forecast> {
    const [result] = await db
      .insert(forecasts)
      .values(forecast)
      .returning();
    return result;
  }

  async getForecastHistory(horizon: "30min" | "3hour", limit = 50): Promise<Forecast[]> {
    return await db.select()
      .from(forecasts)
      .where(eq(forecasts.horizon, horizon))
      .orderBy(desc(forecasts.forecast_time))
      .limit(limit);
  }

  // Alert methods
  async getActiveAlerts(): Promise<Alert[]> {
    const now = new Date();
    // Get all active alerts and filter expired ones in JavaScript
    // since Drizzle OR logic for nullable fields can be complex
    const activeAlerts = await db.select()
      .from(alerts)
      .where(eq(alerts.status, 'active'))
      .orderBy(desc(alerts.created_at));
    
    // Filter out expired alerts (keep alerts with no expiry or future expiry)
    return activeAlerts.filter(alert => !alert.expires_at || alert.expires_at > now);
  }

  async getAlertHistory(limit = 100): Promise<Alert[]> {
    return await db.select()
      .from(alerts)
      .orderBy(desc(alerts.created_at))
      .limit(limit);
  }

  async insertAlert(alert: InsertAlert): Promise<Alert> {
    const [result] = await db
      .insert(alerts)
      .values(alert)
      .returning();
    return result;
  }

  async acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert | undefined> {
    const [result] = await db
      .update(alerts)
      .set({
        status: 'acknowledged',
        acknowledged_by: acknowledgedBy,
        acknowledged_at: new Date()
      })
      .where(eq(alerts.id, id))
      .returning();
    return result || undefined;
  }

  // Model metrics methods
  async getLatestModelMetrics(): Promise<ModelMetrics | undefined> {
    const [metrics] = await db.select()
      .from(modelMetrics)
      .orderBy(desc(modelMetrics.training_date))
      .limit(1);
    return metrics || undefined;
  }

  async insertModelMetrics(metrics: InsertModelMetrics): Promise<ModelMetrics> {
    const [result] = await db
      .insert(modelMetrics)
      .values(metrics)
      .returning();
    return result;
  }

  async getModelMetricsHistory(limit = 20): Promise<ModelMetrics[]> {
    return await db.select()
      .from(modelMetrics)
      .orderBy(desc(modelMetrics.training_date))
      .limit(limit);
  }

  // Data source methods
  async getAllDataSources(): Promise<DataSource[]> {
    return await db.select()
      .from(dataSources)
      .orderBy(dataSources.name);
  }

  async updateDataSourceStatus(name: string, status: string, latencyMs?: number): Promise<DataSource | undefined> {
    const updateData: any = {
      status,
      last_successful_ingest: new Date(),
    };
    if (latencyMs !== undefined) {
      updateData.latency_ms = latencyMs;
    }

    const [result] = await db
      .update(dataSources)
      .set(updateData)
      .where(eq(dataSources.name, name))
      .returning();
    return result || undefined;
  }

  async insertDataSource(source: InsertDataSource): Promise<DataSource> {
    const [result] = await db
      .insert(dataSources)
      .values(source)
      .returning();
    return result;
  }

  // Initialize method for seeding data
  async initializeWithMockData(): Promise<void> {
    // Check if we already have data
    const existingSources = await this.getAllDataSources();
    if (existingSources.length > 0) {
      return; // Already initialized
    }

    // Initialize data sources
    const mockSources: InsertDataSource[] = [
      { name: "ACE", type: "satellite", status: "online", update_frequency: 300, critical: true, url: "https://www.spaceweather.gov/", latency_ms: 150, reliability_score: 0.98 },
      { name: "WIND", type: "satellite", status: "online", update_frequency: 300, critical: true, url: "https://wind.nasa.gov/", latency_ms: 200, reliability_score: 0.95 },
      { name: "DSCOVR", type: "satellite", status: "degraded", update_frequency: 300, critical: false, url: "https://www.nesdis.noaa.gov/", latency_ms: 450, reliability_score: 0.87 },
      { name: "GOES-16", type: "satellite", status: "online", update_frequency: 60, critical: true, url: "https://www.goes.noaa.gov/", latency_ms: 100, reliability_score: 0.99 },
      { name: "SOHO", type: "satellite", status: "online", update_frequency: 600, critical: false, url: "https://soho.esac.esa.int/", latency_ms: 300, reliability_score: 0.92 }
    ];

    for (const source of mockSources) {
      await this.insertDataSource(source);
    }
    
    // Initialize with recent OMNI2 data
    const now = new Date();
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(now.getTime() - i * 3600000); // hourly data for last 100 hours
      await this.insertOmni2Data({
        timestamp,
        dst_index: -20 + Math.random() * 60 - 30, // -50 to +10
        scalar_b: 3 + Math.random() * 12, // 3-15 nT
        alpha_proton_ratio: 0.03 + Math.random() * 0.07, // 0.03-0.1
        sunspot_number: Math.floor(Math.random() * 200),
        sw_plasma_temperature: 10000 + Math.random() * 50000, // 10K-60K
        sw_plasma_speed: 300 + Math.random() * 400, // 300-700 km/s
        kp_index: Math.random() * 9,
        ae_index: Math.random() * 2000,
        source: "ACE",
        quality: Math.random() > 0.1 ? "good" : "fair"
      });
    }
  }
}

// Use PostgreSQL storage in production, MemStorage for development/testing
const useDatabase = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;

let storage: IStorage;

if (useDatabase) {
  storage = new DatabaseStorage();
  // Initialize with mock data if needed
  (storage as DatabaseStorage).initializeWithMockData().catch(console.error);
} else {
  storage = new MemStorage();
}

export { storage };
