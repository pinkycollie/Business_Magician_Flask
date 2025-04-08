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

const ManagePhase: React.FC = () => {
  // Get phase information
  const { data: phases, isLoading: phasesLoading } = useQuery<LifecyclePhase[]>({
    queryKey: ['/api/lifecycle-phases'],
  });

  const managePhase = phases?.find(phase => phase.slug === 'manage');

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

      {/* Current Phase: Manage Phase */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            {phasesLoading ? 'Loading...' : (managePhase?.name || 'Manage')} Phase
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Phase 4 of 4</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full">
              <div className="w-full h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6 text-center">
          <div className="mb-6">
            <i className="ri-lock-line text-5xl text-slate-300"></i>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">Manage Phase Coming Soon</h3>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            You need to complete the Grow phase tasks first before accessing the Manage phase.
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
                <h3 className="text-lg font-medium text-slate-900">Ready to complete your business journey?</h3>
                <p className="text-slate-600">Complete your Grow phase tasks to unlock this phase</p>
              </div>
              <div className="flex gap-3">
                <Link href="/phases/grow">
                  <a className="bg-white text-slate-800 px-4 py-2 rounded-lg font-medium border border-slate-200 flex items-center gap-2 hover:bg-slate-50">
                    <i className="ri-arrow-left-line"></i> Previous
                  </a>
                </Link>
                <button disabled className="bg-slate-200 text-slate-500 cursor-not-allowed px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  Complete <i className="ri-check-line"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Features Specific to Manage Phase */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4 font-heading text-slate-800">Business Management Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <i className="ri-file-chart-line text-primary text-2xl"></i>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Financial Management</h4>
                <p className="text-xs text-slate-500">Track revenue, expenses, and financial forecasts</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">Comprehensive financial tools for business owners, including accounting, invoicing, and tax preparation.</p>
            <div className="text-center">
              <button disabled className="w-full py-2 px-4 border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                <i className="ri-lock-line"></i>
                Coming Soon
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <i className="ri-team-line text-primary text-2xl"></i>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">HR & Team Management</h4>
                <p className="text-xs text-slate-500">Hiring, payroll, and employee management</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">Tools to help you build and manage your team, including job postings, employee onboarding, and benefits administration.</p>
            <div className="text-center">
              <button disabled className="w-full py-2 px-4 border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                <i className="ri-lock-line"></i>
                Coming Soon
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <i className="ri-customer-service-2-line text-primary text-2xl"></i>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Customer Relationship</h4>
                <p className="text-xs text-slate-500">CRM tools and customer support systems</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">Manage your customer relationships effectively with tools for communication, support, and loyalty programs.</p>
            <div className="text-center">
              <button disabled className="w-full py-2 px-4 border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                <i className="ri-lock-line"></i>
                Coming Soon
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <i className="ri-bar-chart-grouped-line text-primary text-2xl"></i>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Business Analytics</h4>
                <p className="text-xs text-slate-500">Performance metrics and KPI tracking</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">Data-driven insights to help you understand your business performance and make informed decisions.</p>
            <div className="text-center">
              <button disabled className="w-full py-2 px-4 border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                <i className="ri-lock-line"></i>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ASL Management Resources */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold font-heading text-slate-800">ASL Business Management Resources</h3>
          <button disabled className="text-sm text-slate-400 cursor-not-allowed flex items-center gap-1">
            View All <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="relative aspect-video bg-slate-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-sign-language-line text-5xl text-slate-300"></i>
                </div>
                <span className="absolute top-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded">ASL</span>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-slate-900">Coming Soon</h4>
                <p className="text-sm text-slate-600 mt-1">ASL resources for the Manage phase will be available soon</p>
                <button disabled className="mt-3 text-slate-400 text-sm font-medium flex items-center gap-1 cursor-not-allowed">
                  <i className="ri-play-circle-line"></i> Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ManagePhase;
