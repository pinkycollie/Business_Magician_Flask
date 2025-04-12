import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { File as StorageFile, formatFileSize, formatDate, isImage } from '@/lib/storage';
import { 
  FileIcon, 
  ImageIcon, 
  VideoIcon, 
  FileAudioIcon, 
  FileTextIcon, 
  TrashIcon, 
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon
} from 'lucide-react';

interface FileBrowserProps {
  userId: number;
  category?: string;
  showFilePreview?: boolean;
  showDeleteOption?: boolean;
  onFileSelect?: (file: StorageFile) => void;
}

// Using StorageFile consistently throughout the component

export function FileBrowser({
  userId,
  category,
  showFilePreview = true,
  showDeleteOption = true,
  onFileSelect
}: FileBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch file categories
  const categoriesQuery = useQuery({
    queryKey: ['/api/storage/categories'],
    queryFn: async () => {
      const response = await apiRequest('/api/storage/categories');
      return response as string[];
    }
  });
  
  // Fetch files
  const filesQuery = useQuery({
    queryKey: ['/api/storage/files', userId, selectedCategory],
    queryFn: async () => {
      const url = `/api/storage/files/${userId}${selectedCategory ? `?category=${selectedCategory}` : ''}`;
      const response = await apiRequest(url);
      return response as StorageFile[];
    }
  });
  
  // Delete file mutation
  const deleteMutation = useMutation<void, Error, { filePath: string }>({
    mutationFn: async (filePathData) => {
      return apiRequest<void>('/api/storage/files', {
        method: 'DELETE',
        body: JSON.stringify(filePathData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      // Invalidate files query to reload the list
      queryClient.invalidateQueries({ queryKey: ['/api/storage/files', userId, selectedCategory] });
      
      toast({
        title: 'File Deleted',
        description: 'The file has been successfully deleted.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete the file. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Filter files based on search query
  const filteredFiles = filesQuery.data 
    ? filesQuery.data.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // Get file icon based on content type
  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-blue-500" />;
    if (contentType.startsWith('video/')) return <VideoIcon className="h-8 w-8 text-purple-500" />;
    if (contentType.startsWith('audio/')) return <FileAudioIcon className="h-8 w-8 text-green-500" />;
    if (contentType === 'application/pdf' || contentType.includes('document')) return <FileTextIcon className="h-8 w-8 text-red-500" />;
    return <FileIcon className="h-8 w-8 text-slate-500" />;
  };
  
  // Handle file selection
  const handleFileClick = (file: StorageFile) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };
  
  // Handle file deletion
  const handleDeleteFile = (filePath: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      deleteMutation.mutate({ filePath });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="text-xl">Your Files</CardTitle>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Category filter */}
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => setSelectedCategory(value || undefined)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <FilterIcon className="h-4 w-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categoriesQuery.data?.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Search input */}
            <div className="relative">
              <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            
            {/* Refresh button */}
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/storage/files', userId, selectedCategory] })}
              disabled={filesQuery.isLoading}
              className="px-3"
            >
              <RefreshCwIcon className={`h-4 w-4 ${filesQuery.isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filesQuery.isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            {searchQuery 
              ? 'No files match your search criteria.' 
              : 'No files found. Upload some files to get started.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFiles.map((file, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getFileIcon(file.contentType)}
                    <div className="ml-3">
                      <h3 className="font-medium truncate max-w-[150px]" title={file.name}>
                        {file.name}
                      </h3>
                      <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(file.updated)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-blue-500 p-1"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </a>
                    
                    {showDeleteOption && (
                      <button 
                        onClick={(e) => handleDeleteFile(`users/${userId}/${selectedCategory || 'other'}/${file.name}`, e)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {showFilePreview && isImage(file.contentType) && (
                  <div className="mt-3">
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}