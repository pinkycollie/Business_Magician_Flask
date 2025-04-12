/**
 * 360 Magicians Ecosystem Connector
 * 
 * This service provides API-based integration between the separate 360 Magicians components:
 * - Business Magician
 * - Job Magician 
 * - VR4Deaf (separate pilot)
 * 
 * Each component remains independent, but can share data and functionality through these APIs.
 */

const axios = require('axios');
const crypto = require('crypto');

// Base URLs for each service (to be configured based on deployment)
const SERVICE_URLS = {
  BUSINESS: process.env.BUSINESS_MAGICIAN_URL || 'https://business.360magicians.com',
  JOB: process.env.JOB_MAGICIAN_URL || 'https://job.360magicians.com',
  VR4DEAF: process.env.VR4DEAF_URL || 'https://vr4deaf.360magicians.com',
  MAIN: process.env.MAIN_PLATFORM_URL || 'https://360magicians.com'
};

// Authentication for cross-service calls
function generateAuthToken(service, timestamp) {
  const secret = process.env.ECOSYSTEM_API_SECRET || 'development-secret-key-replace-in-production';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${service}:${timestamp}`);
  return hmac.digest('hex');
}

/**
 * Make an authenticated request to another service in the ecosystem
 * @param {string} service - The service to call (BUSINESS, JOB, VR4DEAF, MAIN)
 * @param {string} endpoint - The API endpoint to call
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} data - Request data (for POST/PUT)
 * @returns {Promise<Object>} - Response from the service
 */
async function callService(service, endpoint, method = 'GET', data = null) {
  try {
    const serviceUrl = SERVICE_URLS[service];
    if (!serviceUrl) {
      throw new Error(`Unknown service: ${service}`);
    }

    const timestamp = Date.now().toString();
    const token = generateAuthToken(service, timestamp);
    
    const response = await axios({
      method,
      url: `${serviceUrl}${endpoint}`,
      data,
      headers: {
        'X-360-Magicians-Auth': token,
        'X-360-Magicians-Timestamp': timestamp,
        'X-360-Magicians-Source': 'API_CONNECTOR'
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error calling ${service} service:`, error.message);
    return {
      success: false,
      error: error.message,
      status: error.response?.status || 500
    };
  }
}

/**
 * Business Magician Integration
 */
const businessService = {
  /**
   * Get business idea recommendations
   * @param {Array} interests - User interests
   * @param {string} constraints - Business constraints
   * @returns {Promise<Object>} - Business ideas
   */
  async getBusinessIdeas(interests, constraints) {
    return callService(
      'BUSINESS', 
      '/api/generate-business-idea', 
      'POST', 
      { interests, constraints }
    );
  },
  
  /**
   * Get business formation checklist
   * @param {string} state - Two-letter state code
   * @param {string} businessType - Type of business
   * @returns {Promise<Object>} - Formation checklist
   */
  async getFormationChecklist(state, businessType) {
    return callService(
      'BUSINESS', 
      '/api/business-formation', 
      'POST', 
      { state, businessType }
    );
  }
};

/**
 * Job Magician Integration
 */
const jobService = {
  /**
   * Search for job recommendations
   * @param {Object} profile - User job profile
   * @returns {Promise<Object>} - Job recommendations
   */
  async getJobRecommendations(profile) {
    return callService(
      'JOB',
      '/api/job-recommendations',
      'POST',
      { profile }
    );
  },
  
  /**
   * Get resume template
   * @param {string} profileType - Type of job profile
   * @returns {Promise<Object>} - Resume template
   */
  async getResumeTemplate(profileType) {
    return callService(
      'JOB',
      '/api/resume-template',
      'GET',
      { params: { type: profileType } }
    );
  }
};

/**
 * VR4Deaf Integration
 */
const vr4deafService = {
  /**
   * Check VR eligibility
   * @param {Object} clientInfo - Client information
   * @returns {Promise<Object>} - Eligibility information
   */
  async checkEligibility(clientInfo) {
    return callService(
      'VR4DEAF',
      '/api/eligibility-check',
      'POST',
      { clientInfo }
    );
  },
  
  /**
   * Get IPE template
   * @param {string} clientId - Client ID
   * @returns {Promise<Object>} - IPE template
   */
  async getIPETemplate(clientId) {
    return callService(
      'VR4DEAF',
      `/api/ipe-template/${clientId}`,
      'GET'
    );
  },
  
  /**
   * Get accessibility resources
   * @param {string} category - Resource category
   * @returns {Promise<Object>} - Accessibility resources
   */
  async getAccessibilityResources(category) {
    return callService(
      'VR4DEAF',
      '/api/accessibility-resources',
      'GET',
      { params: { category } }
    );
  }
};

/**
 * Unified user mapping between systems
 * @param {string} sourceSystem - Source system (BUSINESS, JOB, VR4DEAF, MAIN)
 * @param {string} sourceId - User ID in source system
 * @param {string} targetSystem - Target system (BUSINESS, JOB, VR4DEAF, MAIN)
 * @returns {Promise<Object>} - User mapping information
 */
async function mapUserBetweenSystems(sourceSystem, sourceId, targetSystem) {
  try {
    // Call the main platform to get user mapping
    const result = await callService(
      'MAIN',
      '/api/user-mapping',
      'POST',
      {
        sourceSystem,
        sourceId,
        targetSystem
      }
    );
    
    if (!result.success) {
      throw new Error(`Failed to map user: ${result.error}`);
    }
    
    return {
      success: true,
      sourceId,
      targetId: result.data.targetId,
      mappingExists: result.data.mappingExists
    };
  } catch (error) {
    console.error('Error mapping user between systems:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create seamless authentication between services
 * @param {string} sourceSystem - Source system (BUSINESS, JOB, VR4DEAF, MAIN)
 * @param {string} userId - User ID in source system
 * @param {string} targetSystem - Target system to authenticate with
 * @returns {Promise<Object>} - Authentication token for target system
 */
async function createCrossServiceAuth(sourceSystem, userId, targetSystem) {
  try {
    // Get user mapping first
    const mapping = await mapUserBetweenSystems(sourceSystem, userId, targetSystem);
    
    if (!mapping.success || !mapping.mappingExists) {
      throw new Error('User mapping not found');
    }
    
    // Create temporary auth token
    const result = await callService(
      'MAIN',
      '/api/create-temp-auth',
      'POST',
      {
        sourceSystem,
        targetSystem,
        sourceId: userId,
        targetId: mapping.targetId
      }
    );
    
    if (!result.success) {
      throw new Error(`Failed to create auth token: ${result.error}`);
    }
    
    return {
      success: true,
      token: result.data.token,
      expiresAt: result.data.expiresAt,
      redirectUrl: `${SERVICE_URLS[targetSystem]}/api/sso-login?token=${result.data.token}`
    };
  } catch (error) {
    console.error('Error creating cross-service auth:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Share data between services
 * @param {string} sourceSystem - Source system (BUSINESS, JOB, VR4DEAF, MAIN)
 * @param {string} targetSystem - Target system 
 * @param {string} dataType - Type of data to share
 * @param {Object} data - The data to share
 * @returns {Promise<Object>} - Result of data sharing
 */
async function shareDataBetweenServices(sourceSystem, targetSystem, dataType, data) {
  try {
    const result = await callService(
      targetSystem,
      '/api/receive-shared-data',
      'POST',
      {
        sourceSystem,
        dataType,
        data,
        timestamp: Date.now()
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error sharing data between services:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get ASL video resources for a specific content
 * @param {string} contentType - Type of content (e.g., 'business-formation', 'interview-prep')
 * @param {string} contentId - Specific content identifier
 * @returns {Promise<Object>} - ASL video resources
 */
async function getASLVideoResources(contentType, contentId) {
  try {
    // ASL resources are centralized in the VR4Deaf system
    const result = await callService(
      'VR4DEAF',
      '/api/asl-resources',
      'GET',
      { params: { contentType, contentId } }
    );
    
    return result;
  } catch (error) {
    console.error('Error getting ASL video resources:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  businessService,
  jobService,
  vr4deafService,
  mapUserBetweenSystems,
  createCrossServiceAuth,
  shareDataBetweenServices,
  getASLVideoResources,
  SERVICE_URLS
};