import React, { useState } from 'react';

interface ASLVideoProps {
  videoUrl: string;
  title: string;
  showControls?: boolean;
  autoplay?: boolean;
  className?: string;
}

const ASLVideo: React.FC<ASLVideoProps> = ({ 
  videoUrl, 
  title, 
  showControls = true, 
  autoplay = false,
  className = "" 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // For demo, we'll simulate a video with a placeholder
  const handleVideoLoad = () => {
    setLoading(false);
  };

  const handleVideoError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`relative rounded-lg overflow-hidden aspect-video ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-slate-500">Loading ASL video...</p>
          </div>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-sign-language-line text-6xl text-primary"></i>
            <p className="mt-2 text-slate-600">{title}</p>
            <p className="mt-1 text-xs text-slate-500">ASL video unavailable</p>
          </div>
        </div>
      ) : (
        // For demo, we'll use a placeholder because we can't include video files
        // In a real implementation, this would be a video element with the actual video
        <div 
          className="absolute inset-0 bg-slate-100 flex items-center justify-center"
          onLoad={handleVideoLoad}
          onError={handleVideoError}
        >
          <div className="text-center">
            <i className="ri-sign-language-line text-6xl text-primary"></i>
            <p className="mt-2 text-slate-600">{title}</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs py-1 px-2 rounded">
        ASL
      </div>
    </div>
  );
};

export default ASLVideo;
