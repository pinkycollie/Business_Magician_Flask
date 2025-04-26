import React, { useState, useEffect, MouseEvent } from 'react';
import EntrepreneurJourneyTracker from '@/components/journey/EntrepreneurJourneyTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Share2, FileText, Download, Video, Award, ArrowRight, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JourneyTrackerPage() {
  const [currentPhase, setCurrentPhase] = useState('idea');
  const [view, setView] = useState('progress');
  const [showMilestone, setShowMilestone] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(6);
  const [totalTasks, setTotalTasks] = useState(24);
  
  // Milestone effect when completing tasks
  useEffect(() => {
    // This would be triggered when a task is completed in a real app
    const timeout = setTimeout(() => {
      setShowMilestone(true);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Calculate progress
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Entrepreneur Journey</h1>
          <p className="text-slate-500 mt-1">
            Track your progress and manage tasks across different business phases
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="default" size="sm" className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            <span>ASL Explanation</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Phase</CardTitle>
            <CardDescription>Select your current business phase</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={currentPhase} onValueChange={setCurrentPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Select phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea Phase</SelectItem>
                <SelectItem value="build">Build Phase</SelectItem>
                <SelectItem value="grow">Growth Phase</SelectItem>
                <SelectItem value="manage">Management Phase</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Quick Stats */}
            <div className="mt-6 space-y-3">
              <motion.div 
                className="flex justify-between items-center text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-slate-500">Overall Progress</span>
                <motion.span 
                  className="font-medium"
                  key={progressPercentage}
                  initial={{ scale: 1.3, color: "#6d28d9" }}
                  animate={{ scale: 1, color: "#000000" }}
                  transition={{ duration: 0.5 }}
                >
                  {progressPercentage}%
                </motion.span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-slate-500">Completed Tasks</span>
                <span className="font-medium">{completedTasks}/{totalTasks}</span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-slate-500">Time in Current Phase</span>
                <span className="font-medium">3 weeks</span>
              </motion.div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Phase Resources</CardTitle>
            <CardDescription>Helpful resources for your current phase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="p-4 border rounded-md border-amber-200 bg-amber-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"
                    whileHover={{ rotate: 10 }}
                  >
                    <FileText className="h-4 w-4" />
                  </motion.div>
                  <h3 className="font-medium">Business Model Canvas</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  A strategic management template for developing new or documenting existing business models.
                </p>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-amber-700">
                    Access Template
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="p-4 border rounded-md border-purple-200 bg-purple-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"
                    whileHover={{ rotate: 10 }}
                  >
                    <Video className="h-4 w-4" />
                  </motion.div>
                  <h3 className="font-medium">ASL Market Research Guide</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Video guide on conducting effective market research with deaf-friendly methodologies.
                </p>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-purple-700">
                    Watch Video
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="p-4 border rounded-md border-blue-200 bg-blue-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
                    whileHover={{ rotate: 10 }}
                  >
                    <FileText className="h-4 w-4" />
                  </motion.div>
                  <h3 className="font-medium">Competitive Analysis</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Template and guide for analyzing competitors in your market segment.
                </p>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-blue-700">
                    Access Template
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={view} onValueChange={setView} className="mt-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="resources">Phase Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="mt-0">
          <EntrepreneurJourneyTracker currentPhase={currentPhase} />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Timeline View</CardTitle>
              <CardDescription>Visualize your business journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-96 bg-slate-50 rounded-md border border-dashed border-slate-300">
                <p className="text-slate-500">Timeline visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Phase Resources</CardTitle>
              <CardDescription>Access resources specific to your current phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-96 bg-slate-50 rounded-md border border-dashed border-slate-300">
                <p className="text-slate-500">Resources catalog will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Milestone Achievement Popup */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMilestone(false)}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 w-full max-w-md relative overflow-hidden"
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button 
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-800"
                onClick={() => setShowMilestone(false)}
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex justify-center mb-4">
                <motion.div 
                  className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"
                  initial={{ rotate: -180, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ 
                    type: "spring",
                    damping: 10,
                    stiffness: 100,
                    delay: 0.1
                  }}
                >
                  <Award className="h-8 w-8" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-center mb-2">Milestone Achieved!</h3>
                <p className="text-slate-600 text-center mb-4">
                  You've completed 25% of tasks in the Idea Phase!
                </p>
                
                <div className="flex gap-2 flex-wrap mb-4">
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                    <Star className="h-3.5 w-3.5" />
                    <span>25% Progress</span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                    <Award className="h-3.5 w-3.5" />
                    <span>First Milestone</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                    onClick={() => setShowMilestone(false)}
                  >
                    Continue Working
                  </button>
                  <motion.button 
                    className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>View ASL Explanation</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}