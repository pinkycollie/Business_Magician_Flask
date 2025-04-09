import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Trash2, 
  ExternalLink, 
  Search,
  File,
  FileText,
  FileImage,
  FileVideo,
  FilePlus,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUploader from './FileUploader';

interface FileManagerProps {
  showUploader?: boolean;
  defaultCategory?: string;
  onFileSelect?: (fileUrl: string, fileName: string) => void;
  isSelectable?: boolean;
}

interface FileItem {
  fileName: string;
  signedUrl: string;
  publicUrl: string;
}

const FileManager: React.FC<FileManagerProps> = ({
  showUploader = true,
  defaultCategory = 'all',
  onFileSelect,
  isSelectable = false
}) => {
  const [activeTab, setActiveTab] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories = [
    { value: 'all', label: 'All Files' },
    { value: 'business-plans', label: 'Business Plans' },
    { value: 'marketing-materials', label: 'Marketing Materials' },
    { value: 'legal-documents', label: 'Legal Documents' },
    { value: 'financial-documents', label: 'Financial Documents' },
    { value: 'presentations', label: 'Presentations' },
    { value: 'asl-videos', label: 'ASL Videos' },
    { value: 'profile-pictures', label: 'Profile Pictures' },
    { value: 'other', label: 'Other' }
  ];

  // Query to fetch files based on the active category
  const { data: filesData, isLoading } = useQuery({
    queryKey: ['/api/storage/files', activeTab !== 'all' ? activeTab : null],
    queryFn: async () => {
      const endpoint = activeTab === 'all' 
        ? '/api/storage/files' 
        : `/api/storage/files/${activeTab}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      return data.files as string[];
    }
  });

  // Mutation to delete a file
  const deleteMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const response = await fetch(`/api/storage/file/${fileName}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the files query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/storage/files'] });
      toast({
        title: 'File Deleted',
        description: 'The file has been successfully deleted.'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete the file. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleFileUploadComplete = (fileUrl: string, fileName: string) => {
    // Refresh the file list after upload
    queryClient.invalidateQueries({ queryKey: ['/api/storage/files'] });
    
    // If a callback was provided, call it with the file info
    if (onFileSelect) {
      onFileSelect(fileUrl, fileName);
    }
  };

  const handleFileSelect = (fileUrl: string, fileName: string) => {
    if (onFileSelect && isSelectable) {
      onFileSelect(fileUrl, fileName);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteMutation.mutate(fileName);
    }
  };

  // Filter files based on search query
  const filteredFiles = filesData?.filter(fileName => {
    return fileName.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  // Function to get file type icon based on extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <FileImage className="w-5 h-5 text-purple-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'webm':
        return <FileVideo className="w-5 h-5 text-pink-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>File Manager</span>
          {showUploader && (
            <Button variant="outline" size="sm" className="gap-1">
              <FilePlus className="w-4 h-4" /> Upload New File
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showUploader && (
          <div className="mb-6">
            <FileUploader 
              onUploadComplete={handleFileUploadComplete}
              showCategorySelect={true}
            />
          </div>
        )}
        
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <Tabs 
          defaultValue={defaultCategory} 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-4 md:grid-cols-9 mb-4">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="text-xs"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* File List Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Loading files...
                    </TableCell>
                  </TableRow>
                ) : filteredFiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No files found{searchQuery ? ' matching your search' : ''}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFiles.map((fileName) => {
                    // Extract file name without path
                    const category = fileName.split('/')[0];
                    const displayName = fileName.split('/')[1];
                    const fileExtension = displayName.split('.').pop();
                    
                    return (
                      <TableRow 
                        key={fileName}
                        className={isSelectable ? 'cursor-pointer hover:bg-muted/50' : ''}
                        onClick={isSelectable ? () => handleFileSelect(
                          `https://storage.googleapis.com/business-magician-files/${fileName}`,
                          displayName
                        ) : undefined}
                      >
                        <TableCell className="py-2">
                          <div className="flex items-center">
                            {getFileIcon(fileName)}
                            <span className="ml-2 text-sm truncate max-w-[200px]">
                              {displayName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm uppercase text-muted-foreground">
                          {fileExtension}
                        </TableCell>
                        <TableCell className="text-sm capitalize">
                          {category.replace(/-/g, ' ')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Download"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `https://storage.googleapis.com/business-magician-files/${fileName}`,
                                  '_blank'
                                );
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(fileName);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FileManager;