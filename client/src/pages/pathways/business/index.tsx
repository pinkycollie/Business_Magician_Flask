import { Link } from 'wouter';
import { 
  ChevronRight, 
  FileText, 
  CreditCard,
  Handshake,
  BarChart3,
  Calendar,
  Settings,
  User,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function BusinessPathwayPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Business Pathway</h1>
        <p className="text-lg text-slate-600">
          Empower your entrepreneurial journey with deaf-first tools and resources
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 mb-10 border border-purple-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-purple-900">
              Start and Grow Your Business with Confidence
            </h2>
            <p className="text-slate-700 mb-6">
              360 Business Magician provides a comprehensive suite of tools and resources 
              specifically designed for deaf entrepreneurs. From business idea validation 
              to funding, formation, and growth, we're here to support your entire journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-lg overflow-hidden border-2 border-purple-200 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center h-64 w-full">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Business Dashboard</h3>
                <p className="text-sm opacity-80">Manage your business journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Journey Steps */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Business Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <JourneyStepCard 
            title="1. Idea" 
            description="Generate and validate your business ideas"
            linkUrl="/pathways/business/idea"
          />
          <JourneyStepCard 
            title="2. Build" 
            description="Form your business and establish operations"
            linkUrl="/pathways/business/build"
          />
          <JourneyStepCard 
            title="3. Grow" 
            description="Market and expand your business"
            linkUrl="/pathways/business/grow"
          />
          <JourneyStepCard 
            title="4. Manage" 
            description="Maintain and optimize your operations"
            linkUrl="/pathways/business/manage"
          />
        </div>
      </div>

      {/* Key Services Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Key Business Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard 
            title="Business Formation" 
            description="Register your business with deaf-friendly guidance through the entire process."
            icon={<FileText className="h-12 w-12 text-purple-600" />}
            linkText="Start Formation"
            linkUrl="/formation"
          />
          <ServiceCard 
            title="Funding & Financing" 
            description="Access capital resources and grant opportunities specifically for deaf entrepreneurs."
            icon={<CreditCard className="h-12 w-12 text-purple-600" />}
            linkText="Explore Funding"
            linkUrl="/funding"
          />
          <ServiceCard 
            title="Business Partnerships" 
            description="Connect with deaf-owned and deaf-friendly business partners and service providers."
            icon={<Handshake className="h-12 w-12 text-purple-600" />}
            linkText="View Partnerships"
            linkUrl="/partnerships"
          />
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Business Dashboard</h2>
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashboardCard 
              title="Business Analytics" 
              description="Track your business performance"
              icon={<BarChart3 className="h-8 w-8 text-purple-500" />}
              linkUrl="/analytics"
            />
            <DashboardCard 
              title="Notifications" 
              description="Stay updated on important events"
              icon={<Bell className="h-8 w-8 text-purple-500" />}
              linkUrl="/dashboard/notifications"
            />
            <DashboardCard 
              title="Calendar" 
              description="Manage appointments and deadlines"
              icon={<Calendar className="h-8 w-8 text-purple-500" />}
              linkUrl="/dashboard/calendar"
            />
            <DashboardCard 
              title="Profile" 
              description="Configure your business profile"
              icon={<User className="h-8 w-8 text-purple-500" />}
              linkUrl="/profile"
            />
          </div>
        </div>
      </div>

      {/* Information Links */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Learn More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InfoLink 
            title="Success Stories" 
            description="Read testimonials from successful deaf entrepreneurs"
            linkUrl="/testimonials"
          />
          <InfoLink 
            title="Pricing Plans" 
            description="Explore our subscription options and features"
            linkUrl="/pricing"
          />
          <InfoLink 
            title="Partner With Us" 
            description="Join our ecosystem of deaf-friendly businesses"
            linkUrl="/partnerships/apply"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-purple-100 rounded-xl p-8 border border-purple-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-900 mb-2">Ready to start your business?</h2>
            <p className="text-slate-700">Create your account to access all business tools and resources.</p>
          </div>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  );
}

// Journey Step Card Component
function JourneyStepCard({ 
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
        <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-purple-300 transition-colors group-hover:shadow-md flex flex-col h-full">
          <h3 className="font-semibold text-lg text-purple-700 mb-2">{title}</h3>
          <p className="text-sm text-slate-600 mb-3 flex-grow">{description}</p>
          <div className="text-purple-600 group-hover:text-purple-800 text-sm font-medium mt-auto">
            Explore →
          </div>
        </div>
      </a>
    </Link>
  );
}

// Service Card Component
function ServiceCard({ 
  title, 
  description, 
  icon, 
  linkText, 
  linkUrl 
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkUrl: string;
}) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4">{description}</CardDescription>
        <Link href={linkUrl}>
          <a className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
            {linkText}
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Link>
      </CardContent>
    </Card>
  );
}

// Dashboard Card Component
function DashboardCard({ 
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
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-purple-300 transition-colors group-hover:shadow-sm">
          <div className="flex items-start gap-3 mb-2">
            <div>{icon}</div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-purple-700">{title}</h3>
              <p className="text-sm text-slate-600">{description}</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

// Information Link Component
function InfoLink({ 
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
        <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-purple-300 transition-colors group-hover:shadow-sm">
          <h3 className="font-semibold text-slate-800 group-hover:text-purple-700 mb-1">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
          <div className="mt-2 text-purple-600 group-hover:text-purple-800 text-sm font-medium">
            Learn more →
          </div>
        </div>
      </a>
    </Link>
  );
}