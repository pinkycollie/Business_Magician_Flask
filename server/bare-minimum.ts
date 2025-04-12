/**
 * Bare minimum server for memory optimization
 * Just the essential code to get a basic server running
 */

import express from "express";
import { createServer } from "http";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from "cors";

// Current directory helpers for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if keys are available
console.log('AI services status:');
console.log(`- OpenAI: ${process.env.OPENAI_API_KEY ? 'Available (key present)' : 'Not available'}`);
console.log(`- Anthropic: ${process.env.ANTHROPIC_API_KEY ? 'Available (key present)' : 'Not available'}`);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Basic health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "bare-minimum" });
});

// AI service status endpoint
app.get("/api/ai-status", (_req, res) => {
  const status = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    environment: process.env.NODE_ENV || "development"
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

// Handle Vite HMR and client-side routes
// Use Vite middleware in development
if (app.get("env") === "development") {
  console.log("Setting up Vite middleware for development");
  
  // Attempt to import vite
  try {
    const viteExpressMiddleware = async () => {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      
      app.use(vite.middlewares);
      return vite;
    };
    
    viteExpressMiddleware().catch(err => {
      console.error("Failed to set up Vite middleware:", err);
    });
  } catch (err) {
    console.error("Error importing Vite:", err);
    // Fallback to static serving
    app.use(express.static('client/dist'));
  }
} else {
  // Production - serve built files
  app.use(express.static('client/dist'));
}

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile("client/dist/index.html", { root: join(__dirname, "../") });
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error("Server error:", err);
  res.status(status).json({ message });
});

// Start server
const port = 5000;
const server = createServer(app);

server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  console.log(`Bare minimum server running on port ${port} (${app.get("env")} mode)`);
});