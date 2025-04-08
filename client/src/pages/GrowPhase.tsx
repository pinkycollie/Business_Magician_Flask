import React, { useEffect } from 'react';
import LifecycleNav from '@/components/lifecycle/LifecycleNav';
import { Link } from 'wouter';
import { initializeHtmx } from '@/lib/htmx';
import { useQuery } from '@tanstack/react-query';

interface LifecyclePhase {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
}

const GrowPhase: React.FC = () => {
  // Get phase information
  const { data: phases, isLoading: phasesLoading } = useQuery<LifecyclePhase[]>({
    queryKey: ['/api/lifecycle-phases'],
  });

  const growPhase = phases?.find(phase => phase.slug === 'grow');

  useEffect(() => {
    // Initialize HTMX after component has rendered
    initializeHtmx();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Business Lifecycle Navigation */}
      <section className="mb-12">
        <LifecycleNav />
      </section>

      {/* Current Phase: Grow Phase */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            {phasesLoading ? 'Loading...' : (growPhase?.name || 'Grow')} Phase
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Phase 3 of 4</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full">
              <div className="w-3/4 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6 text-center">
          <div className="mb-6">
            <i className="ri-lock-line text-5xl text-slate-300"></i>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">Grow Phase Coming Soon</h3>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            You need to complete the Build phase tasks first before accessing the Grow phase.
            Return to the Idea phase to continue your business formation journey.
          </p>
          <Link href="/phases/idea">
            <a className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2">
              <i className="ri-arrow-left-line"></i> 
              Return to Idea Phase
            </a>
          </Link>
        </div>

        {/* Footer Navigation */}
        <section>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-slate-900">Ready to move to the next phase?</h3>
                <p className="text-slate-600">Complete your Build phase tasks to unlock this phase</p>
              </div>
              <div className="flex gap-3">
                <Link href="/phases/build">
                  <a className="bg-white text-slate-800 px-4 py-2 rounded-lg font-medium border border-slate-200 flex items-center gap-2 hover:bg-slate-50">
                    <i className="ri-arrow-left-line"></i> Previous
                  </a>
                </Link>
                <button disabled className="bg-slate-200 text-slate-500 cursor-not-allowed px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  Next <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default GrowPhase;
