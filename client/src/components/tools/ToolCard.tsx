import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface ToolCardProps {
  name: string;
  description: string;
  toolType: string;
  actionText: string;
  actionUrl: string;
  isPrimary?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  name, 
  description, 
  toolType, 
  actionText, 
  actionUrl,
  isPrimary = false 
}) => {
  const { toast } = useToast();

  const handleAction = async () => {
    // For demo purposes, just show a toast
    if (toolType === 'AI') {
      toast({
        title: "AI Tool Activated",
        description: `${name} is processing your request...`,
      });
    } else {
      toast({
        title: "Tool Access",
        description: `Opening ${name}...`,
      });
    }
    
    // In a real implementation, this would redirect to the tool or launch a modal
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-slate-900">{name}</h4>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
          <span className="bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-0.5 rounded-full">
            {toolType}
          </span>
        </div>
        <div className="mt-4">
          <button 
            onClick={handleAction}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              isPrimary 
                ? 'bg-primary hover:bg-primary/90 text-white' 
                : 'border border-primary text-primary hover:bg-primary/5'
            }`}
            hx-post={actionUrl}
            hx-trigger="click[ctrlKey]"
            hx-swap="none"
          >
            <i className={`${getIconForTool(toolType)}`}></i>
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

function getIconForTool(toolType: string): string {
  switch (toolType) {
    case 'AI':
      return 'ri-magic-line';
    case 'Statista API':
      return 'ri-bar-chart-box-line';
    case 'Venturus.ai':
      return 'ri-rocket-line';
    case 'FormFlow':
      return 'ri-file-list-3-line';
    case 'API':
      return 'ri-code-s-slash-line';
    default:
      return 'ri-tools-line';
  }
}

export default ToolCard;
