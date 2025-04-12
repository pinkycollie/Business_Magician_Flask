import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileUploader } from '@/components/storage/FileUploader';
import { FileBrowser } from '@/components/storage/FileBrowser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpenIcon, UploadIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const StoragePage: React.FC = () => {
  // In a real app, this would come from authentication
  const userId = 1;
  
  const [activeTab, setActiveTab] = useState<string>('manage');
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  const handleUploadComplete = (fileData: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    category: string;
  }) => {
    toast({
      title: 'File Uploaded Successfully',
      description: `${fileData.fileName} has been uploaded to the ${fileData.category} category.`,
      variant: 'default',
    });
    
    // Switch to manage tab to see the uploaded file
    setActiveTab('manage');
    setCurrentCategory(fileData.category);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Document Storage</h1>
      
      <Alert className="mb-6">
        <AlertTitle>Google Cloud Storage Integration</AlertTitle>
        <AlertDescription>
          All files are securely stored in Google Cloud Storage with encryption at rest and in transit.
          Files are organized by category and user for easy management.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Secure Cloud Storage</CardTitle>
            <CardDescription>
              Upload, manage, and share your business documents securely. All files are stored with encryption and accessible only to authorized users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manage" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manage" className="flex items-center gap-2">
                  <FolderOpenIcon className="h-4 w-4" />
                  <span>Manage Files</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <UploadIcon className="h-4 w-4" />
                  <span>Upload Files</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manage">
                <FileBrowser 
                  userId={userId}
                  category={currentCategory}
                  showFilePreview={true}
                  showDeleteOption={true}
                  onFileSelect={(file) => {
                    console.log('Selected file:', file);
                    // In a real app, you might show a detail modal or navigate to a detail page
                  }}
                />
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="md:max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-4">Upload New File</h3>
                  <FileUploader 
                    userId={userId}
                    onUploadComplete={handleUploadComplete}
                    maxFileSizeMB={50}
                  />
                  
                  <div className="mt-6 bg-muted/40 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2">File Upload Tips</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
                      <li>Maximum file size is 50MB</li>
                      <li>For larger files, consider compressing them first</li>
                      <li>Supported formats include PDF, DOC, JPG, PNG, and more</li>
                      <li>Files are automatically categorized based on type (documents, images, etc.)</li>
                      <li>You can use uploaded files in business proposals and ASL translation requests</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoragePage;