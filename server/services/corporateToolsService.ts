/**
 * Corporate Tools API Service
 * 
 * This service handles authentication and communication with the Corporate Tools API
 * for business formation and document services.
 * 
 * Based on the documentation at docs.corporatetools.com
 */

import jwt from 'jsonwebtoken';
import axios from 'axios';
import { z } from 'zod';

// API configuration based on Corporate Tools documentation
const API_CONFIG = {
  baseUrl: 'https://api.corporatetools.com',
  apiKey: process.env.CORPORATE_TOOLS_API_KEY,
  apiSecret: process.env.CORPORATE_TOOLS_API_SECRET,
  tokenExpiration: '1h'
};

// Zod schema for API responses
const ApiResponseSchema = z.object({
  status: z.string().optional(),
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  errors: z.array(z.string()).optional()
});

/**
 * Generates a JWT token for Corporate Tools API authentication
 * Based on the JWT documentation at docs.corporatetools.com
 */
function generateToken() {
  if (!API_CONFIG.apiKey || !API_CONFIG.apiSecret) {
    throw new Error('Corporate Tools API credentials are not configured.');
  }
  
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    // Standard JWT claims
    iss: 'business-magician-platform',  // Issuer - our application
    sub: API_CONFIG.apiKey,             // Subject - API key
    iat: now,                           // Issued at
    exp: now + 3600,                    // Expires in 1 hour
    
    // Custom claims for Corporate Tools
    api_key: API_CONFIG.apiKey
  };
  
  return jwt.sign(payload, API_CONFIG.apiSecret, { algorithm: 'HS256' });
}

/**
 * Creates an authenticated API client for Corporate Tools
 */
function createApiClient() {
  const token = generateToken();
  
  return axios.create({
    baseURL: API_CONFIG.baseUrl,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

/**
 * Get available entity types for a specific state
 */
export async function getEntityTypes(stateCode: string) {
  try {
    const client = createApiClient();
    const response = await client.get(`/states/${stateCode}/entity-types`);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status === 'error' || validatedResponse.success === false) {
      const errorMsg = validatedResponse.error || 
                      (validatedResponse.errors && validatedResponse.errors.join(', ')) || 
                      validatedResponse.message || 
                      'Failed to retrieve entity types';
      throw new Error(errorMsg);
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching entity types:', error);
    throw error;
  }
}

/**
 * Get filing requirements for a specific state and entity type
 */
export async function getFilingRequirements(stateCode: string, entityType: string) {
  try {
    const client = createApiClient();
    const response = await client.get(`/states/${stateCode}/filing-requirements/${entityType}`);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status === 'error' || validatedResponse.success === false) {
      const errorMsg = validatedResponse.error || 
                      (validatedResponse.errors && validatedResponse.errors.join(', ')) || 
                      validatedResponse.message || 
                      'Failed to retrieve filing requirements';
      throw new Error(errorMsg);
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching filing requirements:', error);
    throw error;
  }
}

/**
 * Get filing fees for a specific state and entity type
 */
export async function getFilingFees(stateCode: string, entityType: string) {
  try {
    const client = createApiClient();
    const response = await client.get(`/states/${stateCode}/fees/${entityType}`);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status === 'error' || validatedResponse.success === false) {
      const errorMsg = validatedResponse.error || 
                      (validatedResponse.errors && validatedResponse.errors.join(', ')) || 
                      validatedResponse.message || 
                      'Failed to retrieve filing fees';
      throw new Error(errorMsg);
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching filing fees:', error);
    throw error;
  }
}

/**
 * Submit a business formation order
 */
export async function submitBusinessFormation(formData: any) {
  try {
    const client = createApiClient();
    const response = await client.post('/formations', formData);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status === 'error' || validatedResponse.success === false) {
      const errorMsg = validatedResponse.error || 
                      (validatedResponse.errors && validatedResponse.errors.join(', ')) || 
                      validatedResponse.message || 
                      'Failed to submit business formation';
      throw new Error(errorMsg);
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error submitting business formation:', error);
    throw error;
  }
}

/**
 * Check the status of a formation order
 */
export async function getFormationStatus(formationId: string) {
  try {
    const client = createApiClient();
    const response = await client.get(`/formations/${formationId}`);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status === 'error' || validatedResponse.success === false) {
      const errorMsg = validatedResponse.error || 
                      (validatedResponse.errors && validatedResponse.errors.join(', ')) || 
                      validatedResponse.message || 
                      'Failed to retrieve formation status';
      throw new Error(errorMsg);
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching formation status:', error);
    throw error;
  }
}

/**
 * Get available document templates
 */
export async function getDocumentTemplates(stateCode: string, entityType: string) {
  try {
    const client = createApiClient();
    const response = await client.get(`/documents/templates`, {
      params: { state: stateCode, entity_type: entityType }
    });
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status === 'error' || validatedResponse.success === false) {
      const errorMsg = validatedResponse.error || 
                      (validatedResponse.errors && validatedResponse.errors.join(', ')) || 
                      validatedResponse.message || 
                      'Failed to retrieve document templates';
      throw new Error(errorMsg);
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching document templates:', error);
    throw error;
  }
}

/**
 * Generate a legal document from a template
 */
export async function generateDocument(templateId: string, documentData: any) {
  try {
    const client = createApiClient();
    const response = await client.post(`/documents/generate/${templateId}`, documentData);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status === 'error' || validatedResponse.success === false) {
      const errorMsg = validatedResponse.error || 
                      (validatedResponse.errors && validatedResponse.errors.join(', ')) || 
                      validatedResponse.message || 
                      'Failed to generate document';
      throw new Error(errorMsg);
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}

/**
 * Get registered agent services available
 */
export async function getRegisteredAgentServices() {
  try {
    const client = createApiClient();
    const response = await client.get('/registered-agent/services');
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status === 'error' || validatedResponse.success === false) {
      const errorMsg = validatedResponse.error || 
                      (validatedResponse.errors && validatedResponse.errors.join(', ')) || 
                      validatedResponse.message || 
                      'Failed to retrieve registered agent services';
      throw new Error(errorMsg);
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching registered agent services:', error);
    throw error;
  }
}

/**
 * Check if API credentials are properly configured
 */
export function isApiConfigured() {
  return !!(API_CONFIG.apiKey && API_CONFIG.apiSecret);
}