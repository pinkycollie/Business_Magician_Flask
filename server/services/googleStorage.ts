/**
 * Google Cloud Storage Service
 * 
 * This module provides an interface for interacting with Google Cloud Storage
 * for file management within the application.
 */

import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// File categories enum (must match client-side FileCategory enum)
export enum FileCategory {
  DOCUMENT = 'documents',
  IMAGE = 'images',
  VIDEO = 'videos',
  AUDIO = 'audio',
  ASL_VIDEO = 'asl-videos',
  OTHER = 'other'
}

// File interface
export interface File {
  name: string;
  size: number;
  updated: string;
  url: string;
  contentType: string;
}

// Upload result interface
export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  category: FileCategory;
}

// Configure Google Cloud Storage
let storage: Storage;
let bucketName: string;

try {
  // Initialize Cloud Storage
  // Check if credentials file exists at service account path (for local development)
  const serviceAccountPath = path.resolve(process.cwd(), 'server/config/serviceAccount.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    // Use service account file
    storage = new Storage({
      keyFilename: serviceAccountPath
    });
  } else if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    // Use credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    storage = new Storage({ credentials });
  } else {
    // Use application default credentials (works in GCP environment)
    storage = new Storage();
  }
  
  // Get bucket name from environment or use default
  bucketName = process.env.GOOGLE_CLOUD_BUCKET || '360-business-magician-files';
  
  console.log('Google Cloud Storage client initialized successfully');
} catch (error) {
  console.error('Error initializing Google Cloud Storage:', error);
}

/**
 * Upload a file to Google Cloud Storage
 * 
 * @param file File object from multer
 * @param userId User ID who owns the file
 * @param category File category for organization
 * @returns UploadResult with file details
 */
export async function uploadFile(
  file: Express.Multer.File,
  userId: number,
  category: FileCategory = FileCategory.OTHER
): Promise<UploadResult> {
  try {
    // Generate a unique filename to prevent collisions
    const fileExtension = path.extname(file.originalname);
    const fileName = `${path.basename(file.originalname, fileExtension)}-${uuidv4().substring(0, 8)}${fileExtension}`;
    
    // Create storage path: users/{userId}/{category}/{fileName}
    const filePath = `users/${userId}/${category}/${fileName}`;
    
    // Get bucket reference
    const bucket = storage.bucket(bucketName);
    const fileRef = bucket.file(filePath);
    
    // Upload file
    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          userId: userId.toString(),
          category,
          uploadedAt: new Date().toISOString()
        }
      }
    });
    
    // Make file publicly accessible and get URL
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
    
    return {
      fileName,
      fileUrl: publicUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      category
    };
  } catch (error: any) {
    console.error('Error uploading file to Google Cloud Storage:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
}

/**
 * List files for a specific user
 * 
 * @param userId User ID
 * @param category Optional category filter
 * @returns Array of File objects
 */
export async function listUserFiles(
  userId: number,
  category?: FileCategory
): Promise<File[]> {
  try {
    // Build prefix path based on parameters
    let prefix = `users/${userId}/`;
    if (category) {
      prefix += `${category}/`;
    }
    
    // Get bucket and list files with prefix
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({ prefix });
    
    // Build response structure
    const fileList: File[] = await Promise.all(
      files
        // Filter out directories or unwanted files
        .filter(file => {
          const fileName = path.basename(file.name);
          return !fileName.startsWith('.') && !fileName.endsWith('/');
        })
        // Map to our File interface
        .map(async file => {
          const [metadata] = await file.getMetadata();
          
          return {
            name: path.basename(file.name),
            size: parseInt(String(metadata.size || '0'), 10),
            updated: metadata.updated || new Date().toISOString(),
            url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
            contentType: metadata.contentType || 'application/octet-stream'
          };
        })
    );
    
    return fileList;
  } catch (error: any) {
    console.error('Error listing files from Google Cloud Storage:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
}

/**
 * Delete a file from Google Cloud Storage
 * 
 * @param filePath Full path to the file
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);
    
    // Check if file exists before attempting to delete
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    await file.delete();
  } catch (error: any) {
    console.error('Error deleting file from Google Cloud Storage:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Generate a signed URL for temporary file access
 * 
 * @param filePath Full path to the file
 * @param expirationMinutes Minutes until URL expires (default: 60)
 * @returns Signed URL string
 */
export async function getSignedUrl(
  filePath: string,
  expirationMinutes: number = 60
): Promise<string> {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);
    
    // Check if file exists before generating URL
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Generate signed URL
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expirationMinutes * 60 * 1000
    });
    
    return signedUrl;
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}