import express from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = express.Router();

// Schema for job positions
const jobPositionSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  department: z.enum(['engineering', 'design', 'marketing', 'operations', 'customer-service', 'finance', 'leadership']),
  status: z.enum(['draft', 'published', 'filled', 'on-hold']),
  priority: z.enum(['high', 'medium', 'low']),
  location: z.enum(['remote', 'hybrid', 'on-site']),
  type: z.enum(['full-time', 'part-time', 'contract']),
  salaryRange: z.string().optional(),
  skills: z.array(z.string()),
  responsibilities: z.array(z.string()),
  qualifications: z.array(z.string()),
  deafFriendly: z.boolean().default(true),
  publishedDate: z.string().optional(),
  applications: z.number().optional(),
  deafApplicants: z.number().optional(),
  heardApplicants: z.number().optional(),
  businessId: z.number(),
  userId: z.number()
});

// Schema for candidates
const candidateSchema = z.object({
  name: z.string().min(1, "Candidate name is required"),
  position: z.string(),
  status: z.enum(['applied', 'screening', 'interviewing', 'offer', 'rejected', 'hired']),
  experience: z.number(),
  skills: z.array(z.string()),
  isDeafOrHoh: z.boolean(),
  interviewDate: z.string().optional(),
  needsInterpreter: z.boolean(),
  resumeUrl: z.string(),
  coverLetterUrl: z.string().optional(),
  videoIntroUrl: z.string().optional(),
  notes: z.string().optional(),
  jobId: z.string(),
  businessId: z.number(),
  userId: z.number()
});

// Mock data for demonstration until database integration is complete
let jobPositions: any[] = [];
let candidates: any[] = [];

// Create a new job position
router.post('/positions', (req, res) => {
  try {
    const jobData = jobPositionSchema.parse(req.body);
    
    const newJob = {
      id: `job-${Date.now()}`,
      ...jobData,
      publishedDate: jobData.status === 'published' ? new Date().toISOString().split('T')[0] : undefined,
      applications: 0,
      deafApplicants: 0,
      heardApplicants: 0
    };
    
    jobPositions.push(newJob);
    
    res.status(201).json(newJob);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error creating job position:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get all job positions for a business
router.get('/positions', (req, res) => {
  try {
    const businessId = req.query.businessId ? parseInt(req.query.businessId as string) : undefined;
    const status = req.query.status as string | undefined;
    
    let filtered = [...jobPositions];
    
    if (businessId) {
      filtered = filtered.filter(job => job.businessId === businessId);
    }
    
    if (status && status !== 'all') {
      filtered = filtered.filter(job => job.status === status);
    }
    
    res.json(filtered);
  } catch (error) {
    console.error('Error getting job positions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific job position
router.get('/positions/:id', (req, res) => {
  try {
    const jobId = req.params.id;
    const job = jobPositions.find(j => j.id === jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job position not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error getting job position:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a job position
router.patch('/positions/:id', (req, res) => {
  try {
    const jobId = req.params.id;
    const jobIndex = jobPositions.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job position not found' });
    }
    
    // Allow partial updates
    const updateData = jobPositionSchema.partial().parse(req.body);
    
    // Handle status changes that affect publishedDate
    if (updateData.status === 'published' && jobPositions[jobIndex].status !== 'published') {
      updateData.publishedDate = new Date().toISOString().split('T')[0];
    }
    
    jobPositions[jobIndex] = {
      ...jobPositions[jobIndex],
      ...updateData
    };
    
    res.json(jobPositions[jobIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error updating job position:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete a job position
router.delete('/positions/:id', (req, res) => {
  try {
    const jobId = req.params.id;
    const jobIndex = jobPositions.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job position not found' });
    }
    
    jobPositions.splice(jobIndex, 1);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting job position:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Candidate routes
router.post('/candidates', (req, res) => {
  try {
    const candidateData = candidateSchema.parse(req.body);
    
    const newCandidate = {
      id: `cand-${Date.now()}`,
      ...candidateData,
      applied: new Date().toISOString().split('T')[0]
    };
    
    candidates.push(newCandidate);
    
    // Update job application counts if this is for a specific job
    if (candidateData.jobId) {
      const jobIndex = jobPositions.findIndex(j => j.id === candidateData.jobId);
      if (jobIndex !== -1) {
        jobPositions[jobIndex].applications = (jobPositions[jobIndex].applications || 0) + 1;
        
        if (candidateData.isDeafOrHoh) {
          jobPositions[jobIndex].deafApplicants = (jobPositions[jobIndex].deafApplicants || 0) + 1;
        } else {
          jobPositions[jobIndex].heardApplicants = (jobPositions[jobIndex].heardApplicants || 0) + 1;
        }
      }
    }
    
    res.status(201).json(newCandidate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error creating candidate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get all candidates for a business
router.get('/candidates', (req, res) => {
  try {
    const businessId = req.query.businessId ? parseInt(req.query.businessId as string) : undefined;
    const jobId = req.query.jobId as string | undefined;
    const status = req.query.status as string | undefined;
    
    let filtered = [...candidates];
    
    if (businessId) {
      filtered = filtered.filter(candidate => candidate.businessId === businessId);
    }
    
    if (jobId) {
      filtered = filtered.filter(candidate => candidate.jobId === jobId);
    }
    
    if (status) {
      filtered = filtered.filter(candidate => candidate.status === status);
    }
    
    res.json(filtered);
  } catch (error) {
    console.error('Error getting candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific candidate
router.get('/candidates/:id', (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error('Error getting candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a candidate
router.patch('/candidates/:id', (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidateIndex = candidates.findIndex(c => c.id === candidateId);
    
    if (candidateIndex === -1) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Allow partial updates
    const updateData = candidateSchema.partial().parse(req.body);
    
    candidates[candidateIndex] = {
      ...candidates[candidateIndex],
      ...updateData
    };
    
    res.json(candidates[candidateIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error updating candidate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Job Template endpoints
router.get('/templates', (req, res) => {
  // Return predefined job templates
  const templates = [
    {
      id: 'template-1',
      title: 'Frontend Developer',
      category: 'engineering',
      description: 'A complete job description for a Frontend Developer role with accessibility considerations built-in',
      features: ['Skills assessment', 'Accessibility requirements', 'Modern tech stack', 'Remote-friendly'],
      deaf_friendly: true
    },
    {
      id: 'template-2',
      title: 'UI/UX Designer',
      category: 'design',
      description: 'A comprehensive job description for a UI/UX Designer with focus on inclusive design practices',
      features: ['Portfolio requirements', 'Accessibility knowledge', 'User testing experience', 'Inclusive design'],
      deaf_friendly: true
    },
    {
      id: 'template-3',
      title: 'Backend Developer',
      category: 'engineering',
      description: 'A detailed job description for a Backend Developer role with clear expectations',
      features: ['Technical requirements', 'API development', 'Database experience', 'Performance optimization'],
      deaf_friendly: true
    },
    // Add more templates as needed
  ];
  
  res.json(templates);
});

router.get('/templates/:id', (req, res) => {
  // This would normally fetch a specific template from the database
  // For simplicity, we'll return a mockup
  const templateId = req.params.id;
  
  const templates = {
    'template-1': {
      id: 'template-1',
      title: 'Frontend Developer',
      category: 'engineering',
      responsibilities: [
        'Build user interfaces using React and TypeScript',
        'Collaborate with designers to implement visual components',
        'Ensure responsive design across all devices',
        'Implement accessibility features for users with disabilities',
        'Write clean, maintainable code'
      ],
      qualifications: [
        '2+ years of experience with React',
        'Strong TypeScript skills',
        'Experience with modern CSS practices',
        'Knowledge of accessibility standards (WCAG)',
        'Portfolio of previous work'
      ],
      skills: ['React', 'TypeScript', 'CSS', 'HTML', 'Accessibility', 'Responsive Design'],
      deaf_friendly: true,
      deaf_friendly_features: [
        'Video application acceptance',
        'ASL interpreter for interviews',
        'Text-based alternatives for audio content',
        'Flexible communication options'
      ]
    },
    'template-2': {
      id: 'template-2',
      title: 'UI/UX Designer',
      category: 'design',
      responsibilities: [
        'Create user-centered designs for our products',
        'Conduct user research and usability testing',
        'Develop wireframes, prototypes, and high-fidelity mockups',
        'Work closely with developers to implement designs',
        'Ensure accessibility is incorporated into all designs'
      ],
      qualifications: [
        '3+ years of product design experience',
        'Strong portfolio demonstrating UX process',
        'Experience with Figma or similar tools',
        'Knowledge of accessibility standards',
        'Understanding of inclusive design principles'
      ],
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Accessibility', 'Inclusive Design'],
      deaf_friendly: true,
      deaf_friendly_features: [
        'Video application acceptance',
        'ASL interpreter for interviews',
        'Visual-first communication approach',
        'Flexible collaboration methods'
      ]
    }
  };
  
  const template = templates[templateId as keyof typeof templates];
  
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  res.json(template);
});

// Hiring Analytics endpoints
router.get('/analytics', (req, res) => {
  const businessId = req.query.businessId ? parseInt(req.query.businessId as string) : undefined;
  
  // This would normally be calculated from real data in the database
  // For simplicity, we'll return mockup analytics data
  const analytics = {
    timeToHire: 18, // days
    applicationMetrics: {
      totalApplications: 53,
      screened: 32,
      interviewed: 18,
      offered: 4,
      hired: 3
    },
    diversityMetrics: {
      deaf: 38, // percentage
      hearing: 62 // percentage
    },
    stageMetrics: {
      application: {
        deaf: 68, // percentage pass rate
        hearing: 62 // percentage pass rate
      },
      interview: {
        deaf: 85, // percentage pass rate
        hearing: 82 // percentage pass rate
      },
      offer: {
        deaf: 92, // percentage acceptance rate
        hearing: 85 // percentage acceptance rate
      }
    },
    insights: [
      {
        id: 'insight-1',
        category: 'efficiency',
        title: 'Interview Optimization',
        description: 'Technical interviews are 35% longer than industry average without better outcomes. Consider shortening and focusing on key skills assessment.',
        impact: 'medium'
      },
      {
        id: 'insight-2',
        category: 'diversity',
        title: 'Deaf Candidate Success',
        description: 'PinkSync-enabled process has resulted in a 12% higher success rate for deaf candidates in technical assessments.',
        impact: 'high'
      },
      {
        id: 'insight-3',
        category: 'bottleneck',
        title: 'Design Role Dropoff',
        description: 'Significant dropoff (42%) between first and second interviews for design positions. Consider standardizing portfolio reviews.',
        impact: 'high'
      }
    ]
  };
  
  res.json(analytics);
});

// PinkSync Interpreter Request endpoints
router.post('/interpreter-requests', (req, res) => {
  try {
    const requestSchema = z.object({
      type: z.enum(['job-interview', 'training', 'meeting', 'onboarding', 'performance-review']),
      date: z.string(),
      duration: z.string(),
      company: z.string(),
      location: z.string(),
      isRemote: z.boolean(),
      notes: z.string().optional(),
      businessId: z.number(),
      userId: z.number(),
      candidateId: z.string().optional(),
      jobId: z.string().optional()
    });
    
    const requestData = requestSchema.parse(req.body);
    
    const newRequest = {
      id: `int-${Date.now()}`,
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // In a real implementation, this would be saved to the database
    
    res.status(201).json(newRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error creating interpreter request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;