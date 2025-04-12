/**
 * Super minimal server - absolute bare minimum
 */

import express from "express";
import { createServer } from "http";

// Basic Express setup
const app = express();
app.use(express.json());

// Very basic health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "super-minimal" });
});

// Start server
const port = 5000;
const server = createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Super minimal server running on port ${port}`);
});