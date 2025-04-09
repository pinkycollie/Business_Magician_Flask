import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface BusinessMagicianGPTProps {
  title?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
}

const BusinessMagicianGPT: React.FC<BusinessMagicianGPTProps> = ({
  title = '360 Business Magician GPT',
  description = 'Get AI-powered business advice tailored for deaf entrepreneurs',
  linkText = 'Chat with Business Magician GPT',
  linkUrl = 'https://chatgpt.com/g/g-IQNrS0ixP-360-business-magician-gpt'
}) => {
  return (
    <Card className="bg-white overflow-hidden border-primary/20 hover:border-primary/50 transition-colors">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path>
              <path d="M17.75 13.75a7 7 0 1 0-14 0C3.75 15.5 9 20 11 20s7.25-4.5 7.25-6.25Z"></path>
              <path d="M13.5 9.5a4 4 0 0 0 7 0 4 4 0 0 0-7 0Z"></path>
              <path d="M19.75 15a7 7 0 0 0-14 0c0 1.75 5.25 6.25 7.25 6.25s7.25-4.5 7.25-6.25Z"></path>
            </svg>
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="text-sm text-slate-600">
            <p>This AI assistant powered by ChatGPT can help you with:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Business plan creation</li>
              <li>Market analysis for deaf entrepreneurs</li>
              <li>Access to funding resources</li>
              <li>Marketing strategies for deaf-owned businesses</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 px-6 py-4">
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button className="w-full gap-2">
            {linkText} <ExternalLink size={16} />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default BusinessMagicianGPT;