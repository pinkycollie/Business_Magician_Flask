import express from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = express.Router();

// Schema for basic user profile
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  isDeaf: z.boolean().default(false),
  bio: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional().refine(
    (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
    { message: "Website must start with http:// or https://" }
  ),
  avatarUrl: z.string().optional(),
  businessPhase: z.enum(['idea', 'build', 'grow', 'manage']).default('idea'),
  userId: z.number()
});

// In-memory storage for profiles (would be replaced with database in production)
let profiles: any[] = [
  {
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
    businessPhase: 'idea',
    userId: 1
  }
];

// Get a user profile by username
router.get('/:username', (req, res) => {
  try {
    const { username } = req.params;
    const profile = profiles.find(p => p.username === username);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user's profile
router.get('/', (req, res) => {
  try {
    // In a real implementation, this would use the authenticated user ID
    // For now, just return the first profile as an example
    res.json(profiles[0]);
  } catch (error) {
    console.error('Error getting current profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update a profile
router.post('/', (req, res) => {
  try {
    const profileData = profileSchema.parse(req.body);
    
    // Check if profile exists
    const existingIndex = profiles.findIndex(p => p.username === profileData.username);
    
    if (existingIndex !== -1) {
      // Update existing profile
      profiles[existingIndex] = {
        ...profiles[existingIndex],
        ...profileData
      };
      res.json(profiles[existingIndex]);
    } else {
      // Create new profile
      const newProfile = {
        id: profiles.length + 1,
        ...profileData,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      
      profiles.push(newProfile);
      res.status(201).json(newProfile);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error creating/updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Generate OneLink for a user profile
router.post('/:username/generate-onelink', (req, res) => {
  try {
    const { username } = req.params;
    const profile = profiles.find(p => p.username === username);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // In a real implementation, this would integrate with Vercel's API
    // For now, just return a mock response
    res.json({
      success: true,
      onelink: {
        url: `https://360magicians.vercel.app/${username}`,
        created: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating OneLink:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;