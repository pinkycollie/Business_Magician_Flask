import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import FileManager from '@/components/storage/FileManager';
import FileUploader from '@/components/storage/FileUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpenIcon, UploadIcon } from 'lucide-react';

const StoragePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Document Storage</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Secure Cloud Storage</CardTitle>
            <CardDescription>
              Upload, manage, and share your business documents securely. All files are stored with encryption and accessible only to authorized users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manage">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manage" className="flex items-center gap-2">
                  <FolderOpenIcon className="h-4 w-4" />
                  <span>Manage Files</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <UploadIcon className="h-4 w-4" />
                  <span>Quick Upload</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manage">
                <FileManager showUploader={false} />
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-4">Upload New File</h3>
                  <FileUploader 
                    onUploadComplete={(url, fileName) => {
                      console.log('Uploaded file:', url);
                    }}
                  />
                  
                  <div className="mt-6 bg-muted/40 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2">File Upload Tips</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
                      <li>Maximum file size is 10MB</li>
                      <li>For larger files, consider compressing them first</li>
                      <li>Supported formats include PDF, DOC, JPG, PNG, and more</li>
                      <li>Categorize your files appropriately for easier organization</li>
                      <li>All files are automatically backed up and encrypted</li>
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