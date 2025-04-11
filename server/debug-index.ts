import express from "express";
import { log } from "./vite";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    // Test the database connection
    const result = await db.execute(sql`SELECT NOW() as current_time`);
    const rows = result as unknown as Array<{current_time: Date}>;
    
    return res.json({ 
      status: 'ok', 
      database: 'connected', 
      timestamp: rows[0]?.current_time || new Date() 
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error?.message || 'Unknown database error'
    });
  }
});

const port = 5000;
app.listen({
  port,
  host: "0.0.0.0",
}, () => {
  log(`Server running on port ${port}`);
});