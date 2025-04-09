import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as googleStorage from '../services/googleStorage';
import { v4 as uuidv4 } from 'uuid';

// Set up multer for handling file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

const router = Router();

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// File categories
const fileCategories = [
  'business-plans',
  'marketing-materials',
  'legal-documents',
  'financial-documents',
  'presentations',
  'asl-videos',
  'profile-pictures',
  'other'
];

// Upload a file
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { originalname } = req.file;
    const category = fileCategories.includes(req.body.category) 
      ? req.body.category 
      : 'other';
    
    // Generate unique filename to prevent conflicts
    const fileExtension = path.extname(originalname);
    const fileName = `${category}/${uuidv4()}${fileExtension}`;
    
    // Upload to Google Cloud Storage
    const publicUrl = await googleStorage.uploadFile(
      req.file.path, 
      fileName
    );
    
    // Clean up local temp file
    fs.unlinkSync(req.file.path);
    
    // Return success response with file URL
    res.status(200).json({ 
      success: true, 
      fileName,
      url: publicUrl,
      originalName: originalname,
      category
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// List files by category
router.get('/files/:category?', async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const allFiles = await googleStorage.listFiles();
    
    let filteredFiles;
    if (category && fileCategories.includes(category)) {
      // Filter files by the requested category
      filteredFiles = allFiles.filter(file => file.startsWith(`${category}/`));
    } else {
      // Return all files
      filteredFiles = allFiles;
    }
    
    res.status(200).json({
      success: true,
      files: filteredFiles
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Get file details
router.get('/file/:fileName', async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    const exists = await googleStorage.fileExists(fileName);
    
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Generate a signed URL for the file (for secure access)
    const signedUrl = await googleStorage.getSignedUrl(fileName);
    
    res.status(200).json({
      success: true,
      fileName,
      signedUrl,
      publicUrl: `https://storage.googleapis.com/business-magician-files/${fileName}`
    });
  } catch (error) {
    console.error('Error getting file details:', error);
    res.status(500).json({ error: 'Failed to get file details' });
  }
});

// Delete a file
router.delete('/file/:fileName', async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    const exists = await googleStorage.fileExists(fileName);
    
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    await googleStorage.deleteFile(fileName);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;