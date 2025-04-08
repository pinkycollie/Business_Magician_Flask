import React from 'react';
import JobMagicianLink from './JobMagicianLink';
import ASLResourceCard from '@/components/asl/ASLResourceCard';

const JobMagicianSection: React.FC = () => {
  return (
    <div className="w-full mb-8">
      <h3 className="text-xl font-bold mb-4 text-slate-800">Hire From 360 Job Magician Network</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <JobMagicianLink 
            title="Find Deaf Tech Talent" 
            description="Connect with deaf and hard-of-hearing tech professionals who have completed specialized training"
            linkText="Browse Tech Candidates"
            linkUrl="/api/job-magician/tech-candidates"
            candidateCount={8}
          />
        </div>
        
        <div>
          <ASLResourceCard
            title="Hiring Deaf Employees"
            description="Learn about workplace accommodations and communication strategies for deaf employees"
            videoUrl="/api/asl-videos/hiring-deaf-employees.mp4"
            thumbnail="/assets/hiring-thumbnail.jpg"
          />
        </div>
      </div>
      
      <div id="job-magician-results" className="mt-6 min-h-[200px]">
        {/* HTMX will load candidate results here */}
      </div>
    </div>
  );
};

export default JobMagicianSection;