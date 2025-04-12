/**
 * Client-side storage utilities and types for Google Cloud Storage integration
 */

// File categories (must match server-side FileCategory enum)
export enum FileCategory {
  DOCUMENT = 'documents',
  IMAGE = 'images',
  VIDEO = 'videos',
  AUDIO = 'audio',
  ASL_VIDEO = 'asl-videos',
  OTHER = 'other'
}

// File object type
export interface File {
  name: string;
  size: number;
  updated: string;
  url: string;
  contentType: string;
}

// Upload result type
export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  category: FileCategory;
}

// Utility functions for client-side file handling

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

/**
 * Determine if a file is an image based on content type
 */
export const isImage = (contentType: string): boolean => {
  return contentType.startsWith('image/');
};

/**
 * Determine if a file is a video based on content type
 */
export const isVideo = (contentType: string): boolean => {
  return contentType.startsWith('video/');
};

/**
 * Determine if a file is an audio based on content type
 */
export const isAudio = (contentType: string): boolean => {
  return contentType.startsWith('audio/');
};

/**
 * Determine if a file is a document based on content type
 */
export const isDocument = (contentType: string): boolean => {
  return (
    contentType === 'application/pdf' ||
    contentType.includes('document') ||
    contentType.includes('text/') ||
    contentType.includes('application/vnd.ms-') ||
    contentType.includes('application/vnd.openxmlformats-')
  );
};

/**
 * Get file category from content type
 */
export const getCategoryFromContentType = (contentType: string): FileCategory => {
  if (isImage(contentType)) return FileCategory.IMAGE;
  if (isVideo(contentType)) return FileCategory.VIDEO;
  if (isAudio(contentType)) return FileCategory.AUDIO;
  if (isDocument(contentType)) return FileCategory.DOCUMENT;
  
  return FileCategory.OTHER;
};