// Vercel-compatible database connection
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Configure for serverless environment
neonConfig.fetchConnectionCache = true;
neonConfig.useSecureWebSocket = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1, // Limit connections for serverless
});

// Create database instance
export const db = drizzle(pool);

// Export pool for cleanup if needed
export { pool };
