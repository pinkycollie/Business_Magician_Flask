import { Router } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  validateBusinessIdea,
  generateBusinessTemplate,
  deployBusiness,
  updateBusinessLifecycle,
  getBusinessAnalytics,
  type TemplateConfig,
  type LifecycleStage
} from "../services/startupPipeline";

const router = Router();

// Idea validation endpoint
router.post("/ideas/validate", async (req, res) => {
  try {
    const schema = z.object({
      idea: z.string().min(10, "Idea must be at least 10 characters"),
      market: z.string().min(3, "Market must be at least 3 characters"),
      constraints: z.array(z.string()).optional()
    });

    const data = schema.parse(req.body);
    const result = await validateBusinessIdea(data.idea, data.market, data.constraints);
    
    // Check if using fallback validation instead of AI
    if ('serviceAccountUsed' in result && !result.serviceAccountUsed) {
      // Still return success but with a notification about using fallback
      return res.json({
        ...result,
        message: "Using fallback validation logic due to missing service account configuration."
      });
    }
    
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("Error validating idea:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Template generation endpoint
router.post("/templates/generate", async (req, res) => {
  try {
    const schema = z.object({
      templateType: z.enum(["e-commerce", "marketplace", "saas", "service", "job-board"]),
      database: z.enum(["postgres", "mongodb"]),
      framework: z.enum(["react", "next", "vue"]),
      accessibility: z.object({
        aslSupport: z.boolean(),
        screenReader: z.boolean(),
        highContrast: z.boolean()
      }),
      features: z.array(z.string())
    });

    const config = schema.parse(req.body) as TemplateConfig;
    const result = await generateBusinessTemplate(config);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("Error generating template:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Deployment endpoint
router.post("/businesses/:id/deploy", async (req, res) => {
  try {
    const businessId = parseInt(req.params.id);
    const schema = z.object({
      environment: z.enum(["development", "staging", "production"]).optional()
    });

    const data = schema.parse(req.body);
    const result = await deployBusiness(businessId, data.environment);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("Error deploying business:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Lifecycle management endpoint
router.patch("/businesses/:id/lifecycle", async (req, res) => {
  try {
    const businessId = parseInt(req.params.id);
    const schema = z.object({
      stage: z.enum(["idea", "build", "launch", "growth", "optimization", "exit"])
    });

    const data = schema.parse(req.body);
    const result = await updateBusinessLifecycle(businessId, data.stage as LifecycleStage);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("Error updating business lifecycle:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Analytics endpoint
router.get("/businesses/:id/analytics", async (req, res) => {
  try {
    const businessId = parseInt(req.params.id);
    const period = (req.query.period as string) || "month";
    
    if (!["day", "week", "month"].includes(period)) {
      return res.status(400).json({ error: "Invalid period. Use day, week, or month." });
    }
    
    const result = await getBusinessAnalytics(businessId, period as "day" | "week" | "month");
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error("Error fetching business analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;