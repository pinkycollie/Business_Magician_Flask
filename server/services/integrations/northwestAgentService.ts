import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Northwest Registered Agent API Service for Business Formation

export interface FormationDetails {
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
  members?: Array<{
    firstName: string;
    lastName: string;
    title?: string;
    ownership?: number;
  }>;
  // Additional details specific to entity type
  additionalDetails?: Record<string, any>;
}

export interface FormationResponse {
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  trackingUrl?: string;
  estimatedCompletionDate?: string;
  details?: Record<string, any>;
}

export interface FormationStatusResponse {
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  currentStep?: string;
  completedSteps?: string[];
  nextStep?: string;
  estimatedCompletion?: string;
  documents?: Array<{
    name: string;
    type: string;
    url: string;
    dateIssued: string;
  }>;
}

class NorthwestAgentService {
  private apiKey: string;
  private apiBaseUrl: string;
  private mockMode: boolean;

  constructor() {
    this.apiKey = process.env.NORTHWEST_API_KEY || '';
    this.apiBaseUrl = 'https://api.northwestregisteredagent.com/v1';
    this.mockMode = !this.apiKey || process.env.NODE_ENV === 'development';
    
    if (this.mockMode) {
      console.log('Northwest Agent Service running in mock mode');
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
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Northwest API error: ${error.response.status} - ${
            error.response.data?.message || error.message
          }`
        );
      }
      throw error;
    }
  }

  // Mock response generator for development and testing
  private generateMockResponse<T>(endpoint: string, data?: any): T {
    // Create a random order ID for new formations
    const mockOrderId = uuidv4().substring(0, 8).toUpperCase();
    
    if (endpoint === '/formations') {
      const formationResponse: FormationResponse = {
        orderId: mockOrderId,
        status: 'pending',
        trackingUrl: `https://northwestregisteredagent.com/order-status/${mockOrderId}`,
        estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        details: {
          businessName: data.businessName,
          entityType: data.entityType,
          state: data.state,
          submissionDate: new Date().toISOString()
        }
      };
      return formationResponse as unknown as T;
    }
    
    if (endpoint.startsWith('/formations/status/')) {
      const orderId = endpoint.split('/').pop() || mockOrderId;
      const formationStatus: FormationStatusResponse = {
        orderId,
        status: 'processing',
        currentStep: 'Document Processing',
        completedSteps: ['Order Received', 'Payment Processed'],
        nextStep: 'State Filing',
        estimatedCompletion: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        documents: []
      };
      return formationStatus as unknown as T;
    }
    
    // Default mock response
    return { success: true, mockData: true } as unknown as T;
  }

  /**
   * Submit business formation details to Northwest Registered Agent
   */
  public async submitFormation(formationDetails: FormationDetails): Promise<FormationResponse> {
    return this.makeRequest<FormationResponse>('POST', '/formations', formationDetails);
  }

  /**
   * Check status of a business formation order
   */
  public async checkFormationStatus(orderId: string): Promise<FormationStatusResponse> {
    return this.makeRequest<FormationStatusResponse>('GET', `/formations/status/${orderId}`);
  }

  /**
   * Get pricing for business formation
   */
  public async getFormationPricing(entityType: string, state: string): Promise<any> {
    return this.makeRequest<any>('GET', `/pricing/formation?entityType=${entityType}&state=${state}`);
  }

  /**
   * Request EIN filing service for a formed business
   */
  public async requestEINFiling(orderId: string, taxInfo: any): Promise<any> {
    return this.makeRequest<any>('POST', `/formations/${orderId}/ein`, taxInfo);
  }

  /**
   * Update business information for an existing order
   */
  public async updateFormation(orderId: string, updatedDetails: Partial<FormationDetails>): Promise<any> {
    return this.makeRequest<any>('PUT', `/formations/${orderId}`, updatedDetails);
  }

  /**
   * Download formation documents
   */
  public async getFormationDocuments(orderId: string): Promise<any> {
    return this.makeRequest<any>('GET', `/formations/${orderId}/documents`);
  }
}

export const northwestAgentService = new NorthwestAgentService();