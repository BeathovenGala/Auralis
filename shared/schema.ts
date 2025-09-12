import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("viewer"),
  email: text("email"),
  active: boolean("active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
});

// OMNI2 Space Weather Data
export const omni2Data = pgTable("omni2_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull(),
  
  // Key Predictor Variables from specification
  dst_index: real("dst_index"), // Disturbance Storm Time index
  scalar_b: real("scalar_b"), // IMF magnitude
  alpha_proton_ratio: real("alpha_proton_ratio"), // Alpha/Proton ratio
  sunspot_number: real("sunspot_number"), // R (Sunspot No.)
  sw_plasma_temperature: real("sw_plasma_temperature"), // SW Plasma Temperature
  sw_plasma_speed: real("sw_plasma_speed"), // SW Plasma Speed
  
  // Additional indices
  kp_index: real("kp_index"), // Planetary K-index
  ae_index: real("ae_index"), // Auroral Electrojet index
  
  // Data quality and source
  source: text("source").notNull().default("ACE"),
  quality: text("quality").notNull().default("good"),
  created_at: timestamp("created_at").defaultNow(),
});

// Geomagnetic Storm Forecasts
export const forecasts = pgTable("forecasts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  forecast_time: timestamp("forecast_time").notNull(),
  horizon: text("horizon").notNull(), // "30min" or "3hour"
  
  // Predictions
  predicted_dst: real("predicted_dst").notNull(),
  confidence_score: real("confidence_score").notNull(),
  storm_level: text("storm_level").notNull(), // G0, G1, G2, G3, G4, G5
  
  // Model metadata
  model_version: text("model_version").notNull(),
  feature_importance: jsonb("feature_importance"), // JSON object with feature weights
  created_at: timestamp("created_at").defaultNow(),
});

// Dynamic Alerts System
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alert_level: text("alert_level").notNull(), // weak, moderate, strong, severe, extreme
  predicted_dst: real("predicted_dst").notNull(),
  forecast_horizon: text("forecast_horizon").notNull(),
  
  // Alert metadata
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: real("confidence").notNull(),
  affected_systems: jsonb("affected_systems"), // JSON array of affected systems
  
  // Status and timing
  status: text("status").notNull().default("active"), // active, acknowledged, resolved
  acknowledged_by: text("acknowledged_by"),
  acknowledged_at: timestamp("acknowledged_at"),
  created_at: timestamp("created_at").defaultNow(),
  expires_at: timestamp("expires_at"),
});

// Model Performance Metrics
export const modelMetrics = pgTable("model_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  model_version: text("model_version").notNull(),
  training_date: timestamp("training_date").notNull(),
  
  // Performance metrics from specification
  rmse: real("rmse").notNull(), // Root Mean Squared Error
  r2_score: real("r2_score").notNull(), // Coefficient of Determination
  correlation_coefficient: real("correlation_coefficient").notNull(),
  mape: real("mape").notNull(), // Mean Absolute Percentage Error
  
  // Training metadata
  training_samples: integer("training_samples").notNull(),
  validation_samples: integer("validation_samples").notNull(),
  feature_importance: jsonb("feature_importance").notNull(),
  hyperparameters: jsonb("hyperparameters").notNull(),
  
  created_at: timestamp("created_at").defaultNow(),
});

// Data Sources Health Monitoring
export const dataSources = pgTable("data_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // "satellite", "ground", "model"
  url: text("url"),
  
  // Health metrics
  status: text("status").notNull().default("online"), // online, degraded, offline, maintenance
  last_successful_ingest: timestamp("last_successful_ingest"),
  latency_ms: integer("latency_ms"),
  reliability_score: real("reliability_score").default(1.0),
  
  // Configuration
  update_frequency: integer("update_frequency"), // seconds
  critical: boolean("critical").notNull().default(false),
  created_at: timestamp("created_at").defaultNow(),
});

// Zod Schemas for API validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  email: true,
});

export const insertOmni2DataSchema = createInsertSchema(omni2Data).omit({
  id: true,
  created_at: true,
});

export const insertForecastSchema = createInsertSchema(forecasts).omit({
  id: true,
  created_at: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  created_at: true,
  acknowledged_at: true,
});

export const insertModelMetricsSchema = createInsertSchema(modelMetrics).omit({
  id: true,
  created_at: true,
});

export const insertDataSourceSchema = createInsertSchema(dataSources).omit({
  id: true,
  created_at: true,
});

// Enhanced forecast response schema for API
export const forecastResponseSchema = z.object({
  predicted_dst: z.number(),
  confidence_score: z.number(),
  storm_level: z.enum(["G0", "G1", "G2", "G3", "G4", "G5"]),
  forecast_time: z.string(),
  horizon: z.enum(["30min", "3hour"]),
  model_version: z.string(),
  feature_importance: z.record(z.number()).optional(),
});

// Alert threshold configuration
export const alertThresholds = {
  weak: { min: -50, max: -30 },
  moderate: { min: -100, max: -50 },
  strong: { min: -200, max: -100 },
  severe: { min: -350, max: -200 },
  extreme: { min: -Infinity, max: -350 },
} as const;

// Storm level mapping from Dst values
export const getStormLevel = (dst: number): string => {
  if (dst >= -30) return "G0";
  if (dst >= -50) return "G1";
  if (dst >= -100) return "G2";
  if (dst >= -200) return "G3";
  if (dst >= -350) return "G4";
  return "G5";
};

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Omni2Data = typeof omni2Data.$inferSelect;
export type InsertOmni2Data = z.infer<typeof insertOmni2DataSchema>;
export type Forecast = typeof forecasts.$inferSelect;
export type InsertForecast = z.infer<typeof insertForecastSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type ModelMetrics = typeof modelMetrics.$inferSelect;
export type InsertModelMetrics = z.infer<typeof insertModelMetricsSchema>;
export type DataSource = typeof dataSources.$inferSelect;
export type InsertDataSource = z.infer<typeof insertDataSourceSchema>;
export type ForecastResponse = z.infer<typeof forecastResponseSchema>;
