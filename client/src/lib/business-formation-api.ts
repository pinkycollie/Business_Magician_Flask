/**
 * Business Formation API Client
 * Interfaces with the Northwest Registered Agent service
 */

import { apiRequest } from "./queryClient";

// Entity types from Northwest
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

export type EntityType = keyof typeof entityTypes;

// API interfaces
export interface EntityTypeInfo {
  id: string;
  name: string;
  description: string;
}

export interface FormationPricing {
  basePrice: number;
  stateFees: number;
  options: FormationOption[];
  totalPrice: number;
  currency: string;
}

export interface FormationOption {
  name: string;
  price: number;
  description: string;
}

export interface NameAvailabilityResult {
  available: boolean;
  suggestions?: string[];
}

export interface FormationStatus {
  formationId: string;
  status: string;
  estimatedCompletionDate: string;
  filingNumber?: string;
  filingDate?: string;
  trackingUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Member {
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface BusinessEntity {
  companyName: string;
  entityType: EntityType;
  stateCode: string;
  contactEmail: string;
  contactPhone?: string;
  principalAddress: Address;
  mailingAddress?: Address;
  members?: Member[];
  additionalOptions?: {
    includeEIN?: boolean;
    includeOperatingAgreement?: boolean;
    includeRegisteredAgent?: boolean;
    expediteFiling?: boolean;
  };
}

// API client functions
export async function getEntityTypes(): Promise<ApiResponse<{ entityTypes: EntityTypeInfo[] }>> {
  try {
    const response = await apiRequest('GET', '/api/formation/entity-types');
    return await response.json();
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to fetch entity types' 
    };
  }
}

export async function getStateRequirements(
  entityType: EntityType, 
  stateCode: string
): Promise<ApiResponse<any>> {
  try {
    const response = await apiRequest(
      'GET', 
      `/api/formation/requirements/${stateCode}/${entityType}`
    );
    return await response.json();
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to fetch state requirements' 
    };
  }
}

export async function checkNameAvailability(
  companyName: string,
  entityType: EntityType,
  stateCode: string
): Promise<ApiResponse<NameAvailabilityResult>> {
  try {
    const response = await apiRequest(
      'POST', 
      '/api/formation/name-availability',
      { companyName, entityType, stateCode }
    );
    return await response.json();
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to check name availability' 
    };
  }
}

export async function getFormationPricing(
  entityType: EntityType,
  stateCode: string,
  options?: {
    includeEIN?: boolean;
    includeOperatingAgreement?: boolean;
    includeRegisteredAgent?: boolean;
    expediteFiling?: boolean;
  }
): Promise<ApiResponse<FormationPricing>> {
  try {
    const response = await apiRequest(
      'POST', 
      '/api/formation/pricing',
      { entityType, stateCode, ...options }
    );
    return await response.json();
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to get formation pricing' 
    };
  }
}

export async function createBusinessEntity(
  entity: BusinessEntity
): Promise<ApiResponse<FormationStatus>> {
  try {
    const response = await apiRequest(
      'POST', 
      '/api/formation/entity',
      entity
    );
    return await response.json();
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to create business entity' 
    };
  }
}

export async function getFormationStatus(
  formationId: string
): Promise<ApiResponse<FormationStatus>> {
  try {
    const response = await apiRequest(
      'GET', 
      `/api/formation/status/${formationId}`
    );
    return await response.json();
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to get formation status' 
    };
  }
}