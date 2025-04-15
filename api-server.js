/**
 * 360 Business Magician API Server
 * Low-memory optimized version
 */

import express from 'express';
import cors from 'cors';
import http from 'http';

// Initialize express
const app = express();
app.use(express.json());
app.use(cors());

// Basic health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ecosystem routes - simplified implementation
app.get('/api/ecosystem/services', (req, res) => {
  res.json({
    services: [
      {
        id: 'business',
        name: 'Business Magician', 
        description: 'Start or grow your business with expert guidance',
        url: process.env.BUSINESS_MAGICIAN_URL || 'https://business.360magicians.com',
        color: 'blue'
      },
      {
        id: 'job',
        name: 'Job Magician', 
        description: 'Find employment and advance your career',
        url: process.env.JOB_MAGICIAN_URL || 'https://job.360magicians.com',
        color: 'purple'
      },
      {
        id: 'vr4deaf',
        name: 'VR4Deaf', 
        description: 'Specialized vocational rehabilitation services',
        url: process.env.VR4DEAF_URL || 'https://vr4deaf.360magicians.com',
        color: 'green',
        isPilot: true
      }
    ]
  });
});

// Northwest Agent API integration
const NORTHWEST_API_BASE_URL = 'https://api.northwestregisteredagent.com/v1';
const isNorthwestApiConfigured = () => !!process.env.NORTHWEST_API_KEY;

// Entity types supported by Northwest
const entityTypes = {
  LLC: 'LLC',
  CORPORATION: 'Corporation',
  NON_PROFIT: 'NonProfit',
  BENEFIT_CORPORATION: 'BenefitCorporation',
  PROFESSIONAL_LLC: 'ProfessionalLLC',
  PROFESSIONAL_CORPORATION: 'ProfessionalCorporation',
  DBA: 'DBA',
  SERIES_LLC: 'SeriesLLC',
};

// Basic Northwest API helper
const getNorthwestHeaders = () => {
  if (!isNorthwestApiConfigured()) {
    throw new Error('NORTHWEST_API_KEY is not configured');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NORTHWEST_API_KEY}`
  };
};

// Northwest API status middleware
const checkNorthwestApi = (req, res, next) => {
  if (!isNorthwestApiConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Northwest Agent API not configured',
      message: 'Please configure NORTHWEST_API_KEY to use formation services'
    });
  }
  next();
};

// Get available entity types
app.get('/api/formation/entity-types', (req, res) => {
  res.json({
    success: true,
    data: {
      entityTypes: [
        { id: entityTypes.LLC, name: 'Limited Liability Company', description: 'Combines liability protection with tax flexibility' },
        { id: entityTypes.CORPORATION, name: 'Corporation', description: 'Separate legal entity owned by shareholders' },
        { id: entityTypes.NON_PROFIT, name: 'Non-Profit', description: 'Organization for charitable, educational, or public purposes' },
        { id: entityTypes.BENEFIT_CORPORATION, name: 'Benefit Corporation', description: 'For-profit entity with public benefit purpose' },
        { id: entityTypes.PROFESSIONAL_LLC, name: 'Professional LLC', description: 'For licensed professionals like doctors, lawyers, etc.' },
        { id: entityTypes.PROFESSIONAL_CORPORATION, name: 'Professional Corporation', description: 'Corporation for licensed professionals' },
        { id: entityTypes.DBA, name: 'DBA (Doing Business As)', description: 'Business name different from legal name' },
        { id: entityTypes.SERIES_LLC, name: 'Series LLC', description: 'Multiple protected "cells" within one LLC' }
      ]
    }
  });
});

// Get formation status (mock API for development)
app.get('/api/formation/status/:formationId', checkNorthwestApi, (req, res) => {
  const { formationId } = req.params;
  
  // Simplified mock response
  res.json({
    success: true,
    data: {
      formationId: formationId,
      status: 'IN_PROGRESS',
      estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });
});

// Function to generate basic business ideas - standalone implementation
function generateBasicBusinessIdea(interests = ['technology'], marketInfo = 'general', constraints = []) {
  // Simple implementation without AI
  const ideas = [
    {
      title: "ASL Training Services",
      description: "Create a business providing specialized ASL training for corporate environments, focusing on workplace communication and inclusion.",
      viability: "High",
      startupCosts: "Low to Medium",
      targetMarket: "Corporations, educational institutions, government agencies",
      revenueModel: "Training programs, subscription services, certification courses"
    },
    {
      title: "Accessible Events Planning",
      description: "Specialized event planning service focused on accessibility for deaf and hard-of-hearing attendees, including real-time captioning, ASL interpreters, and visual cuing systems.",
      viability: "Medium to High",
      startupCosts: "Low",
      targetMarket: "Conference organizers, corporations, universities, community organizations",
      revenueModel: "Service fees, consulting, accessibility technology rental"
    },
    {
      title: "Assistive Technology Consulting",
      description: "Consulting business helping organizations implement and optimize assistive technologies for deaf and hard-of-hearing employees and customers.",
      viability: "High",
      startupCosts: "Low",
      targetMarket: "Businesses, educational institutions, healthcare facilities",
      revenueModel: "Consulting fees, implementation services, ongoing support contracts"
    }
  ];
  
  return {
    success: true,
    data: {
      ideas: ideas,
      interests: interests,
      marketContext: marketInfo,
      constraints: constraints
    }
  };
}

// Business ideas endpoint
app.post('/api/ecosystem/business-ideas', (req, res) => {
  const { interests, marketInfo, constraints } = req.body;
  
  // Generate ideas using the local function
  const response = generateBasicBusinessIdea(
    interests || ['technology'], 
    marketInfo || 'general',
    constraints || []
  );
  
  res.json(response);
});

// Business tool recommendations
app.get('/api/tools', (req, res) => {
  res.json({
    success: true,
    data: {
      tools: [
        { 
          id: "business-plan-creator",
          name: "Business Plan Creator",
          description: "Create a professional business plan with our step-by-step guide",
          url: "/tools/business-plan"
        },
        { 
          id: "market-research",
          name: "Market Research Tool",
          description: "Analyze your market and competition using our data-driven insights",
          url: "/tools/market-research"
        },
        { 
          id: "startup-calculator",
          name: "Startup Cost Calculator",
          description: "Estimate your startup costs and financial needs",
          url: "/tools/cost-calculator"
        }
      ]
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error'
  });
});

// Start the server
const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {
  console.log(`Business Magician API Server running on port ${port}`);
});