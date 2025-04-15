/**
 * 360 Business Magician - Northwest Agent API Test Server
 * Streamlined implementation focusing only on Northwest Agent integration
 */

import express from 'express';
import cors from 'cors';
import http from 'http';
import axios from 'axios';

// Initialize express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Northwest Agent API configuration
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

// API headers for Northwest
const getNorthwestHeaders = () => {
  if (!isNorthwestApiConfigured()) {
    throw new Error('NORTHWEST_API_KEY is not configured');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NORTHWEST_API_KEY}`
  };
};

// Check if Northwest API is configured
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

// Health check and API status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    northwestAPI: isNorthwestApiConfigured() ? 'configured' : 'not configured',
    timestamp: new Date().toISOString()
  });
});

// Get entity types
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

// Get state requirements
app.get('/api/formation/requirements/:stateCode/:entityType', checkNorthwestApi, async (req, res) => {
  try {
    const { stateCode, entityType } = req.params;
    
    if (!stateCode || !entityType) {
      return res.status(400).json({
        success: false,
        error: 'State code and entity type are required'
      });
    }
    
    // For testing without API call
    if (process.env.API_MODE === 'mock') {
      return res.json({
        success: true,
        data: {
          stateCode: stateCode,
          entityType: entityType,
          requirements: [
            { name: 'Registered Agent', description: 'Required in all states' },
            { name: 'Articles of Organization', description: 'Must be filed with the state' },
            { name: 'Operating Agreement', description: 'Recommended but not state-filed' }
          ]
        }
      });
    }
    
    // Actual API call
    try {
      const response = await axios.get(
        `${NORTHWEST_API_BASE_URL}/requirements/${stateCode}/${entityType}`,
        { headers: getNorthwestHeaders() }
      );
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (apiError) {
      console.error('Northwest API error:', apiError);
      res.status(500).json({
        success: false,
        error: apiError.response?.data?.message || apiError.message || 'Error getting state requirements'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Check name availability
app.post('/api/formation/name-availability', checkNorthwestApi, async (req, res) => {
  try {
    const { companyName, entityType, stateCode } = req.body;
    
    if (!companyName || !entityType || !stateCode) {
      return res.status(400).json({
        success: false,
        error: 'Company name, entity type, and state code are required'
      });
    }
    
    // For testing without API call
    if (process.env.API_MODE === 'mock') {
      return res.json({
        success: true,
        data: {
          available: Math.random() > 0.3, // 70% chance of being available
          suggestions: !available ? ['YourBusinessName LLC', 'YourBusinessName Holdings'] : []
        }
      });
    }
    
    // Actual API call
    try {
      const response = await axios.post(
        `${NORTHWEST_API_BASE_URL}/name-availability`,
        {
          companyName,
          entityType,
          stateCode
        },
        { headers: getNorthwestHeaders() }
      );
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (apiError) {
      console.error('Northwest API error:', apiError);
      res.status(500).json({
        success: false,
        error: apiError.response?.data?.message || apiError.message || 'Error checking name availability'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get formation pricing
app.post('/api/formation/pricing', checkNorthwestApi, async (req, res) => {
  try {
    const { entityType, stateCode, options } = req.body;
    
    if (!entityType || !stateCode) {
      return res.status(400).json({
        success: false,
        error: 'Entity type and state code are required'
      });
    }
    
    // For testing without API call
    if (process.env.API_MODE === 'mock') {
      return res.json({
        success: true,
        data: {
          basePrice: 39,
          stateFees: stateCode === 'DE' ? 90 : 125,
          options: [
            { name: 'EIN Filing', price: 50, description: 'Get your Tax ID number' },
            { name: 'Operating Agreement', price: 40, description: 'Customized for your business' },
            { name: 'Registered Agent', price: 125, description: 'Annual service' }
          ],
          totalPrice: 39 + (stateCode === 'DE' ? 90 : 125),
          currency: 'USD'
        }
      });
    }
    
    // Actual API call
    try {
      const response = await axios.post(
        `${NORTHWEST_API_BASE_URL}/pricing/entity-formation`,
        {
          entityType,
          stateCode,
          ...options
        },
        { headers: getNorthwestHeaders() }
      );
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (apiError) {
      console.error('Northwest API error:', apiError);
      res.status(500).json({
        success: false,
        error: apiError.response?.data?.message || apiError.message || 'Error getting formation pricing'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Create business entity
app.post('/api/formation/entity', checkNorthwestApi, async (req, res) => {
  try {
    // For testing without API call
    if (process.env.API_MODE === 'mock') {
      const mockFormationId = `NW-${Date.now().toString().slice(-8)}`;
      return res.json({
        success: true,
        data: {
          formationId: mockFormationId,
          status: 'IN_PROGRESS',
          estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      });
    }
    
    // Actual API call
    try {
      const response = await axios.post(
        `${NORTHWEST_API_BASE_URL}/formation/entity`,
        req.body,
        { headers: getNorthwestHeaders() }
      );
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (apiError) {
      console.error('Northwest API error:', apiError);
      res.status(500).json({
        success: false,
        error: apiError.response?.data?.message || apiError.message || 'Error creating business entity'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get formation status
app.get('/api/formation/status/:formationId', checkNorthwestApi, async (req, res) => {
  try {
    const { formationId } = req.params;
    
    if (!formationId) {
      return res.status(400).json({
        success: false,
        error: 'Formation ID is required'
      });
    }
    
    // For testing without API call
    if (process.env.API_MODE === 'mock') {
      return res.json({
        success: true,
        data: {
          formationId: formationId,
          status: 'IN_PROGRESS',
          estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      });
    }
    
    // Actual API call
    try {
      const response = await axios.get(
        `${NORTHWEST_API_BASE_URL}/formation/status/${formationId}`,
        { headers: getNorthwestHeaders() }
      );
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (apiError) {
      console.error('Northwest API error:', apiError);
      res.status(500).json({
        success: false,
        error: apiError.response?.data?.message || apiError.message || 'Error getting formation status'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message
  });
});

// Start the server
const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Set API mode for testing without actual API calls
process.env.API_MODE = process.env.NORTHWEST_API_KEY ? 'live' : 'mock';

server.listen(port, '0.0.0.0', () => {
  console.log(`Northwest Agent API Test Server running on port ${port}`);
  console.log(`API Mode: ${process.env.API_MODE}`);
  console.log(`Northwest API: ${isNorthwestApiConfigured() ? 'Configured' : 'Not Configured'}`);
});