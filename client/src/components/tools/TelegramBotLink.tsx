import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface TelegramBotLinkProps {
  title?: string;
  description?: string;
  linkText?: string;
  botUsername?: string;
}

const TelegramBotLink: React.FC<TelegramBotLinkProps> = ({
  title = '360 Business Magician Bot',
  description = 'Get instant business advice directly on Telegram',
  linkText = 'Chat with Business Magician Bot',
  botUsername = 'businessmagicianbot'
}) => {
  const telegramUrl = `https://t.me/${botUsername}`;
  
  return (
    <Card className="bg-white overflow-hidden border-primary/20 hover:border-primary/50 transition-colors">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-400/5 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="text-sm text-slate-600">
            <p>Our Telegram bot offers:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Instant business advice</li>
              <li>ASL resources for deaf entrepreneurs</li>
              <li>Step-by-step business formation guidance</li>
              <li>Real-time updates on your business progress</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 px-6 py-4">
        <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button className="w-full gap-2 bg-blue-500 hover:bg-blue-600">
            {linkText} <ExternalLink size={16} />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default TelegramBotLink;