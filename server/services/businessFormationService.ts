/**
 * Business Formation Service
 * 
 * This service handles communication with various business formation API providers
 * including Corporate Tools, Northwest Registered Agent, and ZenBusiness.
 */

import fetch from 'node-fetch';
import { storage } from '../storage';

// Environment variables for API keys
const CORPORATE_TOOLS_API_KEY = process.env.CORPORATE_TOOLS_API_KEY || '';
const NORTHWEST_API_KEY = process.env.NORTHWEST_API_KEY || '';
const ZENBUSINESS_API_KEY = process.env.ZENBUSINESS_API_KEY || '';

// API Base URLs
const CORPORATE_TOOLS_API_URL = 'https://api.corporatetools.com';
const NORTHWEST_API_URL = 'https://api.northwestregisteredagent.com';
const ZENBUSINESS_API_URL = 'https://api.zenbusiness.com/v1';

/**
 * Validate that we have API keys for the different providers
 */
export function getAvailableProviders() {
  const availableProviders = [];
  
  if (CORPORATE_TOOLS_API_KEY) {
    availableProviders.push('corporatetools');
  }
  
  if (NORTHWEST_API_KEY) {
    availableProviders.push('northwest');
  }
  
  if (ZENBUSINESS_API_KEY) {
    availableProviders.push('zenbusiness');
  }
  
  return availableProviders;
}

/**
 * Process a business formation request for Corporate Tools API
 */
export async function processCorporateToolsFormation(formationData: any) {
  if (!CORPORATE_TOOLS_API_KEY) {
    throw new Error('Corporate Tools API key is not configured');
  }
  
  try {
    // Make API request to Corporate Tools
    const response = await fetch(`${CORPORATE_TOOLS_API_URL}/formations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CORPORATE_TOOLS_API_KEY}`
      },
      body: JSON.stringify(formationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Corporate Tools API Error: ${errorData.message || response.statusText}`);
    }
    
    const formationResponse = await response.json();
    
    // Store the formation record in our database
    await storeFormationRecord({
      provider: 'corporatetools',
      providerOrderId: formationResponse.id,
      businessName: formationData.businessName,
      entityType: formationData.businessType,
      state: formationData.state,
      status: formationResponse.status,
      estimatedCompletionDate: formationResponse.estimatedCompletionDate,
      userId: formationData.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return formationResponse;
  } catch (error) {
    console.error('Error processing Corporate Tools formation:', error);
    throw error;
  }
}

/**
 * Process a business formation request for Northwest Registered Agent API
 */
export async function processNorthwestFormation(formationData: any) {
  if (!NORTHWEST_API_KEY) {
    throw new Error('Northwest API key is not configured');
  }
  
  try {
    // Make API request to Northwest
    const response = await fetch(`${NORTHWEST_API_URL}/api/formations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': NORTHWEST_API_KEY
      },
      body: JSON.stringify(formationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Northwest API Error: ${errorData.message || response.statusText}`);
    }
    
    const formationResponse = await response.json();
    
    // Store the formation record in our database
    await storeFormationRecord({
      provider: 'northwest',
      providerOrderId: formationResponse.orderId,
      businessName: formationData.companyName,
      entityType: formationData.entityType,
      state: formationData.state,
      status: mapNorthwestStatus(formationResponse.status),
      estimatedCompletionDate: formationResponse.trackingDetails.estimatedCompletionDate,
      userId: formationData.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return formationResponse;
  } catch (error) {
    console.error('Error processing Northwest formation:', error);
    throw error;
  }
}

/**
 * Process a business formation request for ZenBusiness API
 */
export async function processZenBusinessFormation(formationData: any) {
  if (!ZENBUSINESS_API_KEY) {
    throw new Error('ZenBusiness API key is not configured');
  }
  
  try {
    // Make API request to ZenBusiness
    const response = await fetch(`${ZENBUSINESS_API_URL}/formations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZENBUSINESS_API_KEY}`
      },
      body: JSON.stringify(formationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ZenBusiness API Error: ${errorData.message || response.statusText}`);
    }
    
    const formationResponse = await response.json();
    
    // Store the formation record in our database
    await storeFormationRecord({
      provider: 'zenbusiness',
      providerOrderId: formationResponse.formationId,
      businessName: formationData.businessName,
      entityType: formationData.entityType,
      state: formationData.state,
      status: formationResponse.status,
      estimatedCompletionDate: formationResponse.estimatedCompletionDate,
      userId: formationData.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return formationResponse;
  } catch (error) {
    console.error('Error processing ZenBusiness formation:', error);
    throw error;
  }
}

/**
 * Check the status of a formation request
 */
export async function checkFormationStatus(provider: string, orderId: string) {
  switch (provider) {
    case 'corporatetools':
      return await checkCorporateToolsStatus(orderId);
    case 'northwest':
      return await checkNorthwestStatus(orderId);
    case 'zenbusiness':
      return await checkZenBusinessStatus(orderId);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Check formation status with Corporate Tools
 */
async function checkCorporateToolsStatus(orderId: string) {
  if (!CORPORATE_TOOLS_API_KEY) {
    throw new Error('Corporate Tools API key is not configured');
  }
  
  try {
    const response = await fetch(`${CORPORATE_TOOLS_API_URL}/formations/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${CORPORATE_TOOLS_API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Corporate Tools API Error: ${errorData.message || response.statusText}`);
    }
    
    const status = await response.json();
    
    // Update status in our database
    await updateFormationStatus('corporatetools', orderId, status.status);
    
    return status;
  } catch (error) {
    console.error('Error checking Corporate Tools status:', error);
    throw error;
  }
}

/**
 * Check formation status with Northwest
 */
async function checkNorthwestStatus(orderId: string) {
  if (!NORTHWEST_API_KEY) {
    throw new Error('Northwest API key is not configured');
  }
  
  try {
    const response = await fetch(`${NORTHWEST_API_URL}/api/formations/${orderId}`, {
      headers: {
        'X-API-Key': NORTHWEST_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Northwest API Error: ${errorData.message || response.statusText}`);
    }
    
    const status = await response.json();
    
    // Update status in our database
    await updateFormationStatus('northwest', orderId, mapNorthwestStatus(status.status));
    
    return status;
  } catch (error) {
    console.error('Error checking Northwest status:', error);
    throw error;
  }
}

/**
 * Check formation status with ZenBusiness
 */
async function checkZenBusinessStatus(orderId: string) {
  if (!ZENBUSINESS_API_KEY) {
    throw new Error('ZenBusiness API key is not configured');
  }
  
  try {
    const response = await fetch(`${ZENBUSINESS_API_URL}/formations/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${ZENBUSINESS_API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ZenBusiness API Error: ${errorData.message || response.statusText}`);
    }
    
    const status = await response.json();
    
    // Update status in our database
    await updateFormationStatus('zenbusiness', orderId, status.status);
    
    return status;
  } catch (error) {
    console.error('Error checking ZenBusiness status:', error);
    throw error;
  }
}

/**
 * Retrieve information about available states from Corporate Tools
 */
export async function getAvailableStates() {
  if (!CORPORATE_TOOLS_API_KEY) {
    throw new Error('Corporate Tools API key is not configured');
  }
  
  try {
    const response = await fetch(`${CORPORATE_TOOLS_API_URL}/states`, {
      headers: {
        'Authorization': `Bearer ${CORPORATE_TOOLS_API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Corporate Tools API Error: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching available states:', error);
    throw error;
  }
}

/**
 * Retrieve information about a specific state from Corporate Tools
 */
export async function getStateInfo(stateCode: string) {
  if (!CORPORATE_TOOLS_API_KEY) {
    throw new Error('Corporate Tools API key is not configured');
  }
  
  try {
    const response = await fetch(`${CORPORATE_TOOLS_API_URL}/states/${stateCode}`, {
      headers: {
        'Authorization': `Bearer ${CORPORATE_TOOLS_API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Corporate Tools API Error: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching state information:', error);
    throw error;
  }
}

/**
 * Retrieve entity types for a specific state from Corporate Tools
 */
export async function getEntityTypes(stateCode: string) {
  if (!CORPORATE_TOOLS_API_KEY) {
    throw new Error('Corporate Tools API key is not configured');
  }
  
  try {
    const response = await fetch(`${CORPORATE_TOOLS_API_URL}/entity-types/${stateCode}`, {
      headers: {
        'Authorization': `Bearer ${CORPORATE_TOOLS_API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Corporate Tools API Error: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching entity types:', error);
    throw error;
  }
}

/**
 * Store formation record in our database
 */
async function storeFormationRecord(formationRecord: any) {
  try {
    // For now, just log - we'll implement this using the storage interface
    console.log('Storing formation record:', formationRecord);
    
    // When the database schema is updated to include a formations table:
    // await storage.createFormation(formationRecord);
    
    return formationRecord;
  } catch (error) {
    console.error('Error storing formation record:', error);
    throw error;
  }
}

/**
 * Update formation status in our database
 */
async function updateFormationStatus(provider: string, providerOrderId: string, status: string) {
  try {
    // For now, just log - we'll implement this using the storage interface
    console.log('Updating formation status:', { provider, providerOrderId, status });
    
    // When the database schema is updated to include a formations table:
    // await storage.updateFormationStatus(provider, providerOrderId, status);
    
    return { provider, providerOrderId, status };
  } catch (error) {
    console.error('Error updating formation status:', error);
    throw error;
  }
}

/**
 * Map Northwest status to standardized status
 */
function mapNorthwestStatus(northwestStatus: string): string {
  switch (northwestStatus) {
    case 'submitted':
      return 'pending';
    case 'in-progress':
      return 'processing';
    case 'approved':
      return 'completed';
    case 'rejected':
      return 'failed';
    default:
      return northwestStatus;
  }
}