import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Users } from 'lucide-react';
import { initializeHtmx } from '@/lib/htmx';

interface JobMagicianLinkProps {
  title?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  candidateCount?: number;
}

const JobMagicianLink: React.FC<JobMagicianLinkProps> = ({
  title = '360 Job Magician',
  description = 'Find qualified candidates who have completed the 360 Job Lifecycle program',
  linkText = 'Browse Qualified Candidates',
  linkUrl = '/job-magician/candidates',
  candidateCount = 12
}) => {
  React.useEffect(() => {
    // Initialize HTMX when component mounts
    initializeHtmx();
  }, []);

  return (
    <Card className="w-full bg-white overflow-hidden border-primary/20 hover:border-primary/50 transition-colors">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
          <div className="text-primary flex items-center gap-1">
            <Users size={18} />
            <span className="text-sm font-medium">{candidateCount} candidates</span>
          </div>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-slate-600">
            <p>Access candidates who have successfully completed:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>ASL fluency training</li>
              <li>Technical skills certification</li>
              <li>Disability workplace accommodation training</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 px-6 py-4">
        <Button 
          className="w-full gap-2"
          hx-get={linkUrl}
          hx-trigger="click"
          hx-target="#job-magician-results"
          hx-swap="innerHTML"
        >
          {linkText} <ExternalLink size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobMagicianLink;