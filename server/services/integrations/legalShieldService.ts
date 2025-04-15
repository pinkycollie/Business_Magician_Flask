import axios from 'axios';

// LegalShield API Service for Legal Services Integration

export interface LegalPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  coverageAreas: string[];
  features: string[];
  businessSize: 'solo' | 'small' | 'medium' | 'large';
}

export interface LegalDocument {
  id: string;
  name: string;
  category: string;
  description: string;
  recommendedFor: string[];
  isCustomizable: boolean;
}

export interface LegalConsultation {
  id: string;
  topic: string;
  description: string;
  duration: number; // minutes
  scheduledAt?: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface LegalServiceRequest {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  serviceType: 'document_review' | 'consultation' | 'legal_plan' | 'business_formation';
  description: string;
  urgency: 'low' | 'medium' | 'high';
  additionalDetails?: Record<string, any>;
}

class LegalShieldService {
  private apiKey: string;
  private apiBaseUrl: string;
  private partnerId: string;
  private mockMode: boolean;

  constructor() {
    this.apiKey = process.env.LEGALSHIELD_API_KEY || '';
    this.partnerId = process.env.LEGALSHIELD_PARTNER_ID || '';
    this.apiBaseUrl = 'https://api.legalshield.com/v1';
    this.mockMode = !this.apiKey || process.env.NODE_ENV === 'development';
    
    if (this.mockMode) {
      console.log('LegalShield Service running in mock mode');
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
          `LegalShield API error: ${error.response.status} - ${
            error.response.data?.message || error.message
          }`
        );
      }
      throw error;
    }
  }

  // Mock response generator for development and testing
  private generateMockResponse<T>(endpoint: string, data?: any): T {
    if (endpoint === '/legal-plans') {
      return [
        {
          id: 'ls-small-business',
          name: 'Small Business Legal Plan',
          description: 'Legal protection for small businesses with 1-5 employees',
          monthlyPrice: 89,
          annualPrice: 890,
          coverageAreas: ['Business Formation', 'Contract Review', 'Debt Collection', 'Legal Consultation'],
          features: ['Unlimited legal consultation', '3 document reviews per month', 'Discounted legal services'],
          businessSize: 'small'
        },
        {
          id: 'ls-solo-entrepreneur',
          name: 'Solo Entrepreneur Plan',
          description: 'Legal essentials for solo entrepreneurs and freelancers',
          monthlyPrice: 49,
          annualPrice: 490,
          coverageAreas: ['Contract Review', 'Legal Consultation', 'Business Formation'],
          features: ['30-minute legal consultation per month', '1 document review per month', 'Online legal forms'],
          businessSize: 'solo'
        }
      ] as unknown as T;
    }
    
    if (endpoint === '/legal-documents') {
      return [
        {
          id: 'doc-nda',
          name: 'Non-Disclosure Agreement',
          category: 'Contracts',
          description: 'Standard NDA to protect your business information',
          recommendedFor: ['All businesses', 'Startups', 'Consultants'],
          isCustomizable: true
        },
        {
          id: 'doc-service-agreement',
          name: 'Service Agreement',
          category: 'Contracts',
          description: 'Template for client service agreements',
          recommendedFor: ['Service providers', 'Consultants', 'Freelancers'],
          isCustomizable: true
        },
        {
          id: 'doc-llc-operating',
          name: 'LLC Operating Agreement',
          category: 'Business Formation',
          description: 'Template for LLC operating agreements',
          recommendedFor: ['LLCs', 'Startups'],
          isCustomizable: true
        }
      ] as unknown as T;
    }
    
    if (endpoint === '/service-request' && data) {
      return {
        requestId: `req-${Math.random().toString(36).substring(2, 10)}`,
        status: 'submitted',
        estimatedResponse: '24 hours',
        message: 'Your request has been received and a LegalShield representative will contact you shortly.',
        submittedAt: new Date().toISOString()
      } as unknown as T;
    }
    
    // Default mock response
    return { success: true, mockData: true } as unknown as T;
  }

  /**
   * Get available legal plans for businesses
   */
  public async getLegalPlans(businessSize?: 'solo' | 'small' | 'medium' | 'large'): Promise<LegalPlan[]> {
    const plans = await this.makeRequest<LegalPlan[]>('GET', '/legal-plans');
    
    if (businessSize) {
      return plans.filter(plan => plan.businessSize === businessSize);
    }
    
    return plans;
  }

  /**
   * Get available legal document templates
   */
  public async getLegalDocuments(category?: string): Promise<LegalDocument[]> {
    const documents = await this.makeRequest<LegalDocument[]>('GET', '/legal-documents');
    
    if (category) {
      return documents.filter(doc => doc.category === category);
    }
    
    return documents;
  }

  /**
   * Submit a request for legal services
   */
  public async submitServiceRequest(request: LegalServiceRequest): Promise<any> {
    return this.makeRequest<any>('POST', '/service-request', request);
  }

  /**
   * Schedule a legal consultation
   */
  public async scheduleLegalConsultation(topic: string, description: string, preferredDate?: Date): Promise<any> {
    const consultationData = {
      topic,
      description,
      preferredDate: preferredDate?.toISOString() || null
    };
    
    return this.makeRequest<any>('POST', '/consultations', consultationData);
  }

  /**
   * Get a specific legal document template
   */
  public async getDocumentTemplate(documentId: string): Promise<any> {
    return this.makeRequest<any>('GET', `/legal-documents/${documentId}`);
  }
}

export const legalShieldService = new LegalShieldService();