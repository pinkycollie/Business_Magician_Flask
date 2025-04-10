import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Helper function to run DB push programmatically
export async function pushSchema() {
  console.log("Pushing schema to database...");
  const { migrate } = await import('drizzle-orm/postgres-js/migrator');
  // Import is done here to avoid issues with build process
  const postgres = await import('postgres');
  
  const sql = postgres.default(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(sql);
  
  await migrate(db, { migrationsFolder: "migrations" });
  await sql.end();
  console.log("Schema push complete.");
}