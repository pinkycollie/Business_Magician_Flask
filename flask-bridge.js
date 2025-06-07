/**
 * 360 Business Magician Flask Integration Bridge
 * Connects existing Flask backend with Node.js VR business flow system
 */

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Flask backend configuration
const FLASK_BASE_URL = 'https://fast-htmx-server-pinkycollie.replit.app';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Check Flask backend health
    const flaskHealth = await axios.get(`${FLASK_BASE_URL}/api/health`);
    
    res.json({ 
      status: 'operational',
      service: '360 Business Magician Platform',
      flaskBackend: flaskHealth.status === 200 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      status: 'partial',
      service: '360 Business Magician Platform', 
      flaskBackend: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Business Blueprint Generation API
app.post('/api/business/generate-blueprint', async (req, res) => {
  try {
    const { clientData, serviceType, accommodations } = req.body;
    
    // Generate comprehensive business blueprint using Flask AI services
    const blueprintRequest = {
      client_info: clientData,
      service_category: serviceType,
      accommodations_needed: accommodations,
      blueprint_type: 'comprehensive_vr_business_plan'
    };
    
    // Call Flask AI endpoint for blueprint generation
    const flaskResponse = await axios.post(`${FLASK_BASE_URL}/api/ai/generate-business-plan`, blueprintRequest);
    
    // Enhance with VR-specific components
    const vrEnhancedBlueprint = {
      ...flaskResponse.data,
      vrSpecializations: {
        accessibility_features: accommodations,
        deaf_community_resources: await generateDeafCommunityResources(clientData.businessType),
        vr_compliance_checklist: await generateVRComplianceChecklist(serviceType),
        timeline_milestones: await generateVRTimeline(serviceType)
      },
      implementation_phases: await generateImplementationPhases(clientData),
      cost_analysis: await calculateVRServiceCosts(serviceType, clientData),
      partner_integrations: {
        mbtq_insurance: { status: 'available', integration_ready: true },
        google_workspace: { status: 'configured', endpoint: '/api/google/workspace' },
        tax_services: { status: 'active', provider: 'integrated_tax_api' }
      }
    };
    
    res.status(201).json({
      success: true,
      message: 'Business blueprint generated successfully',
      blueprint: vrEnhancedBlueprint,
      generated_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Blueprint generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Blueprint generation failed',
      details: error.message
    });
  }
});

// VR Business Package Generator
app.post('/api/vr/generate-package', async (req, res) => {
  try {
    const { packageType, clientNeeds, timelineWeeks } = req.body;
    
    // Generate VR business package using comprehensive checklist
    const packageData = await generateVRBusinessPackage(packageType, clientNeeds, timelineWeeks);
    
    // Integrate with Flask AI for content enhancement
    const aiEnhancedPackage = await axios.post(`${FLASK_BASE_URL}/api/ai/enhance-business-package`, {
      package_data: packageData,
      client_profile: clientNeeds,
      timeline: timelineWeeks
    });
    
    res.status(201).json({
      success: true,
      package: aiEnhancedPackage.data,
      implementation_ready: true
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Package generation failed'
    });
  }
});

// Google Workspace Integration Endpoint
app.post('/api/google/workspace/setup', async (req, res) => {
  try {
    const { clientId, businessName, services } = req.body;
    
    // Setup Google Workspace integration for client
    const workspaceConfig = {
      client_id: clientId,
      business_name: businessName,
      requested_services: services,
      google_workspace_domain: `${businessName.toLowerCase().replace(/\s+/g, '')}.360magicians.com`,
      integration_features: {
        gmail_business: true,
        google_drive_collaboration: true,
        google_calendar_scheduling: true,
        google_docs_business_planning: true,
        google_sheets_financial_tracking: true,
        google_meet_consultations: true
      }
    };
    
    // Process through Flask backend for Google API integration
    const googleSetup = await axios.post(`${FLASK_BASE_URL}/api/integrations/google-workspace`, workspaceConfig);
    
    res.status(201).json({
      success: true,
      workspace_setup: googleSetup.data,
      access_url: `https://${workspaceConfig.google_workspace_domain}`,
      next_steps: [
        'Complete Google Workspace verification',
        'Configure business email accounts',
        'Set up collaborative workspaces',
        'Schedule initial consultation'
      ]
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Google Workspace setup failed'
    });
  }
});

// Business Plan Template Generator
app.get('/api/templates/business-plan/:industry', async (req, res) => {
  try {
    const { industry } = req.params;
    const { accommodations = [] } = req.query;
    
    // Generate industry-specific business plan template
    const template = await generateBusinessPlanTemplate(industry, accommodations);
    
    res.json({
      success: true,
      template,
      industry,
      accommodations_included: accommodations
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Template generation failed'
    });
  }
});

// VR Service Cost Calculator
app.post('/api/vr/calculate-costs', async (req, res) => {
  try {
    const { serviceCategories, clientProfile, timelineMonths } = req.body;
    
    const costAnalysis = await calculateComprehensiveVRCosts(serviceCategories, clientProfile, timelineMonths);
    
    res.json({
      success: true,
      cost_analysis: costAnalysis,
      payment_options: [
        { type: 'monthly', description: 'Spread costs over service timeline' },
        { type: 'milestone', description: 'Pay at completion of each phase' },
        { type: 'vr_funded', description: 'Vocational rehabilitation agency funding' }
      ]
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Cost calculation failed'
    });
  }
});

// Helper Functions
async function generateDeafCommunityResources(businessType) {
  return {
    networking_organizations: [
      'National Association of the Deaf (NAD)',
      'Deaf Professional Network',
      'Registry of Interpreters for the Deaf (RID)'
    ],
    accessibility_tools: [
      'Video relay services (VRS)',
      'Real-time captioning solutions',
      'ASL interpretation booking platforms'
    ],
    business_specific_resources: getBusinessTypeResources(businessType)
  };
}

async function generateVRComplianceChecklist(serviceType) {
  const baseCompliance = [
    'VR agency service agreement documentation',
    'Individual Plan for Employment (IPE) integration',
    'Progress milestone reporting requirements',
    'Accommodation needs assessment',
    'Success metrics definition'
  ];
  
  const serviceSpecific = getServiceTypeCompliance(serviceType);
  
  return [...baseCompliance, ...serviceSpecific];
}

async function generateVRTimeline(serviceType) {
  const timelines = {
    'exploration_concept_development': {
      duration: '4 weeks',
      milestones: ['Initial assessment', 'Concept validation', 'Market research', 'Feasibility report']
    },
    'business_planning': {
      duration: '4 weeks', 
      milestones: ['Business model canvas', 'Financial projections', 'Marketing strategy', 'Final business plan']
    },
    'supported_self_employment': {
      duration: '4 weeks',
      milestones: ['Business setup', 'Operations launch', 'Client acquisition', 'Sustainability planning']
    }
  };
  
  return timelines[serviceType] || timelines['exploration_concept_development'];
}

async function generateImplementationPhases(clientData) {
  return [
    {
      phase: 1,
      name: 'Foundation Setup',
      duration: '2 months',
      tasks: ['Legal structure', 'Digital infrastructure', 'Compliance setup']
    },
    {
      phase: 2,
      name: 'Platform Development', 
      duration: '3 months',
      tasks: ['Core features', 'Security implementation', 'Testing']
    },
    {
      phase: 3,
      name: 'Service Development',
      duration: '1 month',
      tasks: ['Program structure', 'Content development', 'Training materials']
    },
    {
      phase: 4,
      name: 'Marketing and Launch',
      duration: '1 month',
      tasks: ['Digital marketing', 'Partnership development', 'Launch preparation']
    },
    {
      phase: 5,
      name: 'Operations',
      duration: 'Ongoing',
      tasks: ['Client support', 'Continuous improvement', 'Performance monitoring']
    }
  ];
}

async function calculateVRServiceCosts(serviceType, clientData) {
  const costStructures = {
    'exploration_concept_development': { base: 122, max: 551, complexity_multiplier: 1.0 },
    'feasibility_studies': { base: 151, max: 551, complexity_multiplier: 1.1 },
    'business_planning': { base: 1286, max: 1780, complexity_multiplier: 1.3 },
    'supported_self_employment': { base: 2021, max: 2021, complexity_multiplier: 1.5 },
    'business_maintenance': { base: 1011, max: 1011, complexity_multiplier: 1.2 },
    'business_stability': { base: 1511, max: 1511, complexity_multiplier: 1.4 },
    'service_closure': { base: 3023, max: 3023, complexity_multiplier: 1.1 }
  };
  
  const structure = costStructures[serviceType] || costStructures['exploration_concept_development'];
  const estimatedCost = Math.floor(structure.base * structure.complexity_multiplier);
  
  return {
    service_type: serviceType,
    estimated_cost: estimatedCost,
    cost_range: `$${structure.base} - $${structure.max}`,
    includes_accommodations: true,
    payment_schedule: 'Milestone-based',
    vr_funding_eligible: true
  };
}

async function generateVRBusinessPackage(packageType, clientNeeds, timelineWeeks) {
  return {
    package_id: `vr_package_${Date.now()}`,
    package_type: packageType,
    timeline_weeks: timelineWeeks,
    deliverables: [
      'Comprehensive business plan',
      'Financial projections and budgets',
      'Marketing strategy and materials',
      'Operations and compliance documentation',
      'Accessibility integration plan',
      'VR milestone tracking system'
    ],
    support_services: [
      'Weekly one-on-one consultations',
      'Peer mentorship connections',
      'Technical assistance and troubleshooting',
      'Grant and funding application support'
    ],
    accessibility_accommodations: clientNeeds.accommodations || [],
    success_metrics: [
      'Business launch readiness score',
      'Financial sustainability projection',
      'Market entry strategy completion',
      'VR service goal achievement'
    ]
  };
}

function getBusinessTypeResources(businessType) {
  const resources = {
    'technology': ['Tech accessibility standards', 'Inclusive design guidelines'],
    'consulting': ['Professional certification paths', 'Client communication tools'],
    'retail': ['E-commerce accessibility', 'Point-of-sale accommodations'],
    'food_service': ['ADA compliance for restaurants', 'Customer service training']
  };
  
  return resources[businessType] || resources['consulting'];
}

function getServiceTypeCompliance(serviceType) {
  const compliance = {
    'business_planning': ['Business license requirements', 'Financial reporting standards'],
    'supported_self_employment': ['Employment verification', 'Income tracking protocols'],
    'feasibility_studies': ['Market analysis documentation', 'Risk assessment reporting']
  };
  
  return compliance[serviceType] || [];
}

async function generateBusinessPlanTemplate(industry, accommodations) {
  return {
    template_id: `bp_template_${industry}_${Date.now()}`,
    industry,
    sections: [
      'Executive Summary',
      'Business Description', 
      'Market Analysis',
      'Organization & Management',
      'Service Offerings',
      'Marketing & Sales Strategy',
      'Financial Projections',
      'Accessibility Implementation Plan',
      'VR Service Integration'
    ],
    accommodations_integrated: accommodations,
    estimated_completion_time: '2-4 weeks',
    support_resources_included: true
  };
}

async function calculateComprehensiveVRCosts(serviceCategories, clientProfile, timelineMonths) {
  const totalCosts = serviceCategories.reduce((sum, category) => {
    const categoryBase = {
      'exploration': 337,
      'feasibility': 351, 
      'planning': 1533,
      'employment': 2021,
      'maintenance': 1011,
      'stability': 1511,
      'closure': 3023
    };
    
    return sum + (categoryBase[category] || 0);
  }, 0);
  
  return {
    total_estimated_cost: totalCosts,
    cost_breakdown: serviceCategories.map(cat => ({
      category: cat,
      estimated_cost: {
        'exploration': 337,
        'feasibility': 351,
        'planning': 1533,
        'employment': 2021,
        'maintenance': 1011,
        'stability': 1511,
        'closure': 3023
      }[cat] || 0
    })),
    timeline_months: timelineMonths,
    monthly_average: Math.floor(totalCosts / timelineMonths),
    funding_options: [
      'VR agency direct funding',
      'State vocational rehabilitation grants',
      'Federal small business programs',
      'Disability-focused business incubators'
    ]
  };
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`360 Business Magician Platform running on port ${PORT}`);
  console.log(`Flask Backend: ${FLASK_BASE_URL}`);
  console.log(`Service endpoints operational`);
});

export default app;