import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  LightbulbIcon, 
  Building2, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  Award
} from 'lucide-react';

// Define the journey phases
const JOURNEY_PHASES = [
  { 
    id: 'idea', 
    name: 'Idea Phase', 
    description: 'Develop and validate your business concept', 
    icon: <LightbulbIcon className="h-6 w-6" />, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-100' 
  },
  { 
    id: 'build', 
    name: 'Build Phase', 
    description: 'Create your MVP and establish operations', 
    icon: <Building2 className="h-6 w-6" />, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-100' 
  },
  { 
    id: 'grow', 
    name: 'Growth Phase', 
    description: 'Expand your customer base and scale operations', 
    icon: <TrendingUp className="h-6 w-6" />, 
    color: 'text-green-500',
    bgColor: 'bg-green-100' 
  },
  { 
    id: 'manage', 
    name: 'Management Phase', 
    description: 'Optimize operations and ensure long-term success', 
    icon: <BarChart3 className="h-6 w-6" />, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-100' 
  },
];

interface Task {
  id: number;
  name: string;
  completed: boolean;
  phaseId: string;
}

interface EntrepreneurJourneyTrackerProps {
  currentPhase?: string;
  showDetails?: boolean;
}

export default function EntrepreneurJourneyTracker({ 
  currentPhase = 'idea', 
  showDetails = true 
}: EntrepreneurJourneyTrackerProps) {
  const [animateProgress, setAnimateProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(currentPhase);
  
  // Mock tasks data - in a real app, this would come from an API
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Develop business concept', completed: true, phaseId: 'idea' },
    { id: 2, name: 'Research target market', completed: true, phaseId: 'idea' },
    { id: 3, name: 'Create business model canvas', completed: false, phaseId: 'idea' },
    { id: 4, name: 'Conduct competitive analysis', completed: false, phaseId: 'idea' },
    { id: 5, name: 'Build initial prototype', completed: false, phaseId: 'build' },
    { id: 6, name: 'Set up business entity', completed: false, phaseId: 'build' },
    { id: 7, name: 'Develop marketing strategy', completed: false, phaseId: 'grow' },
    { id: 8, name: 'Implement financial systems', completed: false, phaseId: 'manage' },
  ]);
  
  // Calculate progress percentage
  useEffect(() => {
    // Find current phase index
    const currentPhaseIndex = JOURNEY_PHASES.findIndex(phase => phase.id === currentPhase);
    
    // Calculate tasks completed in current phase
    const phaseTasks = tasks.filter(task => task.phaseId === currentPhase);
    const completedPhaseTasks = phaseTasks.filter(task => task.completed);
    
    // Phase progress (tasks completed / total tasks in phase)
    const phaseProgress = phaseTasks.length > 0 
      ? (completedPhaseTasks.length / phaseTasks.length) * 25
      : 0;
    
    // Overall progress (phases completed + current phase progress)
    const overallProgress = (currentPhaseIndex * 25) + phaseProgress;
    
    // Animate progress
    setAnimateProgress(true);
    setTimeout(() => {
      setProgress(overallProgress);
    }, 500);
  }, [currentPhase, tasks]);
  
  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };
  
  const getPhaseStatus = (phaseId: string) => {
    const phaseIndex = JOURNEY_PHASES.findIndex(phase => phase.id === phaseId);
    const currentPhaseIndex = JOURNEY_PHASES.findIndex(phase => phase.id === currentPhase);
    
    if (phaseIndex < currentPhaseIndex) return 'completed';
    if (phaseIndex === currentPhaseIndex) return 'current';
    return 'upcoming';
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Your Entrepreneur Journey</h2>
          <div className="text-sm font-medium">{Math.round(progress)}% Complete</div>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Phase Indicators */}
        <div className="flex justify-between mt-1 relative">
          {JOURNEY_PHASES.map((phase, index) => {
            const phasePosition = index * 33.3;
            const status = getPhaseStatus(phase.id);
            
            return (
              <div 
                key={phase.id} 
                className="absolute transform -translate-x-1/2"
                style={{ left: `${index === 0 ? 0 : index === JOURNEY_PHASES.length - 1 ? 100 : phasePosition}%` }}
              >
                <motion.div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${status === 'completed' 
                      ? 'bg-purple-500 text-white' 
                      : status === 'current' 
                        ? `${JOURNEY_PHASES[index].bgColor} ${JOURNEY_PHASES[index].color}` 
                        : 'bg-gray-100 text-gray-400'}
                  `}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: status === 'current' ? 1.1 : 1,
                    opacity: 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    phase.icon
                  )}
                </motion.div>
                <div className="text-xs font-medium mt-1 text-center" style={{ width: '80px', marginLeft: '-30px' }}>
                  {phase.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Phase Details Accordion */}
      {showDetails && (
        <div className="mt-12 space-y-4">
          {JOURNEY_PHASES.map((phase) => {
            const status = getPhaseStatus(phase.id);
            const isExpanded = expandedPhase === phase.id;
            const phaseTasks = tasks.filter(task => task.phaseId === phase.id);
            
            return (
              <Card 
                key={phase.id} 
                className={`
                  overflow-hidden transition-all duration-300
                  ${status === 'current' ? 'border-2 border-purple-400' : ''}
                `}
              >
                <div 
                  className={`
                    p-4 flex justify-between items-center cursor-pointer
                    ${isExpanded ? `${phase.bgColor} ${phase.color}` : 'hover:bg-slate-50'}
                  `}
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${phase.bgColor} ${phase.color}
                    `}>
                      {phase.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{phase.name}</h3>
                      <p className="text-sm text-slate-500">{phase.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {status === 'current' && (
                      <span className="text-xs bg-purple-100 text-purple-800 py-1 px-2 rounded-full">
                        Current Phase
                      </span>
                    )}
                    {status === 'completed' && (
                      <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                        Completed
                      </span>
                    )}
                    {status === 'upcoming' && (
                      <span className="text-xs bg-slate-100 text-slate-800 py-1 px-2 rounded-full">
                        Upcoming
                      </span>
                    )}
                    <svg 
                      className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Phase Tasks */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <CardContent className="p-4 pt-0">
                    {phaseTasks.length > 0 ? (
                      <ul className="mt-4 space-y-3">
                        {phaseTasks.map(task => (
                          <motion.li 
                            key={task.id} 
                            className={`
                              flex items-start gap-3 p-3 rounded-md 
                              ${task.completed ? 'bg-slate-50' : 'hover:bg-slate-50'}
                              border border-slate-200 shadow-sm
                            `}
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.1}
                            whileDrag={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            whileHover={{ scale: 1.02 }}
                            onDragEnd={() => {
                              // In a real implementation, this would check if the item was dragged 
                              // to a different phase area and update the task's phase accordingly
                              console.log('Task was dragged');
                            }}
                          >
                            <div 
                              className={`
                                flex-shrink-0 w-5 h-5 mt-0.5 border rounded-md cursor-pointer
                                ${task.completed ? 'bg-purple-500 border-purple-500' : 'border-slate-300'}
                              `}
                              onClick={() => toggleTask(task.id)}
                            >
                              {task.completed && (
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <span className={task.completed ? 'line-through text-slate-500' : 'font-medium'}>
                                {task.name}
                              </span>
                              <div className="flex items-center mt-1 text-xs text-slate-500">
                                <span className="bg-slate-100 px-2 py-0.5 rounded-full">
                                  Drag to reorder or change phase
                                </span>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-4 text-center text-slate-500">
                        No tasks available for this phase
                      </div>
                    )}
                    
                    {status === 'current' && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <motion.button 
                          className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-purple-50"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add New Task
                        </motion.button>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Achievement Banner for Current Phase */}
      {currentPhase && (
        <motion.div 
          className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-5 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                You're making great progress!
              </h3>
              <p className="opacity-90">
                {JOURNEY_PHASES.find(phase => phase.id === currentPhase)?.description}
              </p>
              <div className="mt-3 flex gap-2">
                <motion.button 
                  className="px-4 py-1.5 bg-white text-purple-700 rounded-md text-sm font-medium hover:bg-purple-50 hover:text-purple-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Resources
                </motion.button>
                <motion.button 
                  className="px-4 py-1.5 bg-transparent border border-white rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    ASL Guidance
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}