/**
 * Business Formation Routes
 * 
 * These routes provide a unified interface for business formation services
 * across different providers.
 */

import express, { Request, Response } from 'express';
import { z } from 'zod';
import * as businessFormationService from '../services/businessFormationService';

const router = express.Router();

// Get available business formation providers
router.get('/providers', async (_req: Request, res: Response) => {
  try {
    const providers = await businessFormationService.getAvailableProviders();
    res.json({ providers });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Northwest Registered Agent routes
// --------------------------------

// Check if Northwest API is configured
router.get('/northwest/status', (_req: Request, res: Response) => {
  try {
    const configured = businessFormationService.isNorthwestConfigured();
    res.json({ 
      configured, 
      name: 'Northwest Registered Agent',
      message: configured ? 'API is properly configured' : 'API key is missing'
    });
  } catch (error) {
    console.error('Error checking Northwest configuration:', error);
    res.status(500).json({ error: 'Failed to check Northwest configuration' });
  }
});

// Get entity types for a state from Northwest
router.get('/northwest/entity-types/:stateCode', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isNorthwestConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    const { stateCode } = req.params;
    const entityTypes = await businessFormationService.getNorthwestEntityTypes(stateCode);
    res.json({ entityTypes });
  } catch (error) {
    console.error('Error fetching Northwest entity types:', error);
    res.status(500).json({ error: 'Failed to fetch entity types' });
  }
});

// Get state requirements from Northwest
router.get('/northwest/states/:stateCode/requirements', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isNorthwestConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    const { stateCode } = req.params;
    const requirements = await businessFormationService.getNorthwestStateRequirements(stateCode);
    res.json({ requirements });
  } catch (error) {
    console.error('Error fetching Northwest state requirements:', error);
    res.status(500).json({ error: 'Failed to fetch state requirements' });
  }
});

// Submit a business formation to Northwest
router.post('/northwest/formations', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isNorthwestConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    // In a real implementation, we would validate the request body here
    const formationResult = await businessFormationService.submitNorthwestBusinessFormation(req.body);
    res.status(201).json({ formationResult });
  } catch (error) {
    console.error('Error submitting Northwest formation:', error);
    res.status(500).json({ error: 'Failed to submit business formation' });
  }
});

// Get formation status from Northwest
router.get('/northwest/formations/:formationId/status', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isNorthwestConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    const { formationId } = req.params;
    const status = await businessFormationService.getNorthwestFormationStatus(formationId);
    res.json({ status });
  } catch (error) {
    console.error('Error fetching Northwest formation status:', error);
    res.status(500).json({ error: 'Failed to fetch formation status' });
  }
});

// Get registered agent services from Northwest
router.get('/northwest/registered-agent/services', async (_req: Request, res: Response) => {
  try {
    if (!businessFormationService.isNorthwestConfigured()) {
      return res.status(503).json({ 
        error: 'Northwest Registered Agent API is not configured' 
      });
    }
    
    const services = await businessFormationService.getNorthwestRegisteredAgentServices();
    res.json({ services });
  } catch (error) {
    console.error('Error fetching Northwest registered agent services:', error);
    res.status(500).json({ error: 'Failed to fetch registered agent services' });
  }
});

// Corporate Tools Routes
// Based on https://docs.corporatetools.com
// ----------------------

// Check if Corporate Tools API is configured
router.get('/corporate-tools/status', (_req: Request, res: Response) => {
  try {
    const configured = businessFormationService.isCorporateToolsConfigured();
    res.json({ 
      configured, 
      name: 'Corporate Tools',
      message: configured ? 'API is properly configured' : 'API credentials are missing'
    });
  } catch (error) {
    console.error('Error checking Corporate Tools configuration:', error);
    res.status(500).json({ error: 'Failed to check Corporate Tools configuration' });
  }
});

// Get entity types for a state from Corporate Tools
router.get('/corporate-tools/states/:stateCode/entity-types', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isCorporateToolsConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { stateCode } = req.params;
    const entityTypes = await businessFormationService.getEntityTypes(stateCode);
    res.json({ entityTypes });
  } catch (error) {
    console.error('Error fetching Corporate Tools entity types:', error);
    res.status(500).json({ error: 'Failed to fetch entity types' });
  }
});

// Get filing requirements from Corporate Tools
router.get('/corporate-tools/states/:stateCode/requirements/:entityType', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isCorporateToolsConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { stateCode, entityType } = req.params;
    const requirements = await businessFormationService.getFilingRequirements(stateCode, entityType);
    res.json({ requirements });
  } catch (error) {
    console.error('Error fetching Corporate Tools filing requirements:', error);
    res.status(500).json({ error: 'Failed to fetch filing requirements' });
  }
});

// Get filing fees from Corporate Tools
router.get('/corporate-tools/states/:stateCode/fees/:entityType', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isCorporateToolsConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { stateCode, entityType } = req.params;
    const fees = await businessFormationService.getFilingFees(stateCode, entityType);
    res.json({ fees });
  } catch (error) {
    console.error('Error fetching Corporate Tools filing fees:', error);
    res.status(500).json({ error: 'Failed to fetch filing fees' });
  }
});

// Submit a business formation to Corporate Tools
router.post('/corporate-tools/formations', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isCorporateToolsConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    // In a real implementation, we would validate the request body here
    const formationResult = await businessFormationService.submitBusinessFormation(req.body);
    res.status(201).json({ formationResult });
  } catch (error) {
    console.error('Error submitting Corporate Tools formation:', error);
    res.status(500).json({ error: 'Failed to submit business formation' });
  }
});

// Get formation status from Corporate Tools
router.get('/corporate-tools/formations/:formationId', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isCorporateToolsConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { formationId } = req.params;
    const status = await businessFormationService.getFormationStatus(formationId);
    res.json({ status });
  } catch (error) {
    console.error('Error fetching Corporate Tools formation status:', error);
    res.status(500).json({ error: 'Failed to fetch formation status' });
  }
});

// Get document templates from Corporate Tools
router.get('/corporate-tools/documents/templates', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isCorporateToolsConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { state, entity_type } = req.query;
    
    if (!state || !entity_type) {
      return res.status(400).json({ error: 'State and entity_type parameters are required' });
    }
    
    const templates = await businessFormationService.getDocumentTemplates(state as string, entity_type as string);
    res.json({ templates });
  } catch (error) {
    console.error('Error fetching Corporate Tools document templates:', error);
    res.status(500).json({ error: 'Failed to fetch document templates' });
  }
});

// Generate document from Corporate Tools template
router.post('/corporate-tools/documents/generate/:templateId', async (req: Request, res: Response) => {
  try {
    if (!businessFormationService.isCorporateToolsConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const { templateId } = req.params;
    const document = await businessFormationService.generateDocument(templateId, req.body);
    res.json({ document });
  } catch (error) {
    console.error('Error generating Corporate Tools document:', error);
    res.status(500).json({ error: 'Failed to generate document' });
  }
});

// Get registered agent services from Corporate Tools
router.get('/corporate-tools/registered-agent/services', async (_req: Request, res: Response) => {
  try {
    if (!businessFormationService.isCorporateToolsConfigured()) {
      return res.status(503).json({ 
        error: 'Corporate Tools API is not configured' 
      });
    }
    
    const services = await businessFormationService.getRegisteredAgentServices();
    res.json({ services });
  } catch (error) {
    console.error('Error fetching Corporate Tools registered agent services:', error);
    res.status(500).json({ error: 'Failed to fetch registered agent services' });
  }
});

export default router;