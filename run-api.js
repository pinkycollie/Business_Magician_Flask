/**
 * Ultra minimal Node.js express server - without TypeScript
 * Plain JavaScript to eliminate any transpilation memory overhead
 * 
 * This is a temporary solution to address memory issues in the full server.
 * It provides a basic API interface for essential operations.
 */

import express from 'express';
import { createServer } from 'http';

// Create express app
const app = express();
app.use(express.json());

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: "js-minimal" });
});

// Basic API endpoints
app.get("/api/business-tools", (req, res) => {
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
      },
      { 
        id: "business-plan-writer",
        name: "Business Plan Writer",
        description: "Create a professional business plan with AI assistance"
      },
      {
        id: "asl-business-guidance",
        name: "ASL Business Guidance",
        description: "Video resources explaining business concepts in American Sign Language"
      }
    ]
  });
});

// AI status endpoint
app.get("/api/ai-status", (req, res) => {
  res.json({
    openai: process.env.OPENAI_API_KEY ? true : false,
    anthropic: process.env.ANTHROPIC_API_KEY ? true : false,
    environment: process.env.NODE_ENV || "development"
  });
});

// Static content
app.use(express.static('client/dist'));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile("client/dist/index.html", { root: "." });
});

// Start server
const port = 5000;
const server = createServer(app);
server.listen(port, '0.0.0.0', () => {
  console.log(`Ultra minimal JS server running on port ${port}`);
});