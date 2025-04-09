import React, { useEffect } from 'react';
import LifecycleNav from '@/components/lifecycle/LifecycleNav';
import BusinessChecklist from '@/components/checklist/BusinessChecklist';
import ToolCard from '@/components/tools/ToolCard';
import MVPSuccessStories from '@/components/home/MVPSuccessStories';
import ASLResourceCard from '@/components/asl/ASLResourceCard';
import BusinessMagicianGPT from '@/components/tools/BusinessMagicianGPT';
import TelegramBotLink from '@/components/tools/TelegramBotLink';
import { useQuery } from '@tanstack/react-query';
import { initializeHtmx } from '@/lib/htmx';

interface LifecyclePhase {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
}

interface Tool {
  id: number;
  name: string;
  description: string;
  phaseId: number;
  toolType: string;
  actionText: string;
  actionUrl: string;
}

interface ASLVideo {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
}

const IdeaPhase: React.FC = () => {
  // Get phase information
  const { data: phases, isLoading: phasesLoading } = useQuery<LifecyclePhase[]>({
    queryKey: ['/api/lifecycle-phases'],
  });

  const ideaPhase = phases?.find(phase => phase.slug === 'idea');

  // Get tools for the idea phase
  const { data: tools, isLoading: toolsLoading } = useQuery<Tool[]>({
    queryKey: [`/api/phases/${ideaPhase?.id}/tools`],
    enabled: !!ideaPhase?.id,
  });

  // Get ASL videos for the idea phase
  const { data: aslVideos, isLoading: videosLoading } = useQuery<ASLVideo[]>({
    queryKey: ['/api/asl-videos', { phaseId: ideaPhase?.id }],
    enabled: !!ideaPhase?.id,
  });

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

      {/* Current Phase: Idea Generation */}
      <section data-bind="currentPhase" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            {phasesLoading ? 'Loading...' : (ideaPhase?.name || 'Idea Generation')} Phase
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Phase 1 of 4</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full">
              <div className="w-1/4 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Interactive Checklist Component */}
        {ideaPhase && <BusinessChecklist phaseId={ideaPhase.id} userId={1} />}

        {/* AI-Powered Tools Section */}
        <h3 className="text-xl font-bold mb-4 font-heading text-slate-800">AI-Powered Business Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {toolsLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="w-3/4">
                      <div className="h-5 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </div>
                    <div className="h-5 w-16 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-10 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            tools?.map((tool, index) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                toolType={tool.toolType}
                actionText={tool.actionText}
                actionUrl={tool.actionUrl}
                isPrimary={index === 0}
              />
            ))
          )}
        </div>

        {/* Your Business Magician Assistants */}
        <h3 className="text-xl font-bold mb-4 font-heading text-slate-800">Your AI Business Assistants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <BusinessMagicianGPT />
          <TelegramBotLink />
        </div>

        {/* MVP Success Case Studies */}
        <h3 className="text-xl font-bold mb-4 font-heading text-slate-800">MVP Success Stories</h3>
        <MVPSuccessStories />

        {/* Success Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 font-heading text-slate-800">MVP Validation Metrics</h3>
          <p className="text-slate-600 mb-4">An effective MVP answers the critical question: Will customers pay for your solution?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-primary">76%</span>
              <span className="text-sm text-slate-500">of startups fail due to lack of market need</span>
              <div className="mt-auto pt-2">
                <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-primary">3x</span>
              <span className="text-sm text-slate-500">higher success rate for startups that validate with MVPs</span>
              <div className="mt-auto pt-2">
                <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-primary">42%</span>
              <span className="text-sm text-slate-500">of startups fail because they build products nobody wants</span>
              <div className="mt-auto pt-2">
                <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ASL Resources */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold font-heading text-slate-800">ASL Business Resources</h3>
          <button className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videosLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                <div className="relative aspect-video bg-slate-100"></div>
                <div className="p-4">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-full mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : (
            aslVideos?.map(video => (
              <ASLResourceCard
                key={video.id}
                title={video.title}
                description={video.description}
                videoUrl={video.videoUrl}
                thumbnail={video.thumbnail}
              />
            ))
          )}
        </div>

        {/* Footer Navigation */}
        <section className="mt-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-slate-900">Ready to move to the next phase?</h3>
                <p className="text-slate-600">Complete your idea phase tasks to unlock the Build phase</p>
              </div>
              <div className="flex gap-3">
                <button disabled className="bg-white text-slate-400 cursor-not-allowed px-4 py-2 rounded-lg font-medium border border-slate-200 flex items-center gap-2">
                  <i className="ri-arrow-left-line"></i> Previous
                </button>
                <button className="bg-slate-200 text-slate-500 cursor-not-allowed px-4 py-2 rounded-lg font-medium flex items-center gap-2">
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

export default IdeaPhase;
