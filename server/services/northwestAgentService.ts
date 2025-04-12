/**
 * Northwest Registered Agent API Service
 * 
 * This service handles authentication and communication with the Northwest Registered Agent API
 * for business formation and registered agent services.
 */

import jwt from 'jsonwebtoken';
import axios from 'axios';
import { z } from 'zod';

// API configuration
// In production, these would be stored in environment variables
const API_CONFIG = {
  baseUrl: 'https://api.northwestregisteredagent.com/v1',
  clientId: process.env.NORTHWEST_CLIENT_ID,
  clientSecret: process.env.NORTHWEST_CLIENT_SECRET,
  apiKey: process.env.NORTHWEST_API_KEY,
  tokenExpiration: '1h'
};

// Zod schema for API responses
const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional()
});

/**
 * Generates a JWT token for API authentication
 */
function generateToken() {
  if (!API_CONFIG.clientId || !API_CONFIG.clientSecret || !API_CONFIG.apiKey) {
    throw new Error('Northwest Registered Agent API credentials are not configured.');
  }
  
  const payload = {
    client_id: API_CONFIG.clientId,
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
    const response = await client.get(`/entity-types/${stateCode}`);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to retrieve entity types');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching entity types:', error);
    throw error;
  }
}

/**
 * Get state filing fees and requirements
 */
export async function getStateRequirements(stateCode: string) {
  try {
    const client = createApiClient();
    const response = await client.get(`/states/${stateCode}/requirements`);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to retrieve state requirements');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching state requirements:', error);
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
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to submit business formation');
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
    const response = await client.get(`/formations/${formationId}/status`);
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to retrieve formation status');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching formation status:', error);
    throw error;
  }
}

/**
 * Get available registered agent services
 */
export async function getRegisteredAgentServices() {
  try {
    const client = createApiClient();
    const response = await client.get('/registered-agent/services');
    
    const validatedResponse = ApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to retrieve registered agent services');
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
  return !!(API_CONFIG.clientId && API_CONFIG.clientSecret && API_CONFIG.apiKey);
}