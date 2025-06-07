import { Router } from 'express';
import { VRBusinessFlowService } from '../../services/VRBusinessFlowService';

const router = Router();
const vrFlowService = new VRBusinessFlowService();

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
    const errorMessage = error instanceof Error ? error.message : 'Flow initialization failed';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

router.get('/status/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const status = await vrFlowService.getFlowStatus(clientId);
    res.json({ success: true, data: status });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Status retrieval failed';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

router.put('/update/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { stage, data } = req.body;
    await vrFlowService.updateFlowStage(clientId, stage, data);
    res.json({ success: true, message: 'Flow stage updated successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Update failed';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

router.get('/services', async (req, res) => {
  try {
    const services = await vrFlowService.getAvailableServices();
    res.json({ success: true, data: services });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Services retrieval failed';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;