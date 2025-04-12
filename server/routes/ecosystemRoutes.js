/**
 * 360 Magicians Ecosystem Routes
 * Handles navigation and integration between different 360 Magicians services
 */

const express = require('express');
const router = express.Router();
const ecosystemConnector = require('../services/ecosystemConnector');

/**
 * Get service navigation link (with SSO if authenticated)
 */
router.post('/get-service-link', async (req, res) => {
  try {
    const { service } = req.body;
    
    // Validate service name
    const validServices = ['business', 'job', 'vr4deaf', 'main'];
    if (!validServices.includes(service)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid service name'
      });
    }
    
    // Check if user is authenticated
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        redirectUrl: '/login'
      });
    }
    
    // If navigating to main service, simply return success
    if (service === 'main') {
      return res.json({
        success: true,
        redirectUrl: '/'
      });
    }
    
    // Get service URL
    const serviceKey = service.toUpperCase();
    const baseUrl = ecosystemConnector.SERVICE_URLS[serviceKey];
    
    // Create cross-service auth if user is authenticated
    const userId = req.session.userId;
    const authResult = await ecosystemConnector.createCrossServiceAuth(
      'MAIN', // Source system is main platform
      userId.toString(),
      serviceKey // Target system is the requested service
    );
    
    if (!authResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create authentication for service',
        details: authResult.error
      });
    }
    
    // Return success with redirect URL
    return res.json({
      success: true,
      redirectUrl: authResult.redirectUrl
    });
  } catch (error) {
    console.error('Error getting service link:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Check authentication status
 */
router.get('/auth/status', (req, res) => {
  const isAuthenticated = !!(req.session && req.session.userId);
  
  res.json({
    authenticated: isAuthenticated
  });
});

/**
 * Get ASL video resources for content
 */
router.get('/asl-resources', async (req, res) => {
  try {
    const { contentType, contentId } = req.query;
    
    if (!contentType) {
      return res.status(400).json({
        success: false,
        error: 'Content type is required'
      });
    }
    
    const result = await ecosystemConnector.getASLVideoResources(contentType, contentId || 'default');
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: 'ASL resources not found',
        details: result.error
      });
    }
    
    return res.json(result);
  } catch (error) {
    console.error('Error getting ASL resources:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Handle SSO login from other services
 */
router.get('/sso-login', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }
    
    // Verify token with main service
    const verifyResult = await ecosystemConnector.callService(
      'MAIN',
      '/api/verify-temp-auth',
      'POST',
      { token }
    );
    
    if (!verifyResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    
    // Set session
    req.session.userId = verifyResult.data.userId;
    req.session.userInfo = verifyResult.data.userInfo;
    
    // Redirect to homepage
    return res.redirect('/');
  } catch (error) {
    console.error('Error handling SSO login:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Fetch business recommendations from Business Magician
 */
router.post('/business-ideas', async (req, res) => {
  try {
    const { interests, constraints } = req.body;
    
    if (!interests || !Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        error: 'Interests must be provided as an array'
      });
    }
    
    const result = await ecosystemConnector.businessService.getBusinessIdeas(
      interests,
      constraints || []
    );
    
    return res.json(result);
  } catch (error) {
    console.error('Error getting business ideas:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Fetch job recommendations from Job Magician
 */
router.post('/job-recommendations', async (req, res) => {
  try {
    const { profile } = req.body;
    
    if (!profile) {
      return res.status(400).json({
        success: false,
        error: 'Job profile is required'
      });
    }
    
    const result = await ecosystemConnector.jobService.getJobRecommendations(profile);
    
    return res.json(result);
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Check VR eligibility with VR4Deaf
 */
router.post('/vr-eligibility', async (req, res) => {
  try {
    const { clientInfo } = req.body;
    
    if (!clientInfo) {
      return res.status(400).json({
        success: false,
        error: 'Client information is required'
      });
    }
    
    const result = await ecosystemConnector.vr4deafService.checkEligibility(clientInfo);
    
    return res.json(result);
  } catch (error) {
    console.error('Error checking VR eligibility:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;