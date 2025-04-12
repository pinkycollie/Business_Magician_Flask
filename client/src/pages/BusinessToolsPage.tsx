import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, DollarSign, BarChart3 } from 'lucide-react';

interface BusinessTool {
  id: string;
  name: string;
  description: string;
}

/**
 * Business Tools Page
 * 
 * This page provides business planning and tool resources to help entrepreneurs
 * develop and grow their businesses
 */
export function BusinessToolsPage() {
  const [tools, setTools] = useState<BusinessTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch business tools from our API
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/business-tools');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setTools(data.tools || []);
      } catch (err) {
        console.error('Failed to fetch business tools:', err);
        setError('Failed to load business tools. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Map tool ID to icon
  const getToolIcon = (id: string) => {
    switch (id) {
      case 'business-idea-generator':
        return <Lightbulb className="h-8 w-8 mb-2 text-primary" />;
      case 'financial-calculator':
        return <DollarSign className="h-8 w-8 mb-2 text-primary" />;
      case 'market-analyzer':
        return <BarChart3 className="h-8 w-8 mb-2 text-primary" />;
      default:
        return <Lightbulb className="h-8 w-8 mb-2 text-primary" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-600">Loading business tools...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Business Tools</h1>
      <p className="text-lg mb-10">
        Resources and tools to help you plan, start, and grow your business.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader>
              {getToolIcon(tool.id)}
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Use Tool <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Business Planning Resources</h2>
        <p className="mb-4">
          Access templates, guides, and examples to help you plan and grow your business.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Business plan templates</li>
          <li>Marketing strategy guides</li>
          <li>Financial projection worksheets</li>
          <li>Legal compliance checklists</li>
          <li>Accessibility guidelines for your business</li>
        </ul>
        <Button className="mt-6">
          Access Resources
        </Button>
      </div>
    </div>
  );
}

export default BusinessToolsPage;