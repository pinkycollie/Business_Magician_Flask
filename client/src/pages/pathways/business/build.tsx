import { Link } from 'wouter';
import { ChevronRight, FileText, DollarSign, Users, ChevronLeft, Building, Briefcase, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BusinessBuildPage() {
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
        <span>Build Phase</span>
      </div>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">2. Build Phase</h1>
        <p className="text-lg text-slate-600">
          Form your business and establish operations
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-10 border border-blue-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-blue-900">
              Build Your Business Foundation
            </h2>
            <p className="text-slate-700 mb-6">
              The build phase is where your business becomes a reality. From legal formation to setting up 
              operations, our tools provide deaf-friendly guidance through every step of establishing your business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Business Formation
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Northwest Agent Integration</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Our platform integrates with Northwest Registered Agent to provide:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Legal business formation in all 50 states</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Registered agent services with ASL support</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Legal compliance monitoring</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Form Your Business</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Build Phase Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ToolCard 
            title="Business Formation" 
            description="Form your legal business entity with deaf-friendly guidance through the entire process."
            icon={<FileText className="h-6 w-6 text-blue-600" />}
            linkUrl="/formation"
          />
          <ToolCard 
            title="Funding & Financing" 
            description="Access capital resources and grant opportunities specifically for deaf entrepreneurs."
            icon={<DollarSign className="h-6 w-6 text-blue-600" />}
            linkUrl="/funding"
          />
          <ToolCard 
            title="Team Building" 
            description="Find and hire deaf and hearing employees with accessible hiring practices."
            icon={<Users className="h-6 w-6 text-blue-600" />}
            linkUrl="/team-builder"
          />
        </div>
      </div>

      {/* Formation Options */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Business Formation Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormationCard 
            title="LLC Formation" 
            description="Limited Liability Company formation with protection for your personal assets."
            icon={<ShieldCheck className="h-6 w-6 text-blue-600" />}
            linkUrl="/formation/llc"
            price="Starting at $99"
          />
          <FormationCard 
            title="Corporation" 
            description="Form a C-Corporation or S-Corporation with proper governance structure."
            icon={<Building className="h-6 w-6 text-blue-600" />}
            linkUrl="/formation/corporation"
            price="Starting at $129"
          />
          <FormationCard 
            title="Nonprofit" 
            description="Establish a nonprofit organization with 501(c)(3) application guidance."
            icon={<Briefcase className="h-6 w-6 text-blue-600" />}
            linkUrl="/formation/nonprofit"
            price="Starting at $199"
          />
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Resources for Business Formation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard 
            title="Formation Documents ASL Guide" 
            description="Access ASL videos explaining key business formation documents and legal requirements."
            linkUrl="/resource-library?category=formation"
          />
          <ResourceCard 
            title="Deaf-Owned Business Registry" 
            description="Register your business in our directory of deaf-owned businesses for increased visibility."
            linkUrl="/partnerships/registry"
          />
          <ResourceCard 
            title="Building Phase Checklist" 
            description="Follow our comprehensive checklist to ensure you've covered all bases in the build phase."
            linkUrl="/pathways/business/build/checklist"
          />
          <ResourceCard 
            title="SBA Formation Resources" 
            description="Access adapted resources from the Small Business Administration for business formation."
            linkUrl="/resource-library?category=sba-formation"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Link href="/pathways/business/idea">
          <a className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 py-3 px-6 rounded-lg font-medium">
            <ChevronLeft className="h-5 w-5" />
            Back to Idea Phase
          </a>
        </Link>
        
        <Link href="/pathways/business/grow">
          <a className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium">
            Continue to Grow Phase
            <ChevronRight className="h-5 w-5" />
          </a>
        </Link>
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
              <div className="bg-blue-100 p-2 rounded-full">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-700">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            </div>
            <div className="mt-4 text-blue-600 group-hover:text-blue-800 text-sm font-medium">
              Access Tool →
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}

// Formation Card Component
function FormationCard({ 
  title, 
  description, 
  icon, 
  linkUrl,
  price
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  linkUrl: string;
  price: string;
}) {
  return (
    <Link href={linkUrl}>
      <a className="block group">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-700">{title}</h3>
                <p className="text-slate-600 text-sm mb-2">{description}</p>
                <span className="text-sm font-medium text-blue-900 bg-blue-50 py-1 px-2 rounded-full">
                  {price}
                </span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
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
        <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-blue-300 transition-colors group-hover:shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-700">{title}</h3>
          <p className="text-slate-600 text-sm mb-3">{description}</p>
          <div className="text-blue-600 group-hover:text-blue-800 text-sm font-medium">
            View Resource →
          </div>
        </div>
      </a>
    </Link>
  );
}