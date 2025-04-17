/**
 * Ultra minimal Node.js express server - without TypeScript
 * Plain JavaScript to eliminate any transpilation memory overhead
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
    businessPhase: 'idea' // idea, build, grow, manage
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

// Simple error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const port = 5000;
const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {
  console.log(`Ultra minimal server running on port ${port}`);
});