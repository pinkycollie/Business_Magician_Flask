import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
{{#if auth}}
import { requireAuth } from '../middleware/auth';
{{/if}}

const router = Router();

{{#if validation}}
// Validation schemas for VRClients
const createVRClientsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  {{#if (eq name 'vr-clients')}}
  caseStatus: z.enum(['active', 'pending', 'completed', 'suspended']).default('pending'),
  assignedSpecialist: z.string().min(1, 'Assigned specialist is required'),
  currentMilestone: z.string(),
  nextActionDate: z.string().transform(str => new Date(str)),
  fundingEligibility: z.boolean().default(false),
  serviceCategory: z.string(),
  estimatedCost: z.number().positive(),
  mapLocation: z.string().optional(),
  {{else}}
  // Add specific validation fields based on the endpoint type
  {{/if}}
});

const updateVRClientsSchema = createVRClientsSchema.partial();

const queryVRClientsSchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
  {{#if (eq name 'vr-clients')}}
  status: z.enum(['active', 'pending', 'completed', 'suspended']).optional(),
  specialist: z.string().optional(),
  {{/if}}
});
{{/if}}

{{#if (includes methods 'get')}}
// GET /api/vr-clients - List all vr clients
router.get('/', {{#if auth}}requireAuth, {{/if}}async (req, res) => {
  try {
    {{#if validation}}
    const query = queryVRClientsSchema.parse(req.query);
    {{else}}
    const query = req.query;
    {{/if}}
    
    const {
      page = 1,
      limit = 10,
      search,
      {{#if (eq name 'vr-clients')}}
      status,
      specialist
      {{/if}}
    } = query;

    const offset = (page - 1) * limit;
    
    const items = await storage.getVRClientss({
      {{#if auth}}userId: req.user.id,{{/if}}
      limit,
      offset,
      search,
      {{#if (eq name 'vr-clients')}}
      status,
      specialist
      {{/if}}
    });

    const total = await storage.countVRClientss({
      {{#if auth}}userId: req.user.id,{{/if}}
      search,
      {{#if (eq name 'vr-clients')}}
      status,
      specialist
      {{/if}}
    });

    res.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vr clients:', error);
    res.status(500).json({ error: 'Failed to fetch vr clients' });
  }
});

// GET /api/vr-clients/:id - Get specific vr clients
router.get('/:id', {{#if auth}}requireAuth, {{/if}}async (req, res) => {
  try {
    const id = req.params.id;
    
    const item = await storage.getVRClients(id);
    if (!item) {
      return res.status(404).json({ error: 'VR Clients not found' });
    }

    {{#if auth}}
    // Check ownership
    if (item.userId && item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    {{/if}}

    res.json(item);
  } catch (error) {
    console.error('Error fetching vr clients:', error);
    res.status(500).json({ error: 'Failed to fetch vr clients' });
  }
});
{{/if}}

{{#if (includes methods 'post')}}
// POST /api/vr-clients - Create new vr clients
router.post('/', {{#if auth}}requireAuth, {{/if}}async (req, res) => {
  try {
    {{#if validation}}
    const validatedData = createVRClientsSchema.parse(req.body);
    {{else}}
    const validatedData = req.body;
    {{/if}}

    const newItem = await storage.createVRClients({
      ...validatedData,
      {{#if auth}}
      userId: req.user.id,
      {{/if}}
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    {{#if (eq name 'vr-clients')}}
    // Send notification to assigned specialist
    if (validatedData.assignedSpecialist) {
      await notifySpecialist(validatedData.assignedSpecialist, newItem);
    }
    {{/if}}

    res.status(201).json(newItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    console.error('Error creating vr clients:', error);
    res.status(500).json({ error: 'Failed to create vr clients' });
  }
});
{{/if}}

{{#if (includes methods 'put')}}
// PUT /api/vr-clients/:id - Update vr clients
router.put('/:id', {{#if auth}}requireAuth, {{/if}}async (req, res) => {
  try {
    const id = req.params.id;
    
    {{#if validation}}
    const validatedData = updateVRClientsSchema.parse(req.body);
    {{else}}
    const validatedData = req.body;
    {{/if}}

    // Check if item exists
    const existingItem = await storage.getVRClients(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'VR Clients not found' });
    }

    {{#if auth}}
    // Check ownership
    if (existingItem.userId && existingItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    {{/if}}

    const updatedItem = await storage.updateVRClients(id, {
      ...validatedData,
      updatedAt: new Date()
    });

    {{#if (eq name 'vr-clients')}}
    // Check for milestone progression
    if (validatedData.currentMilestone && validatedData.currentMilestone !== existingItem.currentMilestone) {
      await trackMilestoneProgress(id, validatedData.currentMilestone);
    }
    {{/if}}

    res.json(updatedItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    console.error('Error updating vr clients:', error);
    res.status(500).json({ error: 'Failed to update vr clients' });
  }
});
{{/if}}

{{#if (includes methods 'delete')}}
// DELETE /api/vr-clients/:id - Delete vr clients
router.delete('/:id', {{#if auth}}requireAuth, {{/if}}async (req, res) => {
  try {
    const id = req.params.id;

    // Check if item exists
    const existingItem = await storage.getVRClients(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'VR Clients not found' });
    }

    {{#if auth}}
    // Check ownership
    if (existingItem.userId && existingItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    {{/if}}

    await storage.deleteVRClients(id);
    
    {{#if (eq name 'vr-clients')}}
    // Archive related data instead of deleting
    await storage.archiveClientData(id);
    {{/if}}

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vr clients:', error);
    res.status(500).json({ error: 'Failed to delete vr clients' });
  }
});
{{/if}}

{{#if (eq name 'vr-clients')}}
// VR-specific endpoints

// GET /api/vr-clients/:id/milestones - Get client milestones
router.get('/:id/milestones', {{#if auth}}requireAuth, {{/if}}async (req, res) => {
  try {
    const clientId = req.params.id;
    const milestones = await storage.getClientMilestones(clientId);
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
});

// POST /api/vr-clients/:id/milestones - Add milestone
router.post('/:id/milestones', {{#if auth}}requireAuth, {{/if}}async (req, res) => {
  try {
    const clientId = req.params.id;
    const milestoneData = req.body;
    
    const milestone = await storage.createMilestone({
      ...milestoneData,
      clientId,
      id: crypto.randomUUID(),
      createdAt: new Date()
    });
    
    res.status(201).json(milestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Failed to create milestone' });
  }
});

// GET /api/vr-clients/analytics/dashboard - Get dashboard analytics
router.get('/analytics/dashboard', {{#if auth}}requireAuth, {{/if}}async (req, res) => {
  try {
    const analytics = await storage.getVRAnalytics({{#if auth}}req.user.id{{/if}});
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Utility functions
async function notifySpecialist(specialistId: string, client: any) {
  // Send notification via email, SMS, or push notification
  console.log(`Notifying specialist ${specialistId} about new client ${client.name}`);
}

async function trackMilestoneProgress(clientId: string, milestone: string) {
  // Track milestone progression for analytics
  await storage.logMilestoneProgress(clientId, milestone, new Date());
}
{{/if}}

export default router;