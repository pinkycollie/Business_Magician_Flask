import React, { useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import LifecycleNav from '@/components/lifecycle/LifecycleNav';
import VRSection from '@/components/home/VRSection';
import ASLResourceCard from '@/components/asl/ASLResourceCard';
import { useQuery } from '@tanstack/react-query';
import { initializeHtmx } from '@/lib/htmx';

interface ASLVideo {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
}

const Home: React.FC = () => {
  const { data: aslVideos, isLoading } = useQuery<ASLVideo[]>({
    queryKey: ['/api/asl-videos'],
  });

  useEffect(() => {
    // Initialize HTMX after component has rendered
    initializeHtmx();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section with ASL Accessibility */}
      <HeroSection 
        title="Business Lifecycle Management"
        subtitle="Deaf-First Founder Support"
        description="Complete business lifecycle management from idea generation to business growth and management, with integrated ASL support at every step."
      />

      {/* Business Lifecycle Navigation */}
      <section className="mb-12">
        <LifecycleNav />
      </section>

      {/* Vocational Rehabilitation Services */}
      <VRSection />

      {/* ASL Resources */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold font-heading text-slate-800">ASL Business Resources</h3>
          <button className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
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
          ) : aslVideos?.slice(0, 3).map(video => (
            <ASLResourceCard
              key={video.id}
              title={video.title}
              description={video.description}
              videoUrl={video.videoUrl}
              thumbnail={video.thumbnail}
            />
          ))}
        </div>
      </section>

      {/* Hidden Element for ASL Video Modal */}
      <div id="asl-video-modal" className="hidden"></div>
      <div id="asl-video-player" className="hidden"></div>
    </div>
  );
};

export default Home;
