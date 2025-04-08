import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface ASLResourceCardProps {
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
}

const ASLResourceCard: React.FC<ASLResourceCardProps> = ({ 
  title, 
  description, 
  videoUrl,
  thumbnail
}) => {
  const { toast } = useToast();

  const handlePlayVideo = () => {
    // In a real app, this would open a modal with the video
    toast({
      title: "ASL Video",
      description: `Now playing: ${title}`,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="relative aspect-video bg-slate-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="ri-sign-language-line text-5xl text-primary/50"></i>
        </div>
        <span className="absolute top-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded">ASL</span>
      </div>
      <div className="p-4">
        <h4 className="font-medium text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
        <button 
          className="mt-3 text-primary text-sm font-medium hover:underline flex items-center gap-1"
          onClick={handlePlayVideo}
          hx-get={videoUrl}
          hx-trigger="click[ctrlKey]"
          hx-target="#asl-video-player"
          hx-swap="innerHTML"
        >
          <i className="ri-play-circle-line"></i> Watch Video
        </button>
      </div>
    </div>
  );
};

export default ASLResourceCard;
