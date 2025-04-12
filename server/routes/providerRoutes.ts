/**
 * Provider-specific API Routes
 * 
 * These routes handle interactions with specific business formation providers
 * like Northwest Registered Agent and Corporate Tools.
 */

import express, { Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import * as northwestService from '../services/northwestAgentService';
import * as corporateToolsService from '../services/corporateToolsService';

const router = express.Router();

// Check API configuration status
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = {
      northwestAgent: {
        configured: northwestService.isApiConfigured(),
        name: 'Northwest Registered Agent'
      },
      corporateTools: {
        configured: corporateToolsService.isApiConfigured(),
        name: 'Corporate Tools'
      }
    };
    
    res.json({ status });
  } catch (error) {
    console.error('Error checking provider status:', error);
    res.status(500).json({ error: 'Failed to check provider status' });
  }
});

// Northwest Registered Agent Routes
router.get('/northwest/entity-types/:stateCode', async (req: Request, res: Response) => {
  try {
    if (!northwestService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    const { stateCode } = req.params;
    const entityTypes = await northwestService.getEntityTypes(stateCode);
    res.json({ entityTypes });
  } catch (error) {
    console.error('Error fetching Northwest entity types:', error);
    res.status(500).json({ error: 'Failed to fetch entity types' });
  }
});

router.get('/northwest/states/:stateCode/requirements', async (req: Request, res: Response) => {
  try {
    if (!northwestService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    const { stateCode } = req.params;
    const requirements = await northwestService.getStateRequirements(stateCode);
    res.json({ requirements });
  } catch (error) {
    console.error('Error fetching Northwest state requirements:', error);
    res.status(500).json({ error: 'Failed to fetch state requirements' });
  }
});

router.post('/northwest/formations', async (req: Request, res: Response) => {
  try {
    if (!northwestService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    // Note: In a real implementation, we would validate the request body
    // with a comprehensive schema that matches Northwest's API requirements
    
    const formationResult = await northwestService.submitBusinessFormation(req.body);
    res.status(201).json({ formationResult });
  } catch (error) {
    console.error('Error submitting Northwest formation:', error);
    res.status(500).json({ error: 'Failed to submit business formation' });
  }
});

router.get('/northwest/formations/:formationId/status', async (req: Request, res: Response) => {
  try {
    if (!northwestService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    const { formationId } = req.params;
    const status = await northwestService.getFormationStatus(formationId);
    res.json({ status });
  } catch (error) {
    console.error('Error fetching Northwest formation status:', error);
    res.status(500).json({ error: 'Failed to fetch formation status' });
  }
});

// Corporate Tools Routes
router.get('/corporate-tools/states/:stateCode/entity-types', async (req: Request, res: Response) => {
  try {
    if (!corporateToolsService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { stateCode } = req.params;
    const entityTypes = await corporateToolsService.getEntityTypes(stateCode);
    res.json({ entityTypes });
  } catch (error) {
    console.error('Error fetching Corporate Tools entity types:', error);
    res.status(500).json({ error: 'Failed to fetch entity types' });
  }
});

router.get('/corporate-tools/states/:stateCode/filing-requirements/:entityType', async (req: Request, res: Response) => {
  try {
    if (!corporateToolsService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { stateCode, entityType } = req.params;
    const requirements = await corporateToolsService.getFilingRequirements(stateCode, entityType);
    res.json({ requirements });
  } catch (error) {
    console.error('Error fetching Corporate Tools filing requirements:', error);
    res.status(500).json({ error: 'Failed to fetch filing requirements' });
  }
});

router.post('/corporate-tools/formations', async (req: Request, res: Response) => {
  try {
    if (!corporateToolsService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    // Note: In a real implementation, we would validate the request body
    // with a comprehensive schema that matches Corporate Tools' API requirements
    
    const formationResult = await corporateToolsService.submitBusinessFormation(req.body);
    res.status(201).json({ formationResult });
  } catch (error) {
    console.error('Error submitting Corporate Tools formation:', error);
    res.status(500).json({ error: 'Failed to submit business formation' });
  }
});

router.get('/corporate-tools/formations/:formationId', async (req: Request, res: Response) => {
  try {
    if (!corporateToolsService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { formationId } = req.params;
    const status = await corporateToolsService.getFormationStatus(formationId);
    res.json({ status });
  } catch (error) {
    console.error('Error fetching Corporate Tools formation status:', error);
    res.status(500).json({ error: 'Failed to fetch formation status' });
  }
});

router.get('/corporate-tools/documents/templates', async (req: Request, res: Response) => {
  try {
    if (!corporateToolsService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { state, entity_type } = req.query;
    
    if (!state || !entity_type) {
      return res.status(400).json({ error: 'State and entity_type parameters are required' });
    }
    
    const templates = await corporateToolsService.getDocumentTemplates(state as string, entity_type as string);
    res.json({ templates });
  } catch (error) {
    console.error('Error fetching Corporate Tools document templates:', error);
    res.status(500).json({ error: 'Failed to fetch document templates' });
  }
});

router.post('/corporate-tools/documents/generate/:templateId', async (req: Request, res: Response) => {
  try {
    if (!corporateToolsService.isApiConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { templateId } = req.params;
    const document = await corporateToolsService.generateDocument(templateId, req.body);
    res.json({ document });
  } catch (error) {
    console.error('Error generating Corporate Tools document:', error);
    res.status(500).json({ error: 'Failed to generate document' });
  }
});

export default router;