/**
 * Minimal server index.ts for memory optimization
 * This is a stripped-down version just to get the basic server running
 */

import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json());

// Very basic routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Minimal server is running" });
});

app.get("/api/ai-status", (_req, res) => {
  const status = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY
  };
  res.json({ status });
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
}, () => {
  console.log(`Minimal server running on port ${port}`);
});