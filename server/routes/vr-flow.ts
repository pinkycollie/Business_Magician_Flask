import { Router } from 'express';
import { VRBusinessFlowService } from '../../services/VRBusinessFlowService';

const router = Router();
const vrFlowService = new VRBusinessFlowService();

// Initialize new VR client flow
router.post('/start', async (req, res) => {
  try {
    const referralData = req.body;
    const context = await vrFlowService.executeCompleteFlow(referralData);
    
    res.status(201).json({
      success: true,
      clientId: context.clientId,
      currentStage: context.currentStage,
      workspaceUrl: context.progressMetrics?.taskadeProject?.url,
      notionUrl: context.progressMetrics?.notionEntry?.url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get client flow status
router.get('/status/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const status = await vrFlowService.getFlowStatus(clientId);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update flow stage
router.put('/update/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { stage, data } = req.body;
    
    await vrFlowService.updateFlowStage(clientId, stage, data);
    
    res.json({
      success: true,
      message: 'Flow stage updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get available services
router.get('/services', async (req, res) => {
  try {
    const services = await vrFlowService.getAvailableServices();
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;