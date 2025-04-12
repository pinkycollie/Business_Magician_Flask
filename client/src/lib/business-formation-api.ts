/**
 * Business Formation API Client
 * 
 * This module provides functions to interact with the business formation API endpoints.
 * It abstracts away the API details and provides a clean interface for components.
 */

// Using fetch directly for Vercel compatibility
const API_BASE = '/api/business-formation';

// Type definitions for the API responses
export interface EntityType {
  id: string;
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

export interface StateRequirement {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  additionalFee?: number;
}

export interface RegisteredAgentService {
  id: string;
  name: string;
  description: string;
  annualFee: number;
  features: string[];
}

export interface FormationStatus {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
  estimatedCompletionDate?: string;
  rejectionReason?: string;
  documents?: { name: string; url: string }[];
}

export interface FormationRequest {
  entityType: string;
  stateCode: string;
  companyName: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  businessAddress: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  registeredAgentService?: string;
  additionalServices?: string[];
  paymentMethod?: string;
}

// Helper function for API requests
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'An error occurred while fetching data');
  }

  return response.json();
};

// API functions for Northwest Registered Agent
export const NorthwestAgentApi = {
  /**
   * Check if the Northwest Registered Agent API is properly configured
   */
  checkStatus: async () => {
    return fetchAPI('/northwest/status');
  },

  /**
   * Get available entity types for a specific state
   */
  getEntityTypes: async (stateCode: string) => {
    return fetchAPI(`/northwest/entity-types/${stateCode}`);
  },

  /**
   * Get state filing requirements for a specific state
   */
  getStateRequirements: async (stateCode: string) => {
    return fetchAPI(`/northwest/states/${stateCode}/requirements`);
  },

  /**
   * Submit a business formation request
   */
  submitBusinessFormation: async (formData: FormationRequest) => {
    return fetchAPI('/northwest/formations', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  /**
   * Check the status of a formation request
   */
  getFormationStatus: async (formationId: string) => {
    return fetchAPI(`/northwest/formations/${formationId}/status`);
  },

  /**
   * Get available registered agent services
   */
  getRegisteredAgentServices: async () => {
    return fetchAPI('/northwest/registered-agent/services');
  }
};

// Get available providers
export const getAvailableProviders = async () => {
  return fetchAPI('/providers');
};

// Default export for convenience
export default {
  NorthwestAgentApi,
  getAvailableProviders
};