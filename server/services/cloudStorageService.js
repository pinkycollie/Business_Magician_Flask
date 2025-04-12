/**
 * Cloud Storage Service for 360 Business Magician
 * Provides access to GCP Cloud Storage buckets
 */

import { Storage } from '@google-cloud/storage';

// Bucket names
const DATA_BUCKET = 'business-magician-api-data';
const ASSETS_BUCKET = 'business-magician-api-vercel-assets';

// Initialize storage with lazy loading
let storage = null;

/**
 * Initialize the Cloud Storage client
 * @returns {Storage} The Google Cloud Storage client
 */
function getStorageClient() {
  if (!storage) {
    try {
      // Check if we're running in GCP environment (will use default credentials)
      if (process.env.GOOGLE_CLOUD_PROJECT) {
        storage = new Storage();
        console.log('Initialized Cloud Storage with default credentials');
      } 
      // Check if we're using service account key file
      else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        storage = new Storage();
        console.log('Initialized Cloud Storage with service account credentials');
      } 
      // Use credentials from environment variables if available
      else if (process.env.GCP_PROJECT_ID && process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY) {
        storage = new Storage({
          projectId: process.env.GCP_PROJECT_ID,
          credentials: {
            client_email: process.env.GCP_CLIENT_EMAIL,
            private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }
        });
        console.log('Initialized Cloud Storage with environment credentials');
      } else {
        console.warn('No GCP credentials available. Cloud Storage functionality will be limited.');
        return null;
      }
    } catch (error) {
      console.error('Failed to initialize Cloud Storage:', error);
      return null;
    }
  }
  
  return storage;
}

/**
 * Save data to the data bucket
 * @param {string} filename - The name of the file to save
 * @param {Object|string} data - The data to save (will be converted to JSON if object)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The result of the operation
 */
export async function saveData(filename, data, options = {}) {
  const client = getStorageClient();
  if (!client) {
    return { success: false, error: 'Storage client not available' };
  }
  
  try {
    const bucket = client.bucket(DATA_BUCKET);
    const file = bucket.file(filename);
    
    // Convert data to string if it's an object
    const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    
    // Set appropriate options
    const uploadOptions = {
      contentType: options.contentType || 'application/json',
      metadata: {
        cacheControl: options.cacheControl || 'private, max-age=0',
        ...options.metadata
      }
    };
    
    await file.save(content, uploadOptions);
    
    return { 
      success: true, 
      filename,
      url: `https://storage.googleapis.com/${DATA_BUCKET}/${filename}`,
      publicUrl: file.publicUrl()
    };
  } catch (error) {
    console.error('Error saving data to Cloud Storage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to save data', 
      details: error
    };
  }
}

/**
 * Retrieve data from the data bucket
 * @param {string} filename - The name of the file to retrieve
 * @param {boolean} parseJson - Whether to parse the content as JSON
 * @returns {Promise<Object>} The result of the operation
 */
export async function getData(filename, parseJson = true) {
  const client = getStorageClient();
  if (!client) {
    return { success: false, error: 'Storage client not available' };
  }
  
  try {
    const bucket = client.bucket(DATA_BUCKET);
    const file = bucket.file(filename);
    
    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return { success: false, error: 'File not found' };
    }
    
    // Download the file
    const [content] = await file.download();
    const stringContent = content.toString('utf8');
    
    return { 
      success: true, 
      data: parseJson ? JSON.parse(stringContent) : stringContent,
      filename,
      contentType: (await file.getMetadata())[0].contentType
    };
  } catch (error) {
    console.error('Error retrieving data from Cloud Storage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to retrieve data', 
      details: error
    };
  }
}

/**
 * List files in the data bucket
 * @param {string} prefix - Optional prefix to filter files
 * @param {number} limit - Maximum number of files to return
 * @returns {Promise<Object>} The result of the operation
 */
export async function listData(prefix = '', limit = 100) {
  const client = getStorageClient();
  if (!client) {
    return { success: false, error: 'Storage client not available' };
  }
  
  try {
    const bucket = client.bucket(DATA_BUCKET);
    const [files] = await bucket.getFiles({ prefix, maxResults: limit });
    
    return { 
      success: true, 
      files: files.map(file => ({
        name: file.name,
        size: parseInt(file.metadata.size, 10),
        contentType: file.metadata.contentType,
        updated: new Date(file.metadata.updated),
        url: `https://storage.googleapis.com/${DATA_BUCKET}/${file.name}`,
        publicUrl: file.publicUrl()
      }))
    };
  } catch (error) {
    console.error('Error listing files from Cloud Storage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to list files', 
      details: error
    };
  }
}

/**
 * Delete a file from the data bucket
 * @param {string} filename - The name of the file to delete
 * @returns {Promise<Object>} The result of the operation
 */
export async function deleteData(filename) {
  const client = getStorageClient();
  if (!client) {
    return { success: false, error: 'Storage client not available' };
  }
  
  try {
    const bucket = client.bucket(DATA_BUCKET);
    const file = bucket.file(filename);
    
    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return { success: false, error: 'File not found' };
    }
    
    // Delete the file
    await file.delete();
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error deleting file from Cloud Storage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete file', 
      details: error
    };
  }
}

/**
 * Upload an asset to the assets bucket
 * @param {string} filename - The name of the file to upload
 * @param {Buffer|string} data - The data to upload
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The result of the operation
 */
export async function uploadAsset(filename, data, options = {}) {
  const client = getStorageClient();
  if (!client) {
    return { success: false, error: 'Storage client not available' };
  }
  
  try {
    const bucket = client.bucket(ASSETS_BUCKET);
    const file = bucket.file(filename);
    
    // Determine content type if not provided
    let contentType = options.contentType;
    if (!contentType) {
      if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
        contentType = 'image/jpeg';
      } else if (filename.endsWith('.png')) {
        contentType = 'image/png';
      } else if (filename.endsWith('.gif')) {
        contentType = 'image/gif';
      } else if (filename.endsWith('.svg')) {
        contentType = 'image/svg+xml';
      } else if (filename.endsWith('.mp4')) {
        contentType = 'video/mp4';
      } else if (filename.endsWith('.webm')) {
        contentType = 'video/webm';
      } else if (filename.endsWith('.pdf')) {
        contentType = 'application/pdf';
      } else if (filename.endsWith('.css')) {
        contentType = 'text/css';
      } else if (filename.endsWith('.js')) {
        contentType = 'application/javascript';
      } else if (filename.endsWith('.html')) {
        contentType = 'text/html';
      } else {
        contentType = 'application/octet-stream';
      }
    }
    
    // Set appropriate options for public assets
    const uploadOptions = {
      contentType,
      metadata: {
        cacheControl: options.cacheControl || 'public, max-age=31536000',
        ...options.metadata
      },
      public: true
    };
    
    await file.save(data, uploadOptions);
    
    return { 
      success: true, 
      filename,
      url: `https://storage.googleapis.com/${ASSETS_BUCKET}/${filename}`,
      publicUrl: file.publicUrl()
    };
  } catch (error) {
    console.error('Error uploading asset to Cloud Storage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to upload asset', 
      details: error
    };
  }
}

/**
 * Generate a signed URL for uploading a file directly from the browser
 * @param {string} filename - The name of the file
 * @param {Object} options - Signed URL options
 * @returns {Promise<Object>} The signed URL result
 */
export async function generateUploadSignedUrl(filename, options = {}) {
  const client = getStorageClient();
  if (!client) {
    return { success: false, error: 'Storage client not available' };
  }
  
  try {
    const bucket = client.bucket(ASSETS_BUCKET);
    const file = bucket.file(filename);
    
    // Generate signed URL for uploading
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + (options.expiresIn || 15 * 60 * 1000), // 15 minutes by default
      contentType: options.contentType || 'application/octet-stream',
      ...options
    });
    
    return {
      success: true,
      signedUrl,
      filename,
      publicUrl: file.publicUrl(),
      expiresAt: new Date(Date.now() + (options.expiresIn || 15 * 60 * 1000))
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to generate signed URL', 
      details: error
    };
  }
}

/**
 * Sync a local file to Cloud Storage
 * @param {string} localFilePath - Path to the local file
 * @param {string} destinationFilename - Destination filename in Cloud Storage
 * @param {boolean} isAsset - Whether this is an asset or data file
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The result of the operation
 */
export async function syncFileToStorage(localFilePath, destinationFilename, isAsset = false, options = {}) {
  const client = getStorageClient();
  if (!client) {
    return { success: false, error: 'Storage client not available' };
  }
  
  try {
    const bucketName = isAsset ? ASSETS_BUCKET : DATA_BUCKET;
    const bucket = client.bucket(bucketName);
    const file = bucket.file(destinationFilename);
    
    // Upload the file
    await bucket.upload(localFilePath, {
      destination: destinationFilename,
      metadata: {
        contentType: options.contentType,
        cacheControl: options.cacheControl || (isAsset ? 'public, max-age=31536000' : 'private, max-age=0'),
        ...options.metadata
      },
      public: isAsset
    });
    
    return { 
      success: true, 
      filename: destinationFilename,
      url: `https://storage.googleapis.com/${bucketName}/${destinationFilename}`,
      publicUrl: file.publicUrl()
    };
  } catch (error) {
    console.error('Error syncing file to Cloud Storage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sync file', 
      details: error
    };
  }
}

/**
 * Save business idea to Cloud Storage
 * @param {Object} idea - The business idea to save
 * @returns {Promise<Object>} The result of the operation
 */
export async function saveBusinessIdea(idea) {
  // Generate a unique filename based on timestamp and idea name
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedName = (idea.name || 'untitled').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `business-ideas/${timestamp}-${sanitizedName}.json`;
  
  return saveData(filename, idea);
}

/**
 * List all business ideas
 * @param {number} limit - Maximum number of ideas to return
 * @returns {Promise<Object>} The result of the operation
 */
export async function listBusinessIdeas(limit = 100) {
  return listData('business-ideas/', limit);
}

// Export the underlying storage client for advanced usage
export function getStorage() {
  return getStorageClient();
}