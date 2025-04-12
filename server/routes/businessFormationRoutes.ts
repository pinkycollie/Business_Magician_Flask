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

// We're focusing primarily on Northwest Registered Agent for our business formation services
// Corporate Tools routes are removed for simplicity

export default router;