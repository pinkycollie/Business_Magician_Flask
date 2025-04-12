import { Router } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { availableServices, generateBusinessIdeas, analyzeBusinessIdea } from "../services/aiService";

const router = Router();

// AI service status check
router.get("/status", (req, res) => {
  res.json({ 
    availableServices,
    message: Object.values(availableServices).some(Boolean) 
      ? "AI services are available" 
      : "No AI services currently configured"
  });
});

// Business idea generation with any available AI service
router.post("/generate-ideas", async (req, res) => {
  try {
    const schema = z.object({
      interests: z.array(z.string()).min(1),
      marketInfo: z.string().optional(),
      constraints: z.array(z.string()).optional(),
      provider: z.enum(['openai', 'anthropic', 'googleAI', 'auto']).optional()
    });
    
    const data = schema.parse(req.body);
    
    try {
      const result = await generateBusinessIdeas(
        data.interests,
        data.marketInfo,
        data.constraints,
        { provider: data.provider || 'auto' }
      );
      
      res.json({
        ...result,
        interestsUsed: data.interests,
        timestamp: new Date().toISOString()
      });
    } catch (aiError: any) {
      console.error("AI business idea generation error:", aiError);
      res.status(500).json({ 
        error: "Failed to generate business ideas. Please try again later.",
        message: aiError.message
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("AI route error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Business idea analysis
router.post("/analyze-idea", async (req, res) => {
  try {
    const schema = z.object({
      ideaTitle: z.string(),
      ideaDescription: z.string(),
      targetMarket: z.string(),
      provider: z.enum(['openai', 'anthropic', 'googleAI', 'auto']).optional()
    });
    
    const data = schema.parse(req.body);
    
    try {
      const analysis = await analyzeBusinessIdea(
        data.ideaTitle,
        data.ideaDescription,
        data.targetMarket,
        { provider: data.provider || 'auto' }
      );
      
      res.json({
        ...analysis,
        timestamp: new Date().toISOString()
      });
    } catch (aiError: any) {
      console.error("AI business idea analysis error:", aiError);
      res.status(500).json({ 
        error: "Failed to analyze business idea. Please try again later.",
        message: aiError.message
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("AI route error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;