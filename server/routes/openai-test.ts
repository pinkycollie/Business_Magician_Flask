/**
 * OpenAI Test Route
 * 
 * Simple endpoint to test OpenAI API connection
 */

import express from 'express';
import { getOpenAIClient, checkAIServicesAvailability } from '../services/aiLazyLoader';

const router = express.Router();

// Test endpoint for OpenAI
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Check if OpenAI is available without initializing
    const { openai: isOpenAIAvailable } = checkAIServicesAvailability();
    if (!isOpenAIAvailable) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    // Get the OpenAI client using lazy loader
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model
      messages: [
        { 
          role: "system", 
          content: "You are 360 Business Magician, an assistant for deaf entrepreneurs. Keep responses concise and clear."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 500
    });
    
    res.json({
      response: response.choices[0].message.content,
      model: response.model,
      usage: response.usage
    });
  } catch (error: any) {
    console.error('OpenAI test error:', error);
    res.status(500).json({ 
      error: 'OpenAI API error', 
      message: error.message
    });
  }
});

export default router;