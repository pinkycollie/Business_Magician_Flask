import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface LifecyclePhase {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
}

const LifecycleNav: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [activePhase, setActivePhase] = useState<string>('idea');

  const { data: phases, isLoading, error } = useQuery<LifecyclePhase[]>({
    queryKey: ['/api/lifecycle-phases'],
  });

  useEffect(() => {
    // Extract current phase from URL
    const currentPhase = location.split('/').pop();
    if (currentPhase && ['idea', 'build', 'grow', 'manage'].includes(currentPhase)) {
      setActivePhase(currentPhase);
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
        <div className="flex flex-wrap md:flex-nowrap animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 p-4 rounded-lg bg-slate-100">
              <div className="h-6 bg-slate-200 rounded w-16 mx-auto mb-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center text-red-500">
        Error loading lifecycle phases
      </div>
    );
  }

  const getPhaseIcon = (slug: string) => {
    switch (slug) {
      case 'idea':
        return 'ri-lightbulb-flash-line';
      case 'build':
        return 'ri-hammer-line';
      case 'grow':
        return 'ri-line-chart-line';
      case 'manage':
        return 'ri-settings-5-line';
      default:
        return 'ri-question-line';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
      <div className="flex flex-wrap md:flex-nowrap">
        {phases?.map((phase) => (
          <Link key={phase.id} href={`/phases/${phase.slug}`}>
            <a
              className={`flex-1 p-4 rounded-lg font-medium flex flex-col items-center justify-center ${
                activePhase === phase.slug 
                  ? 'bg-primary text-white' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
              data-phase={phase.slug}
              hx-get={`/api/phases/${phase.id}/tasks`}
              hx-trigger="click"
              hx-target="#phase-content"
              hx-swap="innerHTML"
            >
              <i className={`${getPhaseIcon(phase.slug)} text-2xl mb-1`}></i>
              <span>{phase.name}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LifecycleNav;
