
import { Router } from 'express';
import { storage } from '../storage';
import { requireAuth } from '../middleware/auth';

const router = Router();

// VR Analytics Dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const analytics = {
      totalClients: await storage.countVRClients(),
      activeClients: await storage.countVRClients({ status: 'active' }),
      completedClients: await storage.countVRClients({ status: 'completed' }),
      totalInvestment: await storage.getTotalVRInvestment(),
      avgCompletionTime: await storage.getAvgCompletionTime(),
      milestoneDistribution: await storage.getMilestoneDistribution(),
      specialistWorkload: await storage.getSpecialistWorkload(),
      costByCategory: await storage.getCostByCategory()
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching VR analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
