import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { generateBotCommandList } from '@/lib/telegramBotConfig';
import { brandColors } from '@/lib/brandKit';

interface TelegramBotLinkProps {
  title?: string;
  description?: string;
  linkText?: string;
  botUsername?: string;
}

const TelegramBotLink: React.FC<TelegramBotLinkProps> = ({
  title = 'Business Magician Bot',
  description = 'Fun interactive business inspiration for the general public',
  linkText = 'Chat with Business Magician Bot',
  botUsername = 'businessmagicianbot'
}) => {
  const telegramUrl = `https://t.me/${botUsername}`;
  const [copied, setCopied] = useState(false);
  
  const copyCommands = () => {
    const commandList = generateBotCommandList();
    navigator.clipboard.writeText(commandList)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Could not copy commands: ', err);
      });
  };
  
  return (
    <Card className="bg-white overflow-hidden border-primary/20 hover:border-primary/50 transition-colors">
      <CardHeader 
        style={{ 
          background: `linear-gradient(to right, ${brandColors.business.primary}10, ${brandColors.business.secondary}10)`,
          borderBottom: `1px solid ${brandColors.business.secondary}30`
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ 
              background: brandColors.business.primary,
              border: `2px solid ${brandColors.business.secondary}`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
          <CardTitle className="text-lg" style={{ color: brandColors.business.text.primary }}>{title}</CardTitle>
        </div>
        <CardDescription className="text-sm" style={{ color: brandColors.business.text.secondary }}>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="text-sm text-slate-600">
            <p>Available bot commands:</p>
            <div className="max-h-64 overflow-y-auto pr-2">
              <ul className="pl-5 mt-2 space-y-1 list-none">
                <li><code>/start</code> - Begin your business journey</li>
                <li><code>/idea</code> - Generate and refine business ideas</li>
                <li><code>/management</code> - Organize and manage project tasks</li>
                <li><code>/brand</code> - Develop and establish brand identity</li>
                <li><code>/marketing</code> - Create marketing strategies and campaigns</li>
                <li><code>/mvp</code> - Build minimum viable products (MVPs)</li>
                <li><code>/feedback</code> - Provide feedback on services</li>
                <li><code>/completion</code> - Manage project completion</li>
                <li><code>/expansion</code> - Plan business expansion strategies</li>
                <li><code>/partnership</code> - Establish equity partnerships</li>
                <li><code>/help</code> - Get assistance and guidance</li>
                <li><code>/support</code> - Reach out for technical support</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter 
        className="border-t px-6 py-4 flex flex-col gap-2"
        style={{ borderColor: `${brandColors.business.secondary}30` }}
      >
        <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button 
            className="w-full gap-2" 
            style={{ 
              backgroundColor: brandColors.business.primary,
              color: brandColors.business.text.light,
              border: `1px solid ${brandColors.business.secondary}`
            }}
          >
            {linkText} <ExternalLink size={16} />
          </Button>
        </a>
        
        <Button 
          onClick={copyCommands} 
          variant="outline" 
          className="w-full gap-2"
          style={{ 
            borderColor: `${brandColors.business.secondary}50`,
            color: brandColors.business.primary
          }}
        >
          {copied ? (
            <>
              <Check size={16} /> Commands Copied
            </>
          ) : (
            <>
              <Copy size={16} /> Copy Bot Commands
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TelegramBotLink;