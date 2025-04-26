import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertLifecyclePhaseSchema,
  insertTaskSchema,
  insertSubtaskSchema,
  insertToolSchema,
  insertASLVideoSchema,
  insertBusinessSchema,
  insertVRCounselorSchema,
  insertUserCounselorSchema,
  insertResourceSchema,
  insertAslDictionaryTermSchema
} from "@shared/schema";
import storageRoutes from "./routes/storage";
import pipelineRoutes from "./routes/pipeline";
import anthropicRoutes from "./routes/anthropic";
import aiRoutes from "./routes/ai";
import aiControllerRoutes from "./routes/ai-controller";
import openaiTestRoute from "./routes/openai-test";
import ecosystemRoutes from "./routes/ecosystemRoutes";
import businessFormationRoutes from "./routes/businessFormationRoutes";
import startupTeamBuilderRoutes from "./routes/startupTeamBuilderRoutes";
import profileRoutes from "./routes/profileRoutes";
import { initializeRealtimeTranslation } from "./services/realtimeTranslation";

// Validation error handling
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const server = createServer(app);
  
  // Skip real-time translation initialization for performance
  // WebSocket server will be initialized when first accessed
  console.log("WebSocket initialization deferred for better startup performance");
  
  // Register API routes
  app.use('/api/storage', storageRoutes);
  app.use('/api/pipeline', pipelineRoutes);
  app.use('/api/claude', anthropicRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/openai-test', openaiTestRoute);
  app.use('/api/ecosystem', ecosystemRoutes);
  app.use('/api/business-formation', businessFormationRoutes);
  app.use('/api/startup-team', startupTeamBuilderRoutes);
  app.use('/api/profile', profileRoutes);
  
  // Register the new unified AI controller
  app.use('/api/v1/ai', aiControllerRoutes);

  // Base API route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Lifecycle phases routes
  app.get("/api/lifecycle-phases", async (_req, res) => {
    try {
      const phases = await storage.getLifecyclePhases();
      res.json(phases);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/lifecycle-phases/:slug", async (req, res) => {
    try {
      const phase = await storage.getLifecyclePhaseBySlug(req.params.slug);
      if (!phase) {
        return res.status(404).json({ error: "Phase not found" });
      }
      res.json(phase);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Tasks routes
  app.get("/api/phases/:phaseId/tasks", async (req, res) => {
    try {
      const phaseId = parseInt(req.params.phaseId);
      const tasks = await storage.getTasks(phaseId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Subtasks routes
  app.get("/api/tasks/:taskId/subtasks", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const subtasks = await storage.getSubtasks(taskId);
      res.json(subtasks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/tasks/:taskId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const taskId = parseInt(req.params.taskId);
      const progress = await storage.getTaskProgress(userId, taskId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/subtasks/:subtaskId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const subtaskId = parseInt(req.params.subtaskId);
      const { completed } = z.object({ completed: z.boolean() }).parse(req.body);
      
      const progress = await storage.updateSubtaskProgress(userId, subtaskId, completed);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Tools routes
  app.get("/api/phases/:phaseId/tools", async (req, res) => {
    try {
      const phaseId = parseInt(req.params.phaseId);
      const tools = await storage.getTools(phaseId);
      res.json(tools);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ASL Videos routes
  app.get("/api/asl-videos", async (req, res) => {
    try {
      const phaseId = req.query.phaseId ? parseInt(req.query.phaseId as string) : undefined;
      const taskId = req.query.taskId ? parseInt(req.query.taskId as string) : undefined;
      
      const videos = await storage.getASLVideos({ phaseId, taskId });
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/asl-videos/:id", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getASLVideo(videoId);
      if (!video) {
        return res.status(404).json({ error: "ASL video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Business routes
  app.post("/api/businesses", async (req, res) => {
    try {
      const businessData = insertBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(businessData);
      res.status(201).json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:userId/businesses", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const businesses = await storage.getBusinesses(userId);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const business = await storage.getBusiness(businessId);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/businesses/:id", async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      // Partial validation
      const updateSchema = insertBusinessSchema.partial();
      const businessData = updateSchema.parse(req.body);
      
      const business = await storage.updateBusiness(businessId, businessData);
      res.json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // VR Counselor routes
  app.get("/api/vr-counselors", async (_req, res) => {
    try {
      const counselors = await storage.getVRCounselors();
      res.json(counselors);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/vr-counselors/:id", async (req, res) => {
    try {
      const counselorId = parseInt(req.params.id);
      const counselor = await storage.getVRCounselor(counselorId);
      if (!counselor) {
        return res.status(404).json({ error: "VR counselor not found" });
      }
      res.json(counselor);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User-Counselor relationship routes
  app.get("/api/users/:userId/vr-counselors", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const counselors = await storage.getUserCounselors(userId);
      res.json(counselors);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/vr-counselors", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = z.object({
        counselorId: z.number(),
        status: z.string().optional(),
      }).parse(req.body);
      
      const relation = await storage.createUserCounselor({
        userId,
        counselorId: data.counselorId,
        status: data.status,
        endDate: null
      });
      
      res.status(201).json(relation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Helper function to generate business ideas without requiring AI services
  const generateBasicBusinessIdea = (
    interests: string[],
    marketInfo?: string,
    constraints?: string[]
  ) => {
    // Basic business templates
    const businessTypes = [
      "e-commerce store",
      "consulting service",
      "mobile app",
      "subscription service",
      "online marketplace"
    ];
    
    // Select random business type
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    
    // Combine with user interests
    const primaryInterest = interests[0];
    const secondaryInterest = interests.length > 1 ? interests[1] : interests[0];
    
    const ideas = [
      {
        title: `${primaryInterest.charAt(0).toUpperCase() + primaryInterest.slice(1)} ${businessType}`,
        description: `A ${businessType} focused on ${primaryInterest} and ${secondaryInterest} for the ${marketInfo || 'general'} market.`,
        potentialScore: Math.floor(Math.random() * 5) + 5,
        complexity: Math.floor(Math.random() * 3) + 3,
        notes: `Consider focusing on accessibility features for deaf entrepreneurs.`
      },
      {
        title: `Accessible ${secondaryInterest} platform`,
        description: `An accessible platform designed for the ${primaryInterest} community, focusing on ${secondaryInterest}.`,
        potentialScore: Math.floor(Math.random() * 4) + 6,
        complexity: Math.floor(Math.random() * 4) + 4,
        notes: `Integrate ASL video support throughout the user experience.`
      }
    ];
    
    return {
      ideas,
      generatedWith: "local-rules",
      interestsUsed: interests,
      timestamp: new Date().toISOString()
    };
  };

  // AI-powered business idea generation route
  app.post("/api/tools/generate-ideas", async (req, res) => {
    try {
      const schema = z.object({
        interests: z.array(z.string()).min(1),
        marketInfo: z.string().optional(),
        constraints: z.array(z.string()).optional()
      });
      
      const data = schema.parse(req.body);
      
      try {
        // Simplified business idea generation using rules-based approach
        // This would be replaced with more sophisticated Google Cloud AI in production
        const idea = generateBasicBusinessIdea(data.interests, data.marketInfo, data.constraints);
        res.json(idea);
      } catch (aiError: any) {
        console.error("Business idea generation error:", aiError);
        res.status(500).json({ 
          error: "Failed to generate business ideas. Please try again later.",
          message: aiError.message
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const sbaRelated = req.query.sbaRelated === 'true' ? true 
                       : req.query.sbaRelated === 'false' ? false 
                       : undefined;
      
      const tags = req.query.tags ? 
        Array.isArray(req.query.tags) 
          ? req.query.tags as string[] 
          : [req.query.tags as string]
        : undefined;
      
      const resources = await storage.getResources({ category, sbaRelated, tags });
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      const resource = await storage.getResource(resourceId);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.patch("/api/resources/:id", async (req, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      // Partial validation
      const updateSchema = insertResourceSchema.partial();
      const resourceData = updateSchema.parse(req.body);
      
      const resource = await storage.updateResource(resourceId, resourceData);
      res.json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      await storage.deleteResource(resourceId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ASL Dictionary routes
  app.get("/api/asl-dictionary", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const importance = req.query.importance as string | undefined;
      const searchTerm = req.query.searchTerm as string | undefined;
      
      const tags = req.query.tags ? 
        Array.isArray(req.query.tags) 
          ? req.query.tags as string[] 
          : [req.query.tags as string]
        : undefined;
      
      const terms = await storage.getAslDictionaryTerms({ 
        category, 
        importance, 
        tags, 
        searchTerm 
      });
      res.json(terms);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/asl-dictionary/term/:name", async (req, res) => {
    try {
      const name = req.params.name;
      const term = await storage.getAslDictionaryTermByName(name);
      if (!term) {
        return res.status(404).json({ error: "ASL dictionary term not found" });
      }
      res.json(term);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/asl-dictionary/:id", async (req, res) => {
    try {
      const termId = parseInt(req.params.id);
      const term = await storage.getAslDictionaryTerm(termId);
      if (!term) {
        return res.status(404).json({ error: "ASL dictionary term not found" });
      }
      res.json(term);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/asl-dictionary", async (req, res) => {
    try {
      const termData = insertAslDictionaryTermSchema.parse(req.body);
      const term = await storage.createAslDictionaryTerm(termData);
      res.status(201).json(term);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.patch("/api/asl-dictionary/:id", async (req, res) => {
    try {
      const termId = parseInt(req.params.id);
      // Partial validation
      const updateSchema = insertAslDictionaryTermSchema.partial();
      const termData = updateSchema.parse(req.body);
      
      const term = await storage.updateAslDictionaryTerm(termId, termData);
      res.json(term);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.delete("/api/asl-dictionary/:id", async (req, res) => {
    try {
      const termId = parseInt(req.params.id);
      await storage.deleteAslDictionaryTerm(termId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Job Magician candidates API endpoint (for HTMX)
  app.get("/api/job-magician/tech-candidates", (_req, res) => {
    // In a real implementation, this would fetch from database
    const htmlResponse = `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-bold mb-4">Qualified Candidates from 360 Job Magician</h3>
        <p class="text-sm text-slate-600 mb-4">
          These candidates have completed the 360 Job Lifecycle program and have been 
          qualified for positions at deaf-owned businesses:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JS</div>
              <div>
                <h4 class="font-medium text-slate-800">Jamie Smith</h4>
                <p class="text-xs text-slate-500">Front-end Developer</p>
              </div>
            </div>
            <div class="text-xs text-slate-600 mb-3">
              <p>5 years experience with React, TypeScript, and accessibility implementation</p>
            </div>
            <div class="flex flex-wrap gap-1 mb-3">
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">React</span>
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">Accessibility</span>
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">TypeScript</span>
            </div>
            <button class="w-full text-xs bg-primary/10 text-primary hover:bg-primary/20 py-1.5 rounded">
              View Profile
            </button>
          </div>
          
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">MJ</div>
              <div>
                <h4 class="font-medium text-slate-800">Morgan Johnson</h4>
                <p class="text-xs text-slate-500">UX/UI Designer</p>
              </div>
            </div>
            <div class="text-xs text-slate-600 mb-3">
              <p>3 years experience with accessible design systems and inclusive UX research</p>
            </div>
            <div class="flex flex-wrap gap-1 mb-3">
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">Figma</span>
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">UX Research</span>
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">Inclusive Design</span>
            </div>
            <button class="w-full text-xs bg-primary/10 text-primary hover:bg-primary/20 py-1.5 rounded">
              View Profile
            </button>
          </div>
          
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">TW</div>
              <div>
                <h4 class="font-medium text-slate-800">Taylor Washington</h4>
                <p class="text-xs text-slate-500">Full-stack Developer</p>
              </div>
            </div>
            <div class="text-xs text-slate-600 mb-3">
              <p>4 years experience with Node.js, Express, and React development</p>
            </div>
            <div class="flex flex-wrap gap-1 mb-3">
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">Node.js</span>
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">Express</span>
              <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">MongoDB</span>
            </div>
            <button class="w-full text-xs bg-primary/10 text-primary hover:bg-primary/20 py-1.5 rounded">
              View Profile
            </button>
          </div>
        </div>
        
        <div class="mt-4 text-center">
          <button class="px-4 py-2 border border-primary text-primary hover:bg-primary/5 rounded-lg text-sm font-medium">
            View All Candidates
          </button>
        </div>
      </div>
    `;
    
    res.send(htmlResponse);
  });

  const httpServer = createServer(app);
  return httpServer;
}
