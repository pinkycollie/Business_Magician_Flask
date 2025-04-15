/**
 * Business Formation Routes
 * 
 * These routes handle all API endpoints related to business formation
 * including entity creation, state requirements, and pricing through
 * Northwest Registered Agent.
 */

import { Router, Request, Response, NextFunction } from 'express';
import northwestService, { BusinessEntitySchema } from '../services/northwestAgentService';
import { createBusinessFormationRecord } from '../services/notionService';

const router = Router();

// Middleware to check if Northwest API is configured
const requireNorthwestApi = (req: Request, res: Response, next: NextFunction) => {
  if (!northwestService.isNorthwestApiConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Northwest Registered Agent API is not configured'
    });
  }
  next();
};

// Get supported entity types
router.get('/entity-types', (req: Request, res: Response) => {
  const entityTypes = Object.keys(northwestService.entityTypes).map(key => ({
    id: key,
    name: northwestService.entityTypes[key as keyof typeof northwestService.entityTypes],
  }));
  
  res.json({
    success: true,
    data: entityTypes
  });
});

// Get state requirements for entity formation
router.get('/requirements/:stateCode/:entityType', requireNorthwestApi, async (req: Request, res: Response) => {
  try {
    const { stateCode, entityType } = req.params;
    
    const response = await northwestService.getStateRequirements(
      entityType as keyof typeof northwestService.entityTypes, 
      stateCode
    );
    
    res.json(response);
  } catch (error: any) {
    console.error('Error fetching state requirements:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch state requirements'
    });
  }
});

// Check business name availability
router.post('/name-availability', requireNorthwestApi, async (req: Request, res: Response) => {
  try {
    const { companyName, entityType, stateCode } = req.body;
    
    if (!companyName || !entityType || !stateCode) {
      return res.status(400).json({
        success: false,
        error: 'Company name, entity type, and state code are required'
      });
    }
    
    const response = await northwestService.checkNameAvailability(
      companyName,
      entityType,
      stateCode
    );
    
    res.json(response);
  } catch (error: any) {
    console.error('Error checking name availability:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check name availability'
    });
  }
});

// Get formation pricing
router.post('/pricing', requireNorthwestApi, async (req: Request, res: Response) => {
  try {
    const { entityType, stateCode, options } = req.body;
    
    if (!entityType || !stateCode) {
      return res.status(400).json({
        success: false,
        error: 'Entity type and state code are required'
      });
    }
    
    const response = await northwestService.getFormationPricing(
      entityType,
      stateCode,
      options
    );
    
    res.json(response);
  } catch (error: any) {
    console.error('Error getting formation pricing:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get formation pricing'
    });
  }
});

// Get registered agent services
router.get('/registered-agent/:stateCode', requireNorthwestApi, async (req: Request, res: Response) => {
  try {
    const { stateCode } = req.params;
    
    if (!stateCode) {
      return res.status(400).json({
        success: false,
        error: 'State code is required'
      });
    }
    
    const response = await northwestService.getRegisteredAgentServices(stateCode);
    
    res.json(response);
  } catch (error: any) {
    console.error('Error getting registered agent services:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get registered agent services'
    });
  }
});

// Create a business entity
router.post('/entity', requireNorthwestApi, async (req: Request, res: Response) => {
  try {
    // Validate request body against schema
    const entityData = BusinessEntitySchema.parse(req.body);
    
    // Create Notion record if Notion is configured
    try {
      await createBusinessFormationRecord(
        entityData.companyName,
        entityData.entityType,
        entityData.stateCode,
        'IN_PROGRESS',
        JSON.stringify(entityData, null, 2)
      );
    } catch (notionError) {
      console.warn('Failed to create Notion record:', notionError);
      // Continue with entity creation even if Notion record fails
    }
    
    // Call Northwest API to create entity
    const response = await northwestService.createBusinessEntity(entityData);
    
    // Update Notion record with formation status if successful
    if (response.success && response.data) {
      try {
        await createBusinessFormationRecord(
          entityData.companyName,
          entityData.entityType,
          entityData.stateCode,
          'COMPLETED',
          `Formation ID: ${response.data.formationId}\nStatus: ${response.data.status}\nEstimated Completion: ${response.data.estimatedCompletionDate}`
        );
      } catch (notionError) {
        console.warn('Failed to update Notion record:', notionError);
      }
    }
    
    res.json(response);
  } catch (error: any) {
    console.error('Error creating business entity:', error);
    
    // Error validation handling
    if (error.errors) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create business entity'
    });
  }
});

// Get entity formation status
router.get('/status/:formationId', requireNorthwestApi, async (req: Request, res: Response) => {
  try {
    const { formationId } = req.params;
    
    if (!formationId) {
      return res.status(400).json({
        success: false,
        error: 'Formation ID is required'
      });
    }
    
    const response = await northwestService.getFormationStatus(formationId);
    
    res.json(response);
  } catch (error: any) {
    console.error('Error getting formation status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get formation status'
    });
  }
});

export default router;