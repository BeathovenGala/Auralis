CREATE TABLE "alerts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alert_level" text NOT NULL,
	"predicted_dst" real NOT NULL,
	"forecast_horizon" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"confidence" real NOT NULL,
	"affected_systems" jsonb,
	"status" text DEFAULT 'active' NOT NULL,
	"acknowledged_by" text,
	"acknowledged_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "data_sources" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"url" text,
	"status" text DEFAULT 'online' NOT NULL,
	"last_successful_ingest" timestamp,
	"latency_ms" integer,
	"reliability_score" real DEFAULT 1,
	"update_frequency" integer,
	"critical" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "data_sources_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "forecasts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"forecast_time" timestamp NOT NULL,
	"horizon" text NOT NULL,
	"predicted_dst" real NOT NULL,
	"confidence_score" real NOT NULL,
	"storm_level" text NOT NULL,
	"model_version" text NOT NULL,
	"feature_importance" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_metrics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_version" text NOT NULL,
	"training_date" timestamp NOT NULL,
	"rmse" real NOT NULL,
	"r2_score" real NOT NULL,
	"correlation_coefficient" real NOT NULL,
	"mape" real NOT NULL,
	"training_samples" integer NOT NULL,
	"validation_samples" integer NOT NULL,
	"feature_importance" jsonb NOT NULL,
	"hyperparameters" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "omni2_data" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp NOT NULL,
	"dst_index" real,
	"scalar_b" real,
	"alpha_proton_ratio" real,
	"sunspot_number" real,
	"sw_plasma_temperature" real,
	"sw_plasma_speed" real,
	"kp_index" real,
	"ae_index" real,
	"source" text DEFAULT 'ACE' NOT NULL,
	"quality" text DEFAULT 'good' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'viewer' NOT NULL,
	"email" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
