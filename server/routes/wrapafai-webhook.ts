import { Router } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

// Webhook verification endpoint
router.get("/verify", (req, res) => {
  const token = req.query.token;
  const expectedToken = process.env.WRAPAFAI_VERIFICATION_TOKEN;
  
  if (token === expectedToken) {
    console.log("WRAPAFAI webhook verification successful");
    res.status(200).send("Webhook verified");
  } else {
    console.error("WRAPAFAI webhook verification failed - invalid token");
    res.status(401).json({ error: "Invalid verification token" });
  }
});

// Webhook receiver for tool generation events
router.post("/event", async (req, res) => {
  try {
    // Validate the webhook payload
    const schema = z.object({
      event_type: z.enum(["tool_generated", "tool_updated", "tool_deleted"]),
      tool_id: z.string(),
      tool_name: z.string(),
      timestamp: z.string().datetime(),
      tool_data: z.object({
        description: z.string(),
        version: z.string(),
        capabilities: z.array(z.string()),
        api_endpoint: z.string(),
        authentication_type: z.enum(["api_key", "oauth", "none"]),
      }).optional(),
      metadata: z.record(z.unknown()).optional()
    });
    
    const data = schema.parse(req.body);
    
    // Log webhook event
    console.log(`WRAPAFAI webhook received: ${data.event_type} for tool ${data.tool_name}`);
    
    // Process different event types
    switch (data.event_type) {
      case "tool_generated":
        // Handle new tool generation
        await handleNewToolGenerated(data);
        break;
        
      case "tool_updated":
        // Handle tool update
        await handleToolUpdated(data);
        break;
        
      case "tool_deleted":
        // Handle tool deletion
        await handleToolDeleted(data);
        break;
    }
    
    // Send success response
    res.status(200).json({
      status: "success",
      message: `Processed ${data.event_type} for tool ${data.tool_name}`
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("WRAPAFAI webhook validation error:", error);
      res.status(400).json({ 
        error: "Invalid webhook payload", 
        details: fromZodError(error).message 
      });
    } else {
      console.error("WRAPAFAI webhook processing error:", error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  }
});

// Handler for new tool generation
async function handleNewToolGenerated(data: any) {
  // Implementation for processing newly generated tools
  // In a production environment, this would:
  // 1. Store the tool information in your database
  // 2. Notify relevant users or systems
  // 3. Potentially trigger integration processes
  
  console.log("Processing new tool:", data.tool_name);
  // This is where you would add your business-specific logic
}

// Handler for tool updates
async function handleToolUpdated(data: any) {
  // Implementation for processing tool updates
  console.log("Processing tool update for:", data.tool_name);
  // This is where you would add your business-specific logic
}

// Handler for tool deletions
async function handleToolDeleted(data: any) {
  // Implementation for processing tool deletions
  console.log("Processing tool deletion for:", data.tool_name);
  // This is where you would add your business-specific logic
}

export default router;