import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to service account key file
const keyFilePath = path.join(__dirname, '../../attached_assets/business-magician-api-5010bf7c1689.json');

// Initialize storage with credentials
const storage = new Storage({
  keyFilename: keyFilePath,
  projectId: 'business-magician-api',
});

// Default bucket name for the application
const DEFAULT_BUCKET_NAME = 'business-magician-files';

/**
 * Create a bucket if it doesn't already exist
 * @param {string} bucketName - Name of the bucket to create
 * @returns {Promise<void>}
 */
export async function ensureBucketExists(bucketName = DEFAULT_BUCKET_NAME): Promise<void> {
  try {
    const [buckets] = await storage.getBuckets();
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);

    if (!bucketExists) {
      await storage.createBucket(bucketName);
      console.log(`Bucket ${bucketName} created.`);
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
}

/**
 * Upload a file to Google Cloud Storage
 * @param {string} filePath - Local path to the file
 * @param {string} destinationFileName - Name to save the file as in the bucket
 * @param {string} bucketName - Name of the bucket to upload to
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export async function uploadFile(
  filePath: string,
  destinationFileName: string,
  bucketName = DEFAULT_BUCKET_NAME
): Promise<string> {
  try {
    await ensureBucketExists(bucketName);
    
    const bucket = storage.bucket(bucketName);
    const options = {
      destination: destinationFileName,
      metadata: {
        contentType: determineContentType(filePath),
      },
    };

    await bucket.upload(filePath, options);
    
    // Make the file public and get its URL
    const file = bucket.file(destinationFileName);
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destinationFileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload a buffer to Google Cloud Storage
 * @param {Buffer} buffer - File buffer to upload
 * @param {string} destinationFileName - Name to save the file as in the bucket
 * @param {string} contentType - MIME type of the file
 * @param {string} bucketName - Name of the bucket to upload to
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export async function uploadBuffer(
  buffer: Buffer,
  destinationFileName: string,
  contentType: string,
  bucketName = DEFAULT_BUCKET_NAME
): Promise<string> {
  try {
    await ensureBucketExists(bucketName);
    
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(destinationFileName);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType,
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });

      stream.on('finish', async () => {
        // Make the file public
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${destinationFileName}`;
        resolve(publicUrl);
      });

      stream.end(buffer);
    });
  } catch (error) {
    console.error('Error uploading buffer:', error);
    throw error;
  }
}

/**
 * Download a file from Google Cloud Storage
 * @param {string} fileName - Name of the file in the bucket
 * @param {string} destinationPath - Local path to save the file to
 * @param {string} bucketName - Name of the bucket to download from
 * @returns {Promise<string>} - Path to the downloaded file
 */
export async function downloadFile(
  fileName: string,
  destinationPath: string,
  bucketName = DEFAULT_BUCKET_NAME
): Promise<string> {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    
    await file.download({
      destination: destinationPath,
    });

    return destinationPath;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * List all files in a bucket
 * @param {string} bucketName - Name of the bucket to list files from
 * @returns {Promise<string[]>} - Array of file names
 */
export async function listFiles(bucketName = DEFAULT_BUCKET_NAME): Promise<string[]> {
  try {
    const [files] = await storage.bucket(bucketName).getFiles();
    return files.map(file => file.name);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Delete a file from Google Cloud Storage
 * @param {string} fileName - Name of the file in the bucket
 * @param {string} bucketName - Name of the bucket to delete from
 * @returns {Promise<void>}
 */
export async function deleteFile(
  fileName: string,
  bucketName = DEFAULT_BUCKET_NAME
): Promise<void> {
  try {
    const bucket = storage.bucket(bucketName);
    await bucket.file(fileName).delete();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get a signed URL for a file (for temporary access)
 * @param {string} fileName - Name of the file in the bucket
 * @param {string} bucketName - Name of the bucket
 * @param {number} expires - Expiration time in seconds
 * @returns {Promise<string>} - Signed URL
 */
export async function getSignedUrl(
  fileName: string,
  bucketName = DEFAULT_BUCKET_NAME,
  expires = 60 * 60 // 1 hour
): Promise<string> {
  try {
    const options = {
      version: 'v4' as const,
      action: 'read' as const,
      expires: Date.now() + expires * 1000,
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return url;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
}

/**
 * Check if a file exists in Google Cloud Storage
 * @param {string} fileName - Name of the file in the bucket
 * @param {string} bucketName - Name of the bucket
 * @returns {Promise<boolean>} - Whether the file exists
 */
export async function fileExists(
  fileName: string,
  bucketName = DEFAULT_BUCKET_NAME
): Promise<boolean> {
  try {
    const [exists] = await storage
      .bucket(bucketName)
      .file(fileName)
      .exists();
    
    return exists;
  } catch (error) {
    console.error('Error checking if file exists:', error);
    throw error;
  }
}

/**
 * Determine the content type of a file based on its extension
 * @param {string} filePath - Path to the file
 * @returns {string} - MIME type
 */
function determineContentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.zip': 'application/zip',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

// Export the storage instance for direct access if needed
export { storage };