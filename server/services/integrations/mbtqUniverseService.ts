import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * MBTQ Universe Service Integration
 * 
 * This service integrates with formation.mbtquniverse.com to provide 
 * full corporate formation services from entity formation to registered agent services.
 */

export interface FormationRequest {
  businessName: string;
  entityType: 'llc' | 'corporation' | 's-corporation' | 'non-profit';
  state: string;
  principalAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  memberInfo?: Array<{
    firstName: string;
    lastName: string;
    title?: string;
    ownership?: number;
  }>;
  serviceOptions: {
    registeredAgent: boolean;
    einFiling: boolean;
    operatingAgreement: boolean;
    bankingResolution: boolean;
    annualCompliance: boolean;
  };
  accessibilityRequirements?: {
    needsASLSupport: boolean;
    communicationPreference: 'asl' | 'email' | 'text' | 'phone';
    accommodationNotes?: string;
  };
}

export interface FormationResponse {
  orderId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  formationDetails: {
    businessName: string;
    entityType: string;
    state: string;
    estimatedCompletion: string;
  };
  documents?: Array<{
    name: string;
    status: 'pending' | 'completed';
    url?: string;
    dateIssued?: string;
  }>;
  nextSteps?: string[];
  pricing: {
    formationFee: number;
    stateFee: number;
    serviceFees: number;
    totalPrice: number;
  };
  trackingUrl: string;
}

export interface FormationStatusResponse {
  orderId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  currentStep: string;
  completedSteps: string[];
  percentComplete: number;
  documents: Array<{
    name: string;
    status: 'pending' | 'completed';
    url?: string;
    dateIssued?: string;
  }>;
  issues?: Array<{
    description: string;
    severity: 'low' | 'medium' | 'high';
    actionRequired: boolean;
  }>;
  registeredAgentInfo?: {
    name: string;
    address: string;
    status: 'active' | 'pending';
    renewalDate: string;
  };
}

export interface EntityLookupResponse {
  exists: boolean;
  availableInStates: string[];
  similarNames?: string[];
  recommendations?: string[];
}

class MBTQUniverseService {
  private apiKey: string;
  private apiBaseUrl: string;
  private partnerId: string;
  private mockMode: boolean;

  constructor() {
    this.apiKey = process.env.MBTQ_UNIVERSE_API_KEY || '';
    this.partnerId = process.env.MBTQ_UNIVERSE_PARTNER_ID || '360magicians';
    this.apiBaseUrl = 'https://api.formation.mbtquniverse.com/v1';
    this.mockMode = !this.apiKey || process.env.NODE_ENV === 'development';
    
    if (this.mockMode) {
      console.log('MBTQ Universe Service running in mock mode');
    }
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    if (this.mockMode) {
      return this.generateMockResponse<T>(endpoint, data);
    }

    try {
      const response = await axios({
        method,
        url: `${this.apiBaseUrl}${endpoint}`,
        data,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Partner-ID': this.partnerId,
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `MBTQ Universe API error: ${error.response.status} - ${
            error.response.data?.message || error.message
          }`
        );
      }
      throw error;
    }
  }

  // Mock response generator for development and testing
  private generateMockResponse<T>(endpoint: string, data?: any): T {
    const mockOrderId = `MBTQ-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    if (endpoint === '/formation') {
      const formationRequest = data as FormationRequest;
      const formationResponse: FormationResponse = {
        orderId: mockOrderId,
        status: 'pending',
        formationDetails: {
          businessName: formationRequest.businessName,
          entityType: formationRequest.entityType,
          state: formationRequest.state,
          estimatedCompletion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        documents: [
          {
            name: 'Articles of Organization',
            status: 'pending'
          },
          {
            name: 'Operating Agreement',
            status: 'pending'
          },
          {
            name: 'EIN Confirmation',
            status: 'pending'
          }
        ],
        nextSteps: [
          'Wait for application processing',
          'Prepare for EIN application',
          'Set up business banking account'
        ],
        pricing: {
          formationFee: 99,
          stateFee: this.getStateFee(formationRequest.state, formationRequest.entityType),
          serviceFees: this.calculateServiceFees(formationRequest.serviceOptions),
          totalPrice: 99 + this.getStateFee(formationRequest.state, formationRequest.entityType) + this.calculateServiceFees(formationRequest.serviceOptions)
        },
        trackingUrl: `https://formation.mbtquniverse.com/track/${mockOrderId}`
      };
      
      return formationResponse as unknown as T;
    }
    
    if (endpoint.startsWith('/formation/status/')) {
      const orderId = endpoint.split('/').pop() || mockOrderId;
      const statusResponse: FormationStatusResponse = {
        orderId,
        status: 'in_progress',
        currentStep: 'Filing with state',
        completedSteps: ['Order received', 'Payment processed', 'Documents prepared'],
        percentComplete: 45,
        documents: [
          {
            name: 'Articles of Organization',
            status: 'pending'
          },
          {
            name: 'Operating Agreement',
            status: 'completed',
            url: `https://formation.mbtquniverse.com/documents/${orderId}/operating-agreement.pdf`,
            dateIssued: new Date().toISOString()
          }
        ]
      };
      
      return statusResponse as unknown as T;
    }
    
    if (endpoint.startsWith('/entity-lookup')) {
      const businessName = new URLSearchParams(endpoint.split('?')[1]).get('name') || '';
      const lookupResponse: EntityLookupResponse = {
        exists: Math.random() > 0.7, // 30% chance name exists
        availableInStates: ['CA', 'NY', 'TX', 'FL', 'WA', 'CO', 'NV', 'DE', 'WY'],
        similarNames: [
          `${businessName} LLC`,
          `${businessName} Inc`,
          `${businessName} Corp`,
          `The ${businessName} Group`
        ],
        recommendations: [
          `${businessName} Solutions`,
          `${businessName} Enterprises`,
          `${businessName} Technologies`
        ]
      };
      
      return lookupResponse as unknown as T;
    }
    
    // Default mock response
    return { success: true, mockData: true } as unknown as T;
  }

  /**
   * Check if a business name is available
   */
  public async checkBusinessNameAvailability(name: string, state: string): Promise<EntityLookupResponse> {
    return this.makeRequest<EntityLookupResponse>('GET', `/entity-lookup?name=${encodeURIComponent(name)}&state=${state}`);
  }

  /**
   * Submit a new formation request
   */
  public async submitFormation(request: FormationRequest): Promise<FormationResponse> {
    return this.makeRequest<FormationResponse>('POST', '/formation', request);
  }

  /**
   * Get the status of a formation order
   */
  public async getFormationStatus(orderId: string): Promise<FormationStatusResponse> {
    return this.makeRequest<FormationStatusResponse>('GET', `/formation/status/${orderId}`);
  }

  /**
   * Get pricing information for formation services
   */
  public async getFormationPricing(state: string, entityType: string, services: string[]): Promise<any> {
    return this.makeRequest<any>('GET', `/pricing?state=${state}&entityType=${entityType}&services=${services.join(',')}`);
  }

  /**
   * Order a registered agent service for a specific company
   */
  public async orderRegisteredAgentService(businessName: string, state: string, contactInfo: any): Promise<any> {
    return this.makeRequest<any>('POST', '/registered-agent', {
      businessName,
      state,
      contactInfo
    });
  }

  /**
   * Request an EIN (tax ID) for a business
   */
  public async requestEIN(businessInfo: any): Promise<any> {
    return this.makeRequest<any>('POST', '/ein-filing', businessInfo);
  }

  /**
   * Get document templates for a specific business entity type
   */
  public async getDocumentTemplates(entityType: string, state: string): Promise<any> {
    return this.makeRequest<any>('GET', `/document-templates?entityType=${entityType}&state=${state}`);
  }

  /**
   * Get annual compliance requirements for a business
   */
  public async getComplianceRequirements(state: string, entityType: string): Promise<any> {
    return this.makeRequest<any>('GET', `/compliance-requirements?state=${state}&entityType=${entityType}`);
  }

  /**
   * Order a custom operating agreement
   */
  public async orderOperatingAgreement(businessInfo: any, memberInfo: any): Promise<any> {
    return this.makeRequest<any>('POST', '/operating-agreement', {
      businessInfo,
      memberInfo
    });
  }

  // Helper methods for mock data
  private getStateFee(state: string, entityType: string): number {
    const stateFees: Record<string, number> = {
      'CA': 70,
      'NY': 200,
      'TX': 300,
      'FL': 125,
      'DE': 90,
      'WY': 100,
      'NV': 425,
      'CO': 50
    };
    
    return stateFees[state] || 100;
  }
  
  private calculateServiceFees(serviceOptions: FormationRequest['serviceOptions']): number {
    let total = 0;
    
    if (serviceOptions.registeredAgent) total += 99;
    if (serviceOptions.einFiling) total += 79;
    if (serviceOptions.operatingAgreement) total += 89;
    if (serviceOptions.bankingResolution) total += 39;
    if (serviceOptions.annualCompliance) total += 99;
    
    return total;
  }
}

export const mbtqUniverseService = new MBTQUniverseService();