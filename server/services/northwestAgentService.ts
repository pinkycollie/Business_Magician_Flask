/**
 * Northwest Registered Agent Service
 * 
 * This service handles API integration with Northwest Registered Agent
 * for business formation services including:
 * - Entity creation
 * - Registered agent services
 * - Document filings
 * - Compliance management
 */

import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { createApiIntegrationRecord } from './notionService';

// Base URL for Northwest Registered Agent API
const NORTHWEST_API_BASE_URL = 'https://api.northwestregisteredagent.com/v1';

// Headers for API requests
const getApiHeaders = () => {
  if (!process.env.NORTHWEST_API_KEY) {
    throw new Error('NORTHWEST_API_KEY is not configured');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NORTHWEST_API_KEY}`
  };
};

// Check if Northwest API is properly configured
export function isNorthwestApiConfigured(): boolean {
  return !!process.env.NORTHWEST_API_KEY;
}

// Entity types supported by Northwest
export const entityTypes = {
  LLC: 'LLC',
  CORPORATION: 'Corporation',
  NON_PROFIT: 'NonProfit',
  BENEFIT_CORPORATION: 'BenefitCorporation',
  PROFESSIONAL_LLC: 'ProfessionalLLC',
  PROFESSIONAL_CORPORATION: 'ProfessionalCorporation',
  DBA: 'DBA',
  SERIES_LLC: 'SeriesLLC',
} as const;

// Schema for business entity information
export const BusinessEntitySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  entityType: z.enum([
    entityTypes.LLC,
    entityTypes.CORPORATION,
    entityTypes.NON_PROFIT,
    entityTypes.BENEFIT_CORPORATION,
    entityTypes.PROFESSIONAL_LLC,
    entityTypes.PROFESSIONAL_CORPORATION,
    entityTypes.DBA,
    entityTypes.SERIES_LLC,
  ]),
  stateCode: z.string().length(2, 'State code must be 2 characters'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().optional(),
  principalAddress: z.object({
    street1: z.string().min(1, 'Street address is required'),
    street2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().length(2, 'State code must be 2 characters'),
    zipCode: z.string().min(5, 'Zip code is required'),
  }),
  mailingAddress: z.object({
    street1: z.string().min(1, 'Street address is required'),
    street2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().length(2, 'State code must be 2 characters'),
    zipCode: z.string().min(5, 'Zip code is required'),
  }).optional(),
  members: z.array(z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    title: z.string().optional(),
    email: z.string().email('Valid email is required').optional(),
    phone: z.string().optional(),
    address: z.object({
      street1: z.string().min(1, 'Street address is required'),
      street2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().length(2, 'State code must be 2 characters'),
      zipCode: z.string().min(5, 'Zip code is required'),
    }).optional(),
  })).optional(),
  additionalOptions: z.object({
    includeEIN: z.boolean().optional(),
    includeOperatingAgreement: z.boolean().optional(),
    includeRegisteredAgent: z.boolean().optional(),
    expediteFiling: z.boolean().optional(),
  }).optional(),
});

export type BusinessEntity = z.infer<typeof BusinessEntitySchema>;

// Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface EntityFormationResponse {
  formationId: string;
  status: string;
  estimatedCompletionDate: string;
  filingNumber?: string;
  filingDate?: string;
  trackingUrl?: string;
}

interface PricingResponse {
  basePrice: number;
  stateFees: number;
  options: {
    name: string;
    price: number;
    description: string;
  }[];
  totalPrice: number;
  currency: string;
}

// Create entity record in API
export async function createBusinessEntity(entity: BusinessEntity): Promise<ApiResponse<EntityFormationResponse>> {
  if (!isNorthwestApiConfigured()) {
    throw new Error('Northwest API is not configured');
  }

  try {
    // Validate the entity data
    const validatedEntity = BusinessEntitySchema.parse(entity);

    // Log formation request to Notion if available
    try {
      await createApiIntegrationRecord(
        'Northwest Entity Formation',
        `Formation request for ${validatedEntity.companyName} (${validatedEntity.entityType}) in ${validatedEntity.stateCode}`,
        'IN_PROGRESS'
      );
    } catch (notionError) {
      console.warn('Failed to create Notion record for formation request:', notionError);
      // Continue with API call even if Notion logging fails
    }

    // Make API request to Northwest
    const response = await axios.post(
      `${NORTHWEST_API_BASE_URL}/formation/entity`,
      validatedEntity,
      { headers: getApiHeaders() }
    );

    // If successful, log to Notion
    try {
      await createApiIntegrationRecord(
        'Northwest Entity Formation',
        `Formation request for ${validatedEntity.companyName} successful. Formation ID: ${response.data.formationId}`,
        'COMPLETED'
      );
    } catch (notionError) {
      console.warn('Failed to update Notion record:', notionError);
    }

    return {
      success: true,
      data: response.data as EntityFormationResponse
    };
  } catch (error: any) {
    console.error('Error creating business entity:', error);
    
    // Log failed formation to Notion
    try {
      await createApiIntegrationRecord(
        'Northwest Entity Formation Error',
        `Formation request failed: ${error.message}`,
        'BLOCKED'
      );
    } catch (notionError) {
      console.warn('Failed to log error to Notion:', notionError);
    }

    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
}

// Get formation status
export async function getFormationStatus(formationId: string): Promise<ApiResponse<EntityFormationResponse>> {
  if (!isNorthwestApiConfigured()) {
    throw new Error('Northwest API is not configured');
  }

  try {
    const response = await axios.get(
      `${NORTHWEST_API_BASE_URL}/formation/status/${formationId}`,
      { headers: getApiHeaders() }
    );

    return {
      success: true,
      data: response.data as EntityFormationResponse
    };
  } catch (error: any) {
    console.error('Error getting formation status:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
}

// Get pricing for entity formation
export async function getFormationPricing(
  entityType: keyof typeof entityTypes,
  stateCode: string,
  options?: {
    includeEIN?: boolean;
    includeOperatingAgreement?: boolean;
    includeRegisteredAgent?: boolean;
    expediteFiling?: boolean;
  }
): Promise<ApiResponse<PricingResponse>> {
  if (!isNorthwestApiConfigured()) {
    throw new Error('Northwest API is not configured');
  }

  try {
    const response = await axios.post(
      `${NORTHWEST_API_BASE_URL}/pricing/entity-formation`,
      {
        entityType,
        stateCode,
        ...options
      },
      { headers: getApiHeaders() }
    );

    return {
      success: true,
      data: response.data as PricingResponse
    };
  } catch (error: any) {
    console.error('Error getting formation pricing:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
}

// Get state requirements
export async function getStateRequirements(
  entityType: keyof typeof entityTypes,
  stateCode: string
): Promise<ApiResponse<any>> {
  if (!isNorthwestApiConfigured()) {
    throw new Error('Northwest API is not configured');
  }

  try {
    const response = await axios.get(
      `${NORTHWEST_API_BASE_URL}/requirements/${stateCode}/${entityType}`,
      { headers: getApiHeaders() }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Error getting state requirements:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
}

// Get entity name availability
export async function checkNameAvailability(
  companyName: string,
  entityType: keyof typeof entityTypes,
  stateCode: string
): Promise<ApiResponse<{ available: boolean, suggestions?: string[] }>> {
  if (!isNorthwestApiConfigured()) {
    throw new Error('Northwest API is not configured');
  }

  try {
    const response = await axios.post(
      `${NORTHWEST_API_BASE_URL}/name-availability`,
      {
        companyName,
        entityType,
        stateCode
      },
      { headers: getApiHeaders() }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Error checking name availability:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
}

// Get registered agent services
export async function getRegisteredAgentServices(
  stateCode: string
): Promise<ApiResponse<any>> {
  if (!isNorthwestApiConfigured()) {
    throw new Error('Northwest API is not configured');
  }

  try {
    const response = await axios.get(
      `${NORTHWEST_API_BASE_URL}/registered-agent/services/${stateCode}`,
      { headers: getApiHeaders() }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Error getting registered agent services:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
}

export default {
  isNorthwestApiConfigured,
  createBusinessEntity,
  getFormationStatus,
  getFormationPricing,
  getStateRequirements,
  checkNameAvailability,
  getRegisteredAgentServices,
  entityTypes
};