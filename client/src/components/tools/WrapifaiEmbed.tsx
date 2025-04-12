import React, { useEffect, useRef } from 'react';

interface WrapifaiEmbedProps {
  embedId?: string;
  height?: string;
  className?: string;
}

/**
 * Component for embedding WRAPIFAI tool generator
 * 
 * This component integrates the WRAPIFAI AI tool generator as an iframe
 * and handles the necessary script loading for proper functionality.
 */
export function WrapifaiEmbed({ 
  embedId = "48840a", 
  height = "1584px", 
  className = ""
}: WrapifaiEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create and load the WRAPIFAI script
    const script = document.createElement('script');
    script.src = "https://app.wrapifai.com/embed/index.js";
    script.async = true;
    
    // Add the script to the document
    document.body.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div ref={containerRef} className={`wrapifai-container w-full ${className}`}>
      <iframe 
        ref={iframeRef}
        id="wrapifai-iframe" 
        src={`https://app.wrapifai.com/embed/${embedId}`}
        width="100%" 
        height={height} 
        frameBorder="0" 
        loading="lazy"
        title="WRAPIFAI AI Tool Generator"
        className="w-full border-0 rounded-lg shadow-lg"
      />
    </div>
  );
}

export default WrapifaiEmbed;