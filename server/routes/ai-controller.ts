/**
 * AI Controller
 * 
 * This controller exposes the AI middleware services as API endpoints.
 */

import { Router } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { 
  AIServiceType, 
  getServicesInfo, 
  processBusineseAssistance,
  getBusinessAssistanceSchema
} from '../middleware/aiManager';

const router = Router();

// Get information about available AI services
router.get('/services', (req, res) => {
  const servicesInfo = getServicesInfo();
  res.json(servicesInfo);
});

// Business assistance endpoint
router.post('/business-assistant', async (req, res) => {
  try {
    // Use the lazy-loaded schema
    const businessAssistanceSchema = getBusinessAssistanceSchema();
    const validatedData = businessAssistanceSchema.parse(req.body);
    
    try {
      const result = await processBusineseAssistance(validatedData);
      res.json(result);
    } catch (aiError: any) {
      console.error('AI processing error:', aiError);
      res.status(500).json({
        error: 'Failed to process request with AI service',
        message: aiError.message
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Audio translation initialization endpoint
router.post('/translation/audio/init', (req, res) => {
  try {
    const schema = z.object({
      sourceLanguage: z.string().optional(),
      targetLanguage: z.string(),
    });
    
    const validatedData = schema.parse(req.body);
    
    // Create a session ID for the translation
    const sessionId = `translation_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    res.json({
      sessionId,
      status: 'initialized',
      sourceLanguage: validatedData.sourceLanguage || 'auto',
      targetLanguage: validatedData.targetLanguage,
      // In production, this would include WebSocket connection details
      websocketUrl: `/api/translation/socket/${sessionId}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Simple text translation endpoint
router.post('/translation/text', (req, res) => {
  try {
    const schema = z.object({
      text: z.string().min(1),
      sourceLanguage: z.string().optional(),
      targetLanguage: z.string(),
    });
    
    const validatedData = schema.parse(req.body);
    
    // In development, just return a mock translation
    // In production, this would call the appropriate AI service
    const mockTranslation = `[${validatedData.targetLanguage.toUpperCase()}] ${validatedData.text}`;
    
    res.json({
      originalText: validatedData.text,
      translatedText: mockTranslation,
      sourceLanguage: validatedData.sourceLanguage || 'auto-detected',
      targetLanguage: validatedData.targetLanguage,
      provider: 'development'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Document processing endpoint
router.post('/document/generate', (req, res) => {
  try {
    const schema = z.object({
      documentType: z.enum(['business_plan', 'marketing', 'financial', 'legal', 'other']),
      content: z.string().min(10),
      businessName: z.string().optional(),
      outputFormat: z.enum(['pdf', 'docx', 'txt', 'json']).optional().default('pdf')
    });
    
    const validatedData = schema.parse(req.body);
    
    // In development, return a mock response
    // In production, this would generate an actual document
    res.json({
      documentId: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      documentType: validatedData.documentType,
      status: 'generated',
      // This would be an actual document URL in production
      downloadUrl: `/api/document/download/mock-document.${validatedData.outputFormat}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;