import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Check } from 'lucide-react';

interface VR4DeafBotLinkProps {
  title?: string;
  description?: string;
  linkText?: string;
  botUsername?: string;
}

const VR4DeafBotLink: React.FC<VR4DeafBotLinkProps> = ({
  title = 'VR4Deaf Icebreaker Bot',
  description = 'Fun interactive icebreaker for high school VAT programs',
  linkText = 'Chat with VR4Deaf Bot',
  botUsername = 'vr4deaf_bot'
}) => {
  const telegramUrl = `https://t.me/${botUsername}`;
  const [copied, setCopied] = useState(false);
  
  const vatBotCommands = [
    { command: "start", description: "Begin your VR journey" },
    { command: "intro", description: "Introduction to vocational rehabilitation" },
    { command: "games", description: "Fun icebreaker activities" },
    { command: "career", description: "Career exploration for deaf students" },
    { command: "skills", description: "Identify and develop your skills" },
    { command: "resources", description: "Educational resources for deaf students" },
    { command: "asl", description: "ASL videos about vocational topics" },
    { command: "stories", description: "Success stories from deaf professionals" },
    { command: "help", description: "List all available commands" }
  ];
  
  const generateCommandList = () => {
    return vatBotCommands
      .map(cmd => `${cmd.command} - ${cmd.description}`)
      .join('\n');
  };
  
  const copyCommands = () => {
    const commandList = generateCommandList();
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
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-400/5 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
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
            <p>Fun interactive commands:</p>
            <ul className="pl-5 mt-2 space-y-1 list-none">
              {vatBotCommands.map(cmd => (
                <li key={cmd.command}><code>/{cmd.command}</code> - {cmd.description}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 px-6 py-4 flex flex-col gap-2">
        <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button className="w-full gap-2 bg-purple-500 hover:bg-purple-600">
            {linkText} <ExternalLink size={16} />
          </Button>
        </a>
        
        <Button onClick={copyCommands} variant="outline" className="w-full gap-2 border-purple-200 text-purple-600 hover:bg-purple-50">
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

export default VR4DeafBotLink;