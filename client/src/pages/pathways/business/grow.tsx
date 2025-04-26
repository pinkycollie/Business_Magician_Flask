import { Link } from 'wouter';
import { ChevronRight, ChevronLeft, TrendingUp, Users, Share, Globe, Megaphone, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BusinessGrowPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/pathways/business">
          <a className="hover:text-green-600 flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Business Pathway
          </a>
        </Link>
        <span>/</span>
        <span>Grow Phase</span>
      </div>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">3. Grow Phase</h1>
        <p className="text-lg text-slate-600">
          Market and expand your business
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 mb-10 border border-green-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-green-900">
              Expand Your Business Reach
            </h2>
            <p className="text-slate-700 mb-6">
              The grow phase is where your business gains momentum. Our tools help you market 
              your products or services, build customer relationships, and expand your operations 
              with deaf-friendly strategies and resources.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Explore Growth Strategies
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Growth Analytics</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Track your business growth with deaf-accessible analytics:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Visual performance metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Customer acquisition insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Revenue and growth projections</span>
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700">View Analytics</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Strategies */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Marketing Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StrategyCard 
            title="Digital Marketing" 
            description="Implement accessible digital marketing strategies to reach both deaf and hearing customers online."
            icon={<Globe className="h-6 w-6 text-green-600" />}
            linkUrl="/marketing/digital"
          />
          <StrategyCard 
            title="Social Media" 
            description="Build your brand presence on social platforms with visual-first content strategies."
            icon={<Share className="h-6 w-6 text-green-600" />}
            linkUrl="/marketing/social"
          />
          <StrategyCard 
            title="Community Outreach" 
            description="Connect with deaf and mainstream communities through targeted outreach programs."
            icon={<Users className="h-6 w-6 text-green-600" />}
            linkUrl="/marketing/community"
          />
        </div>
      </div>

      {/* Growth Tools */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Growth Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolCard 
            title="Marketing Campaigns" 
            description="Create and manage accessible marketing campaigns with ASL-integrated content strategies."
            icon={<Megaphone className="h-6 w-6 text-green-600" />}
            linkUrl="/marketing/campaigns"
          />
          <ToolCard 
            title="Business Analytics" 
            description="Track your business metrics and growth with visual-focused analytics tools."
            icon={<BarChart3 className="h-6 w-6 text-green-600" />}
            linkUrl="/analytics"
          />
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Resources for Business Growth</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard 
            title="Accessible Marketing Guide" 
            description="Learn how to create marketing materials that are accessible to both deaf and hearing audiences."
            linkUrl="/resource-library?category=marketing"
          />
          <ResourceCard 
            title="Deaf Business Network" 
            description="Connect with other deaf entrepreneurs to share growth strategies and partnership opportunities."
            linkUrl="/partnerships/network"
          />
          <ResourceCard 
            title="Growth Phase Checklist" 
            description="Follow our comprehensive checklist to ensure you've covered all bases in the growth phase."
            linkUrl="/pathways/business/grow/checklist"
          />
          <ResourceCard 
            title="SBA Growth Resources" 
            description="Access adapted resources from the Small Business Administration for business growth."
            linkUrl="/resource-library?category=sba-growth"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Link href="/pathways/business/build">
          <a className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 py-3 px-6 rounded-lg font-medium">
            <ChevronLeft className="h-5 w-5" />
            Back to Build Phase
          </a>
        </Link>
        
        <Link href="/pathways/business/manage">
          <a className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium">
            Continue to Manage Phase
            <ChevronRight className="h-5 w-5" />
          </a>
        </Link>
      </div>
    </div>
  );
}

// Strategy Card Component
function StrategyCard({ 
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
              <div className="bg-green-100 p-2 rounded-full">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-green-700">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            </div>
            <div className="mt-4 text-green-600 group-hover:text-green-800 text-sm font-medium">
              Explore Strategy →
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
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
              <div className="bg-green-100 p-2 rounded-full">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-green-700">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Access Tool
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
        <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-green-300 transition-colors group-hover:shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-green-700">{title}</h3>
          <p className="text-slate-600 text-sm mb-3">{description}</p>
          <div className="text-green-600 group-hover:text-green-800 text-sm font-medium">
            View Resource →
          </div>
        </div>
      </a>
    </Link>
  );
}