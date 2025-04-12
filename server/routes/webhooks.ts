/**
 * Webhook Handlers
 * 
 * Endpoints for receiving webhooks from external services like WRAPIFAI
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

const router = Router();

// Schema for WRAPIFAI webhook events
const wrapifaiEventSchema = z.object({
  event: z.string(),
  timestamp: z.string(),
  toolId: z.string(),
  userId: z.string().optional(),
  data: z.record(z.any()).optional()
});

/**
 * WRAPIFAI webhook endpoint
 * 
 * Receives events when users interact with embedded WRAPIFAI tools
 */
router.post('/wrapifai', async (req: Request, res: Response) => {
  try {
    // Validate the incoming webhook payload
    const result = wrapifaiEventSchema.safeParse(req.body);
    
    if (!result.success) {
      console.error('Invalid webhook payload:', result.error);
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }
    
    const event = result.data;
    
    // Log the event
    console.log(`WRAPIFAI webhook received: ${event.event} for tool ${event.toolId}`);
    
    // Process different event types
    switch (event.event) {
      case 'tool_created':
        // Handle tool creation events
        // Could store in database for analytics
        break;
        
      case 'tool_used':
        // Handle tool usage events
        // Could increment usage counter, store user data, etc.
        break;
        
      case 'lead_captured':
        // Handle lead capture events
        // Could store lead information in CRM
        break;
        
      default:
        console.log(`Unhandled WRAPIFAI event type: ${event.event}`);
    }
    
    // Return success
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default router;