import { useState } from 'react';
import { Switch, Route, Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft,
  ChevronRight,
  BarChart,
  Briefcase,
  Globe,
  Headphones,
  Users,
  Settings,
  UserIcon,
  BookOpen,
  Map,
  Library,
  BookMarked,
  Building
} from 'lucide-react';

// Import our components
import AIBusinessAnalytics from '@/components/analytics/AIBusinessAnalytics';
import VR4DeafDashboard from '@/components/vr4deaf/VR4DeafDashboard';
import JobSupportDashboard from '@/components/vr4deaf/JobSupportDashboard';
import StartupTeamBuilder from '@/components/vr4deaf/StartupTeamBuilder';
import ProfilePage from '@/pages/profile-page';
import TechLeadershipResources from '@/components/resources/TechLeadershipResources';
import JourneyTrackerPage from '@/pages/journey-tracker-page';
import ResourceLibraryPage from '@/pages/resource-library-page';

// Business Pathway Pages
import BusinessPathwayPage from '@/pages/pathways/business';
import BusinessIdeaPage from '@/pages/pathways/business/idea';
import BusinessBuildPage from '@/pages/pathways/business/build';
import BusinessGrowPage from '@/pages/pathways/business/grow';
import BusinessManagePage from '@/pages/pathways/business/manage';

export default function App() {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Side Navigation */}
      <aside 
        className={`${
          navCollapsed ? 'w-16' : 'w-64'
        } bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {!navCollapsed && (
            <div className="font-bold text-lg">360 Magicians</div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setNavCollapsed(!navCollapsed)} 
            className="text-white hover:bg-slate-800"
          >
            {navCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <NavItem 
              to="/pathways/business" 
              icon={<Building className="h-5 w-5" />} 
              text="Business Pathway" 
              collapsed={navCollapsed} 
              active={location.includes('/pathways/business')} 
            />
            <NavItem 
              to="/analytics" 
              icon={<BarChart className="h-5 w-5" />} 
              text="Business Analytics" 
              collapsed={navCollapsed} 
              active={location === '/analytics'} 
            />
            <NavItem 
              to="/vr4deaf" 
              icon={<Headphones className="h-5 w-5" />} 
              text="VR4Deaf" 
              collapsed={navCollapsed} 
              active={location === '/vr4deaf'} 
            />
            <NavItem 
              to="/job-support" 
              icon={<Briefcase className="h-5 w-5" />} 
              text="Job Support" 
              collapsed={navCollapsed} 
              active={location === '/job-support'} 
            />
            <NavItem 
              to="/team-builder" 
              icon={<Users className="h-5 w-5" />} 
              text="Team Builder" 
              collapsed={navCollapsed} 
              active={location === '/team-builder'} 
            />
            <NavItem 
              to="/profile" 
              icon={<UserIcon className="h-5 w-5" />} 
              text="My Profile" 
              collapsed={navCollapsed} 
              active={location === '/profile' || location.includes('/profile/')} 
            />
            <NavItem 
              to="/resources" 
              icon={<BookOpen className="h-5 w-5" />} 
              text="Tech Leadership" 
              collapsed={navCollapsed} 
              active={location === '/resources'} 
            />
            <NavItem 
              to="/resource-library" 
              icon={<Library className="h-5 w-5" />} 
              text="Resource Library" 
              collapsed={navCollapsed} 
              active={location === '/resource-library'} 
            />
            <NavItem 
              to="/journey" 
              icon={<Map className="h-5 w-5" />} 
              text="Journey Tracker" 
              collapsed={navCollapsed} 
              active={location === '/journey'} 
            />
            <NavItem 
              to="/settings" 
              icon={<Settings className="h-5 w-5" />} 
              text="Settings" 
              collapsed={navCollapsed} 
              active={location === '/settings'} 
            />
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-700 text-center">
          {!navCollapsed && (
            <div className="flex flex-col items-center">
              <div className="mb-1">
                <span className="text-purple-400 font-medium">PinkSync</span> Enabled
              </div>
              <div className="text-xs text-slate-400">
                Deaf-Friendly Platform
              </div>
            </div>
          )}
          {navCollapsed && (
            <div className="flex justify-center">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            </div>
          )}
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 bg-slate-50">
        <Switch>
          <Route path="/" component={HomeScreen} />
          <Route path="/pathways/business" component={BusinessPathwayPage} />
          <Route path="/pathways/business/idea" component={BusinessIdeaPage} />
          <Route path="/pathways/business/build" component={BusinessBuildPage} />
          <Route path="/pathways/business/grow" component={BusinessGrowPage} />
          <Route path="/pathways/business/manage" component={BusinessManagePage} />
          <Route path="/analytics" component={AIBusinessAnalytics} />
          <Route path="/vr4deaf" component={VR4DeafDashboard} />
          <Route path="/job-support" component={JobSupportDashboard} />
          <Route path="/team-builder" component={StartupTeamBuilder} />
          <Route path="/settings" component={SettingsScreen} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/profile/:username" component={ProfilePage} />
          <Route path="/resources" component={TechLeadershipResources} />
          <Route path="/resource-library" component={ResourceLibraryPage} />
          <Route path="/journey" component={JourneyTrackerPage} />
          <Route component={NotFoundScreen} />
        </Switch>
      </main>
    </div>
  );
}

// Navigation Item Component
function NavItem({ 
  to, 
  icon, 
  text, 
  collapsed, 
  active 
}: { 
  to: string; 
  icon: React.ReactNode; 
  text: string; 
  collapsed: boolean; 
  active: boolean;
}) {
  return (
    <li>
      <Link href={to}>
        <a 
          className={`
            flex items-center p-2 rounded-md 
            ${active ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800'}
          `}
        >
          <span className="flex-shrink-0">{icon}</span>
          {!collapsed && <span className="ml-3">{text}</span>}
        </a>
      </Link>
    </li>
  );
}

// Home Screen Component
function HomeScreen() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Welcome to 360 Magicians</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-purple-600" />
            <h2 className="text-2xl font-semibold">Business Magician</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Create, build, and grow your business with deaf-first resources, AI-powered guidance, 
            and accessibility-focused tools.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/pathways/business">
              <a className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
                Explore Business Pathway
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Link>
            <Link href="/analytics">
              <a className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
                View Business Analytics
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-8 w-8 text-green-600" />
            <h2 className="text-2xl font-semibold">Job Magician</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Find, secure, and thrive in jobs with specialized tools for workplace accommodations,
            interpreter services, and deaf-friendly employment practices.
          </p>
          <Link href="/job-support">
            <a className="inline-flex items-center text-green-600 font-medium hover:text-green-800">
              Access Job Support
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Headphones className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-semibold">VR4Deaf</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Navigate vocational rehabilitation services with specialized support for deaf
            entrepreneurs and professionals seeking training, funding, and accommodations.
          </p>
          <Link href="/vr4deaf">
            <a className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
              View VR Dashboard
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-amber-600" />
            <h2 className="text-2xl font-semibold">Team Builder</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Build and manage an inclusive team for your startup with deaf-friendly hiring practices,
            job descriptions, and interview processes.
          </p>
          <Link href="/team-builder">
            <a className="inline-flex items-center text-amber-600 font-medium hover:text-amber-800">
              Start Building Your Team
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Link>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-purple-50 border border-purple-100 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Headphones className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">PinkSync Integration</h3>
            <p className="text-slate-700 mb-3">
              All 360 Magicians modules are powered by PinkSync technology, providing seamless ASL communication, 
              video translation, interpreter services, and deaf-friendly workflows throughout your business journey.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge color="purple">ASL Video Support</Badge>
              <Badge color="purple">Real-time Interpretation</Badge>
              <Badge color="purple">Deaf-Friendly AI</Badge>
              <Badge color="purple">Accessibility-First Design</Badge>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/resources">
                <a className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
                  Explore Tech Leadership Resources
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Link>
              <Link href="/resource-library">
                <a className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
                  Browse SBA Resource Library
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Link>
              <Link href="/journey">
                <a className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
                  Track Your Business Journey
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Screen Component
function SettingsScreen() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
        <p className="text-slate-600 mb-4">Settings page is under construction.</p>
      </div>
    </div>
  );
}

// Not Found Screen Component
function NotFoundScreen() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-slate-600 mb-6">The page you're looking for doesn't exist.</p>
      <Link href="/">
        <a className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Return Home
        </a>
      </Link>
    </div>
  );
}

// Badge Component
function Badge({ children, color = 'slate' }: { children: React.ReactNode; color?: string }) {
  const colorClasses = {
    slate: 'bg-slate-100 text-slate-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
      {children}
    </span>
  );
}