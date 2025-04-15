import { Router } from 'express';
import { aiBusinessAnalyticsService } from '../services/aiBusinessAnalytics';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = Router();

// Schema definitions
const analyzeRequestSchema = z.object({
  businessId: z.string(),
  dataTypes: z.array(z.enum(['financial', 'customer', 'market', 'operations'])),
  timeframe: z.object({
    start: z.string().optional(),
    end: z.string().optional()
  }).optional(),
  filters: z.record(z.any()).optional(),
  comparisonPeriod: z.string().optional()
});

const questionRequestSchema = z.object({
  businessId: z.string(),
  question: z.string(),
  includeData: z.object({
    financial: z.boolean(),
    customer: z.boolean(),
    market: z.boolean(),
    historical: z.boolean()
  })
});

// Routes
router.post('/analyze', async (req, res) => {
  try {
    const request = analyzeRequestSchema.parse(req.body);
    const result = await aiBusinessAnalyticsService.analyzeBusinessData(request);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error in business analytics:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

router.post('/ask', async (req, res) => {
  try {
    const request = questionRequestSchema.parse(req.body);
    const result = await aiBusinessAnalyticsService.askBusinessQuestion(request);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error in business question answering:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

router.post('/kpi-dashboard', async (req, res) => {
  try {
    const { businessId, kpiTypes } = req.body;
    
    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }
    
    const result = await aiBusinessAnalyticsService.generateKPIDashboard(
      businessId,
      kpiTypes || ['financial', 'customer', 'marketing', 'operations']
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error generating KPI dashboard:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.post('/competitive-analysis', async (req, res) => {
  try {
    const { businessId, competitorIds } = req.body;
    
    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }
    
    const result = await aiBusinessAnalyticsService.analyzeCompetitors(businessId, competitorIds);
    res.json(result);
  } catch (error) {
    console.error('Error in competitive analysis:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.get('/insights/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { category, limit } = req.query;
    
    // In a real implementation, we would query the database for saved insights
    // For now, just get the insights from a fresh analysis
    const result = await aiBusinessAnalyticsService.analyzeBusinessData({
      businessId,
      dataTypes: ['financial', 'customer', 'market', 'operations']
    });
    
    let insights = result.insights;
    
    // Filter by category if provided
    if (category && category !== 'all') {
      insights = insights.filter(insight => insight.category === category);
    }
    
    // Limit the number of results if specified
    if (limit) {
      insights = insights.slice(0, parseInt(limit as string));
    }
    
    res.json({ insights });
  } catch (error) {
    console.error('Error retrieving insights:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;