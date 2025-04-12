/**
 * 360 Magicians Ecosystem Routes - TypeScript Implementation
 */

import { Router, Request, Response } from 'express';
const router = Router();

// Service mapping
const SERVICE_URLS = {
  BUSINESS: process.env.BUSINESS_MAGICIAN_URL || 'https://business.360magicians.com',
  JOB: process.env.JOB_MAGICIAN_URL || 'https://job.360magicians.com',
  VR4DEAF: process.env.VR4DEAF_URL || 'https://vr4deaf.360magicians.com',
  MAIN: process.env.MAIN_PLATFORM_URL || 'https://360magicians.com'
};

/**
 * Get ecosystem services navigation information
 */
router.get('/services', (_req: Request, res: Response) => {
  res.json({
    services: [
      {
        id: 'business',
        name: 'Business Magician', 
        description: 'Start or grow your business with expert guidance',
        url: SERVICE_URLS.BUSINESS,
        color: 'blue'
      },
      {
        id: 'job',
        name: 'Job Magician', 
        description: 'Find employment and advance your career',
        url: SERVICE_URLS.JOB,
        color: 'purple'
      },
      {
        id: 'vr4deaf',
        name: 'VR4Deaf', 
        description: 'Specialized vocational rehabilitation services',
        url: SERVICE_URLS.VR4DEAF,
        color: 'green',
        isPilot: true
      }
    ]
  });
});

/**
 * Get ASL video resources for content
 */
router.get('/asl-resources', (req: Request, res: Response) => {
  const contentType = req.query.contentType as string;
  const contentId = req.query.contentId as string | undefined;
  
  if (!contentType) {
    return res.status(400).json({
      success: false,
      error: 'Content type is required'
    });
  }
  
  // Placeholder implementation
  res.json({
    success: true,
    data: {
      videos: [
        {
          title: "Introduction to VR Services",
          url: "https://storage.googleapis.com/business-magician-api-vercel-assets/asl/vr-intro.mp4",
          duration: 120
        }
      ]
    }
  });
});

/**
 * Fetch business recommendations from Business Magician
 */
router.post('/business-ideas', (req: Request, res: Response) => {
  const { interests, constraints } = req.body;
  
  if (!interests || !Array.isArray(interests)) {
    return res.status(400).json({
      success: false,
      error: 'Interests must be provided as an array'
    });
  }
  
  // Placeholder implementation
  res.json({
    success: true,
    data: {
      ideas: [
        {
          title: "ASL Training Services",
          description: "Create a business providing specialized ASL training for corporate environments."
        }
      ]
    }
  });
});

/**
 * Fetch job recommendations from Job Magician
 */
router.post('/job-recommendations', (req: Request, res: Response) => {
  const { profile } = req.body;
  
  if (!profile) {
    return res.status(400).json({
      success: false,
      error: 'Job profile is required'
    });
  }
  
  // Placeholder implementation
  res.json({
    success: true,
    data: {
      jobs: [
        {
          title: "ASL Interpreter",
          company: "TechCorp Inc.",
          location: "Remote"
        }
      ]
    }
  });
});

/**
 * Check VR eligibility with VR4Deaf
 */
router.post('/vr-eligibility', (req: Request, res: Response) => {
  const { clientInfo } = req.body;
  
  if (!clientInfo) {
    return res.status(400).json({
      success: false,
      error: 'Client information is required'
    });
  }
  
  // Placeholder implementation
  res.json({
    success: true,
    data: {
      eligible: true,
      nextSteps: "Contact your VR counselor to begin the intake process."
    }
  });
});

export default router;