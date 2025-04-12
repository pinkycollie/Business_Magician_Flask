/**
 * 360 Business Magician API Server
 * Low-memory optimized version
 */

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check environment variables
console.log('API Server starting...');
console.log('AI services status:');
console.log(`- OpenAI: ${process.env.OPENAI_API_KEY ? 'Available (key present)' : 'Not available'}`);
console.log(`- Anthropic: ${process.env.ANTHROPIC_API_KEY ? 'Available (key present)' : 'Not available'}`);

// Create Express application
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

// API ENDPOINTS
// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "api-server" });
});

// AI services status 
app.get("/api/ai-status", (_req, res) => {
  res.json({
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    environment: process.env.NODE_ENV || "development"
  });
});

// Business tools endpoint
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

// Business Phases (lifecycle)
app.get("/api/business-phases", (_req, res) => {
  res.json({
    phases: [
      {
        id: "idea",
        name: "Idea Phase",
        description: "Explore and validate business ideas"
      },
      {
        id: "build",
        name: "Build Phase",
        description: "Create your business foundation and structure"
      },
      {
        id: "grow",
        name: "Grow Phase",
        description: "Expand your customer base and operations"
      },
      {
        id: "manage",
        name: "Manage Phase",
        description: "Optimize business operations and sustainability"
      }
    ]
  });
});

// BUSINESS IDEA GENERATOR
function generateBasicBusinessIdea(interests = ['technology'], marketInfo = 'general', constraints = []) {
  // Simple placeholder to generate ideas without AI integration
  const ideaTemplates = [
    { name: "Mobile App for Deaf Entrepreneurs", description: "A specialized mobile app that provides business guidance, resources and networking opportunities specifically designed for deaf entrepreneurs." },
    { name: "ASL Business Training Platform", description: "Online platform offering business courses and certifications in American Sign Language." },
    { name: "Accessibility Consulting Service", description: "Consulting service that helps businesses improve accessibility for deaf and hard-of-hearing customers and employees." },
    { name: "Deaf-Friendly Co-working Space", description: "Co-working space designed with deaf entrepreneurs in mind, featuring visual alerts, specialized meeting rooms, and sign language interpreters." },
    { name: "ASL Interpretation Booking Platform", description: "Platform connecting businesses with qualified ASL interpreters for meetings, events, and customer service." }
  ];

  // Select random idea from templates as a placeholder
  const randomIndex = Math.floor(Math.random() * ideaTemplates.length);
  return {
    ...ideaTemplates[randomIndex],
    generatedAt: new Date().toISOString(),
    interests: interests,
    viabilityScore: Math.floor(Math.random() * 100),
    implementationComplexity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)]
  };
}

// Business idea generation endpoint
app.post("/api/generate-business-idea", (req, res) => {
  const { interests, marketInfo, constraints } = req.body;
  const idea = generateBasicBusinessIdea(
    interests || ['technology'], 
    marketInfo || 'general', 
    constraints || []
  );
  
  res.json({ success: true, idea });
});

// Static file serving - client application
app.use(express.static(path.join(__dirname, 'client/dist')));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start server
const port = process.env.PORT || 5000;
const server = createServer(app);

server.listen({
  port,
  host: "0.0.0.0",
}, () => {
  console.log(`360 Business Magician API Server running on port ${port}`);
});

export default app;