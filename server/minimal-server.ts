/**
 * 360 Business Magician - Minimal Server
 * Streamlined for memory efficiency
 */

import express from "express";
import cors from "cors";
import { createServer } from "http";
import businessFormationRoutes from "./routes/businessFormationRoutes";
import ecosystemRoutes from "./routes/ecosystemRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Simple logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Basic health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", environment: app.get("env") });
});

// Register API routes
app.use('/api/formation', businessFormationRoutes);
app.use('/api/ecosystem', ecosystemRoutes);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const port = 5000;
const server = createServer(app);

server.listen({
  port,
  host: "0.0.0.0",
}, () => {
  console.log(`Minimal server running on port ${port} (${app.get("env")} mode)`);
});