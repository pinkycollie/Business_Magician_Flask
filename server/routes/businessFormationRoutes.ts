/**
 * Business Formation Routes
 * 
 * This file defines the routes for interacting with business formation APIs
 * from multiple providers.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as businessFormationService from '../services/businessFormationService';

const router = Router();

// Define validation schemas
const stateCodeSchema = z.string().length(2);

const formationRequestSchema = z.object({
  businessName: z.string().min(3).max(100),
  entityType: z.enum(['llc', 'corporation', 'partnership', 'sole-proprietorship']),
  state: z.string().length(2),
  owners: z.array(z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().length(2),
      zip: z.string().min(5)
    }),
    ownershipPercentage: z.number().min(0).max(100).optional(),
    title: z.string().optional()
  })).min(1),
  businessAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    zip: z.string().min(5)
  }),
  mailingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    zip: z.string().min(5)
  }).optional(),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string().min(10)
  }),
  registeredAgent: z.object({
    useProviderService: z.boolean(),
    agentName: z.string().optional(),
    agentAddress: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().length(2),
      zip: z.string().min(5)
    }).optional()
  }),
  businessPurpose: z.string().optional(),
  options: z.object({
    expediteFiling: z.boolean(),
    einFiling: z.boolean(),
    operatingAgreement: z.boolean(),
    complianceService: z.boolean()
  }),
  providerPreference: z.enum(['corporatetools', 'northwest', 'zenbusiness', 'any']).optional(),
  userId: z.number().optional() // Add this when we have authentication
});

// Get available business formation providers
router.get('/providers', async (_req: Request, res: Response) => {
  try {
    const providers = businessFormationService.getAvailableProviders();
    res.json({ providers });
  } catch (error: any) {
    console.error('Error getting providers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available states for business formation
router.get('/states', async (_req: Request, res: Response) => {
  try {
    const states = await businessFormationService.getAvailableStates();
    res.json(states);
  } catch (error: any) {
    console.error('Error getting states:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get information for a specific state
router.get('/states/:stateCode', async (req: Request, res: Response) => {
  try {
    const { stateCode } = req.params;
    
    // Validate state code
    const result = stateCodeSchema.safeParse(stateCode);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid state code format. Must be a 2-letter code.' });
    }
    
    const stateInfo = await businessFormationService.getStateInfo(stateCode.toUpperCase());
    res.json(stateInfo);
  } catch (error: any) {
    console.error('Error getting state info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get entity types for a specific state
router.get('/entity-types/:stateCode', async (req: Request, res: Response) => {
  try {
    const { stateCode } = req.params;
    
    // Validate state code
    const result = stateCodeSchema.safeParse(stateCode);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid state code format. Must be a 2-letter code.' });
    }
    
    const entityTypes = await businessFormationService.getEntityTypes(stateCode.toUpperCase());
    res.json(entityTypes);
  } catch (error: any) {
    console.error('Error getting entity types:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit a business formation request
router.post('/submit-formation', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = formationRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid formation request',
        details: validationResult.error.errors
      });
    }
    
    const formationData = validationResult.data;
    
    // Determine which provider to use
    const provider = formationData.providerPreference || 'corporatetools';
    let formationResponse;
    
    // Route to the appropriate provider service
    switch (provider) {
      case 'corporatetools':
        formationResponse = await businessFormationService.processCorporateToolsFormation(formationData);
        break;
      case 'northwest':
        formationResponse = await businessFormationService.processNorthwestFormation(formationData);
        break;
      case 'zenbusiness':
        formationResponse = await businessFormationService.processZenBusinessFormation(formationData);
        break;
      case 'any':
        // Choose the first available provider
        const availableProviders = businessFormationService.getAvailableProviders();
        if (availableProviders.length === 0) {
          return res.status(503).json({ error: 'No business formation providers are currently configured' });
        }
        
        // Use the first available provider
        const selectedProvider = availableProviders[0];
        
        switch (selectedProvider) {
          case 'corporatetools':
            formationResponse = await businessFormationService.processCorporateToolsFormation(formationData);
            break;
          case 'northwest':
            formationResponse = await businessFormationService.processNorthwestFormation(formationData);
            break;
          case 'zenbusiness':
            formationResponse = await businessFormationService.processZenBusinessFormation(formationData);
            break;
          default:
            return res.status(500).json({ error: `Unsupported provider: ${selectedProvider}` });
        }
        break;
      default:
        return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }
    
    // Send response
    res.json(formationResponse);
  } catch (error: any) {
    console.error('Error submitting formation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check the status of a formation request
router.get('/formation-status/:provider/:formationId', async (req: Request, res: Response) => {
  try {
    const { provider, formationId } = req.params;
    
    // Validate provider
    if (!['corporatetools', 'northwest', 'zenbusiness'].includes(provider)) {
      return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }
    
    const status = await businessFormationService.checkFormationStatus(provider, formationId);
    
    res.json(status);
  } catch (error: any) {
    console.error('Error checking formation status:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;