import { Router } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { hasAnthropicKey, generateBusinessIdeas, analyzeBusinessIdea, createBusinessPlanOutline } from "../services/anthropic";

const router = Router();

// Claude service status check
router.get("/claude/status", (req, res) => {
  res.json({ 
    available: hasAnthropicKey,
    message: hasAnthropicKey ? 
      "Claude AI service is available" : 
      "Claude AI service requires API key configuration"
  });
});

// Business idea generation with Claude
router.post("/claude/generate-ideas", async (req, res) => {
  try {
    const schema = z.object({
      interests: z.array(z.string()).min(1),
      marketInfo: z.string().optional(),
      constraints: z.array(z.string()).optional()
    });
    
    const data = schema.parse(req.body);
    
    if (!hasAnthropicKey) {
      return res.status(400).json({ 
        error: "Claude API key is required for this feature",
        configureKey: true
      });
    }
    
    try {
      const ideas = await generateBusinessIdeas(
        data.interests,
        data.marketInfo,
        data.constraints
      );
      
      res.json({
        ...ideas,
        generatedWith: "claude",
        interestsUsed: data.interests,
        timestamp: new Date().toISOString()
      });
    } catch (aiError: any) {
      console.error("Claude business idea generation error:", aiError);
      res.status(500).json({ 
        error: "Failed to generate business ideas with Claude. Please try again later.",
        message: aiError.message
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("Claude route error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Business idea analysis with Claude
router.post("/claude/analyze-idea", async (req, res) => {
  try {
    const schema = z.object({
      ideaTitle: z.string(),
      ideaDescription: z.string(),
      targetMarket: z.string()
    });
    
    const data = schema.parse(req.body);
    
    if (!hasAnthropicKey) {
      return res.status(400).json({ 
        error: "Claude API key is required for this feature",
        configureKey: true
      });
    }
    
    try {
      const analysis = await analyzeBusinessIdea(
        data.ideaTitle,
        data.ideaDescription,
        data.targetMarket
      );
      
      res.json({
        ...analysis,
        analyzedWith: "claude",
        timestamp: new Date().toISOString()
      });
    } catch (aiError: any) {
      console.error("Claude business idea analysis error:", aiError);
      res.status(500).json({ 
        error: "Failed to analyze business idea with Claude. Please try again later.",
        message: aiError.message
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("Claude route error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Business plan generation with Claude
router.post("/claude/create-business-plan", async (req, res) => {
  try {
    const schema = z.object({
      businessName: z.string(),
      businessDescription: z.string(),
      targetMarket: z.string()
    });
    
    const data = schema.parse(req.body);
    
    if (!hasAnthropicKey) {
      return res.status(400).json({ 
        error: "Claude API key is required for this feature",
        configureKey: true
      });
    }
    
    try {
      const businessPlan = await createBusinessPlanOutline(
        data.businessName,
        data.businessDescription,
        data.targetMarket
      );
      
      res.json({
        ...businessPlan,
        createdWith: "claude",
        timestamp: new Date().toISOString()
      });
    } catch (aiError: any) {
      console.error("Claude business plan creation error:", aiError);
      res.status(500).json({ 
        error: "Failed to create business plan with Claude. Please try again later.",
        message: aiError.message
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error("Claude route error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;