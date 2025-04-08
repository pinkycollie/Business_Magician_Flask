/**
 * Corporate Tools API Integration
 * This module provides functions to interact with the Corporate Tools API
 * for business formation services.
 * 
 * API Documentation: https://api.corporatetools.com/
 */

// Base URL for Corporate Tools API
const BASE_URL = 'https://api.corporatetools.com';

// API key from environment variables
const API_KEY = process.env.CORPORATE_TOOLS_API_KEY || '';

// Types for API responses
export interface StateInfo {
  code: string;
  name: string;
  filingFees: {
    llc: number;
    corporation: number;
  };
  processingTime: {
    standard: string;
    expedited: string;
  };
}

export interface BusinessTypeInfo {
  id: string;
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

export interface FormationRequest {
  businessName: string;
  businessType: string;
  state: string;
  owners: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  }[];
  contactInfo: {
    email: string;
    phone: string;
  };
  expedite?: boolean;
}

export interface FormationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filingNumber?: string;
  estimatedCompletionDate: string;
  documents?: {
    name: string;
    url: string;
  }[];
}

// Helper functions
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || 
      `API request failed with status ${response.status}: ${response.statusText}`
    );
  }
  
  return response.json();
};

// API functions
export const getAvailableStates = async (): Promise<StateInfo[]> => {
  try {
    const response = await fetch(`${BASE_URL}/states`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleApiResponse(response);
  } catch (error) {
    console.error('Failed to fetch available states:', error);
    throw error;
  }
};

export const getBusinessTypes = async (): Promise<BusinessTypeInfo[]> => {
  try {
    const response = await fetch(`${BASE_URL}/business-types`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleApiResponse(response);
  } catch (error) {
    console.error('Failed to fetch business types:', error);
    throw error;
  }
};

export const checkNameAvailability = async (name: string, state: string): Promise<{available: boolean, suggestions?: string[]}> => {
  try {
    const response = await fetch(`${BASE_URL}/name-check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        state
      })
    });
    
    return handleApiResponse(response);
  } catch (error) {
    console.error('Failed to check name availability:', error);
    throw error;
  }
};

export const submitFormation = async (formationData: FormationRequest): Promise<FormationResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/formations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formationData)
    });
    
    return handleApiResponse(response);
  } catch (error) {
    console.error('Failed to submit formation request:', error);
    throw error;
  }
};

export const getFormationStatus = async (formationId: string): Promise<FormationResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/formations/${formationId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleApiResponse(response);
  } catch (error) {
    console.error('Failed to fetch formation status:', error);
    throw error;
  }
};

// For demo purposes, stub functions
export const demoGetBusinessTypes = (): BusinessTypeInfo[] => {
  return [
    {
      id: 'llc',
      name: 'Limited Liability Company (LLC)',
      description: 'A flexible business structure that combines the personal liability protection of a corporation with the tax benefits of a partnership.',
      advantages: [
        'Limited personal liability for business debts and claims',
        'Pass-through taxation',
        'Less paperwork and formalities than corporations',
        'Management flexibility'
      ],
      disadvantages: [
        'Self-employment taxes',
        'Limited growth potential compared to corporations',
        'May be difficult to raise capital'
      ]
    },
    {
      id: 'c-corp',
      name: 'C Corporation',
      description: 'A legal entity that is separate from its owners, offering the strongest protection from personal liability but subject to double taxation.',
      advantages: [
        'Limited personal liability',
        'Unlimited growth potential through stock issuance',
        'Attractive to investors',
        'Perpetual existence'
      ],
      disadvantages: [
        'Double taxation',
        'More expensive to form and maintain',
        'Extensive record-keeping and reporting requirements'
      ]
    },
    {
      id: 's-corp',
      name: 'S Corporation',
      description: 'A corporation that elects to pass corporate income, losses, deductions, and credits through to shareholders for federal tax purposes.',
      advantages: [
        'Limited personal liability',
        'Avoid double taxation',
        'Potential self-employment tax savings'
      ],
      disadvantages: [
        'Strict eligibility requirements',
        'Limited to 100 shareholders',
        'More formalities than LLCs'
      ]
    }
  ];
};

export const demoGetAvailableStates = (): StateInfo[] => {
  return [
    {
      code: 'DE',
      name: 'Delaware',
      filingFees: {
        llc: 90,
        corporation: 89
      },
      processingTime: {
        standard: '10-15 business days',
        expedited: '2-3 business days'
      }
    },
    {
      code: 'WY',
      name: 'Wyoming',
      filingFees: {
        llc: 100,
        corporation: 100
      },
      processingTime: {
        standard: '3-5 business days',
        expedited: '1 business day'
      }
    },
    {
      code: 'NV',
      name: 'Nevada',
      filingFees: {
        llc: 425,
        corporation: 725
      },
      processingTime: {
        standard: '7-10 business days',
        expedited: '1-2 business days'
      }
    }
  ];
};
