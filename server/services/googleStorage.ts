import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const BUCKET_NAME = 'business-magician-storage';
const VIDEOS_FOLDER = 'asl-videos';
const DOCUMENTS_FOLDER = 'business-documents';
const TEMPLATES_FOLDER = 'business-templates';

// Check for service account credentials
export const hasServiceAccount = (() => {
  try {
    const keyFilePath = path.join(__dirname, '../config/serviceAccount.json');
    return fs.existsSync(keyFilePath);
  } catch (error) {
    console.error('Error checking for service account:', error);
    return false;
  }
})();

// Initialize storage client if service account is available
let storageClient: Storage | null = null;

if (hasServiceAccount) {
  try {
    const keyFilePath = path.join(__dirname, '../config/serviceAccount.json');
    storageClient = new Storage({
      keyFilename: keyFilePath
    });
    console.log('Google Cloud Storage client initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Cloud Storage:', error);
  }
}

// Helper function to generate a unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName);
  const safeName = path.basename(originalName, extension)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase();
  
  return `${safeName}-${timestamp}-${randomString}${extension}`;
}

// Store ASL video to Google Cloud Storage
export async function storeASLVideo(
  fileBuffer: Buffer, 
  originalFilename: string,
  metadata: {
    title: string;
    description?: string;
    phaseId?: number;
    taskId?: number;
  }
): Promise<{ url: string; filename: string; } | null> {
  if (!storageClient) {
    console.warn('Google Cloud Storage client not available. Video not stored.');
    return null;
  }

  try {
    const bucket = storageClient.bucket(BUCKET_NAME);
    const uniqueFilename = generateUniqueFilename(originalFilename);
    const filePath = `${VIDEOS_FOLDER}/${uniqueFilename}`;
    const file = bucket.file(filePath);

    // Upload the file
    await file.save(fileBuffer, {
      metadata: {
        contentType: getContentType(originalFilename),
        metadata: {
          title: metadata.title,
          description: metadata.description || '',
          phaseId: metadata.phaseId?.toString() || '',
          taskId: metadata.taskId?.toString() || '',
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filePath}`;
    
    return {
      url: publicUrl,
      filename: uniqueFilename
    };
  } catch (error) {
    console.error('Error storing ASL video to Google Cloud Storage:', error);
    return null;
  }
}

// Store business document to Google Cloud Storage
export async function storeBusinessDocument(
  fileBuffer: Buffer,
  originalFilename: string,
  metadata: {
    businessId: number;
    documentType: string;
    description?: string;
  }
): Promise<{ url: string; filename: string; } | null> {
  if (!storageClient) {
    console.warn('Google Cloud Storage client not available. Document not stored.');
    return null;
  }

  try {
    const bucket = storageClient.bucket(BUCKET_NAME);
    const uniqueFilename = generateUniqueFilename(originalFilename);
    const businessFolder = `${DOCUMENTS_FOLDER}/business-${metadata.businessId}`;
    const filePath = `${businessFolder}/${uniqueFilename}`;
    const file = bucket.file(filePath);

    // Upload the file
    await file.save(fileBuffer, {
      metadata: {
        contentType: getContentType(originalFilename),
        metadata: {
          businessId: metadata.businessId.toString(),
          documentType: metadata.documentType,
          description: metadata.description || '',
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filePath}`;
    
    return {
      url: publicUrl,
      filename: uniqueFilename
    };
  } catch (error) {
    console.error('Error storing business document to Google Cloud Storage:', error);
    return null;
  }
}

// Store business template to Google Cloud Storage
export async function storeBusinessTemplate(
  fileBuffer: Buffer,
  originalFilename: string,
  metadata: {
    templateName: string;
    templateType: string;
    description?: string;
  }
): Promise<{ url: string; filename: string; } | null> {
  if (!storageClient) {
    console.warn('Google Cloud Storage client not available. Template not stored.');
    return null;
  }

  try {
    const bucket = storageClient.bucket(BUCKET_NAME);
    const uniqueFilename = generateUniqueFilename(originalFilename);
    const filePath = `${TEMPLATES_FOLDER}/${metadata.templateType}/${uniqueFilename}`;
    const file = bucket.file(filePath);

    // Upload the file
    await file.save(fileBuffer, {
      metadata: {
        contentType: getContentType(originalFilename),
        metadata: {
          templateName: metadata.templateName,
          templateType: metadata.templateType,
          description: metadata.description || '',
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filePath}`;
    
    return {
      url: publicUrl,
      filename: uniqueFilename
    };
  } catch (error) {
    console.error('Error storing business template to Google Cloud Storage:', error);
    return null;
  }
}

// Delete file from Google Cloud Storage
export async function deleteFile(filePath: string): Promise<boolean> {
  if (!storageClient) {
    console.warn('Google Cloud Storage client not available. File not deleted.');
    return false;
  }

  try {
    const bucket = storageClient.bucket(BUCKET_NAME);
    const file = bucket.file(filePath);
    
    // Delete the file
    await file.delete();
    return true;
  } catch (error) {
    console.error('Error deleting file from Google Cloud Storage:', error);
    return false;
  }
}

// List files in a folder
export async function listFiles(folderPath: string): Promise<{ name: string; url: string; metadata: any; }[]> {
  if (!storageClient) {
    console.warn('Google Cloud Storage client not available. Unable to list files.');
    return [];
  }

  try {
    const bucket = storageClient.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix: folderPath });
    
    return await Promise.all(files.map(async (file) => {
      const [metadata] = await file.getMetadata();
      return {
        name: file.name,
        url: `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`,
        metadata: metadata.metadata || {}
      };
    }));
  } catch (error) {
    console.error('Error listing files from Google Cloud Storage:', error);
    return [];
  }
}

// List ASL videos
export async function listASLVideos(params: { phaseId?: number; taskId?: number; } = {}): Promise<{ name: string; url: string; metadata: any; }[]> {
  if (!storageClient) {
    console.warn('Google Cloud Storage client not available. Unable to list ASL videos.');
    return [];
  }

  try {
    const videos = await listFiles(VIDEOS_FOLDER);
    
    // Filter videos based on parameters
    return videos.filter(video => {
      if (params.phaseId && video.metadata.phaseId !== params.phaseId.toString()) {
        return false;
      }
      if (params.taskId && video.metadata.taskId !== params.taskId.toString()) {
        return false;
      }
      return true;
    });
  } catch (error) {
    console.error('Error listing ASL videos from Google Cloud Storage:', error);
    return [];
  }
}

// Helper function to determine content type based on file extension
function getContentType(filename: string): string {
  const extension = path.extname(filename).toLowerCase();
  
  const contentTypeMap: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.zip': 'application/zip',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
  };
  
  return contentTypeMap[extension] || 'application/octet-stream';
}