import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadIcon, FileIcon, XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getCategoryFromContentType } from '@/lib/storage';

interface FileUploaderProps {
  userId: number;
  category?: string;
  onUploadComplete?: (fileData: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    category: string;
  }) => void;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
}

export function FileUploader({
  userId,
  category,
  onUploadComplete,
  acceptedFileTypes = '*',
  maxFileSizeMB = 20
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Check file size
    if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File size exceeds the maximum limit of ${maxFileSizeMB}MB.`);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    
    if (category) {
      formData.append('category', category);
    } else {
      // Auto-detect category based on file type
      const fileCategory = getCategoryFromContentType(file.type);
      formData.append('category', fileCategory);
    }
    
    try {
      // Use XMLHttpRequest for upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          
          toast({
            title: 'Upload Successful',
            description: `File "${file.name}" has been uploaded successfully.`,
            variant: 'default',
          });
          
          if (onUploadComplete) {
            onUploadComplete({
              fileName: response.fileName,
              fileUrl: response.fileUrl,
              fileSize: response.fileSize,
              mimeType: response.mimeType,
              category: response.category,
            });
          }
          
          // Reset form
          setFile(null);
          setProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          const errorMsg = xhr.responseText ? JSON.parse(xhr.responseText).message : 'Upload failed';
          setError(errorMsg || 'An error occurred during upload.');
          toast({
            title: 'Upload Failed',
            description: errorMsg || 'An error occurred during upload.',
            variant: 'destructive',
          });
        }
        setUploading(false);
      });
      
      xhr.addEventListener('error', () => {
        setError('Network error occurred during upload.');
        toast({
          title: 'Upload Failed',
          description: 'Network error occurred during upload.',
          variant: 'destructive',
        });
        setUploading(false);
      });
      
      xhr.addEventListener('abort', () => {
        setError('Upload was cancelled.');
        toast({
          title: 'Upload Cancelled',
          description: 'The upload was cancelled.',
          variant: 'default',
        });
        setUploading(false);
      });
      
      // Open and send the request
      xhr.open('POST', '/api/storage/upload');
      xhr.send(formData);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
      toast({
        title: 'Upload Failed',
        description: err.message || 'An error occurred during upload.',
        variant: 'destructive',
      });
      setUploading(false);
    }
  };
  
  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        {!file ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileIcon className="h-12 w-12 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Select a file to upload</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your file or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: {maxFileSizeMB}MB
                </p>
              </div>
              
              <div>
                <Label htmlFor="fileUpload" className="sr-only">
                  Choose a file
                </Label>
                <Input
                  id="fileUpload"
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedFileTypes}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center"
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-8 w-8 text-primary/70" />
                <div>
                  <p className="font-medium truncate max-w-[250px]" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                disabled={uploading}
                className="text-muted-foreground hover:text-destructive"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            
            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-center text-muted-foreground">
                  Uploading... {progress}%
                </p>
              </div>
            )}
            
            {!uploading && (
              <div className="mt-4">
                <Button
                  onClick={handleUpload}
                  className="w-full"
                  disabled={uploading}
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}