/**
 * Simple Storage Service
 * 
 * A lightweight alternative to Google Cloud Storage for local development
 * to improve application startup performance.
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileCategory } from './googleStorage';

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

// Path for local file storage
const STORAGE_BASE_PATH = path.join(process.cwd(), 'uploads');

// Ensure storage directories exist
function ensureDirectoryExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

// Initialize local storage directory
ensureDirectoryExists(STORAGE_BASE_PATH);
console.log('Simple storage initialized for local development');

/**
 * Upload a file to local storage
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
    
    // Create storage path: uploads/users/{userId}/{category}/{fileName}
    const userDirPath = path.join(STORAGE_BASE_PATH, 'users', userId.toString());
    const categoryDirPath = path.join(userDirPath, category);
    
    // Ensure directories exist
    ensureDirectoryExists(categoryDirPath);
    
    // Create full file path
    const filePath = path.join(categoryDirPath, fileName);
    
    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);
    
    // Generate accessible URL (in production this would be a proper URL)
    const fileUrl = `/api/storage/files/users/${userId}/${category}/${fileName}`;
    
    return {
      fileName,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      category
    };
  } catch (error: any) {
    console.error('Error saving file to local storage:', error);
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
    // Build directory path based on parameters
    let directoryPath = path.join(STORAGE_BASE_PATH, 'users', userId.toString());
    if (category) {
      directoryPath = path.join(directoryPath, category);
    }
    
    // Check if directory exists
    if (!fs.existsSync(directoryPath)) {
      return [];
    }
    
    const files: File[] = [];
    
    // Function to scan directory recursively
    const scanDir = (dirPath: string, relativePath: string = '') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          scanDir(fullPath, path.join(relativePath, entry.name));
        } else {
          // Add file to list
          const stats = fs.statSync(fullPath);
          
          // Skip hidden files
          if (!entry.name.startsWith('.')) {
            const fileUrl = `/api/storage/files/${path.join('users', userId.toString(), relativePath, entry.name)}`;
            
            files.push({
              name: entry.name,
              size: stats.size,
              updated: stats.mtime.toISOString(),
              url: fileUrl,
              contentType: getContentType(entry.name)
            });
          }
        }
      }
    };
    
    // Start scanning from the specified directory
    scanDir(directoryPath);
    
    return files;
  } catch (error: any) {
    console.error('Error listing files from local storage:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
}

/**
 * Delete a file from local storage
 * 
 * @param filePath Path to the file
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    // Convert API path to filesystem path
    const localPath = filePath.replace(/^\/api\/storage\/files\//, '');
    const fullPath = path.join(STORAGE_BASE_PATH, localPath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Delete file
    fs.unlinkSync(fullPath);
  } catch (error: any) {
    console.error('Error deleting file from local storage:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  
  // Map common extensions to content types
  const contentTypeMap: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.wav': 'audio/wav',
    '.txt': 'text/plain',
    '.zip': 'application/zip',
  };
  
  return contentTypeMap[ext] || 'application/octet-stream';
}