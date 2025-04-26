/**
 * Ultra minimal Node.js express server - with HTMX Support
 * Plain JavaScript to eliminate any transpilation memory overhead
 */

import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

// Set up __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set up template engine for HTML rendering
app.set('view engine', 'html');
app.engine('html', (filePath, options, callback) => {
  const renderFile = (err, content) => {
    if (err) return callback(err);
    
    // Replace placeholders with actual values
    let renderedContent = content;
    if (options) {
      Object.keys(options).forEach(key => {
        if (key !== 'settings' && key !== '_locals' && key !== 'cache') {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          renderedContent = renderedContent.replace(regex, options[key]);
        }
      });
    }
    
    return callback(null, renderedContent);
  };
  
  // Read the file
  fs.readFile(filePath, 'utf8', renderFile);
});

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../public')));

// Define directories without creating them for stateless operations
const publicDir = path.join(__dirname, '../public');
const viewsDir = path.join(__dirname, '../views');

// Basic health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'ultra-minimal' });
});

// Basic API placeholder
app.get('/api/ecosystem/services', (req, res) => {
  res.json({
    services: [
      {
        id: 'business',
        name: 'Business Magician', 
        description: 'Start or grow your business with expert guidance'
      },
      {
        id: 'job',
        name: 'Job Magician', 
        description: 'Find employment and advance your career'
      },
      {
        id: 'vr4deaf',
        name: 'VR4Deaf', 
        description: 'Specialized vocational rehabilitation services',
        isPilot: true
      }
    ]
  });
});

// Business Pathway API endpoints
app.get('/api/business/pathway', (req, res) => {
  res.json({
    id: 'business-pathway',
    name: 'Business Pathway',
    description: 'Complete journey for deaf entrepreneurs',
    phases: [
      {
        id: 'idea',
        name: 'Idea Phase',
        description: 'Generate and validate business ideas',
        slug: 'idea',
        order: 1
      },
      {
        id: 'build',
        name: 'Build Phase',
        description: 'Form your business and establish operations',
        slug: 'build',
        order: 2
      },
      {
        id: 'grow',
        name: 'Grow Phase',
        description: 'Market and expand your business',
        slug: 'grow',
        order: 3
      },
      {
        id: 'manage',
        name: 'Manage Phase',
        description: 'Maintain and optimize your operations',
        slug: 'manage',
        order: 4
      }
    ]
  });
});

// Business Formation API endpoints
app.get('/api/business/formation/entity-types', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'llc', name: 'Limited Liability Company (LLC)' },
      { id: 'c-corp', name: 'C-Corporation' },
      { id: 's-corp', name: 'S-Corporation' },
      { id: 'sole-prop', name: 'Sole Proprietorship' },
      { id: 'nonprofit', name: 'Nonprofit Organization' }
    ]
  });
});

app.get('/api/business/formation/states', (req, res) => {
  res.json({
    success: true,
    data: [
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
      { code: 'WY', name: 'Wyoming' }
    ]
  });
});

// Business Idea Generation endpoints
app.get('/api/business/idea/generator', (req, res) => {
  res.json({
    success: true,
    data: {
      interests: [
        { id: 'technology', name: 'Technology' },
        { id: 'health', name: 'Health & Wellness' },
        { id: 'education', name: 'Education' },
        { id: 'food', name: 'Food & Beverage' },
        { id: 'retail', name: 'Retail' },
        { id: 'services', name: 'Professional Services' },
        { id: 'creative', name: 'Creative Arts' },
        { id: 'manufacturing', name: 'Manufacturing' },
        { id: 'finance', name: 'Finance' },
        { id: 'hospitality', name: 'Hospitality & Tourism' },
        { id: 'accessibility', name: 'Accessibility & Inclusion' }
      ],
      skillLevels: [
        { id: 'beginner', name: 'Beginner' },
        { id: 'intermediate', name: 'Intermediate' },
        { id: 'advanced', name: 'Advanced' },
        { id: 'expert', name: 'Expert' }
      ],
      fundingOptions: [
        { id: 'self', name: 'Self-funded' },
        { id: 'small', name: 'Small budget (<$10k)' },
        { id: 'medium', name: 'Medium budget ($10k-$50k)' },
        { id: 'large', name: 'Large budget (>$50k)' },
        { id: 'investor', name: 'Seeking investors' }
      ]
    }
  });
});

app.post('/api/business/idea/generate', (req, res) => {
  const { interests, skillLevel, fundingOption } = req.body;
  
  // Sample generated business ideas
  const businessIdeas = [
    {
      id: 1,
      title: "ASL Training Platform",
      description: "An online platform that provides ASL training courses for businesses looking to improve accessibility for deaf customers and employees.",
      marketPotential: "High",
      initialInvestment: "$5,000 - $20,000",
      profitabilityTimeline: "12-18 months",
      category: "education",
      skills: ["web development", "video production", "ASL fluency"],
      deafOwnershipAdvantage: "Authentic content creation and cultural understanding"
    },
    {
      id: 2,
      title: "Accessibility Consulting Firm",
      description: "A consulting firm that helps businesses make their products, services, and workplaces more accessible to deaf and hard-of-hearing individuals.",
      marketPotential: "Medium",
      initialInvestment: "$1,000 - $5,000",
      profitabilityTimeline: "6-12 months",
      category: "services",
      skills: ["accessibility knowledge", "communication", "business analysis"],
      deafOwnershipAdvantage: "Firsthand experience with accessibility challenges"
    },
    {
      id: 3,
      title: "Visual Notification System",
      description: "Develop and sell visual notification systems for homes and businesses that convert auditory alerts to visual cues.",
      marketPotential: "High",
      initialInvestment: "$15,000 - $50,000",
      profitabilityTimeline: "18-24 months",
      category: "technology",
      skills: ["hardware development", "software development", "design"],
      deafOwnershipAdvantage: "Deep understanding of user needs and practical solutions"
    }
  ];
  
  res.json({
    success: true,
    data: businessIdeas
  });
});

app.get('/api/business/idea/resources', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: "ASL Business Glossary",
        description: "Access common business terminology in American Sign Language with visual examples.",
        category: "education",
        type: "video",
        url: "/resources/asl-business-glossary"
      },
      {
        id: 2,
        title: "Market Research Guide for Deaf Entrepreneurs",
        description: "Learn how to conduct market research with deaf-friendly methodologies and tools.",
        category: "research",
        type: "guide",
        url: "/resources/market-research-guide"
      },
      {
        id: 3,
        title: "Business Plan Template",
        description: "A comprehensive business plan template with visual aids and ASL video explanations.",
        category: "planning",
        type: "template",
        url: "/resources/business-plan-template"
      },
      {
        id: 4,
        title: "Deaf Entrepreneur Success Stories",
        description: "Inspiring stories of successful deaf-owned businesses and their journeys.",
        category: "motivation",
        type: "article",
        url: "/resources/deaf-entrepreneur-stories"
      }
    ]
  });
});

// EntrepreneursOS API endpoints
app.get('/api/entrepreneurs-os/ai-hub', (req, res) => {
  res.json({
    success: true,
    data: {
      aiTools: [
        {
          id: 'business-idea-generator',
          name: 'Business Idea Generator',
          description: 'AI-powered tool to generate innovative business ideas based on your interests and market gaps.',
          category: 'idea',
          usageCount: 1254,
          popularity: 4.8
        },
        {
          id: 'market-research-assistant',
          name: 'Market Research Assistant',
          description: 'Automate market research with AI-powered data analysis and competitor insights.',
          category: 'idea',
          usageCount: 982,
          popularity: 4.6
        },
        {
          id: 'business-plan-creator',
          name: 'Business Plan Creator',
          description: 'Create comprehensive business plans with AI guidance and templates.',
          category: 'build',
          usageCount: 1432,
          popularity: 4.7
        },
        {
          id: 'financial-projections',
          name: 'Financial Projections AI',
          description: 'Generate realistic financial projections with AI-powered analysis and modeling.',
          category: 'build',
          usageCount: 876,
          popularity: 4.5
        },
        {
          id: 'marketing-campaign-creator',
          name: 'Marketing Campaign Creator',
          description: 'Design effective marketing campaigns with AI-generated content and strategies.',
          category: 'grow',
          usageCount: 1156,
          popularity: 4.9
        },
        {
          id: 'business-analytics',
          name: 'Business Analytics Engine',
          description: 'Analyze business performance with AI-powered insights and recommendations.',
          category: 'manage',
          usageCount: 943,
          popularity: 4.7
        }
      ]
    }
  });
});

app.get('/api/entrepreneurs-os/partners', (req, res) => {
  res.json({
    success: true,
    data: {
      featuredPartners: [
        {
          id: 'legalshield',
          name: 'LegalShield',
          description: 'Legal services with ASL support for deaf entrepreneurs.',
          category: 'legal',
          partnerSince: '2023-01-15',
          serviceType: 'legal',
          logo: '/static/images/partners/legalshield.png'
        },
        {
          id: 'mbtq-tax',
          name: 'MBTQ Tax',
          description: 'Tax and accounting services for deaf business owners.',
          category: 'financial',
          partnerSince: '2023-03-10',
          serviceType: 'tax',
          logo: '/static/images/partners/mbtq-tax.png'
        },
        {
          id: 'ionos',
          name: 'IONOS Hosting',
          description: 'Web hosting and domain services with accessibility focus.',
          category: 'technology',
          partnerSince: '2023-02-05',
          serviceType: 'hosting',
          logo: '/static/images/partners/ionos.png'
        },
        {
          id: 'mux',
          name: 'MUX Video',
          description: 'Video streaming and ASL translation services.',
          category: 'technology',
          partnerSince: '2023-04-20',
          serviceType: 'video',
          logo: '/static/images/partners/mux.png'
        }
      ],
      categories: [
        { id: 'legal', name: 'Business Formation & Legal', count: 5 },
        { id: 'financial', name: 'Financial Services', count: 7 },
        { id: 'technology', name: 'Technology Services', count: 10 },
        { id: 'marketing', name: 'Marketing & Design', count: 6 },
        { id: 'hr', name: 'Human Resources', count: 4 },
        { id: 'operations', name: 'Business Operations', count: 8 }
      ]
    }
  });
});

// Northwest Agent API endpoint
app.get('/api/entrepreneurs-os/northwest-agent', (req, res) => {
  res.json({
    success: true,
    data: {
      agentId: 'northwest-ai',
      name: 'Northwest Agent',
      description: 'Advanced AI agent that learns your business needs and automates complex processes.',
      status: 'active',
      integrations: [
        { id: 'legalshield', name: 'LegalShield', status: 'connected' },
        { id: 'mbtq-tax', name: 'MBTQ Tax', status: 'connected' },
        { id: 'ionos', name: 'IONOS Hosting', status: 'available' },
        { id: 'mux', name: 'MUX Video', status: 'available' }
      ],
      capabilities: [
        'Document generation and processing',
        'Business task automation',
        'Service integration management',
        'Financial data analysis',
        'ASL translation coordination'
      ]
    }
  });
});

// Basic profile routes
app.get('/api/profile', (req, res) => {
  res.json({
    id: 1,
    username: 'entrepreneur1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    isDeaf: true,
    bio: 'Deaf entrepreneur working on my first tech startup. Focused on accessibility solutions.',
    location: 'Portland, OR',
    company: 'AccessFirst',
    website: 'https://accessfirst.example.com',
    avatarUrl: '',
    joinedDate: '2023-06-15',
    businessPhase: 'idea', // idea, build, grow, manage
    entrepreneursOSEnabled: true
  });
});

app.get('/api/profile/:username', (req, res) => {
  const { username } = req.params;
  res.json({
    id: 1,
    username,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    isDeaf: true,
    bio: 'Deaf entrepreneur working on my first tech startup. Focused on accessibility solutions.',
    location: 'Portland, OR',
    company: 'AccessFirst',
    website: 'https://accessfirst.example.com',
    avatarUrl: '',
    joinedDate: '2023-06-15',
    businessPhase: 'idea'
  });
});

// Leadership resources endpoints
app.get('/api/resources/leadership', (req, res) => {
  res.json({
    categories: [
      { id: 'leadership', name: 'Leadership', count: 12 },
      { id: 'management', name: 'Engineering Management', count: 8 },
      { id: 'hiring', name: 'Hiring & Team Building', count: 5 },
      { id: 'architecture', name: 'Technical Architecture', count: 7 },
      { id: 'security', name: 'Security & Compliance', count: 4 },
      { id: 'ai', name: 'AI & ML Resources', count: 6 },
      { id: 'growth', name: 'Growth & Scaling', count: 9 },
    ],
    featuredResources: [
      {
        id: 1,
        title: 'The CTO Handbook',
        url: 'https://github.com/kuchin/awesome-cto',
        description: 'A comprehensive collection of resources for CTOs, organized by topic.',
        category: 'leadership',
        hasASL: true,
      },
      {
        id: 4,
        title: 'The Startup CTO\'s Handbook',
        url: 'https://github.com/ZachGoldberg/Startup-CTO-Handbook',
        description: 'A comprehensive resource for technical founders and CTOs of startups.',
        category: 'leadership',
        hasASL: true,
      },
      {
        id: 7,
        title: 'Accessible AI Implementation',
        url: 'https://github.com/collections/ai-model-development',
        description: 'AI resources with a focus on accessibility and inclusive design.',
        category: 'ai',
        hasASL: true,
      }
    ]
  });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// HTMX routes for the web interface
app.get('/', (req, res) => {
  res.render(path.join(__dirname, '../views/layout.html'), { 
    title: 'Home',
    pageTitle: 'Welcome to 360 Business Magician',
    content: '<h1 class="text-2xl font-bold mb-4">Welcome to 360 Business Magician</h1><p>Your all-in-one platform for deaf entrepreneurs.</p>'
  });
});

// Collaboration routes - Main collaboration page
app.get('/collaboration', (req, res) => {
  try {
    const collaborationHtml = fs.readFileSync(path.join(__dirname, '../views/collaboration.html'), 'utf8');
    
    if (req.headers['hx-request']) {
      // If it's an HTMX request, just send the content
      res.send(collaborationHtml);
    } else {
      // If it's a full page request, wrap in layout
      try {
        const layoutHtml = fs.readFileSync(path.join(__dirname, '../views/layout.html'), 'utf8');
        res.send(layoutHtml.replace('{{content}}', collaborationHtml)
                        .replace('{{title}}', 'Team Collaboration')
                        .replace('{{pageTitle}}', 'Team Collaboration'));
      } catch (error) {
        console.error('Error loading layout:', error);
        res.send(collaborationHtml);
      }
    }
  } catch (error) {
    console.error('Error loading collaboration page:', error);
    res.status(500).send('Error loading page');
  }
});

// Video call page
app.get('/collaboration/video-meeting', (req, res) => {
  try {
    const videoMeetingHtml = fs.readFileSync(path.join(__dirname, '../views/video-meeting.html'), 'utf8');
    res.send(videoMeetingHtml);
  } catch (error) {
    console.error('Error loading video meeting page:', error);
    res.status(500).send('Error loading video meeting page');
  }
});

// Team chat page
app.get('/collaboration/chat', (req, res) => {
  try {
    const teamChatHtml = fs.readFileSync(path.join(__dirname, '../views/team-chat.html'), 'utf8');
    res.send(teamChatHtml);
  } catch (error) {
    console.error('Error loading team chat page:', error);
    res.status(500).send('Error loading team chat page');
  }
});

// Document sharing page
app.get('/collaboration/documents', (req, res) => {
  try {
    const documentSharingHtml = fs.readFileSync(path.join(__dirname, '../views/document-sharing.html'), 'utf8');
    res.send(documentSharingHtml);
  } catch (error) {
    console.error('Error loading document sharing page:', error);
    res.status(500).send('Error loading document sharing page');
  }
});

// Task management page
app.get('/collaboration/tasks', (req, res) => {
  try {
    const taskManagementHtml = fs.readFileSync(path.join(__dirname, '../views/task-management.html'), 'utf8');
    res.send(taskManagementHtml);
  } catch (error) {
    console.error('Error loading task management page:', error);
    res.status(500).send('Error loading task management page');
  }
});

// EntrepreneursOS AI Hub
app.get('/entrepreneurs-os/ai-hub', (req, res) => {
  try {
    const aiHubHtml = fs.readFileSync(path.join(__dirname, '../views/entrepreneurs-os-ai-hub.html'), 'utf8');
    
    if (req.headers['hx-request']) {
      // If it's an HTMX request, just send the content
      res.send(aiHubHtml);
    } else {
      // If it's a full page request, wrap in layout
      try {
        const layoutHtml = fs.readFileSync(path.join(__dirname, '../views/layout.html'), 'utf8');
        res.send(layoutHtml.replace('{{content}}', aiHubHtml)
                        .replace('{{title}}', 'EntrepreneursOS AI Hub')
                        .replace('{{pageTitle}}', 'EntrepreneursOS AI Hub'));
      } catch (error) {
        console.error('Error loading layout:', error);
        res.send(aiHubHtml);
      }
    }
  } catch (error) {
    console.error('Error loading AI Hub page:', error);
    res.status(500).send('Error loading page');
  }
});

// EntrepreneursOS Partners
app.get('/entrepreneurs-os/partners', (req, res) => {
  try {
    const partnersHtml = fs.readFileSync(path.join(__dirname, '../views/entrepreneurs-os-partners.html'), 'utf8');
    
    if (req.headers['hx-request']) {
      // If it's an HTMX request, just send the content
      res.send(partnersHtml);
    } else {
      // If it's a full page request, wrap in layout
      try {
        const layoutHtml = fs.readFileSync(path.join(__dirname, '../views/layout.html'), 'utf8');
        res.send(layoutHtml.replace('{{content}}', partnersHtml)
                        .replace('{{title}}', 'EntrepreneursOS Partners Ecosystem')
                        .replace('{{pageTitle}}', 'EntrepreneursOS Partners Ecosystem'));
      } catch (error) {
        console.error('Error loading layout:', error);
        res.send(partnersHtml);
      }
    }
  } catch (error) {
    console.error('Error loading Partners page:', error);
    res.status(500).send('Error loading page');
  }
});

// Admin Dashboard Routes
// Main Admin Dashboard
app.get('/admin', (req, res) => {
  try {
    const adminDashboardHtml = fs.readFileSync(path.join(__dirname, '../views/admin-dashboard.html'), 'utf8');
    res.send(adminDashboardHtml);
  } catch (error) {
    console.error('Error loading admin dashboard page:', error);
    res.status(500).send('Error loading admin dashboard page');
  }
});

// Admin Dashboard Home Content
app.get('/admin/dashboard', (req, res) => {
  try {
    // This route is for HTMX to load the dashboard content into the main content area
    // It returns just the dashboard content part, not the full page
    const adminDashboardHtml = fs.readFileSync(path.join(__dirname, '../views/admin-dashboard.html'), 'utf8');
    
    // Extract just the main content part using a basic method
    const mainContentMatch = adminDashboardHtml.match(/<main class="p-6" id="main-content">([\s\S]*?)<\/main>/);
    const mainContent = mainContentMatch ? mainContentMatch[1] : 'Dashboard content not found';
    
    res.send(mainContent);
  } catch (error) {
    console.error('Error loading admin dashboard content:', error);
    res.status(500).send('Error loading admin dashboard content');
  }
});

// Admin Partners Management
app.get('/admin/partners', (req, res) => {
  try {
    const partnersHtml = fs.readFileSync(path.join(__dirname, '../views/admin-partners.html'), 'utf8');
    res.send(partnersHtml);
  } catch (error) {
    console.error('Error loading admin partners page:', error);
    res.status(500).send('Error loading admin partners page');
  }
});

// Admin Add New Partner Form
app.get('/admin/partners/new', (req, res) => {
  try {
    const newPartnerHtml = fs.readFileSync(path.join(__dirname, '../views/admin-partners-new.html'), 'utf8');
    res.send(newPartnerHtml);
  } catch (error) {
    console.error('Error loading new partner form:', error);
    res.status(500).send('Error loading new partner form');
  }
});

// Admin Content Library
app.get('/admin/content', (req, res) => {
  try {
    const contentHtml = fs.readFileSync(path.join(__dirname, '../views/admin-content.html'), 'utf8');
    res.send(contentHtml);
  } catch (error) {
    console.error('Error loading content library page:', error);
    res.status(500).send('Error loading content library page');
  }
});

// Admin Content Upload Form
app.get('/admin/content/upload', (req, res) => {
  try {
    const contentUploadHtml = fs.readFileSync(path.join(__dirname, '../views/admin-content-upload.html'), 'utf8');
    res.send(contentUploadHtml);
  } catch (error) {
    console.error('Error loading content upload form:', error);
    res.status(500).send('Error loading content upload form');
  }
});

// Admin Social Media Generator
app.get('/admin/social-media', (req, res) => {
  try {
    const socialMediaHtml = fs.readFileSync(path.join(__dirname, '../views/admin-social-media.html'), 'utf8');
    res.send(socialMediaHtml);
  } catch (error) {
    console.error('Error loading social media generator page:', error);
    res.status(500).send('Error loading social media generator page');
  }
});

// Admin ASL Videos Management
app.get('/admin/asl-videos', (req, res) => {
  try {
    const aslVideosHtml = fs.readFileSync(path.join(__dirname, '../views/admin-asl-videos.html'), 'utf8');
    res.send(aslVideosHtml);
  } catch (error) {
    console.error('Error loading ASL videos page:', error);
    res.status(500).send('Error loading ASL videos page');
  }
});

// Admin ASL Videos Upload Form
app.get('/admin/asl-videos/upload', (req, res) => {
  try {
    const aslVideosUploadHtml = fs.readFileSync(path.join(__dirname, '../views/admin-asl-videos-upload.html'), 'utf8');
    res.send(aslVideosUploadHtml);
  } catch (error) {
    console.error('Error loading ASL videos upload form:', error);
    res.status(500).send('Error loading ASL videos upload form');
  }
});

// Team Collaboration Hub Page
app.get('/collaboration', (req, res) => {
  try {
    const collaborationHtml = fs.readFileSync(path.join(__dirname, '../views/team-collaboration.html'), 'utf8');
    res.send(collaborationHtml);
  } catch (error) {
    console.error('Error loading team collaboration page:', error);
    res.status(500).send('Error loading team collaboration page');
  }
});

// Video Meeting Page
app.get('/collaboration/video', (req, res) => {
  try {
    const videoMeetingHtml = fs.readFileSync(path.join(__dirname, '../views/video-meeting.html'), 'utf8');
    res.send(videoMeetingHtml);
  } catch (error) {
    console.error('Error loading video meeting page:', error);
    res.status(500).send('Error loading video meeting page');
  }
});

// Team Chat Page
app.get('/collaboration/chat', (req, res) => {
  try {
    // If chat.html doesn't exist yet, fall back to team-collaboration.html
    let chatHtml;
    try {
      chatHtml = fs.readFileSync(path.join(__dirname, '../views/chat.html'), 'utf8');
    } catch {
      chatHtml = fs.readFileSync(path.join(__dirname, '../views/team-collaboration.html'), 'utf8');
    }
    res.send(chatHtml);
  } catch (error) {
    console.error('Error loading team chat page:', error);
    res.status(500).send('Error loading team chat page');
  }
});

// Documents Collaboration Page
app.get('/collaboration/documents', (req, res) => {
  try {
    // If documents.html doesn't exist yet, fall back to team-collaboration.html
    let documentsHtml;
    try {
      documentsHtml = fs.readFileSync(path.join(__dirname, '../views/documents.html'), 'utf8');
    } catch {
      documentsHtml = fs.readFileSync(path.join(__dirname, '../views/team-collaboration.html'), 'utf8');
    }
    res.send(documentsHtml);
  } catch (error) {
    console.error('Error loading documents collaboration page:', error);
    res.status(500).send('Error loading documents collaboration page');
  }
});

// Task Management Page
app.get('/collaboration/tasks', (req, res) => {
  try {
    // If tasks.html doesn't exist yet, fall back to team-collaboration.html
    let tasksHtml;
    try {
      tasksHtml = fs.readFileSync(path.join(__dirname, '../views/tasks.html'), 'utf8');
    } catch {
      tasksHtml = fs.readFileSync(path.join(__dirname, '../views/team-collaboration.html'), 'utf8');
    }
    res.send(tasksHtml);
  } catch (error) {
    console.error('Error loading task management page:', error);
    res.status(500).send('Error loading task management page');
  }
});

// Team Status Page
app.get('/collaboration/team', (req, res) => {
  try {
    // If team-status.html doesn't exist yet, fall back to team-collaboration.html
    let teamStatusHtml;
    try {
      teamStatusHtml = fs.readFileSync(path.join(__dirname, '../views/team-status.html'), 'utf8');
    } catch {
      teamStatusHtml = fs.readFileSync(path.join(__dirname, '../views/team-collaboration.html'), 'utf8');
    }
    res.send(teamStatusHtml);
  } catch (error) {
    console.error('Error loading team status page:', error);
    res.status(500).send('Error loading team status page');
  }
});

// ASL Support Features Page
app.get('/collaboration/asl-support', (req, res) => {
  try {
    // If asl-support.html doesn't exist yet, fall back to team-collaboration.html
    let aslSupportHtml;
    try {
      aslSupportHtml = fs.readFileSync(path.join(__dirname, '../views/asl-support.html'), 'utf8');
    } catch {
      aslSupportHtml = fs.readFileSync(path.join(__dirname, '../views/team-collaboration.html'), 'utf8');
    }
    res.send(aslSupportHtml);
  } catch (error) {
    console.error('Error loading ASL support features page:', error);
    res.status(500).send('Error loading ASL support features page');
  }
});

// Admin API Endpoints
// Add Partner API
app.post('/api/admin/partners', (req, res) => {
  // In a real app, this would save the partner to the database
  // For now, just simulate a successful response
  console.log('New partner data:', req.body);
  
  // Redirect back to the partners page
  res.redirect(303, '/admin/partners');
});

// Generate Social Media Content API
app.post('/api/admin/social-media/generate', (req, res) => {
  // In a real app, this would call an AI service to generate content
  // For now, simulate a response with generated content
  console.log('Social media generation request:', req.body);
  
  const generatedContent = `
    <div class="space-y-6">
      <div>
        <h4 class="text-lg font-medium text-gray-900 mb-2">Generated ${req.body.contentType || 'Content'}</h4>
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-sm text-gray-800">${req.body.contentTopic ? `<strong>Topic:</strong> ${req.body.contentTopic}<br><br>` : ''}
          Here's your generated content related to ${req.body.contentTopic || 'the requested topic'}. This content has been optimized for ${req.body.platforms ? req.body.platforms.join(', ') : 'social media'} with a ${req.body.tone || 'professional'} tone.
          <br><br>
          # ${req.body.contentTopic || 'Sample Topic'}<br>
          Did you know that deaf entrepreneurs face unique challenges and opportunities in the business world? At 360 Business Magician, we provide specialized tools and resources to help deaf business owners thrive!<br><br>
          ${req.body.cta ? `<strong>Call to Action:</strong> ${req.body.cta}` : 'Learn more at our website!'}</p>
        </div>
      </div>
      
      <div class="flex justify-between">
        <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="mr-2 -ml-1 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          Edit
        </button>
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          Save to Calendar
        </button>
      </div>
    </div>
  `;
  
  res.send(generatedContent);
});

// Upload Content API
app.post('/api/admin/content/upload', (req, res) => {
  // In a real app, this would save the content to storage and add to database
  // For now, just simulate a successful response
  console.log('Content upload request:', req.body);
  
  // Redirect back to the content library
  setTimeout(() => {
    res.redirect(303, '/admin/content');
  }, 1000); // Small delay to simulate upload
});

// Upload ASL Video API
app.post('/api/admin/asl-videos/upload', (req, res) => {
  // In a real app, this would process and store the video file
  // For now, just simulate a successful response
  console.log('ASL video upload request:', req.body);
  
  // Redirect back to the ASL videos page
  setTimeout(() => {
    res.redirect(303, '/admin/asl-videos');
  }, 1500); // Small delay to simulate video processing
});

// Chat typing indicator
app.post('/collaboration/chat/typing', (req, res) => {
  // In a real app, this would notify other users via WebSocket
  res.send("");
});

// Send message endpoint
app.post('/collaboration/chat/send', (req, res) => {
  // In a real app, this would save the message and broadcast to other users
  console.log('Message sent:', req.body.message);
  res.send("");
});

// Toggle audio/video in meetings
app.post('/collaboration/toggle-audio', (req, res) => {
  res.send("");
});

app.post('/collaboration/toggle-video', (req, res) => {
  res.send("");
});

// Additional collaboration endpoints for deaf-accessible features
app.post('/collaboration/caption', (req, res) => {
  // In a real app, this would be the endpoint to create captions
  // for a video meeting or content, potentially using AI services
  console.log('Caption request:', req.body);
  res.send("");
});

app.post('/collaboration/request-interpreter', (req, res) => {
  // In a real app, this would schedule/request an ASL interpreter
  console.log('Interpreter request:', req.body);
  res.send("");
});

app.post('/collaboration/visual-notification', (req, res) => {
  // In a real app, this would trigger visual notifications for all users
  console.log('Visual notification request:', req.body);
  res.send("");
});

app.post('/collaboration/reaction', (req, res) => {
  // In a real app, this would broadcast reactions to all users
  console.log('Reaction:', req.body);
  res.send("");
});

// Start the HTTP server
const port = parseInt(process.env.PORT || "5000", 10);
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected');
  
  // Determine which WebSocket endpoint was requested
  const url = new URL(req.url, 'http://localhost');
  const endpoint = url.pathname.replace('/ws/', '');
  
  // Add connection to the appropriate group
  ws.endpoint = endpoint;
  
  // Send a welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: `Connected to ${endpoint} endpoint`,
    timestamp: new Date().toISOString()
  }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Received message from ${endpoint}:`, data);
      
      // Broadcast to all clients connected to this endpoint
      wss.clients.forEach((client) => {
        if (client.endpoint === endpoint && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'message',
            data: data,
            sender: 'user', // In a real app, this would be the authenticated user
            timestamp: new Date().toISOString()
          }));
        }
      });
    } catch (e) {
      console.error('Error processing WebSocket message:', e);
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  // For team chat, simulate user typing and new messages with accessibility features
  if (endpoint === 'chat') {
    // Simulate user typing after 2 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'typing',
        user: 'Sarah Chen',
        isTyping: true,
        timestamp: new Date().toISOString()
      }));
    }, 2000);
    
    // Simulate new message after 5 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'message',
        data: {
          id: Date.now(),
          text: "Let's schedule that meeting for tomorrow at 10:00 AM. Does that work for everyone?",
          sender: {
            id: 2,
            name: 'Sarah Chen',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff'
          },
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }));
    }, 5000);
    
    // Send visual notification for new message after 5.1 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'visual_notification',
        notificationType: 'new_message',
        user: {
          id: 2,
          name: 'Sarah Chen',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff'
        },
        message: 'New message from Sarah Chen',
        timestamp: new Date().toISOString()
      }));
    }, 5100);
    
    // Send ASL video message after 8 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'message',
        data: {
          id: Date.now(),
          text: "[ASL Video Message]",
          hasASLVideo: true,
          videoUrl: "https://example.com/asl-videos/greeting-message.mp4", // Placeholder URL
          sender: {
            id: 4,
            name: 'Marcus Johnson',
            avatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=ef4444&color=fff'
          },
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }));
    }, 8000);
    
    // Send emoji reaction after 10 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'reaction',
        reaction: '👍',
        messageId: Date.now() - 5000, // Reference to first message
        user: {
          id: 3,
          name: 'Aisha Patel',
          avatar: 'https://ui-avatars.com/api/?name=Aisha+Patel&background=d946ef&color=fff'
        },
        timestamp: new Date().toISOString()
      }));
    }, 10000);
    
    // Send visual alert for important message after 12 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'visual_alert',
        alertLevel: 'important',
        message: 'Important meeting reminder for tomorrow',
        timestamp: new Date().toISOString()
      }));
    }, 12000);
  }
  
  // For video meetings, simulate participants joining and accessibility features
  if (endpoint === 'video') {
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'participant_joined',
        participant: {
          id: 3,
          name: 'Aisha Patel',
          avatar: 'https://ui-avatars.com/api/?name=Aisha+Patel&background=d946ef&color=fff'
        },
        timestamp: new Date().toISOString()
      }));
    }, 3000);
    
    // Send an automated caption after 8 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'caption',
        text: "I think we should focus on expanding our marketing strategy to target more deaf business owners.",
        speaker: {
          id: 2,
          name: 'Sarah Chen',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=22c55e&color=fff'
        },
        timestamp: new Date().toISOString()
      }));
    }, 8000);
    
    // Send visual notification of hand raised after 10 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'visual_notification',
        notificationType: 'hand_raised',
        user: {
          id: 4,
          name: 'Marcus Johnson',
          avatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=ef4444&color=fff'
        },
        message: 'Marcus Johnson has raised their hand',
        timestamp: new Date().toISOString()
      }));
    }, 10000);
    
    // Send interpreter joined notification after 12 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'interpreter_joined',
        interpreter: {
          id: 6,
          name: 'Lily Chen',
          avatar: 'https://ui-avatars.com/api/?name=Lily+Chen&background=a855f7&color=fff',
          role: 'ASL Interpreter'
        },
        timestamp: new Date().toISOString()
      }));
    }, 12000);
    
    // Send emoji reaction after 15 seconds
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'reaction',
        reaction: '👍',
        user: {
          id: 3,
          name: 'Aisha Patel',
          avatar: 'https://ui-avatars.com/api/?name=Aisha+Patel&background=d946ef&color=fff'
        },
        timestamp: new Date().toISOString()
      }));
    }, 15000);
  }
  
  // For document sharing, simulate document updates
  if (endpoint === 'documents') {
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'document_updated',
        document: {
          id: 1,
          title: 'Business Plan - Draft',
          updatedBy: 'Marcus Johnson'
        },
        timestamp: new Date().toISOString()
      }));
    }, 4000);
  }
  
  // For task management, simulate task updates
  if (endpoint === 'tasks') {
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'task_updated',
        task: {
          id: 3,
          title: 'Review legal documents',
          status: 'completed',
          updatedBy: 'Aisha Patel'
        },
        timestamp: new Date().toISOString()
      }));
    }, 7000);
  }
  
  // For EntrepreneursOS AI Hub, simulate AI tool activity
  if (endpoint === 'ai-hub') {
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'ai_tool_activity',
        activity: {
          id: Date.now(),
          toolId: 'business-plan-creator',
          toolName: 'Business Plan Creator',
          userAction: 'generated',
          itemName: 'Retail Business Plan',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }));
    }, 3000);
    
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'notification',
        content: 'Your business plan draft is ready for review!',
        messageType: 'success',
        timestamp: new Date().toISOString()
      }));
    }, 6000);
  }
  
  // For EntrepreneursOS Partners, simulate partner connection activity
  if (endpoint === 'partners') {
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'partner_connection',
        connection: {
          id: Date.now(),
          partnerId: 'legalshield',
          partnerName: 'LegalShield',
          status: 'connected',
          message: 'Successfully connected with LegalShield services',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }));
    }, 4000);
    
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'notification',
        content: 'Your account is now connected with LegalShield services',
        messageType: 'success',
        timestamp: new Date().toISOString()
      }));
    }, 5000);
  }
});

// Start the server
server.listen(port, '0.0.0.0', () => {
  console.log(`Ultra minimal server with HTMX and WebSockets running on port ${port}`);
  console.log(`Note: External port mapping is port 80 -> ${port}`);
});