/**
 * 360 Business Magician - Super Minimal Server
 * Extremely streamlined for low memory environments
 */

import express from "express";
import cors from "cors";
import { createServer } from "http";

// Create the express app
const app = express();
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "super-minimal" });
});

// Basic API placeholder
app.get("/api/ecosystem/services", (_req, res) => {
  res.json({
    services: [
      {
        id: 'business',
        name: 'Business Magician', 
        description: 'Start or grow your business with expert guidance'
      },
      {
        id: 'job',
        name: 'Job Magician', 
        description: 'Find employment and advance your career'
      },
      {
        id: 'vr4deaf',
        name: 'VR4Deaf', 
        description: 'Specialized vocational rehabilitation services',
        isPilot: true
      }
    ]
  });
});

// Start the server
const port = 5000;
const server = createServer(app);

server.listen({
  port,
  host: "0.0.0.0"
}, () => {
  console.log(`Super minimal server running on port ${port}`);
});