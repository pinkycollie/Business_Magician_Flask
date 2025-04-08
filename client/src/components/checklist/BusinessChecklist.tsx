import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface Subtask {
  id: number;
  taskId: number;
  name: string;
  order: number;
}

interface Task {
  id: number;
  phaseId: number;
  name: string;
  description: string;
  order: number;
  hasASLVideo: boolean;
  aslVideoUrl?: string;
}

interface BusinessChecklistProps {
  phaseId: number;
  userId?: number;
}

const BusinessChecklist: React.FC<BusinessChecklistProps> = ({ phaseId, userId = 1 }) => {
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  const [taskProgress, setTaskProgress] = useState<{[key: number]: boolean}>({});

  // Fetch tasks for the phase
  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: [`/api/phases/${phaseId}/tasks`],
  });

  // Create a map of task IDs to track which ones to show
  const [visibleTasks, setVisibleTasks] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Initially show first 3 tasks
      const initialVisibleTasks = tasks.reduce((acc, task, index) => {
        acc[task.id] = index < 3;
        return acc;
      }, {} as {[key: number]: boolean});
      
      setVisibleTasks(initialVisibleTasks);
      
      // Initially expand the first task
      setExpandedTasks([tasks[0].id]);
    }
  }, [tasks]);

  // Fetch subtasks for each task
  const fetchSubtasks = (taskId: number) => {
    return useQuery<Subtask[]>({
      queryKey: [`/api/tasks/${taskId}/subtasks`],
      enabled: expandedTasks.includes(taskId),
    });
  };

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  const showMoreTasks = () => {
    if (tasks) {
      setVisibleTasks(
        tasks.reduce((acc, task) => {
          acc[task.id] = true;
          return acc;
        }, {} as {[key: number]: boolean})
      );
    }
  };

  // Progress mutation
  const progressMutation = useMutation({
    mutationFn: async ({ userId, subtaskId, completed }: { userId: number, subtaskId: number, completed: boolean }) => {
      const response = await fetch(`/api/users/${userId}/subtasks/${subtaskId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
    },
  });

  const handleSubtaskToggle = (subtaskId: number, checked: boolean) => {
    progressMutation.mutate({ userId, subtaskId, completed: checked });
    
    // Update local state for immediate feedback
    setTaskProgress(prev => ({
      ...prev,
      [subtaskId]: checked
    }));
  };

  // Fetch user progress
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/users/${userId}/progress`],
    enabled: !!userId,
  });

  useEffect(() => {
    if (userProgress) {
      const progressMap = userProgress.reduce((acc: {[key: number]: boolean}, progress: any) => {
        acc[progress.subtaskId] = progress.completed;
        return acc;
      }, {});
      
      setTaskProgress(progressMap);
    }
  }, [userProgress]);

  if (tasksLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 animate-pulse">
        <div className="border-b border-slate-100 p-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="p-4 space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="py-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                </div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-full mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-4 bg-slate-100 rounded w-1/2"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="border-b border-slate-100 p-4 flex justify-between items-center">
        <h3 className="font-medium text-lg text-slate-800">360 Business Basic Checklist</h3>
        <div className="flex items-center gap-2">
          <button aria-label="ASL Video for Checklist" className="p-1.5 text-primary hover:bg-primary/5 rounded-md">
            <i className="ri-sign-language-line text-lg"></i>
          </button>
          <button 
            aria-label="Expand All" 
            className="p-1.5 text-slate-500 hover:bg-slate-50 rounded-md"
            onClick={() => tasks && setExpandedTasks(tasks.map(t => t.id))}
          >
            <i className="ri-expand-height-line text-lg"></i>
          </button>
        </div>
      </div>
      
      <div className="p-4 divide-y divide-slate-100">
        {tasks?.map((task, index) => (
          visibleTasks[task.id] && (
            <div key={task.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${expandedTasks.includes(task.id) 
                        ? 'border-primary bg-primary/10' 
                        : 'border-slate-300 bg-white'}`}
                    onClick={() => toggleTaskExpansion(task.id)}
                  >
                    {expandedTasks.includes(task.id) && (
                      <i className="ri-check-line text-primary text-sm"></i>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between mb-1">
                    <h4 
                      className="text-base font-medium text-slate-900 cursor-pointer"
                      onClick={() => toggleTaskExpansion(task.id)}
                    >
                      {index + 1}. {task.name}
                    </h4>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      #{task.name.replace(/\s+/g, '')}
                    </span>
                  </div>
                  <div className="mb-3 text-slate-600 text-sm">
                    {task.description}
                  </div>
                  
                  {expandedTasks.includes(task.id) && (
                    <SubtaskList 
                      taskId={task.id} 
                      progress={taskProgress}
                      onToggle={handleSubtaskToggle}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        ))}
        
        {tasks && tasks.length > 0 && tasks.some(task => !visibleTasks[task.id]) && (
          <div className="py-4">
            <button 
              className="flex w-full items-center justify-between text-left"
              onClick={showMoreTasks}
            >
              <div className="flex items-center">
                <i className="ri-add-line text-lg text-slate-400 mr-2"></i>
                <span className="text-slate-600">
                  {tasks.filter(task => !visibleTasks[task.id]).length} more steps
                </span>
              </div>
              <span className="text-xs text-slate-500">Click to expand</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface SubtaskListProps {
  taskId: number;
  progress: {[key: number]: boolean};
  onToggle: (subtaskId: number, checked: boolean) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({ taskId, progress, onToggle }) => {
  const { data: subtasks, isLoading } = useQuery<Subtask[]>({
    queryKey: [`/api/tasks/${taskId}/subtasks`],
  });

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-6 bg-slate-100 rounded"></div>
        ))}
      </div>
    );
  }

  if (!subtasks || subtasks.length === 0) {
    return <div className="text-sm text-slate-400">No subtasks found</div>;
  }

  return (
    <div className="space-y-2">
      {subtasks.map(subtask => (
        <div key={subtask.id} className="flex items-center" hx-boost="true">
          <input 
            id={`subtask-${subtask.id}`} 
            type="checkbox" 
            checked={progress[subtask.id] || false}
            onChange={(e) => onToggle(subtask.id, e.target.checked)}
            className="h-4 w-4 text-primary rounded border-slate-300 focus:ring-primary"
            hx-post={`/api/users/1/subtasks/${subtask.id}/progress`}
            hx-vals={`{"completed": ${!progress[subtask.id]}}`}
            hx-trigger="click[ctrlKey]"
            hx-swap="none"
          />
          <label 
            htmlFor={`subtask-${subtask.id}`} 
            className="ml-2 text-sm text-slate-700"
          >
            {subtask.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default BusinessChecklist;
