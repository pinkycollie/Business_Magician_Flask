import React from 'react';

interface WrapifaiEmbedProps {
  embedId: string;
  height?: string;
  className?: string;
}

/**
 * Empty implementation of WrapifaiEmbed component
 * This is a placeholder to maintain compatibility with existing imports
 * while removing the actual WRAPIFAI integration
 */
export const WrapifaiEmbed: React.FC<WrapifaiEmbedProps> = ({ 
  height = '600px',
  className = '',
}) => {
  return (
    <div 
      style={{ height }}
      className={`bg-muted flex items-center justify-center rounded-lg ${className}`}
    >
      <div className="text-center p-6">
        <h3 className="text-lg font-medium mb-2">AI Tool Generator</h3>
        <p className="text-muted-foreground">
          The external tool integration has been removed for performance reasons.
          Please use the built-in business tools instead.
        </p>
      </div>
    </div>
  );
};