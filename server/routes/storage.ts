/**
 * Storage Routes
 * 
 * This module provides API endpoints for managing file storage operations
 * using Google Cloud Storage.
 */

import { Router } from 'express';
import multer from 'multer';
import * as googleStorage from '../services/googleStorage';
import { FileCategory } from '../services/googleStorage';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Upload a file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const userId = parseInt(req.body.userId || '0', 10);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Get category from request or default to OTHER
    let category = req.body.category ? 
      (req.body.category as FileCategory) : 
      FileCategory.OTHER;

    // Upload the file
    const result = await googleStorage.uploadFile(
      req.file, 
      userId, 
      category as FileCategory
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ 
      message: error.message || 'Error uploading file' 
    });
  }
});

// Get file categories
router.get('/categories', (req, res) => {
  try {
    // Return available file categories
    const categories = Object.values(FileCategory);
    return res.status(200).json(categories);
  } catch (error: any) {
    console.error('Error getting file categories:', error);
    return res.status(500).json({ 
      message: error.message || 'Error getting file categories' 
    });
  }
});

// List files for a user
router.get('/files/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Get optional category from query params
    const category = req.query.category as FileCategory | undefined;

    const files = await googleStorage.listUserFiles(userId, category);
    return res.status(200).json(files);
  } catch (error: any) {
    console.error('Error listing files:', error);
    return res.status(500).json({ 
      message: error.message || 'Error listing files' 
    });
  }
});

// Delete a file
router.delete('/files', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }

    await googleStorage.deleteFile(filePath);
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ 
      message: error.message || 'Error deleting file' 
    });
  }
});

// Get a signed URL for temporary file access
router.post('/signed-url', async (req, res) => {
  try {
    const { filePath, expirationMinutes } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }

    const signedUrl = await googleStorage.getSignedUrl(
      filePath, 
      expirationMinutes || 60
    );
    
    return res.status(200).json({ signedUrl });
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    return res.status(500).json({ 
      message: error.message || 'Error generating signed URL' 
    });
  }
});

export default router;