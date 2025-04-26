import { Link } from 'wouter';
import { ChevronRight, BrainCircuit, Search, Target, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BusinessIdeaPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/pathways/business">
          <a className="hover:text-purple-600 flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Business Pathway
          </a>
        </Link>
        <span>/</span>
        <span>Idea Phase</span>
      </div>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">1. Idea Phase</h1>
        <p className="text-lg text-slate-600">
          Generate, explore, and validate your business ideas
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 mb-10 border border-purple-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-purple-900">
              Turn Your Vision Into a Business
            </h2>
            <p className="text-slate-700 mb-6">
              The idea phase is where your entrepreneurial journey begins. Our tools help you 
              explore potential business concepts, validate market demand, and refine your ideas 
              into viable business opportunities.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Generate Business Ideas
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BrainCircuit className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Idea Generation</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Use our AI-powered tool to generate personalized business ideas based on:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <div className="bg-purple-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Your interests and passions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-purple-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Skills and experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-purple-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Market trends and opportunities</span>
                </li>
              </ul>
              <Button className="w-full">Try Idea Generator</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Idea Phase Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ToolCard 
            title="Idea Generator" 
            description="Generate personalized business ideas based on your interests, skills, and market opportunities."
            icon={<BrainCircuit className="h-6 w-6 text-purple-600" />}
            linkUrl="/analytics"
          />
          <ToolCard 
            title="Market Research" 
            description="Research your target market, competitors, and industry trends to validate your business concept."
            icon={<Search className="h-6 w-6 text-purple-600" />}
            linkUrl="/analytics"
          />
          <ToolCard 
            title="Idea Validation" 
            description="Test and refine your business ideas with structured validation processes and feedback tools."
            icon={<Target className="h-6 w-6 text-purple-600" />}
            linkUrl="/analytics"
          />
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Resources for Deaf Entrepreneurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard 
            title="ASL Business Glossary" 
            description="Access business terminology in American Sign Language to help you understand key concepts."
            linkUrl="/resource-library"
          />
          <ResourceCard 
            title="Deaf Entrepreneur Success Stories" 
            description="Get inspired by stories of successful deaf-owned businesses and their journeys."
            linkUrl="/testimonials"
          />
          <ResourceCard 
            title="Idea-Phase Checklist" 
            description="Follow our comprehensive checklist to ensure you've covered all bases in the idea phase."
            linkUrl="/pathways/business/idea/checklist"
          />
          <ResourceCard 
            title="SBA Business Guide" 
            description="Access adapted resources from the Small Business Administration's business guide."
            linkUrl="/resource-library?category=sba"
          />
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready for the next phase?</h2>
            <p className="text-slate-700">Once you've validated your business idea, move on to building your business.</p>
          </div>
          <Link href="/pathways/business/build">
            <a className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium">
              Continue to Build Phase
              <ChevronRight className="h-5 w-5" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Tool Card Component
function ToolCard({ 
  title, 
  description, 
  icon, 
  linkUrl 
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  linkUrl: string;
}) {
  return (
    <Link href={linkUrl}>
      <a className="block group">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-purple-100 p-2 rounded-full">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-700">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            </div>
            <div className="mt-4 text-purple-600 group-hover:text-purple-800 text-sm font-medium">
              Access Tool →
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}

// Resource Card Component
function ResourceCard({ 
  title, 
  description, 
  linkUrl 
}: { 
  title: string;
  description: string;
  linkUrl: string;
}) {
  return (
    <Link href={linkUrl}>
      <a className="block group">
        <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-purple-300 transition-colors group-hover:shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-700">{title}</h3>
          <p className="text-slate-600 text-sm mb-3">{description}</p>
          <div className="text-purple-600 group-hover:text-purple-800 text-sm font-medium">
            View Resource →
          </div>
        </div>
      </a>
    </Link>
  );
}