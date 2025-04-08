import React, { useEffect } from 'react';
import LifecycleNav from '@/components/lifecycle/LifecycleNav';
import { Link } from 'wouter';
import { initializeHtmx } from '@/lib/htmx';
import { useQuery } from '@tanstack/react-query';
import JobMagicianSection from '@/components/hiring/JobMagicianSection';
import BusinessIdeaGenerator from '@/components/tools/BusinessIdeaGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LifecyclePhase {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
}

const BuildPhase: React.FC = () => {
  // Get phase information
  const { data: phases, isLoading: phasesLoading } = useQuery<LifecyclePhase[]>({
    queryKey: ['/api/lifecycle-phases'],
  });

  const buildPhase = phases?.find(phase => phase.slug === 'build');

  useEffect(() => {
    // Initialize HTMX after component has rendered
    initializeHtmx();
  }, []);

  // Check if phase is unlocked - in real app would depend on user progress
  const isPhaseUnlocked = true; // Just for demo purposes

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Business Lifecycle Navigation */}
      <section className="mb-12">
        <LifecycleNav />
      </section>

      {/* Current Phase: Build Phase */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            {phasesLoading ? 'Loading...' : (buildPhase?.name || 'Build')} Phase
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Phase 2 of 4</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full">
              <div className="w-2/4 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        {!isPhaseUnlocked ? (
          // Locked phase state
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6 text-center">
            <div className="mb-6">
              <i className="ri-lock-line text-5xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">Build Phase Coming Soon</h3>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              You need to complete the Idea phase tasks first before accessing the Build phase.
              Return to the Idea phase to continue your business formation journey.
            </p>
            <Link href="/phases/idea">
              <a className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2">
                <i className="ri-arrow-left-line"></i> 
                Return to Idea Phase
              </a>
            </Link>
          </div>
        ) : (
          // Unlocked phase content
          <Tabs defaultValue="business" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="business">Business Formation</TabsTrigger>
              <TabsTrigger value="hiring">Hiring</TabsTrigger>
              <TabsTrigger value="ai">AI Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="business">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Business Formation Tools</h3>
                <p className="text-slate-600 mb-4">
                  Use these tools to formally establish your business entity, register with necessary agencies, 
                  and set up the legal foundation for your business.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <span className="inline-block p-2 bg-primary/10 text-primary rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                    </div>
                    <h4 className="font-medium text-slate-900 mb-1">Entity Formation</h4>
                    <p className="text-sm text-slate-600 mb-4">Register your LLC, Corporation, or other legal entity</p>
                    <button className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium">
                      Start Formation
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <span className="inline-block p-2 bg-primary/10 text-primary rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </span>
                    </div>
                    <h4 className="font-medium text-slate-900 mb-1">EIN Application</h4>
                    <p className="text-sm text-slate-600 mb-4">Get your federal Employer Identification Number</p>
                    <button className="w-full py-2 px-4 border border-primary text-primary hover:bg-primary/5 rounded-lg text-sm font-medium">
                      Apply for EIN
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <span className="inline-block p-2 bg-primary/10 text-primary rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                    </div>
                    <h4 className="font-medium text-slate-900 mb-1">Annual Compliance</h4>
                    <p className="text-sm text-slate-600 mb-4">Set up reminders for annual filings and requirements</p>
                    <button className="w-full py-2 px-4 border border-primary text-primary hover:bg-primary/5 rounded-lg text-sm font-medium">
                      Setup Reminders
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hiring">
              <JobMagicianSection />
            </TabsContent>
            
            <TabsContent value="ai">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <BusinessIdeaGenerator />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Footer Navigation */}
        <section>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-slate-900">Ready to move to the next phase?</h3>
                <p className="text-slate-600">Complete your Build phase tasks to unlock the Grow phase</p>
              </div>
              <div className="flex gap-3">
                <Link href="/phases/idea">
                  <a className="bg-white text-slate-800 px-4 py-2 rounded-lg font-medium border border-slate-200 flex items-center gap-2 hover:bg-slate-50">
                    <i className="ri-arrow-left-line"></i> Previous
                  </a>
                </Link>
                <Link href="/phases/grow">
                  <a className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    Next <i className="ri-arrow-right-line"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default BuildPhase;
