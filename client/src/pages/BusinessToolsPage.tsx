import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, DollarSign, BarChart3 } from 'lucide-react';

/**
 * Business Tools Page
 * 
 * This page provides business planning and tool resources to help entrepreneurs
 * develop and grow their businesses
 */
export function BusinessToolsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Business Tools</h1>
      <p className="text-lg mb-10">
        Resources and tools to help you plan, start, and grow your business.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Business Idea Generator */}
        <Card>
          <CardHeader>
            <Lightbulb className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Business Idea Generator</CardTitle>
            <CardDescription>
              Generate custom business ideas based on your interests and skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our AI-powered business idea generator helps you brainstorm potential
              business opportunities tailored to your unique situation.
            </p>
            <Button variant="outline" className="w-full">
              Generate Ideas <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Financial Calculator */}
        <Card>
          <CardHeader>
            <DollarSign className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Financial Calculator</CardTitle>
            <CardDescription>
              Calculate startup costs and project financial needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Estimate your startup expenses, ongoing operational costs, and
              calculate how much funding you'll need to launch your business.
            </p>
            <Button variant="outline" className="w-full">
              Calculate Finances <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Market Analysis */}
        <Card>
          <CardHeader>
            <BarChart3 className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Market Analysis</CardTitle>
            <CardDescription>
              Research your target market and competition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Understand your target customers, identify competitors, and find
              your unique advantage in the marketplace.
            </p>
            <Button variant="outline" className="w-full">
              Analyze Market <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
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