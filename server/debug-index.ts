/**
 * Debug server index.ts for memory optimization
 * This is a simplified version of the server that only includes essential features
 */

import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import { env } from "process";
import pg from "pg";
const { Pool } = pg;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Simple logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Basic health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", environment: app.get("env") });
});

// Check database connection without requiring full ORM
app.get("/api/db-status", async (_req, res) => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query("SELECT NOW() as current_time");
    const rows = result as unknown as Array<{current_time: Date}>;
    await pool.end();
    
    res.json({ 
      status: "connected", 
      serverTime: rows[0].current_time,
      dbUrl: `${process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] || "database-url-hidden"}` 
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to connect to database",
      error: String(error)
    });
  }
});

// AI service status endpoint
app.get("/api/ai-status", (_req, res) => {
  const status = {
    openai: !!(env.OPENAI_API_KEY || 
             env.OPENAI_MANAGED_KEY || 
             env.OPENAI_API_IDEA_KEY || 
             env.OPENAI_API_BUILD_KEY || 
             env.OPENAI_API_GROW_KEY),
    anthropic: !!env.ANTHROPIC_API_KEY,
    environment: env.NODE_ENV || "development"
  };
  
  res.json(status);
});

// Test route for business tools (replaces WRAPIFAI)
app.get("/api/business-tools", (_req, res) => {
  res.json({
    tools: [
      { 
        id: "business-idea-generator",
        name: "Business Idea Generator",
        description: "Generate custom business ideas based on your interests and skills"
      },
      { 
        id: "financial-calculator",
        name: "Financial Calculator",
        description: "Calculate startup costs and project financial needs"
      },
      { 
        id: "market-analyzer",
        name: "Market Analysis Tool",
        description: "Research your target market and competition"
      }
    ]
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error("Server error:", err);
  res.status(status).json({ message });
});

// Static content
app.use(express.static('client/dist'));

// Catchall route for SPA
app.get("*", (_req, res) => {
  res.sendFile("client/dist/index.html", { root: "." });
});

// Start server
const port = 5000;
const server = createServer(app);

server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  console.log(`Debug server running on port ${port} (${app.get("env")} mode)`);
});