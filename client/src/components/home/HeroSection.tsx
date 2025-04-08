import React from 'react';
import { Link } from 'wouter';
import ASLVideo from '@/components/asl/ASLVideo';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, description }) => {
  return (
    <section className="mb-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-3/5">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-slate-900">
            {title}
            <span className="block text-sm font-normal mt-2 text-slate-600">{subtitle}</span>
          </h1>
          <p className="text-lg mb-6 text-slate-700">
            {description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/phases/idea">
              <a className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2">
                <i className="ri-rocket-line"></i> 
                Get Started
              </a>
            </Link>
            <button 
              className="bg-white hover:bg-slate-100 text-slate-800 px-5 py-2.5 rounded-lg font-medium border border-slate-200 flex items-center gap-2"
              hx-get="/api/asl-videos/intro"
              hx-trigger="click"
              hx-target="#asl-video-modal"
              hx-swap="innerHTML"
            >
              <i className="ri-video-line text-primary"></i>
              View ASL Tutorial
            </button>
          </div>
        </div>
        <div className="md:w-2/5 relative">
          <ASLVideo 
            videoUrl="/api/asl-videos/intro.mp4"
            title="ASL Introduction Video"
            showControls={true}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
