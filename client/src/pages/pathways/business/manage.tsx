import { Link } from 'wouter';
import { ChevronLeft, Settings, FileSpreadsheet, BarChart3, CalendarClock, Landmark, CircleDollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BusinessManagePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/pathways/business">
          <a className="hover:text-amber-600 flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Business Pathway
          </a>
        </Link>
        <span>/</span>
        <span>Manage Phase</span>
      </div>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">4. Manage Phase</h1>
        <p className="text-lg text-slate-600">
          Maintain and optimize your business operations
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 mb-10 border border-amber-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-amber-900">
              Optimize Your Business Operations
            </h2>
            <p className="text-slate-700 mb-6">
              The manage phase is where you ensure the long-term success of your business. Our tools 
              help you handle finances, manage operations, and maintain compliance with deaf-friendly 
              interfaces and resources.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                Access Management Tools
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 border border-amber-200 shadow-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Settings className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold">Operations Dashboard</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Manage your business with our accessible dashboard:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Financial management tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Compliance monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-700">Operations scheduling</span>
                </li>
              </ul>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">View Dashboard</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Management Tools */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ToolCard 
            title="Financial Management" 
            description="Track expenses, manage invoices, and handle accounting with deaf-accessible interfaces."
            icon={<CircleDollarSign className="h-6 w-6 text-amber-600" />}
            linkUrl="/manage/finances"
          />
          <ToolCard 
            title="Compliance Tracker" 
            description="Stay on top of business regulations and requirements with visual notification systems."
            icon={<Landmark className="h-6 w-6 text-amber-600" />}
            linkUrl="/manage/compliance"
          />
          <ToolCard 
            title="Operations Calendar" 
            description="Schedule and manage business operations with an accessible calendar system."
            icon={<CalendarClock className="h-6 w-6 text-amber-600" />}
            linkUrl="/dashboard/calendar"
          />
        </div>
      </div>

      {/* Business Reports */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Business Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportCard 
            title="Financial Reports" 
            description="Generate accessible financial reports with visual data representations."
            icon={<FileSpreadsheet className="h-6 w-6 text-amber-600" />}
            linkUrl="/manage/reports/financial"
          />
          <ReportCard 
            title="Performance Analytics" 
            description="Track business performance with visual analytics and metrics."
            icon={<BarChart3 className="h-6 w-6 text-amber-600" />}
            linkUrl="/analytics"
          />
          <ReportCard 
            title="Compliance Reports" 
            description="Generate reports on business compliance status and requirements."
            icon={<FileText className="h-6 w-6 text-amber-600" />}
            linkUrl="/manage/reports/compliance"
          />
          <ReportCard 
            title="Tax Documents" 
            description="Prepare and organize tax documents with deaf-accessible guidance."
            icon={<FileText className="h-6 w-6 text-amber-600" />}
            linkUrl="/manage/reports/tax"
          />
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Resources for Business Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard 
            title="Financial Management ASL Guide" 
            description="Learn financial management concepts with ASL videos and visual guides."
            linkUrl="/resource-library?category=finance"
          />
          <ResourceCard 
            title="Business Compliance Guide" 
            description="Navigate business regulations with deaf-accessible compliance resources."
            linkUrl="/resource-library?category=compliance"
          />
          <ResourceCard 
            title="Management Phase Checklist" 
            description="Follow our comprehensive checklist to ensure effective business management."
            linkUrl="/pathways/business/manage/checklist"
          />
          <ResourceCard 
            title="SBA Management Resources" 
            description="Access adapted resources from the Small Business Administration for business management."
            linkUrl="/resource-library?category=sba-management"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Link href="/pathways/business/grow">
          <a className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 py-3 px-6 rounded-lg font-medium">
            <ChevronLeft className="h-5 w-5" />
            Back to Grow Phase
          </a>
        </Link>
        
        <Link href="/pathways/business">
          <a className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium">
            Return to Business Pathway
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
              <div className="bg-amber-100 p-2 rounded-full">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-amber-700">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            </div>
            <div className="mt-4 text-amber-600 group-hover:text-amber-800 text-sm font-medium">
              Access Tool →
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}

// Report Card Component
function ReportCard({ 
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
              <div className="bg-amber-100 p-2 rounded-full">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-amber-700">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
              Generate Report
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
        <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-amber-300 transition-colors group-hover:shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-amber-700">{title}</h3>
          <p className="text-slate-600 text-sm mb-3">{description}</p>
          <div className="text-amber-600 group-hover:text-amber-800 text-sm font-medium">
            View Resource →
          </div>
        </div>
      </a>
    </Link>
  );
}