import React from 'react';
import SBAResourceLibrary from '@/components/resources/SBAResourceLibrary';
import ASLBusinessDictionary from '@/components/resources/ASLBusinessDictionary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, Video, Users, BookMarked, MessageSquare } from 'lucide-react';

export default function ResourceLibraryPage() {
  const [currentTab, setCurrentTab] = React.useState('sba');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Business Resource Library</h1>
          <p className="text-slate-500 mt-1">
            Access curated resources, guides, and tools to help you succeed
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-blue-700" />
              </div>
              <CardTitle className="text-lg">SBA Resources</CardTitle>
            </div>
            <CardDescription>
              Access resources and guidance aligned with Small Business Administration principles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              <p>• Business planning templates</p>
              <p>• Funding guidance</p>
              <p>• Legal structure resources</p>
              <p>• Operations management</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Video className="h-4 w-4 text-purple-700" />
              </div>
              <CardTitle className="text-lg">ASL Resources</CardTitle>
            </div>
            <CardDescription>
              ASL video resources covering key business topics for deaf entrepreneurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              <p>• Business term explanations</p>
              <p>• How-to guides in ASL</p>
              <p>• Visual business planning</p>
              <p>• Deaf-friendly communication</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-700" />
              </div>
              <CardTitle className="text-lg">Community Resources</CardTitle>
            </div>
            <CardDescription>
              Connect with other deaf entrepreneurs and access community support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              <p>• Mentor connections</p>
              <p>• Peer networking</p>
              <p>• Community events</p>
              <p>• Success stories</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="sba">
            <BookMarked className="h-4 w-4 mr-2" />
            SBA Resources
          </TabsTrigger>
          <TabsTrigger value="asl">
            <Video className="h-4 w-4 mr-2" />
            ASL Resources
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="h-4 w-4 mr-2" />
            Community
          </TabsTrigger>
        </TabsList>

        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="sba" className="mt-0">
            <SBAResourceLibrary />
          </TabsContent>

          <TabsContent value="asl" className="mt-0">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    ASL Resources
                  </h2>
                  <p className="text-slate-500">
                    Access business resources, guides, and term definitions in American Sign Language
                  </p>
                </div>
              </div>
              
              <Tabs defaultValue="dictionary">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="dictionary">Business Dictionary</TabsTrigger>
                  <TabsTrigger value="tutorials">ASL Tutorials</TabsTrigger>
                  <TabsTrigger value="guides">Business Guides</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dictionary" className="mt-0">
                  <ASLBusinessDictionary />
                </TabsContent>
                
                <TabsContent value="tutorials" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>ASL Business Tutorials</CardTitle>
                      <CardDescription>Step-by-step video tutorials for business concepts in ASL</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center h-72 bg-slate-50 rounded-md border border-dashed border-slate-300">
                        <p className="text-slate-500">ASL tutorial library coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="guides" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>ASL Business Guides</CardTitle>
                      <CardDescription>Comprehensive business guides with ASL video support</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center h-72 bg-slate-50 rounded-md border border-dashed border-slate-300">
                        <p className="text-slate-500">ASL business guides coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Deaf Entrepreneur Community</CardTitle>
                <CardDescription>Connect with other deaf business owners and supporters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-96 bg-slate-50 rounded-md border border-dashed border-slate-300">
                  <p className="text-slate-500">Community features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}