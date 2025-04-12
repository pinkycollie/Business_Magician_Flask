/**
 * Business Formation API Service
 * This service integrates with multiple API providers to offer business formation services
 * to the 360 Magicians platform.
 */

import { apiRequest } from './queryClient';

// Import existing Corporate Tools API types
import { 
  StateInfo, 
  BusinessTypeInfo, 
  FormationRequest as CorporateToolsFormationRequest,
  FormationResponse as CorporateToolsFormationResponse
} from './corporate-tools-api';

/**
 * Helper function to make API POST requests with JSON body
 */
async function apiPost<T, R>(url: string, data: T): Promise<R> {
  return apiRequest<R>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
}

// Northwest Registered Agent API types
export interface NorthwestFormationRequest {
  companyName: string;
  entityType: string;
  state: string;
  contactInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  addresses: {
    principal: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    mailing?: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  registeredAgent: {
    useNorthwest: boolean;
    selfAgent?: {
      name: string;
      address: {
        street: string;
        city: string;
        state: string;
        zip: string;
      };
    };
  };
  owners: {
    name: string;
    ownershipPercentage: number;
    title?: string;
  }[];
  options: {
    expedite: boolean;
    operatingAgreement: boolean;
    ein: boolean;
  };
}

export interface NorthwestFormationResponse {
  orderId: string;
  status: 'submitted' | 'in-progress' | 'approved' | 'rejected';
  trackingDetails: {
    estimatedCompletionDate: string;
    currentStep: string;
    stepsCompleted: number;
    totalSteps: number;
  };
  documents: {
    name: string;
    url: string;
    dateIssued: string;
  }[];
}

// ZenBusiness API types
export interface ZenBusinessFormationRequest {
  businessName: string;
  entityType: string;
  state: string;
  owners: {
    firstName: string;
    lastName: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zipCode: string;
    };
    ownershipPercentage: number;
  }[];
  businessAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessPurpose: string;
  contactEmail: string;
  contactPhone: string;
  serviceOptions: {
    registeredAgentService: boolean;
    einFiling: boolean;
    complianceAlerts: boolean;
    expeditedFiling: boolean;
  };
}

export interface ZenBusinessFormationResponse {
  formationId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedCompletionDate: string;
  documents: {
    title: string;
    documentUrl: string;
    type: string;
  }[];
}

// Unified business formation request/response types
export interface UnifiedBusinessFormationRequest {
  businessName: string;
  entityType: 'llc' | 'corporation' | 'partnership' | 'sole-proprietorship';
  state: string;
  owners: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    ownershipPercentage?: number;
    title?: string;
  }[];
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  mailingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
  registeredAgent: {
    useProviderService: boolean;
    agentName?: string;
    agentAddress?: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  businessPurpose?: string;
  options: {
    expediteFiling: boolean;
    einFiling: boolean;
    operatingAgreement: boolean;
    complianceService: boolean;
  };
  providerPreference?: 'corporatetools' | 'northwest' | 'zenbusiness' | 'any';
}

export interface UnifiedBusinessFormationResponse {
  formationId: string;
  provider: 'corporatetools' | 'northwest' | 'zenbusiness';
  providerOrderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedCompletionDate: string;
  trackingUrl?: string;
  documents: {
    name: string;
    url: string;
    dateIssued?: string;
    type?: string;
  }[];
  nextSteps?: string[];
}

// Provider service URLs
const PROVIDERS = {
  CORPORATE_TOOLS: '/api/providers/corporatetools',
  NORTHWEST: '/api/providers/northwest',
  ZENBUSINESS: '/api/providers/zenbusiness',
};

/**
 * Get business entity types for the given state
 * 
 * @param state Two-letter state code
 * @returns List of available business entity types
 */
export async function getBusinessEntityTypes(state: string): Promise<BusinessTypeInfo[]> {
  try {
    const response = await apiRequest<BusinessTypeInfo[]>(`${PROVIDERS.CORPORATE_TOOLS}/entity-types/${state}`);
    return response;
  } catch (error) {
    console.error('Error fetching business entity types:', error);
    throw new Error('Failed to fetch business entity types');
  }
}

/**
 * Get state information including filing fees and processing times
 * 
 * @param stateCode Two-letter state code
 * @returns State information
 */
export async function getStateInfo(stateCode: string): Promise<StateInfo> {
  try {
    const response = await apiRequest<StateInfo>(`${PROVIDERS.CORPORATE_TOOLS}/states/${stateCode}`);
    return response;
  } catch (error) {
    console.error('Error fetching state information:', error);
    throw new Error('Failed to fetch state information');
  }
}

/**
 * Get all available states for business formation
 * 
 * @returns List of available states
 */
export async function getAvailableStates(): Promise<StateInfo[]> {
  try {
    const response = await apiRequest<StateInfo[]>(`${PROVIDERS.CORPORATE_TOOLS}/states`);
    return response;
  } catch (error) {
    console.error('Error fetching available states:', error);
    throw new Error('Failed to fetch available states');
  }
}

/**
 * Submit a business formation request to the specified provider
 * 
 * @param formationData Business formation data
 * @returns Formation response
 */
export async function submitBusinessFormation(
  formationData: UnifiedBusinessFormationRequest
): Promise<UnifiedBusinessFormationResponse> {
  try {
    // Determine which provider to use based on preference or default to Corporate Tools
    const provider = formationData.providerPreference || 'corporatetools';
    
    // Submit to the appropriate provider
    let providerResponse;
    
    switch (provider) {
      case 'corporatetools':
        providerResponse = await apiPost<CorporateToolsFormationRequest, CorporateToolsFormationResponse>(
          `${PROVIDERS.CORPORATE_TOOLS}/submit-formation`, 
          mapToCorporateToolsRequest(formationData)
        );
        return mapFromCorporateToolsResponse(providerResponse);
        
      case 'northwest':
        providerResponse = await apiPost<NorthwestFormationRequest, NorthwestFormationResponse>(
          `${PROVIDERS.NORTHWEST}/submit-formation`, 
          mapToNorthwestRequest(formationData)
        );
        return mapFromNorthwestResponse(providerResponse);
        
      case 'zenbusiness':
        providerResponse = await apiPost<ZenBusinessFormationRequest, ZenBusinessFormationResponse>(
          `${PROVIDERS.ZENBUSINESS}/submit-formation`, 
          mapToZenBusinessRequest(formationData)
        );
        return mapFromZenBusinessResponse(providerResponse);
        
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error('Error submitting business formation:', error);
    throw new Error('Failed to submit business formation request');
  }
}

/**
 * Check the status of a business formation request
 * 
 * @param formationId The ID of the formation request
 * @param provider The provider used for the formation
 * @returns Formation status response
 */
export async function checkFormationStatus(
  formationId: string,
  provider: 'corporatetools' | 'northwest' | 'zenbusiness'
): Promise<UnifiedBusinessFormationResponse> {
  try {
    let providerUrl;
    
    switch (provider) {
      case 'corporatetools':
        providerUrl = PROVIDERS.CORPORATE_TOOLS;
        break;
      case 'northwest':
        providerUrl = PROVIDERS.NORTHWEST;
        break;
      case 'zenbusiness':
        providerUrl = PROVIDERS.ZENBUSINESS;
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
    
    const statusResponse = await apiRequest<any>(`${providerUrl}/formation-status/${formationId}`);
    
    // Map the provider-specific response to the unified response
    switch (provider) {
      case 'corporatetools':
        return mapFromCorporateToolsResponse(statusResponse);
      case 'northwest':
        return mapFromNorthwestResponse(statusResponse);
      case 'zenbusiness':
        return mapFromZenBusinessResponse(statusResponse);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error('Error checking formation status:', error);
    throw new Error('Failed to check business formation status');
  }
}

// Helper functions to map between unified and provider-specific formats

function mapToCorporateToolsRequest(
  unifiedRequest: UnifiedBusinessFormationRequest
): CorporateToolsFormationRequest {
  return {
    businessName: unifiedRequest.businessName,
    businessType: unifiedRequest.entityType,
    state: unifiedRequest.state,
    owners: unifiedRequest.owners.map(owner => ({
      name: `${owner.firstName} ${owner.lastName}`,
      email: owner.email,
      address: owner.address
    })),
    contactInfo: unifiedRequest.contactInfo,
    expedite: unifiedRequest.options.expediteFiling
  };
}

function mapToNorthwestRequest(
  unifiedRequest: UnifiedBusinessFormationRequest
): NorthwestFormationRequest {
  const firstOwner = unifiedRequest.owners[0];
  
  return {
    companyName: unifiedRequest.businessName,
    entityType: unifiedRequest.entityType,
    state: unifiedRequest.state,
    contactInformation: {
      firstName: firstOwner.firstName,
      lastName: firstOwner.lastName,
      email: unifiedRequest.contactInfo.email,
      phone: unifiedRequest.contactInfo.phone
    },
    addresses: {
      principal: unifiedRequest.businessAddress,
      mailing: unifiedRequest.mailingAddress
    },
    registeredAgent: {
      useNorthwest: unifiedRequest.registeredAgent.useProviderService,
      selfAgent: !unifiedRequest.registeredAgent.useProviderService ? {
        name: unifiedRequest.registeredAgent.agentName || '',
        address: unifiedRequest.registeredAgent.agentAddress || unifiedRequest.businessAddress
      } : undefined
    },
    owners: unifiedRequest.owners.map(owner => ({
      name: `${owner.firstName} ${owner.lastName}`,
      ownershipPercentage: owner.ownershipPercentage || 100 / unifiedRequest.owners.length,
      title: owner.title
    })),
    options: {
      expedite: unifiedRequest.options.expediteFiling,
      operatingAgreement: unifiedRequest.options.operatingAgreement,
      ein: unifiedRequest.options.einFiling
    }
  };
}

function mapToZenBusinessRequest(
  unifiedRequest: UnifiedBusinessFormationRequest
): ZenBusinessFormationRequest {
  return {
    businessName: unifiedRequest.businessName,
    entityType: unifiedRequest.entityType,
    state: unifiedRequest.state,
    owners: unifiedRequest.owners.map(owner => ({
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      address: {
        line1: owner.address.street,
        city: owner.address.city,
        state: owner.address.state,
        zipCode: owner.address.zip
      },
      ownershipPercentage: owner.ownershipPercentage || 100 / unifiedRequest.owners.length
    })),
    businessAddress: {
      line1: unifiedRequest.businessAddress.street,
      city: unifiedRequest.businessAddress.city,
      state: unifiedRequest.businessAddress.state,
      zipCode: unifiedRequest.businessAddress.zip
    },
    businessPurpose: unifiedRequest.businessPurpose || 'General business purposes',
    contactEmail: unifiedRequest.contactInfo.email,
    contactPhone: unifiedRequest.contactInfo.phone,
    serviceOptions: {
      registeredAgentService: unifiedRequest.registeredAgent.useProviderService,
      einFiling: unifiedRequest.options.einFiling,
      complianceAlerts: unifiedRequest.options.complianceService,
      expeditedFiling: unifiedRequest.options.expediteFiling
    }
  };
}

function mapFromCorporateToolsResponse(
  response: CorporateToolsFormationResponse
): UnifiedBusinessFormationResponse {
  return {
    formationId: response.id,
    provider: 'corporatetools',
    providerOrderId: response.id,
    status: response.status,
    estimatedCompletionDate: response.estimatedCompletionDate,
    documents: response.documents ? response.documents.map(doc => ({
      name: doc.name,
      url: doc.url
    })) : [],
    nextSteps: []
  };
}

function mapFromNorthwestResponse(
  response: NorthwestFormationResponse
): UnifiedBusinessFormationResponse {
  return {
    formationId: response.orderId,
    provider: 'northwest',
    providerOrderId: response.orderId,
    status: response.status === 'in-progress' ? 'processing' : 
           response.status === 'approved' ? 'completed' : 
           response.status === 'rejected' ? 'failed' : 'pending',
    estimatedCompletionDate: response.trackingDetails.estimatedCompletionDate,
    documents: response.documents.map(doc => ({
      name: doc.name,
      url: doc.url,
      dateIssued: doc.dateIssued
    })),
    nextSteps: [`Current step: ${response.trackingDetails.currentStep}`, 
                `Progress: ${response.trackingDetails.stepsCompleted}/${response.trackingDetails.totalSteps} steps completed`]
  };
}

function mapFromZenBusinessResponse(
  response: ZenBusinessFormationResponse
): UnifiedBusinessFormationResponse {
  return {
    formationId: response.formationId,
    provider: 'zenbusiness',
    providerOrderId: response.formationId,
    status: response.status,
    estimatedCompletionDate: response.estimatedCompletionDate,
    documents: response.documents.map(doc => ({
      name: doc.title,
      url: doc.documentUrl,
      type: doc.type
    })),
    nextSteps: []
  };
}