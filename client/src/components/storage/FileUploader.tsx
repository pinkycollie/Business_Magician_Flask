import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  allowedTypes?: string[];
  maxSizeMB?: number;
  onUploadComplete?: (fileUrl: string, fileName: string) => void;
  className?: string;
  buttonText?: string;
  showCategorySelect?: boolean;
}

interface FileUploadResponse {
  success: boolean;
  fileName: string;
  url: string;
  originalName: string;
  category: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.mp4'],
  maxSizeMB = 10,
  onUploadComplete,
  className = '',
  buttonText = 'Upload File',
  showCategorySelect = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [category, setCategory] = useState('other');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const categories = [
    { value: 'business-plans', label: 'Business Plans' },
    { value: 'marketing-materials', label: 'Marketing Materials' },
    { value: 'legal-documents', label: 'Legal Documents' },
    { value: 'financial-documents', label: 'Financial Documents' },
    { value: 'presentations', label: 'Presentations' },
    { value: 'asl-videos', label: 'ASL Videos' },
    { value: 'profile-pictures', label: 'Profile Pictures' },
    { value: 'other', label: 'Other' }
  ];

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json() as FileUploadResponse;
      
      // Set final progress to 100%
      setUploadProgress(100);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Upload Successful',
          description: `${data.originalName} has been uploaded.`,
        });
        
        // Call the callback with the file URL if provided
        if (onUploadComplete) {
          onUploadComplete(data.url, data.fileName);
        }
        
        // Reset state after successful upload
        setSelectedFile(null);
        setUploadProgress(0);
      }
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive'
      });
      setUploadProgress(0);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${maxSizeMB}MB.`,
        variant: 'destructive'
      });
      return;
    }

    // Check file type if allowed types are specified
    if (allowedTypes.length > 0) {
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExt) && !allowedTypes.includes('*')) {
        toast({
          title: 'File type not allowed',
          description: `Allowed file types: ${allowedTypes.join(', ')}`,
          variant: 'destructive'
        });
        return;
      }
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    
    uploadMutation.mutate(formData);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`border border-slate-200 ${className}`}>
      <CardContent className="p-4">
        <div 
          className={`border-2 border-dashed rounded-md p-6 ${
            isDragging ? 'border-primary bg-primary/5' : 'border-slate-300'
          } transition-colors flex flex-col items-center justify-center cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={selectedFile ? undefined : openFileSelector}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={allowedTypes.join(',')}
          />
          
          {!selectedFile ? (
            <>
              <Upload className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-slate-600 text-center mb-1">
                Drag & drop a file here or click to browse
              </p>
              <p className="text-slate-400 text-xs text-center">
                Allowed file types: {allowedTypes.join(', ')} (Max: {maxSizeMB}MB)
              </p>
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <File className="w-5 h-5 text-slate-500 mr-2" />
                  <span className="text-slate-700 text-sm truncate max-w-[180px]">
                    {selectedFile.name}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelectedFile();
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-xs text-slate-500 mb-2">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
              
              {uploadMutation.isPending && (
                <div className="mb-2">
                  <Progress value={uploadProgress} />
                  <p className="text-xs text-slate-500 mt-1">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
              
              {uploadMutation.isSuccess && (
                <div className="flex items-center text-green-600 text-xs">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  <span>Upload successful</span>
                </div>
              )}
              
              {uploadMutation.isError && (
                <div className="flex items-center text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>Upload failed</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex gap-3">
          {showCategorySelect && (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="flex-1"
          >
            {uploadMutation.isPending ? 'Uploading...' : buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;