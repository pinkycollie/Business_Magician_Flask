/**
 * Corporate Tools API Service
 * 
 * This service handles authentication and communication with the Corporate Tools API
 * for business formation and document services.
 */

import jwt from 'jsonwebtoken';
import axios from 'axios';
import { z } from 'zod';

// API configuration
// In production, these would be stored in environment variables
const API_CONFIG = {
  baseUrl: 'https://api.corporatetools.com/v2',
  clientId: process.env.CORPORATE_TOOLS_CLIENT_ID,
  clientSecret: process.env.CORPORATE_TOOLS_CLIENT_SECRET,
  apiKey: process.env.CORPORATE_TOOLS_API_KEY,
  tokenExpiration: '1h'
};

// Zod schema for API responses
const ApiResponseSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  error: z.string().optional()
});

/**
 * Generates a JWT token for API authentication
 */
function generateToken() {
  if (!API_CONFIG.clientId || !API_CONFIG.clientSecret || !API_CONFIG.apiKey) {
    throw new Error('Corporate Tools API credentials are not configured.');
  }
  
  const payload = {
    iss: API_CONFIG.clientId,
    api_key: API_CONFIG.apiKey,
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, API_CONFIG.clientSecret, { expiresIn: API_CONFIG.tokenExpiration });
}

/**
 * Creates an authenticated API client
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
    
    if (validatedResponse.status !== 'success') {
      throw new Error(validatedResponse.error || validatedResponse.message || 'Failed to retrieve entity types');
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
    
    if (validatedResponse.status !== 'success') {
      throw new Error(validatedResponse.error || validatedResponse.message || 'Failed to retrieve filing requirements');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching filing requirements:', error);
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
    
    if (validatedResponse.status !== 'success') {
      throw new Error(validatedResponse.error || validatedResponse.message || 'Failed to submit business formation');
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
    
    if (validatedResponse.status !== 'success') {
      throw new Error(validatedResponse.error || validatedResponse.message || 'Failed to retrieve formation status');
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
    const response = await client.get(`/documents/templates?state=${stateCode}&entity_type=${entityType}`);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (validatedResponse.status !== 'success') {
      throw new Error(validatedResponse.error || validatedResponse.message || 'Failed to retrieve document templates');
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
    
    if (validatedResponse.status !== 'success') {
      throw new Error(validatedResponse.error || validatedResponse.message || 'Failed to generate document');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}

/**
 * Check if API credentials are properly configured
 */
export function isApiConfigured() {
  return !!(API_CONFIG.clientId && API_CONFIG.clientSecret && API_CONFIG.apiKey);
}