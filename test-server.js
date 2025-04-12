// Simple test server to verify Google service integration
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Check if service account file exists
const hasServiceAccount = (() => {
  try {
    const keyFilePath = path.join(__dirname, 'server/config/serviceAccount.json');
    return fs.existsSync(keyFilePath);
  } catch (error) {
    console.error('Error checking for service account:', error);
    return false;
  }
})();

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    serviceAccountExists: hasServiceAccount,
    environment: {
      databaseConfigured: !!process.env.DATABASE_URL,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Generate a business idea without AI
const generateBasicBusinessIdea = (interests = ['technology'], marketInfo = 'general', constraints = []) => {
  // Basic business templates
  const businessTypes = [
    "e-commerce store",
    "consulting service",
    "mobile app",
    "subscription service",
    "online marketplace"
  ];
  
  // Select random business type
  const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
  
  // Combine with user interests
  const primaryInterest = interests[0];
  const secondaryInterest = interests.length > 1 ? interests[1] : interests[0];
  
  const ideas = [
    {
      title: `${primaryInterest.charAt(0).toUpperCase() + primaryInterest.slice(1)} ${businessType}`,
      description: `A ${businessType} focused on ${primaryInterest} and ${secondaryInterest} for the ${marketInfo || 'general'} market.`,
      potentialScore: Math.floor(Math.random() * 5) + 5,
      complexity: Math.floor(Math.random() * 3) + 3,
      notes: `Consider focusing on accessibility features for deaf entrepreneurs.`
    },
    {
      title: `Accessible ${secondaryInterest} platform`,
      description: `An accessible platform designed for the ${primaryInterest} community, focusing on ${secondaryInterest}.`,
      potentialScore: Math.floor(Math.random() * 4) + 6,
      complexity: Math.floor(Math.random() * 4) + 4,
      notes: `Integrate ASL video support throughout the user experience.`
    }
  ];
  
  return {
    ideas,
    generatedWith: "local-rules",
    interestsUsed: interests,
    timestamp: new Date().toISOString()
  };
};

app.post('/api/test/generate-ideas', (req, res) => {
  const { interests = ['technology'], marketInfo = 'general', constraints = [] } = req.body;
  const idea = generateBasicBusinessIdea(interests, marketInfo, constraints);
  res.json(idea);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${port}`);
  console.log(`Service account available: ${hasServiceAccount}`);
  console.log(`Database URL configured: ${!!process.env.DATABASE_URL}`);
});