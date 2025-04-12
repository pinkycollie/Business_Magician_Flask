import React, { useEffect } from 'react';

interface WrapifaiEmbedProps {
  embedId: string;
  height?: string;
  width?: string;
  className?: string;
}

/**
 * WRAPIFAI Tool Generator Embed Component
 * 
 * This component embeds a WRAPIFAI tool generator into any page
 * using their official embed code structure.
 */
export function WrapifaiEmbed({ 
  embedId, 
  height = '600px', 
  width = '100%',
  className = '' 
}: WrapifaiEmbedProps) {
  
  useEffect(() => {
    // Load the WRAPIFAI embed script
    const script = document.createElement('script');
    script.src = 'https://app.wrapifai.com/embed/index.js';
    script.async = true;
    
    // Add script to document
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  return (
    <div className={`wrapifai-embed-container ${className}`}>
      <iframe
        id="wrapifai-iframe"
        src={`https://app.wrapifai.com/embed/${embedId}`}
        width={width}
        height={height}
        frameBorder="0"
        title="WRAPIFAI Tool Generator"
        loading="lazy"
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}

export default WrapifaiEmbed;