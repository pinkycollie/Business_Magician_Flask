/**
 * Business Formation Service
 * 
 * This service provides a unified interface for business formation services
 * across different providers including Northwest Registered Agent and Corporate Tools.
 */

import axios from 'axios';
import { z } from 'zod';

// Northwest API Configuration
const NORTHWEST_API_CONFIG = {
  baseUrl: 'https://api.northwestregisteredagent.com/v1',
  apiKey: process.env.NORTHWEST_API_KEY
};

// API Response Schema for Northwest
const NorthwestApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional()
});

/**
 * Creates a Northwest API client with the API key in headers
 */
function createNorthwestClient() {
  if (!NORTHWEST_API_CONFIG.apiKey) {
    throw new Error('Northwest Registered Agent API key is not configured.');
  }
  
  return axios.create({
    baseURL: NORTHWEST_API_CONFIG.baseUrl,
    headers: {
      'X-API-Key': NORTHWEST_API_CONFIG.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

/**
 * Check if Northwest API is configured
 */
export function isNorthwestConfigured() {
  return !!NORTHWEST_API_CONFIG.apiKey;
}

/**
 * Get available entity types for a specific state from Northwest
 */
export async function getNorthwestEntityTypes(stateCode: string) {
  try {
    const client = createNorthwestClient();
    const response = await client.get(`/entity-types/${stateCode}`);
    
    const validatedResponse = NorthwestApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to retrieve entity types');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching Northwest entity types:', error);
    throw error;
  }
}

/**
 * Get state filing fees and requirements from Northwest
 */
export async function getNorthwestStateRequirements(stateCode: string) {
  try {
    const client = createNorthwestClient();
    const response = await client.get(`/states/${stateCode}/requirements`);
    
    const validatedResponse = NorthwestApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to retrieve state requirements');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching Northwest state requirements:', error);
    throw error;
  }
}

/**
 * Submit a business formation order to Northwest
 */
export async function submitNorthwestBusinessFormation(formData: any) {
  try {
    const client = createNorthwestClient();
    const response = await client.post('/formations', formData);
    
    const validatedResponse = NorthwestApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to submit business formation');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error submitting Northwest business formation:', error);
    throw error;
  }
}

/**
 * Check the status of a Northwest formation order
 */
export async function getNorthwestFormationStatus(formationId: string) {
  try {
    const client = createNorthwestClient();
    const response = await client.get(`/formations/${formationId}/status`);
    
    const validatedResponse = NorthwestApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to retrieve formation status');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching Northwest formation status:', error);
    throw error;
  }
}

/**
 * Get available registered agent services from Northwest
 */
export async function getNorthwestRegisteredAgentServices() {
  try {
    const client = createNorthwestClient();
    const response = await client.get('/registered-agent/services');
    
    const validatedResponse = NorthwestApiResponseSchema.parse(response.data);
    
    if (!validatedResponse.success) {
      throw new Error(validatedResponse.message || 'Failed to retrieve registered agent services');
    }
    
    return validatedResponse.data;
  } catch (error) {
    console.error('Error fetching Northwest registered agent services:', error);
    throw error;
  }
}

// These functions can be expanded in the future to support Corporate Tools API integration
// For now, they're placeholders that will indicate Corporate Tools integration is not yet available

export function isCorporateToolsConfigured() {
  return false; // Not yet configured
}

export async function getAvailableProviders() {
  const providers = [];
  
  if (isNorthwestConfigured()) {
    providers.push({
      id: 'northwest',
      name: 'Northwest Registered Agent',
      features: ['Business Formation', 'Registered Agent Services', 'Annual Reports']
    });
  }
  
  if (isCorporateToolsConfigured()) {
    providers.push({
      id: 'corporate-tools',
      name: 'Corporate Tools',
      features: ['Business Formation', 'Document Generation', 'Compliance']
    });
  }
  
  return providers;
}