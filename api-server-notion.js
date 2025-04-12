/**
 * 360 Business Magician API Server
 * With Notion Integration
 */

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from '@notionhq/client';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Notion client
let notionClient = null;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (NOTION_API_KEY && NOTION_DATABASE_ID) {
  try {
    notionClient = new Client({ auth: NOTION_API_KEY });
    console.log('Notion integration initialized');
  } catch (error) {
    console.error('Failed to initialize Notion client:', error);
  }
} else {
  console.warn('Notion integration not available: Missing API key or database ID');
}

// Check environment variables
console.log('API Server starting...');
console.log('AI services status:');
console.log(`- OpenAI: ${process.env.OPENAI_API_KEY ? 'Available (key present)' : 'Not available'}`);
console.log(`- Anthropic: ${process.env.ANTHROPIC_API_KEY ? 'Available (key present)' : 'Not available'}`);
console.log(`- Notion: ${(NOTION_API_KEY && NOTION_DATABASE_ID) ? 'Available' : 'Not available'}`);

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
  res.json({ 
    status: "ok", 
    mode: "api-server-notion",
    notion: !!notionClient
  });
});

// AI services status 
app.get("/api/ai-status", (_req, res) => {
  res.json({
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    notion: !!notionClient,
    environment: process.env.NODE_ENV || "development"
  });
});

// Function to save to Notion
async function saveToNotion(content, type = "general") {
  if (!notionClient || !NOTION_DATABASE_ID) {
    console.warn('Cannot save to Notion: client or database ID missing');
    return { success: false, error: 'Notion integration not available' };
  }

  try {
    // Prepare properties based on content type
    let properties = {
      Name: {
        title: [{
          text: { content: content.name || `${type} Result` }
        }]
      },
      Type: {
        select: { name: type }
      },
      CreatedAt: {
        date: { start: new Date().toISOString() }
      }
    };

    // Add description if available
    if (content.description) {
      properties.Description = {
        rich_text: [{
          text: { content: content.description }
        }]
      };
    }

    // Add viability score for business ideas
    if (type === "Business Idea" && content.viabilityScore !== undefined) {
      properties.ViabilityScore = {
        number: content.viabilityScore
      };
    }

    // Add complexity for business ideas
    if (type === "Business Idea" && content.implementationComplexity) {
      properties.Complexity = {
        select: { name: content.implementationComplexity }
      };
    }

    // Add interests as multi-select for business ideas
    if (type === "Business Idea" && Array.isArray(content.interests)) {
      properties.Interests = {
        multi_select: content.interests.map(interest => ({ name: interest }))
      };
    }

    // Create page in Notion
    const response = await notionClient.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: properties
    });

    console.log(`Saved to Notion: ${type} - ${content.name || 'Unnamed'}`);
    return { success: true, notionPageId: response.id };
  } catch (error) {
    console.error('Error saving to Notion:', error);
    return {
      success: false,
      error: error.message || 'Failed to save to Notion',
      details: error.body || {}
    };
  }
}

// Business tools endpoint
app.get("/api/business-tools", async (_req, res) => {
  const tools = [
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
  ];
  
  const response = { tools };
  
  // Save the tool list to Notion if available
  if (notionClient) {
    try {
      const notionResult = await saveToNotion(
        { 
          name: "Business Tools List", 
          description: "Complete list of business tools available in the 360 Business Magician" 
        }, 
        "Tool List"
      );
      response.notion = notionResult;
    } catch (error) {
      console.error('Error saving tools list to Notion:', error);
    }
  }
  
  res.json(response);
});

// Business Phases (lifecycle)
app.get("/api/business-phases", async (_req, res) => {
  const phases = [
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
  ];
  
  const response = { phases };
  
  // Save the phases list to Notion if available
  if (notionClient) {
    try {
      const notionResult = await saveToNotion(
        { 
          name: "Business Lifecycle Phases", 
          description: "The four main phases of the business lifecycle in the 360 Business Magician" 
        }, 
        "Lifecycle Phases"
      );
      response.notion = notionResult;
    } catch (error) {
      console.error('Error saving phases to Notion:', error);
    }
  }
  
  res.json(response);
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

// Import Cloud Storage service (if available)
let cloudStorage = null;
try {
  cloudStorage = await import('./server/services/cloudStorageService.js');
  console.log('Cloud Storage service loaded');
} catch (error) {
  console.warn('Cloud Storage service not available:', error.message);
}

// Business idea generation endpoint
app.post("/api/generate-business-idea", async (req, res) => {
  const { interests, marketInfo, constraints } = req.body;
  const idea = generateBasicBusinessIdea(
    interests || ['technology'], 
    marketInfo || 'general', 
    constraints || []
  );
  
  const response = { success: true, idea };
  
  // Save the generated idea to Notion if available
  if (notionClient) {
    try {
      const notionResult = await saveToNotion(idea, "Business Idea");
      response.notion = notionResult;
    } catch (error) {
      console.error('Error saving business idea to Notion:', error);
      response.notion = { success: false, error: error.message };
    }
  }
  
  // Save the generated idea to Cloud Storage if available
  if (cloudStorage) {
    try {
      const storageResult = await cloudStorage.saveBusinessIdea(idea);
      response.storage = storageResult;
    } catch (error) {
      console.error('Error saving business idea to Cloud Storage:', error);
      response.storage = { success: false, error: error.message };
    }
  }
  
  res.json(response);
});

// Cloud Storage endpoints
if (cloudStorage) {
  // List business ideas from Cloud Storage
  app.get("/api/storage/business-ideas", async (_req, res) => {
    try {
      const result = await cloudStorage.listBusinessIdeas();
      res.json(result);
    } catch (error) {
      console.error('Error listing business ideas from storage:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to list business ideas from storage'
      });
    }
  });
  
  // List files in a storage bucket
  app.get("/api/storage/files", async (req, res) => {
    try {
      const { prefix = '', limit = 100 } = req.query;
      const result = await cloudStorage.listData(prefix, parseInt(limit, 10));
      res.json(result);
    } catch (error) {
      console.error('Error listing files from storage:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to list files from storage'
      });
    }
  });
  
  // Generate signed upload URL
  app.post("/api/storage/upload-url", async (req, res) => {
    try {
      const { filename, contentType, expiresIn } = req.body;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          error: 'Filename is required'
        });
      }
      
      const result = await cloudStorage.generateUploadSignedUrl(filename, {
        contentType,
        expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined
      });
      
      res.json(result);
    } catch (error) {
      console.error('Error generating upload URL:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate upload URL'
      });
    }
  });
  
  // Save data to storage
  app.post("/api/storage/data", async (req, res) => {
    try {
      const { filename, data, options } = req.body;
      
      if (!filename || !data) {
        return res.status(400).json({
          success: false,
          error: 'Filename and data are required'
        });
      }
      
      const result = await cloudStorage.saveData(filename, data, options || {});
      res.json(result);
    } catch (error) {
      console.error('Error saving data to storage:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to save data to storage'
      });
    }
  });
  
  // Get data from storage
  app.get("/api/storage/data/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const { parse = 'true' } = req.query;
      
      const result = await cloudStorage.getData(filename, parse === 'true');
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error retrieving data from storage:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve data from storage'
      });
    }
  });
  
  // Delete file from storage
  app.delete("/api/storage/data/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const result = await cloudStorage.deleteData(filename);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error deleting file from storage:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete file from storage'
      });
    }
  });
}

// Static file serving - client application
app.use(express.static(path.join(__dirname, 'client/dist')));

// SPA fallback
app.get("*", (_req, res) => {
  const indexPath = path.join(__dirname, 'client/dist/index.html');
  // Check if the index.html file exists before sending it
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('404 - Not Found: The requested resource does not exist.');
  }
});

// Start server
const port = process.env.PORT || 5000;
const server = createServer(app);

server.listen({
  port,
  host: "0.0.0.0",
}, () => {
  console.log(`360 Business Magician API Server (with Notion) running on port ${port}`);
});

export default app;