// Simple API server to test core functionality
import express from 'express';
import cors from 'cors';
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Service flags - these will be set based on environment variables 
// and available services
const serviceStatus = {
  database: false,
  googleCloud: false,
  anthropic: false,
  openai: false
};

// Initialize service status
(function checkServices() {
  try {
    serviceStatus.database = !!process.env.DATABASE_URL;
    serviceStatus.googleCloud = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
    serviceStatus.anthropic = !!process.env.ANTHROPIC_API_KEY;
    serviceStatus.openai = !!process.env.OPENAI_API_KEY;
    
    console.log('Service status:', JSON.stringify(serviceStatus, null, 2));
  } catch (error) {
    console.error('Error checking services:', error);
  }
})();

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    services: serviceStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Basic business idea generator (without AI dependency)
function generateBasicBusinessIdea(interests = ['technology'], marketInfo = 'general', constraints = []) {
  const businessTypes = [
    "e-commerce store", "consulting service", "mobile app", 
    "subscription service", "online marketplace"
  ];
  
  // Select random business type and combine with user interests
  const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
  const primaryInterest = interests[0];
  const secondaryInterest = interests.length > 1 ? interests[1] : interests[0];
  
  const ideas = [
    {
      title: `${primaryInterest.charAt(0).toUpperCase() + primaryInterest.slice(1)} ${businessType}`,
      description: `A ${businessType} focused on ${primaryInterest} and ${secondaryInterest} for the ${marketInfo || 'general'} market.`,
      marketPotential: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      difficultyLevel: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      startupCosts: `$${Math.floor(Math.random() * 10) + 1}k - $${Math.floor(Math.random() * 20) + 10}k`,
      notes: `Consider focusing on accessibility features for deaf entrepreneurs.`
    },
    {
      title: `Accessible ${secondaryInterest} platform`,
      description: `An accessible platform designed for the ${primaryInterest} community, focusing on ${secondaryInterest}.`,
      marketPotential: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      difficultyLevel: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      startupCosts: `$${Math.floor(Math.random() * 15) + 5}k - $${Math.floor(Math.random() * 25) + 15}k`,
      notes: `Integrate ASL video support throughout the user experience.`
    }
  ];
  
  return {
    ideas,
    generatedWith: "local-generator",
    interestsUsed: interests,
    timestamp: new Date().toISOString()
  };
}

// Business idea routes
app.post('/api/generate-ideas', (req, res) => {
  try {
    const { interests = ['technology'], marketInfo, constraints } = req.body;
    const result = generateBasicBusinessIdea(interests, marketInfo, constraints);
    res.json(result);
  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500).json({ error: 'Failed to generate business ideas', message: error.message });
  }
});

// ASL video routes
const aslVideos = [
  { id: 1, title: 'Business Formation Introduction', url: '/videos/business-formation.mp4', phaseId: 1 },
  { id: 2, title: 'Market Research Basics', url: '/videos/market-research.mp4', phaseId: 1 },
  { id: 3, title: 'Financial Planning', url: '/videos/financial-planning.mp4', phaseId: 2 }
];

app.get('/api/asl-videos', (req, res) => {
  const { phaseId } = req.query;
  if (phaseId) {
    res.json(aslVideos.filter(video => video.phaseId === parseInt(phaseId)));
  } else {
    res.json(aslVideos);
  }
});

// Lifecycle phases routes
const lifecyclePhases = [
  { id: 1, name: "Idea", slug: "idea", description: "Generate and validate business ideas", order: 1 },
  { id: 2, name: "Build", slug: "build", description: "Develop your business foundation", order: 2 },
  { id: 3, name: "Grow", slug: "grow", description: "Expand your business reach", order: 3 },
  { id: 4, name: "Manage", slug: "manage", description: "Optimize and maintain your business", order: 4 }
];

app.get('/api/lifecycle-phases', (req, res) => {
  res.json(lifecyclePhases);
});

app.get('/api/lifecycle-phases/:slug', (req, res) => {
  const phase = lifecyclePhases.find(p => p.slug === req.params.slug);
  if (!phase) {
    return res.status(404).json({ error: 'Phase not found' });
  }
  res.json(phase);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running at http://0.0.0.0:${PORT}`);
});