/**
 * Optimized server index.ts for memory efficiency
 * This version removes all WRAPIFAI components and implements deferred loading
 */

import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import { env } from "process";
import { log } from "./vite";

// Check if OpenAI key exists without loading any modules
function hasOpenAIKey() {
  return !!(env.OPENAI_API_KEY || 
          env.OPENAI_MANAGED_KEY || 
          env.OPENAI_API_IDEA_KEY || 
          env.OPENAI_API_BUILD_KEY || 
          env.OPENAI_API_GROW_KEY);
}

// Check if Anthropic key exists without loading any modules
function hasAnthropicKey() {
  return !!env.ANTHROPIC_API_KEY;
}

// Log AI service status at startup without initializing clients
console.log('AI services status:');
console.log(`- OpenAI: ${hasOpenAIKey() ? 'Available (key present)' : 'Not available (API key missing)'}`);
console.log(`- Anthropic: ${hasAnthropicKey() ? 'Available (key present)' : 'Not available (API key missing)'}`);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Simple logger
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Basic minimal routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", environment: app.get("env") });
});

// AI service status endpoint
app.get("/api/ai-status", (_req, res) => {
  const status = {
    openai: hasOpenAIKey(),
    anthropic: hasAnthropicKey(),
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

// Lazy load the routes only when needed
let lazyRoutesLoaded = false;
app.use("/api", (req, res, next) => {
  // Skip basic routes that are already defined
  if (req.path === "/health" || req.path === "/ai-status" || req.path === "/business-tools") {
    return next();
  }
  
  // For other API endpoints, lazy load routes
  if (!lazyRoutesLoaded) {
    console.log("Lazy loading routes on first API request...");
    try {
      // Dynamically import routes.ts
      import("./routes").then(({ registerRoutes }) => {
        // Initialize routes
        registerRoutes(app)
          .then(() => {
            console.log("Routes initialized successfully");
            lazyRoutesLoaded = true;
            next();
          })
          .catch(err => {
            console.error("Failed to initialize routes:", err);
            res.status(500).json({ error: "Server initialization error" });
          });
      }).catch(err => {
        console.error("Failed to import routes:", err);
        res.status(500).json({ error: "Server initialization error" });
      });
    } catch (err) {
      console.error("Error in lazy route loading:", err);
      res.status(500).json({ error: "Server initialization error" });
    }
  } else {
    next();
  }
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Server error:", err);
  res.status(status).json({ message });
});

// Static content - lazy load
app.use((req, res, next) => {
  import("./vite").then(({ setupVite, serveStatic }) => {
    // Set up static file serving based on environment
    if (app.get("env") === "development") {
      setupVite(app, server).then(() => next());
    } else {
      serveStatic(app);
      next();
    }
  }).catch(err => {
    console.error("Failed to load static content handler:", err);
    next();
  });
});

// Start server
const port = parseInt(env.PORT || "5000", 10);
const server = createServer(app);

server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  console.log(`Optimized server running on port ${port} (${app.get("env")} mode)`);
  console.log(`Note: In deployment, external port mapping is port 80 -> ${port}`);
});
