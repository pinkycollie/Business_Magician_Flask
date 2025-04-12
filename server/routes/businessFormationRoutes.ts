/**
 * Business Formation Routes
 * 
 * This file defines the routes for interacting with business formation APIs
 * from multiple providers.
 */

import express, { Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = express.Router();

// Get available formation providers
router.get('/providers', async (_req: Request, res: Response) => {
  try {
    // This is a static list for demonstration. In production, this would be fetched
    // from configuration or database based on available API integrations
    res.json({
      providers: ['corporatetools', 'northwest', 'zenbusiness']
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Get available states for business formation
router.get('/states', async (_req: Request, res: Response) => {
  try {
    // Static list of US states with their codes
    // In production, this could be filtered by provider support
    const states = [
      { code: 'AL', name: 'Alabama' },
      { code: 'AK', name: 'Alaska' },
      { code: 'AZ', name: 'Arizona' },
      { code: 'AR', name: 'Arkansas' },
      { code: 'CA', name: 'California' },
      { code: 'CO', name: 'Colorado' },
      { code: 'CT', name: 'Connecticut' },
      { code: 'DE', name: 'Delaware' },
      { code: 'FL', name: 'Florida' },
      { code: 'GA', name: 'Georgia' },
      { code: 'HI', name: 'Hawaii' },
      { code: 'ID', name: 'Idaho' },
      { code: 'IL', name: 'Illinois' },
      { code: 'IN', name: 'Indiana' },
      { code: 'IA', name: 'Iowa' },
      { code: 'KS', name: 'Kansas' },
      { code: 'KY', name: 'Kentucky' },
      { code: 'LA', name: 'Louisiana' },
      { code: 'ME', name: 'Maine' },
      { code: 'MD', name: 'Maryland' },
      { code: 'MA', name: 'Massachusetts' },
      { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' },
      { code: 'MS', name: 'Mississippi' },
      { code: 'MO', name: 'Missouri' },
      { code: 'MT', name: 'Montana' },
      { code: 'NE', name: 'Nebraska' },
      { code: 'NV', name: 'Nevada' },
      { code: 'NH', name: 'New Hampshire' },
      { code: 'NJ', name: 'New Jersey' },
      { code: 'NM', name: 'New Mexico' },
      { code: 'NY', name: 'New York' },
      { code: 'NC', name: 'North Carolina' },
      { code: 'ND', name: 'North Dakota' },
      { code: 'OH', name: 'Ohio' },
      { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'RI', name: 'Rhode Island' },
      { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'TX', name: 'Texas' },
      { code: 'UT', name: 'Utah' },
      { code: 'VT', name: 'Vermont' },
      { code: 'VA', name: 'Virginia' },
      { code: 'WA', name: 'Washington' },
      { code: 'WV', name: 'West Virginia' },
      { code: 'WI', name: 'Wisconsin' },
      { code: 'WY', name: 'Wyoming' },
      { code: 'DC', name: 'District of Columbia' }
    ];
    
    res.json({ states });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

// Get state-specific information
router.get('/states/:stateCode', async (req: Request, res: Response) => {
  try {
    const { stateCode } = req.params;
    // In production, fetch state-specific information from the appropriate provider API
    res.json({
      stateCode,
      requirements: {
        llc: {
          filingFee: 100,
          annualFee: 50,
          processingTime: "5-7 business days",
          requiredInfo: [
            "Business name",
            "Registered agent information",
            "Member/manager information",
            "Business address"
          ]
        },
        corporation: {
          filingFee: 150,
          annualFee: 75,
          processingTime: "7-10 business days",
          requiredInfo: [
            "Business name",
            "Registered agent information",
            "Director information",
            "Business address",
            "Stock information"
          ]
        }
      }
    });
  } catch (error) {
    console.error(`Error fetching state info for ${req.params.stateCode}:`, error);
    res.status(500).json({ error: 'Failed to fetch state information' });
  }
});

// Get entity types available for a specific state
router.get('/entity-types/:stateCode', async (req: Request, res: Response) => {
  try {
    const { stateCode } = req.params;
    // In production, fetch available entity types from provider API based on state
    const entityTypes = [
      { 
        code: 'llc', 
        name: 'Limited Liability Company (LLC)',
        description: 'Combines the liability protection of a corporation with the tax benefits and flexibility of a partnership.'
      },
      { 
        code: 'corp', 
        name: 'Corporation',
        description: 'A legal entity that is separate and distinct from its owners, offering strong liability protection.'
      },
      { 
        code: 'scorp', 
        name: 'S Corporation',
        description: 'A corporation that has elected to pass corporate income, losses, deductions, and credits through to shareholders for federal tax purposes.'
      },
      { 
        code: 'nonprofit', 
        name: 'Nonprofit Corporation',
        description: 'An organization that uses its surplus revenues to further achieve its purpose rather than distributing profits to shareholders.'
      },
      { 
        code: 'partnership', 
        name: 'Partnership',
        description: 'A business relationship between two or more individuals who share management and profits.'
      }
    ];
    
    res.json({ stateCode, entityTypes });
  } catch (error) {
    console.error(`Error fetching entity types for ${req.params.stateCode}:`, error);
    res.status(500).json({ error: 'Failed to fetch entity types' });
  }
});

// Submit a business formation request
router.post('/submit-formation', async (req: Request, res: Response) => {
  try {
    // Define expected payload schema
    const formationSchema = z.object({
      provider: z.string(),
      entityType: z.string(),
      stateCode: z.string(),
      businessName: z.string(),
      businessPurpose: z.string().optional(),
      ownerInfo: z.array(z.object({
        name: z.string(),
        address: z.string(),
        email: z.string().email(),
        phone: z.string().optional()
      })),
      registeredAgent: z.object({
        name: z.string(),
        address: z.string(),
        useProviderAgent: z.boolean().optional()
      }),
      additionalServices: z.array(z.string()).optional()
    });
    
    // Validate the request body
    const formationData = formationSchema.parse(req.body);
    
    // In production, this would call the appropriate provider API
    // For demonstration, return a mock successful response
    res.status(201).json({
      success: true,
      formationId: `BF-${Date.now()}`,
      provider: formationData.provider,
      estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      message: "Business formation request submitted successfully"
    });
    
  } catch (error) {
    console.error('Error submitting formation request:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: fromZodError(error).message });
    }
    res.status(500).json({ error: 'Failed to submit formation request' });
  }
});

// Check status of a formation request
router.get('/formation-status/:provider/:formationId', async (req: Request, res: Response) => {
  try {
    const { provider, formationId } = req.params;
    
    // In production, this would call the appropriate provider API to check status
    // For demonstration, return a mock status
    const statuses = ['pending', 'in_progress', 'document_review', 'approved', 'completed', 'rejected'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    res.json({
      formationId,
      provider,
      status: randomStatus,
      lastUpdated: new Date().toISOString(),
      estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      nextSteps: randomStatus === 'completed' 
        ? "Download your formation documents and set up your business bank account" 
        : "We'll notify you when there are updates to your filing"
    });
    
  } catch (error) {
    console.error(`Error fetching formation status for ${req.params.formationId}:`, error);
    res.status(500).json({ error: 'Failed to fetch formation status' });
  }
});

// Get available formation services
router.get('/services', async (_req: Request, res: Response) => {
  try {
    // Mock data for available services
    const services = {
      filingServices: [
        { id: 'llc_formation', name: 'Form an LLC', description: 'Create a Limited Liability Company' },
        { id: 'corp_formation', name: 'Incorporate', description: 'Form a Corporation' },
        { id: 'nonprofit_formation', name: 'Form a Nonprofit', description: 'Create a Nonprofit Organization' },
        { id: 'compliance', name: 'Stay Compliant', description: 'Meet ongoing compliance requirements' },
        { id: 'foreign_qualification', name: 'Foreign Qualification', description: 'Register to do business in other states' },
      ],
      identityServices: [
        { id: 'business_identity', name: 'Business Identity', description: 'Establish your brand identity' },
        { id: 'domain_name', name: 'Instant Domain Name', description: 'Secure your business domain name' },
        { id: 'business_website', name: 'Business Website', description: 'Create a professional website' },
        { id: 'business_email', name: 'Business Email', description: 'Professional email addresses' },
        { id: 'phone_service', name: 'Phone Service', description: 'Business phone service' },
      ],
      registeredAgentServices: [
        { id: 'registered_agent', name: 'Registered Agent Service', description: 'Professional registered agent service' },
        { id: 'change_agent', name: 'Change Registered Agents', description: 'Switch to a new registered agent' },
        { id: 'boc3', name: 'BOC-3 Process Agent', description: 'Process agent for trucking companies' },
        { id: 'national_agent', name: 'National Registered Agent', description: 'Registered agent service in all 50 states' },
      ],
      additionalServices: [
        { id: 'mail_forwarding', name: 'Mail Forwarding', description: 'Business mail handling and forwarding' },
        { id: 'virtual_office', name: 'Virtual Office', description: 'Professional business address' },
        { id: 'trademark', name: 'Trademark Service', description: 'Protect your business name and logo' },
        { id: 'ein', name: 'EIN Service', description: 'Obtain your Federal Tax ID' },
      ]
    };
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get formation resources
router.get('/resources', async (_req: Request, res: Response) => {
  try {
    // Mock data for resources
    const resources = {
      getStarted: [
        { id: 'start_business', title: 'Start a Business', type: 'guide' },
        { id: 'business_ideas', title: 'Small Business Ideas', type: 'article' },
        { id: 'llc_vs_corp', title: 'LLC vs. Corporation', type: 'comparison' },
        { id: 'dba', title: 'Get a DBA Name', type: 'guide' },
      ],
      keepItRunning: [
        { id: 'maintain_business', title: 'Maintain a Business', type: 'guide' },
        { id: 'good_standing', title: 'Certificate of Good Standing', type: 'article' },
        { id: 'apostille', title: 'Apostille', type: 'guide' },
        { id: 'certified_copy', title: 'Certified Copy', type: 'article' },
      ],
      businessDocs: [
        { id: 'legal_forms', title: 'Legal Forms', type: 'templates' },
        { id: 'llc_agreements', title: 'LLC Operating Agreements', type: 'templates' },
        { id: 'single_member_llc', title: 'Single-Member LLC Operating Agreement', type: 'template' },
        { id: 'llc_bank', title: 'LLC Bank Account Resolution', type: 'template' },
        { id: 'corp_bylaws', title: 'Corporate Bylaws', type: 'template' },
        { id: 'stock_cert', title: 'Certificate of Stock', type: 'template' },
        { id: 'board_meeting', title: 'Initial Board Meeting', type: 'guide' },
        { id: 'nonprofit_bylaws', title: 'Nonprofit Bylaws', type: 'template' },
      ],
      corporateGuides: [
        { id: 'manifesto', title: 'Our Manifesto', type: 'article' },
        { id: 'privacy', title: 'Privacy by Default', type: 'guide' },
        { id: 'private_llc', title: 'Live Privately with an LLC', type: 'guide' },
      ]
    };
    
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

export default router;