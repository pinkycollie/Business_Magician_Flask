import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Award,
  BriefcaseIcon, 
  CalendarDays, 
  Code, 
  Clock, 
  Edit, 
  FileCheck, 
  FilePlus, 
  GraduationCap, 
  HandHelping, 
  Headphones, 
  Info, 
  Laptop, 
  MessageSquare, 
  PersonStanding, 
  Plus, 
  Radio, 
  RefreshCw, 
  Search, 
  Settings, 
  Star, 
  User, 
  Video, 
  Video as VideoIcon,
  X,
  Calendar,
  Copy,
  Download,
  ArrowUpDown,
  BookOpen,
  Building,
  ClipboardList,
  Check
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Job types and interfaces
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  salary?: string;
  description: string;
  isAccommodationFriendly: boolean;
  datePosted: string;
  deadline?: string;
  requiresInterpreter: boolean;
  skills: string[];
}

interface InterpreterRequest {
  id: string;
  status: 'pending' | 'approved' | 'scheduled' | 'completed' | 'denied';
  type: 'job-interview' | 'training' | 'meeting' | 'onboarding' | 'performance-review';
  date: string;
  duration: string;
  company: string;
  location: string;
  isRemote: boolean;
  notes?: string;
  interpreter?: {
    name: string;
    isPinkSync: boolean;
  };
}

interface Training {
  id: string;
  title: string;
  provider: string;
  type: 'technical' | 'soft-skills' | 'industry' | 'accessibility' | 'certification';
  status: 'available' | 'enrolled' | 'in-progress' | 'completed';
  startDate?: string;
  endDate?: string;
  fundingStatus: 'needed' | 'requested' | 'approved' | 'not-needed';
  hasAslSupport: boolean;
  isPinkSyncEnabled: boolean;
  description: string;
  progress?: number;
}

interface WorkplaceAccommodation {
  id: string;
  type: 'interpreter' | 'technology' | 'schedule' | 'communication' | 'physical';
  status: 'draft' | 'submitted' | 'in-review' | 'approved' | 'implemented' | 'denied';
  company: string;
  requestDate: string;
  approvalDate?: string;
  details: string;
  isLegallyRequired: boolean;
  supportingDocuments?: string[];
  followUpDate?: string;
}

interface JobCoach {
  id: string;
  name: string;
  specialties: string[];
  isPinkSyncCertified: boolean;
  languages: string[];
  rating: number;
  availability: string[];
}

// Sample data
const sampleJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Software Developer',
    company: 'TechSolutions Inc',
    location: 'San Francisco, CA (Remote)',
    type: 'full-time',
    status: 'interviewing',
    salary: '$100,000 - $120,000',
    description: 'We are seeking a Software Developer to join our growing team. The ideal candidate will have experience with React, Node.js, and TypeScript.',
    isAccommodationFriendly: true,
    datePosted: '2023-03-15',
    deadline: '2023-04-15',
    requiresInterpreter: true,
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL']
  },
  {
    id: 'job-2',
    title: 'UX/UI Designer',
    company: 'Creative Designs',
    location: 'Remote',
    type: 'full-time',
    status: 'applied',
    salary: '$90,000 - $110,000',
    description: 'Creative Designs is looking for a UX/UI Designer with experience in creating accessible user interfaces and a passion for inclusive design.',
    isAccommodationFriendly: true,
    datePosted: '2023-03-20',
    requiresInterpreter: true,
    skills: ['Figma', 'Adobe XD', 'Accessibility', 'User Testing']
  },
  {
    id: 'job-3',
    title: 'Project Manager',
    company: 'Global Solutions',
    location: 'Chicago, IL',
    type: 'full-time',
    status: 'saved',
    salary: '$85,000 - $105,000',
    description: 'Global Solutions is seeking an experienced Project Manager to oversee the development and implementation of client projects.',
    isAccommodationFriendly: false,
    datePosted: '2023-03-22',
    deadline: '2023-04-22',
    requiresInterpreter: true,
    skills: ['Project Management', 'Agile', 'Budgeting', 'Stakeholder Management']
  },
  {
    id: 'job-4',
    title: 'Data Analyst',
    company: 'Data Insights Corp',
    location: 'Austin, TX (Hybrid)',
    type: 'full-time',
    status: 'saved',
    salary: '$80,000 - $95,000',
    description: 'Data Insights Corp is looking for a Data Analyst to join our team. The ideal candidate will have experience with SQL, Python, and data visualization tools.',
    isAccommodationFriendly: true,
    datePosted: '2023-03-25',
    requiresInterpreter: true,
    skills: ['SQL', 'Python', 'Tableau', 'Excel']
  }
];

const sampleInterpreterRequests: InterpreterRequest[] = [
  {
    id: 'int-1',
    status: 'scheduled',
    type: 'job-interview',
    date: '2023-04-20T14:00:00Z',
    duration: '1 hour',
    company: 'TechSolutions Inc',
    location: 'Video Call',
    isRemote: true,
    notes: 'Technical interview with the engineering team. Will involve coding questions and architecture discussions.',
    interpreter: {
      name: 'Sarah Johnson',
      isPinkSync: true
    }
  },
  {
    id: 'int-2',
    status: 'pending',
    type: 'job-interview',
    date: '2023-04-25T10:00:00Z',
    duration: '45 minutes',
    company: 'Creative Designs',
    location: 'Video Call',
    isRemote: true,
    notes: 'Initial interview with HR and Design Lead'
  },
  {
    id: 'int-3',
    status: 'approved',
    type: 'meeting',
    date: '2023-04-18T15:30:00Z',
    duration: '2 hours',
    company: 'Current Employer - DataTech',
    location: 'Company HQ - 123 Main St, Austin TX',
    isRemote: false,
    notes: 'Quarterly team planning meeting',
    interpreter: {
      name: 'Michael Chen',
      isPinkSync: true
    }
  }
];

const sampleTrainings: Training[] = [
  {
    id: 'tr-1',
    title: 'Advanced React Development',
    provider: 'Tech Learning Academy',
    type: 'technical',
    status: 'in-progress',
    startDate: '2023-03-01',
    endDate: '2023-05-30',
    fundingStatus: 'approved',
    hasAslSupport: true,
    isPinkSyncEnabled: true,
    description: 'Master advanced React concepts including hooks, context, and performance optimization.',
    progress: 65
  },
  {
    id: 'tr-2',
    title: 'Project Management Professional (PMP) Certification',
    provider: 'PM Institute',
    type: 'certification',
    status: 'enrolled',
    startDate: '2023-05-15',
    endDate: '2023-08-15',
    fundingStatus: 'approved',
    hasAslSupport: true,
    isPinkSyncEnabled: true,
    description: 'Comprehensive preparation for the PMP certification exam.',
    progress: 0
  },
  {
    id: 'tr-3',
    title: 'Effective Communication in the Workplace',
    provider: 'Professional Skills Center',
    type: 'soft-skills',
    status: 'available',
    fundingStatus: 'needed',
    hasAslSupport: false,
    isPinkSyncEnabled: false,
    description: 'Develop better workplace communication skills for both deaf and hearing environments.'
  },
  {
    id: 'tr-4',
    title: 'Data Science Fundamentals',
    provider: 'Online Data Academy',
    type: 'technical',
    status: 'completed',
    startDate: '2023-01-10',
    endDate: '2023-03-10',
    fundingStatus: 'not-needed',
    hasAslSupport: true,
    isPinkSyncEnabled: true,
    description: 'Introduction to data science concepts, tools, and methodologies.',
    progress: 100
  }
];

const sampleAccommodations: WorkplaceAccommodation[] = [
  {
    id: 'acc-1',
    type: 'interpreter',
    status: 'approved',
    company: 'DataTech (Current Employer)',
    requestDate: '2023-02-10',
    approvalDate: '2023-02-20',
    details: 'ASL interpreter for all team meetings and company-wide presentations',
    isLegallyRequired: true,
    followUpDate: '2023-05-20'
  },
  {
    id: 'acc-2',
    type: 'technology',
    status: 'implemented',
    company: 'DataTech (Current Employer)',
    requestDate: '2023-01-15',
    approvalDate: '2023-01-25',
    details: 'Video relay service (VRS) for phone calls and automated captioning software for impromptu conversations',
    isLegallyRequired: true,
    supportingDocuments: ['AudiologistReport.pdf', 'TechnologyRecommendation.pdf']
  },
  {
    id: 'acc-3',
    type: 'communication',
    status: 'submitted',
    company: 'TechSolutions Inc (Potential Employer)',
    requestDate: '2023-04-05',
    details: 'Request for ASL interpreter during onboarding process and team meetings if hired',
    isLegallyRequired: true
  }
];

const sampleCoaches: JobCoach[] = [
  {
    id: 'coach-1',
    name: 'Jennifer Martinez',
    specialties: ['Tech Industry', 'Job Applications', 'Interview Preparation', 'Workplace Accommodations'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    rating: 4.9,
    availability: ['Monday', 'Wednesday', 'Thursday']
  },
  {
    id: 'coach-2',
    name: 'David Kim',
    specialties: ['Career Transitions', 'Resume Building', 'Salary Negotiation', 'Professional Development'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English', 'Korean'],
    rating: 4.8,
    availability: ['Tuesday', 'Wednesday', 'Friday']
  },
  {
    id: 'coach-3',
    name: 'Marcus Johnson',
    specialties: ['Technical Interviews', 'Software Development', 'Remote Work', 'LinkedIn Optimization'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    rating: 4.7,
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday']
  }
];

export default function JobSupportDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Job & Career Support</h1>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
              PinkSync Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            VR-funded job search, workplace accommodations, and career advancement
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="sm" variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Search Jobs
          </Button>
          <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
            <VideoIcon className="h-4 w-4" />
            Meet With Coach
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <JobSearchStatusCard />
        <InterpreterStatusCard />
        <TrainingStatusCard />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid md:w-full md:grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <Info className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2">
            <BriefcaseIcon className="h-4 w-4" />
            Job Search
          </TabsTrigger>
          <TabsTrigger value="interpreters" className="gap-2">
            <Video className="h-4 w-4" />
            Interpreters
          </TabsTrigger>
          <TabsTrigger value="training" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="accommodations" className="gap-2">
            <Settings className="h-4 w-4" />
            Accommodations
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <JobSearchTab />
        </TabsContent>
        
        <TabsContent value="interpreters" className="space-y-4">
          <InterpretersTab />
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          <TrainingTab />
        </TabsContent>
        
        <TabsContent value="accommodations" className="space-y-4">
          <AccommodationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Status Cards
function JobSearchStatusCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Job Search Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded">
                <BriefcaseIcon className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <span className="text-sm">Active Applications</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800">2</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-1.5 rounded">
                <Calendar className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <span className="text-sm">Upcoming Interviews</span>
            </div>
            <Badge className="bg-amber-100 text-amber-800">1</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded">
                <Star className="h-3.5 w-3.5 text-green-600" />
              </div>
              <span className="text-sm">Saved Jobs</span>
            </div>
            <Badge className="bg-green-100 text-green-800">2</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-1.5 rounded">
                <Video className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <span className="text-sm">PinkSync Job Features</span>
            </div>
            <Badge className="bg-purple-100 text-purple-800">Active</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full gap-1">
          <Search className="h-3.5 w-3.5" />
          View Job Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}

function InterpreterStatusCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Interpreter Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-md p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">Interview Interpreter</p>
                <p className="text-xs text-muted-foreground">TechSolutions Inc</p>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Tomorrow</Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs">2:00 PM - 3:00 PM</p>
              <Button size="sm" variant="ghost" className="h-7 gap-1">
                <Video className="h-3 w-3" />
                Prep
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Interpreter Hours</span>
              <span className="text-sm">
                <span className="font-medium">18</span>
                <span className="text-muted-foreground">/50 used</span>
              </span>
            </div>
            <Progress value={36} className="h-2" />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">
                VR funding remaining: 32 hours
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full gap-1 text-purple-600">
          <Plus className="h-3.5 w-3.5" />
          Request Interpreter
        </Button>
      </CardFooter>
    </Card>
  );
}

function TrainingStatusCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Training & Development</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded">
                <GraduationCap className="h-3.5 w-3.5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Advanced React</p>
                <p className="text-xs text-muted-foreground">In Progress (65%)</p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              PinkSync
            </Badge>
          </div>
          
          <Progress value={65} className="h-2" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded">
                <Award className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">PMP Certification</p>
                <p className="text-xs text-muted-foreground">Starts May 15</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-7">
              View
            </Button>
          </div>
          
          <div className="bg-muted/40 p-2 rounded-md">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-1.5 rounded-full">
                <Video className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium">ASL-Supported Training</p>
                <p className="text-xs text-muted-foreground">VR funding available</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full gap-1">
          <Search className="h-3.5 w-3.5" />
          Find Training
        </Button>
      </CardFooter>
    </Card>
  );
}

// Tab Content Components
function OverviewTab() {
  const [isCoachDialogOpen, setIsCoachDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleScheduleSession = () => {
    toast({
      title: "Session scheduled",
      description: "Your coaching session has been scheduled for Tuesday at 2:00 PM",
    });
    setIsCoachDialogOpen(false);
  };
  
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Job Coach</CardTitle>
            <CardDescription>
              PinkSync-certified career specialist for deaf professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src="https://i.pravatar.cc/100?img=32" />
                <AvatarFallback>DJ</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">David Kim</h3>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-50 fill-yellow-50" half />
                  <span className="text-sm ml-1">4.8/5</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">ASL Fluent</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-800 text-xs">PinkSync Certified</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-800">Career Transitions</Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800">Resume Building</Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800">Salary Negotiation</Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800">Professional Development</Badge>
              </div>
              
              <h4 className="font-medium text-sm mt-2">Next Session</h4>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Interview Preparation</p>
                    <p className="text-xs text-muted-foreground">Tuesday, April 18 • 2:00 PM</p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Calendar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
            <Button onClick={() => setIsCoachDialogOpen(true)} className="gap-1 bg-purple-600 hover:bg-purple-700">
              <Video className="h-4 w-4" />
              Schedule Session
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Career Progress</CardTitle>
            <CardDescription>
              Job search and skill development progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Job Search Progress</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Resume & Profile</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Applications</span>
                    <span>50%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Interviews</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Offer & Negotiation</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Skill Development</span>
                  <span className="text-sm text-muted-foreground">2 in progress</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Technical Skills</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Project Management</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                <div className="flex gap-3">
                  <Video className="h-5 w-5 text-purple-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">PinkSync Job Search Assistance</p>
                    <p className="text-xs text-gray-600">All job interviews include ASL interpreter services through VR funding. PinkSync technology ensures seamless communication with potential employers.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Career Roadmap</CardTitle>
          <CardDescription>
            Your personalized career development plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 border rounded-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Current Position</h3>
                </div>
                <h4 className="font-bold">Junior Developer</h4>
                <p className="text-sm text-muted-foreground mb-2">DataTech Solutions</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>1 year, 3 months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span>React, Node.js, TypeScript</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 border rounded-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="h-5 w-5 text-amber-600" />
                  <h3 className="font-medium">Target Position</h3>
                </div>
                <h4 className="font-bold">Mid-Level Frontend Developer</h4>
                <p className="text-sm text-muted-foreground mb-2">Timeline: 6-12 months</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <HandHelping className="h-4 w-4 text-muted-foreground" />
                    <span>Required: Advanced React, State Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>Training in progress (65%)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 border rounded-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Long-Term Goal</h3>
                </div>
                <h4 className="font-bold">Senior Developer / Tech Lead</h4>
                <p className="text-sm text-muted-foreground mb-2">Timeline: 3-5 years</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-muted-foreground" />
                    <span>Architecture, Leadership, Mentoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <span>Continous learning path planned</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">Required Skills Development</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Technical Skills</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Advanced React</span>
                      <span className="text-green-600">In Progress</span>
                    </div>
                    <Progress value={65} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>State Management (Redux)</span>
                      <span className="text-amber-600">Planned</span>
                    </div>
                    <Progress value={10} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance Optimization</span>
                      <span className="text-muted-foreground">Not Started</span>
                    </div>
                    <Progress value={0} className="h-1.5" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Project Skills</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Agile Methodologies</span>
                      <span className="text-green-600">Completed</span>
                    </div>
                    <Progress value={100} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Project Management</span>
                      <span className="text-green-600">In Progress</span>
                    </div>
                    <Progress value={10} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Technical Documentation</span>
                      <span className="text-muted-foreground">Not Started</span>
                    </div>
                    <Progress value={0} className="h-1.5" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Soft Skills</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Technical Communication</span>
                      <span className="text-amber-600">Planned</span>
                    </div>
                    <Progress value={25} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mentorship</span>
                      <span className="text-muted-foreground">Not Started</span>
                    </div>
                    <Progress value={0} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Leadership</span>
                      <span className="text-muted-foreground">Not Started</span>
                    </div>
                    <Progress value={0} className="h-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-1">
            <Edit className="h-4 w-4" />
            Update Goals
          </Button>
          <Button className="gap-1">
            <GraduationCap className="h-4 w-4" />
            Find Training
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isCoachDialogOpen} onOpenChange={setIsCoachDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Coaching Session</DialogTitle>
            <DialogDescription>
              Schedule a PinkSync-enabled video coaching session with David Kim
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="session-type">Session Type</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                <option value="resume-review">Resume Review</option>
                <option value="interview-prep">Interview Preparation</option>
                <option value="job-search">Job Search Strategy</option>
                <option value="career-planning">Career Planning</option>
                <option value="skills-assessment">Skills Assessment</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date & Time</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" id="date" value="2023-04-18" />
                <select className="flex h-9 rounded-md border border-input bg-background px-3 py-1">
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00" selected>2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topics">Session Topics</Label>
              <Textarea 
                id="topics" 
                placeholder="What would you like to discuss in this session?" 
                rows={3}
                value="Preparing for the upcoming technical interview with TechSolutions Inc. Need help with coding interview questions and how to showcase my projects."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pinksync-enabled" defaultChecked />
              <Label htmlFor="pinksync-enabled" className="text-sm">Enable PinkSync ASL translation and recording</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCoachDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleSession} className="bg-purple-600 hover:bg-purple-700">Schedule Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function JobSearchTab() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const { toast } = useToast();
  
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
  };
  
  const handleApplyJob = () => {
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted. An interpreter will be scheduled for any interviews.",
    });
    setIsJobDetailOpen(false);
  };
  
  const handleRequestInterpreter = () => {
    toast({
      title: "Interpreter Requested",
      description: "An interpreter request has been submitted for this interview.",
    });
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Job Search</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <FilePlus className="h-4 w-4" />
            Upload Resume
          </Button>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Track New Job
          </Button>
        </div>
      </div>
      
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Video className="h-5 w-5 text-purple-700 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1 text-purple-900">PinkSync Job Application Support</h3>
            <p className="text-sm text-gray-700 mb-2">
              All job applications through VR4Deaf include PinkSync translator services for:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
              <li>ASL video cover letters</li>
              <li>Interview interpreters (in-person or remote)</li>
              <li>Workplace accommodation requests</li>
              <li>Onboarding communication support</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Job Tracker</CardTitle>
          <CardDescription>
            Track applications, interviews, and offers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-10 font-medium p-2 bg-muted text-xs">
              <div className="col-span-3">Position</div>
              <div className="col-span-2">Company</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Posted</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Interpreter</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {sampleJobs.map(job => (
                <div key={job.id} className="grid grid-cols-10 p-2 text-sm items-center">
                  <div className="col-span-3 font-medium">{job.title}</div>
                  <div className="col-span-2">{job.company}</div>
                  <div className="col-span-1">
                    <Badge variant="outline" className="text-xs">
                      {job.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-xs text-muted-foreground">
                    {new Date(job.datePosted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="col-span-1">
                    <Badge className={`text-xs ${
                      job.status === 'saved' ? 'bg-gray-100 text-gray-800' :
                      job.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'interviewing' ? 'bg-amber-100 text-amber-800' :
                      job.status === 'offered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    {job.requiresInterpreter && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        PinkSync
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-1 flex justify-end gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleViewJob(job)}>
                      <Search className="h-4 w-4" />
                    </Button>
                    {job.status === 'interviewing' && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleRequestInterpreter}>
                        <Video className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Resume & Materials</CardTitle>
            <CardDescription>
              Your job application documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Tech Resume</h3>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Last updated 2 weeks ago • Optimized for tech roles
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Search className="h-3.5 w-3.5" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">ASL Video Introduction</h3>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">PinkSync</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Created 1 month ago • 2:15 duration • With captions
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Search className="h-3.5 w-3.5" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Video className="h-3.5 w-3.5" />
                    Re-record
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Portfolio Website</h3>
                  </div>
                  <Badge variant="outline">External</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  yourportfolio.com • Last checked 3 days ago
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1" asChild>
                    <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Visit
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add Document
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>
              Scheduled interviews with interpreter services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">TechSolutions Inc</h3>
                  <Badge className="bg-amber-100 text-amber-800">Tomorrow</Badge>
                </div>
                <p className="text-sm mb-1">Technical Interview for Software Developer</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <Clock className="h-3.5 w-3.5" />
                  <span>2:00 PM - 3:00 PM • Video Call</span>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-100 rounded mb-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-700" />
                    <div>
                      <p className="text-xs font-medium text-purple-900">PinkSync Interpreter: Sarah Johnson</p>
                      <p className="text-xs text-gray-600">Pre-interview prep: 1:30 PM</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Calendar
                  </Button>
                  <Button size="sm" className="gap-1">
                    <Video className="h-3.5 w-3.5" />
                    Interview Prep
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Creative Designs</h3>
                  <Badge variant="outline">Next Week</Badge>
                </div>
                <p className="text-sm mb-1">Initial Interview for UX/UI Designer</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <Clock className="h-3.5 w-3.5" />
                  <span>April 25 • 10:00 AM • Video Call</span>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-100 rounded mb-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-700" />
                    <div>
                      <p className="text-xs font-medium text-purple-900">PinkSync Interpreter: Pending Assignment</p>
                      <p className="text-xs text-gray-600">Request submitted</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Calendar
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    Details
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add Interview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedJob && (
        <Dialog open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
                <Badge className={`${
                  selectedJob.status === 'saved' ? 'bg-gray-100 text-gray-800' :
                  selectedJob.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                  selectedJob.status === 'interviewing' ? 'bg-amber-100 text-amber-800' :
                  selectedJob.status === 'offered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                </Badge>
              </div>
              <DialogDescription>
                {selectedJob.company} • {selectedJob.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Job Type</span>
                    <p className="capitalize">{selectedJob.type.replace('-', ' ')}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Salary Range</span>
                    <p>{selectedJob.salary || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Date Posted</span>
                    <p>{new Date(selectedJob.datePosted).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Application Deadline</span>
                    <p>{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Description</span>
                    {selectedJob.isAccommodationFriendly && (
                      <Badge className="bg-green-100 text-green-800">
                        Accommodation Friendly
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{selectedJob.description}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.skills.map(skill => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                {selectedJob.requiresInterpreter && (
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                    <div className="flex gap-3">
                      <Video className="h-5 w-5 text-purple-700" />
                      <div>
                        <p className="font-medium text-purple-900">PinkSync Interpreter Support Available</p>
                        <p className="text-sm text-gray-600">
                          VR funding will provide ASL interpreter services for all interviews and onboarding
                          if you apply for this position.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Application Status</h4>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`rounded-full h-2.5 w-2.5 ${selectedJob.status !== 'saved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm font-medium">Save</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${selectedJob.status !== 'saved' ? 'bg-green-500' : 'bg-gray-300'}`} style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`rounded-full h-2.5 w-2.5 ${selectedJob.status === 'applied' || selectedJob.status === 'interviewing' || selectedJob.status === 'offered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm font-medium">Apply</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${selectedJob.status === 'applied' || selectedJob.status === 'interviewing' || selectedJob.status === 'offered' ? 'bg-green-500' : 'bg-gray-300'}`} style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`rounded-full h-2.5 w-2.5 ${selectedJob.status === 'interviewing' || selectedJob.status === 'offered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm font-medium">Interview</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${selectedJob.status === 'interviewing' || selectedJob.status === 'offered' ? 'bg-green-500' : 'bg-gray-300'}`} style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`rounded-full h-2.5 w-2.5 ${selectedJob.status === 'offered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm font-medium">Offer</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${selectedJob.status === 'offered' ? 'bg-green-500' : 'bg-gray-300'}`} style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Save
                </Button>
                {selectedJob.status === 'interviewing' && (
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleRequestInterpreter}>
                    <Video className="h-3.5 w-3.5" />
                    Request Interpreter
                  </Button>
                )}
              </div>
              {selectedJob.status === 'saved' && (
                <Button onClick={handleApplyJob} className="gap-1">
                  <Send className="h-4 w-4" />
                  Apply Now
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function InterpretersTab() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleRequestInterpreter = () => {
    toast({
      title: "Interpreter Requested",
      description: "Your interpreter request has been submitted and is pending approval.",
    });
    setIsRequestDialogOpen(false);
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Interpreter Services</h3>
        <Button size="sm" onClick={() => setIsRequestDialogOpen(true)} className="gap-1 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" />
          Request Interpreter
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Interpreter Hours</CardTitle>
            <CardDescription>
              VR-funded interpreter services allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-medium">Hours Used</span>
                <span className="font-bold">18 / 50</span>
              </div>
              <Progress value={36} className="h-2.5" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Job Interviews</span>
                    <span>8 hours</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Work Meetings</span>
                    <span>6 hours</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Training</span>
                    <span>3 hours</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '6%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Other</span>
                    <span>1 hour</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '2%' }}></div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Current VR Allocation</span>
                  <span className="font-medium">50 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Hours Remaining</span>
                  <span className="font-medium">32 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Renewal Date</span>
                  <span className="font-medium">August 15, 2023</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Plus className="h-3.5 w-3.5" />
              Request Additional Hours
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>PinkSync Features</CardTitle>
              <Badge className="bg-purple-100 text-purple-800">Active</Badge>
            </div>
            <CardDescription>
              PinkSync-powered interpreter enhancements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md flex gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Video className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">ASL-specific Interpreters</h4>
                  <p className="text-sm text-muted-foreground">
                    PinkSync interpreters are trained in tech and business terminology in ASL
                  </p>
                </div>
              </div>
              
              <div className="p-3 border rounded-md flex gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Headphones className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">AI-enhanced Accuracy</h4>
                  <p className="text-sm text-muted-foreground">
                    AI technology improves interpreter accuracy for technical terms
                  </p>
                </div>
              </div>
              
              <div className="p-3 border rounded-md flex gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Radio className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Session Recording</h4>
                  <p className="text-sm text-muted-foreground">
                    Optional recording of interpreted sessions for reference
                  </p>
                </div>
              </div>
              
              <div className="p-3 border rounded-md flex gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Laptop className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Remote Interpreter Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with interpreters for any meeting via video call
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Interpreter Schedule</CardTitle>
          <CardDescription>
            Upcoming and past interpreter sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 font-medium p-2 bg-muted text-xs">
              <div className="col-span-2">Date & Time</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Company/Event</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {sampleInterpreterRequests.map(request => (
                <div key={request.id} className="grid grid-cols-12 p-2 text-sm items-center">
                  <div className="col-span-2">
                    {new Date(request.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    <div className="text-xs text-muted-foreground">
                      {new Date(request.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="col-span-2 capitalize">
                    {request.type.replace('-', ' ')}
                  </div>
                  <div className="col-span-3">{request.company}</div>
                  <div className="col-span-2">
                    {request.isRemote ? (
                      <Badge variant="outline" className="text-xs">Remote</Badge>
                    ) : (
                      request.location.substring(0, 20) + (request.location.length > 20 ? '...' : '')
                    )}
                  </div>
                  <div className="col-span-1">{request.duration}</div>
                  <div className="col-span-1">
                    <Badge className={`text-xs ${
                      request.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      request.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex justify-end gap-1">
                    {request.interpreter?.isPinkSync && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        PinkSync
                      </Badge>
                    )}
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Interpreter</DialogTitle>
            <DialogDescription>
              Request a VR-funded interpreter through PinkSync for job interviews, meetings, or training
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="request-type">Request Type</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                  <option value="job-interview">Job Interview</option>
                  <option value="meeting">Work Meeting</option>
                  <option value="training">Training Session</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="performance-review">Performance Review</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location-type">Location Type</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                  <option value="remote">Remote (Video Call)</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company">Company/Organization</Label>
              <Input id="company" placeholder="Company or organization name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input type="date" id="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input type="time" id="time" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                  <option value="30min">30 minutes</option>
                  <option value="45min">45 minutes</option>
                  <option value="1hr">1 hour</option>
                  <option value="1.5hr">1.5 hours</option>
                  <option value="2hr">2 hours</option>
                  <option value="3hr">3+ hours</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interpreter-preference">Interpreter Preference</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                  <option value="any">No Preference</option>
                  <option value="sarah">Sarah Johnson</option>
                  <option value="michael">Michael Chen</option>
                  <option value="elena">Elena Rodriguez</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="details">Details & Special Requirements</Label>
              <Textarea 
                id="details" 
                placeholder="Provide any additional details about the meeting or specific terminology needs" 
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="pinksync-enabled" defaultChecked />
              <Label htmlFor="pinksync-enabled" className="text-sm">Request PinkSync-certified interpreter with technical expertise</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="recording-enabled" />
              <Label htmlFor="recording-enabled" className="text-sm">Enable session recording for later reference</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestInterpreter} className="bg-purple-600 hover:bg-purple-700">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TrainingTab() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleRequestTraining = () => {
    toast({
      title: "Training Request Submitted",
      description: "Your training request has been submitted for VR funding approval.",
    });
    setIsRequestDialogOpen(false);
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Training & Development</h3>
        <Button size="sm" onClick={() => setIsRequestDialogOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Request Training
        </Button>
      </div>
      
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <GraduationCap className="h-5 w-5 text-purple-700 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1 text-purple-900">ASL-Accessible VR Training</h3>
            <p className="text-sm text-gray-700 mb-2">
              VR4Deaf provides ASL-accessible training through PinkSync partners. Training includes:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
              <li>Technical certifications with ASL instruction</li>
              <li>Professional development courses</li>
              <li>On-the-job training interpreter support</li>
              <li>Self-paced video courses with ASL</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Training</CardTitle>
          <CardDescription>
            Current and upcoming training courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-md border p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-blue-100">
                      <Code className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Advanced React Development</h3>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tech Learning Academy • Mar 1 - May 30, 2023
                  </p>
                  <p className="text-sm mb-4">
                    Master advanced React concepts including hooks, context, and performance optimization.
                  </p>
                  
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex items-start gap-2 mt-3">
                    <Badge className="bg-green-100 text-green-800">VR Funded</Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      PinkSync Enabled
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between gap-2">
                  <Button size="sm" className="gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    Continue Course
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Video className="h-3.5 w-3.5" />
                    ASL Videos
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Contact Instructor
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full"></div>
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-amber-100">
                      <ClipboardList className="h-4 w-4 text-amber-600" />
                    </div>
                    <h3 className="font-medium">Project Management Professional (PMP) Certification</h3>
                    <Badge className="bg-amber-100 text-amber-800">Enrolled</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    PM Institute • May 15 - Aug 15, 2023
                  </p>
                  <p className="text-sm mb-4">
                    Comprehensive preparation for the PMP certification exam.
                  </p>
                  
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span>Starts in: 28 days</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  
                  <div className="flex items-start gap-2 mt-3">
                    <Badge className="bg-green-100 text-green-800">VR Funded</Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      PinkSync Enabled
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    View Schedule
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Pre-course Materials
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-5 relative overflow-hidden bg-gray-50">
              <div className="absolute top-0 left-0 w-1 bg-green-500 h-full"></div>
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-green-100">
                      <FileCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium">Data Science Fundamentals</h3>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Online Data Academy • Jan 10 - Mar 10, 2023
                  </p>
                  <p className="text-sm mb-4">
                    Introduction to data science concepts, tools, and methodologies.
                  </p>
                  
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span>Final Grade: A</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex items-start gap-2 mt-3">
                    <Badge className="bg-gray-100 text-gray-800">Self Funded</Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      PinkSync Enabled
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Download Certificate
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Video className="h-3.5 w-3.5" />
                    Access Materials
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommended Training</CardTitle>
          <CardDescription>
            VR-approved training opportunities for your career goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 font-medium p-2 bg-muted text-xs">
              <div className="col-span-4">Course</div>
              <div className="col-span-2">Provider</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-1">ASL Support</div>
              <div className="col-span-1">Funding</div>
              <div className="col-span-1">Actions</div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-12 p-2 text-sm items-center">
                <div className="col-span-4 font-medium">Effective Communication in the Workplace</div>
                <div className="col-span-2">Professional Skills Center</div>
                <div className="col-span-2">
                  <Badge variant="outline" className="text-xs">Soft Skills</Badge>
                </div>
                <div className="col-span-1">6 weeks</div>
                <div className="col-span-1">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    Available
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Badge className="bg-amber-100 text-amber-800 text-xs">
                    Eligible
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsRequestDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-12 p-2 text-sm items-center">
                <div className="col-span-4 font-medium">Frontend Performance Optimization</div>
                <div className="col-span-2">Tech Academy</div>
                <div className="col-span-2">
                  <Badge variant="outline" className="text-xs">Technical</Badge>
                </div>
                <div className="col-span-1">8 weeks</div>
                <div className="col-span-1">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    Available
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Eligible
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsRequestDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-12 p-2 text-sm items-center">
                <div className="col-span-4 font-medium">Technical Leadership Fundamentals</div>
                <div className="col-span-2">Leadership Institute</div>
                <div className="col-span-2">
                  <Badge variant="outline" className="text-xs">Management</Badge>
                </div>
                <div className="col-span-1">12 weeks</div>
                <div className="col-span-1">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    Available
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Eligible
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsRequestDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-12 p-2 text-sm items-center">
                <div className="col-span-4 font-medium">Modern State Management (Redux, Context, Zustand)</div>
                <div className="col-span-2">React Training Co.</div>
                <div className="col-span-2">
                  <Badge variant="outline" className="text-xs">Technical</Badge>
                </div>
                <div className="col-span-1">6 weeks</div>
                <div className="col-span-1">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    Available
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Eligible
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsRequestDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full gap-1">
            <Search className="h-3.5 w-3.5" />
            Browse All Courses
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Training</DialogTitle>
            <DialogDescription>
              Request VR funding for job-related training and professional development
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input id="course-name" placeholder="Course or certification name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="provider">Provider</Label>
                <Input id="provider" placeholder="Training provider or school" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course-type">Course Type</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                  <option value="technical">Technical Skills</option>
                  <option value="soft-skills">Soft Skills</option>
                  <option value="certification">Certification</option>
                  <option value="industry">Industry Knowledge</option>
                  <option value="management">Management/Leadership</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input type="date" id="start-date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input type="date" id="end-date" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cost">Course Cost ($)</Label>
                <Input type="number" id="cost" placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course-format">Course Format</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                  <option value="online-self">Online (Self-paced)</option>
                  <option value="online-live">Online (Live Instruction)</option>
                  <option value="in-person">In-person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="career-relevance">Career Relevance</Label>
              <Textarea 
                id="career-relevance" 
                placeholder="Explain how this training is relevant to your career goals" 
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="course-url">Course URL (if available)</Label>
              <Input id="course-url" placeholder="https://" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="asl-support" defaultChecked />
              <Label htmlFor="asl-support" className="text-sm">I need ASL support for this training</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="pinksync-enabled" defaultChecked />
              <Label htmlFor="pinksync-enabled" className="text-sm">Request PinkSync ASL services for this training</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestTraining}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AccommodationsTab() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleRequestAccommodation = () => {
    toast({
      title: "Accommodation Request Submitted",
      description: "Your workplace accommodation request has been submitted.",
    });
    setIsRequestDialogOpen(false);
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Workplace Accommodations</h3>
        <Button size="sm" onClick={() => setIsRequestDialogOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Request Accommodation
        </Button>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-700 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1 text-blue-900">Accommodation Rights</h3>
            <p className="text-sm text-gray-700 mb-2">
              Under the Americans with Disabilities Act (ADA), deaf and hard of hearing individuals have the right to 
              reasonable accommodations in the workplace. VR4Deaf helps you navigate this process with:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
              <li>Legal guidance for accommodation requests</li>
              <li>Documentation preparation and submission</li>
              <li>Follow-up assistance and advocacy if needed</li>
              <li>Implementation support through PinkSync technology</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Accommodations</CardTitle>
          <CardDescription>
            Active and pending workplace accommodations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="rounded-md border p-5">
              <div className="flex flex-col md:flex-row gap-4 md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-green-100">
                      <Video className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium">ASL Interpreter for Team Meetings</h3>
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Company</p>
                      <p className="text-sm">DataTech (Current Employer)</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Requested</p>
                      <p className="text-sm">February 10, 2023</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Approved</p>
                      <p className="text-sm">February 20, 2023</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Follow-up Date</p>
                      <p className="text-sm">May 20, 2023</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Details</p>
                    <p className="text-sm">
                      ASL interpreter for all team meetings and company-wide presentations. Interpreter to be arranged 
                      at least 24 hours in advance for scheduled meetings.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2 mt-3">
                    <Badge className="bg-purple-100 text-purple-800">
                      PinkSync Enabled
                    </Badge>
                    <Badge variant="outline">Legally Required</Badge>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    Update
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <FileCheck className="h-3.5 w-3.5" />
                    Documents
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-5">
              <div className="flex flex-col md:flex-row gap-4 md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-green-100">
                      <Headphones className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium">Video Relay Service & Captioning</h3>
                    <Badge className="bg-green-100 text-green-800">Implemented</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Company</p>
                      <p className="text-sm">DataTech (Current Employer)</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Requested</p>
                      <p className="text-sm">January 15, 2023</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Approved</p>
                      <p className="text-sm">January 25, 2023</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Documents</p>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">AudiologistReport.pdf</Badge>
                        <Badge variant="outline" className="text-xs">TechRecommendation.pdf</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Details</p>
                    <p className="text-sm">
                      Video relay service (VRS) for phone calls and automated captioning software for impromptu 
                      conversations. Includes specialized video conferencing equipment setup.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2 mt-3">
                    <Badge className="bg-purple-100 text-purple-800">
                      PinkSync Enabled
                    </Badge>
                    <Badge variant="outline">Legally Required</Badge>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <FileCheck className="h-3.5 w-3.5" />
                    Documents
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Video className="h-3.5 w-3.5" />
                    Support
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-5">
              <div className="flex flex-col md:flex-row gap-4 md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-amber-100">
                      <Video className="h-4 w-4 text-amber-600" />
                    </div>
                    <h3 className="font-medium">ASL Interpreter for Onboarding</h3>
                    <Badge className="bg-amber-100 text-amber-800">Submitted</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Company</p>
                      <p className="text-sm">TechSolutions Inc (Potential Employer)</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Requested</p>
                      <p className="text-sm">April 5, 2023</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <p className="text-sm">Pending employer response</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Expected Response</p>
                      <p className="text-sm">Within 5 business days</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Details</p>
                    <p className="text-sm">
                      Request for ASL interpreter during onboarding process and team meetings if hired. Submitted 
                      as part of interview process to ensure accommodation if position is offered.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2 mt-3">
                    <Badge className="bg-purple-100 text-purple-800">
                      PinkSync Ready
                    </Badge>
                    <Badge variant="outline">Legally Required</Badge>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <InfoIcon className="h-3.5 w-3.5" />
                    Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Accommodation Templates</CardTitle>
          <CardDescription>
            Pre-written accommodation request templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <Video className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-medium">ASL Interpreter Request</h3>
                  <p className="text-sm text-muted-foreground">For meetings, interviews, and team events</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Use Template</Button>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <Headphones className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-medium">Communication Technology Request</h3>
                  <p className="text-sm text-muted-foreground">For VRS, captioning tools, and alerting devices</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Use Template</Button>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <Building className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-medium">Remote Work Accommodation</h3>
                  <p className="text-sm text-muted-foreground">For flexible location arrangements</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Use Template</Button>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-medium">Modified Schedule Request</h3>
                  <p className="text-sm text-muted-foreground">For flexible hours and interpreter scheduling</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Use Template</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full gap-1">
            <Search className="h-3.5 w-3.5" />
            Browse All Templates
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Workplace Accommodation</DialogTitle>
            <DialogDescription>
              Create a workplace accommodation request with VR4Deaf support
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Company or organization name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accommodation-type">Accommodation Type</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                  <option value="interpreter">ASL Interpreter</option>
                  <option value="technology">Assistive Technology</option>
                  <option value="schedule">Modified Schedule</option>
                  <option value="communication">Communication Tools</option>
                  <option value="physical">Physical Workspace</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="accommodation-details">Accommodation Details</Label>
              <Textarea 
                id="accommodation-details" 
                placeholder="Describe the specific accommodation you are requesting" 
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Accommodation</Label>
              <Textarea 
                id="reason" 
                placeholder="Explain why this accommodation is necessary for you to perform your job" 
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="job-duties">Affected Job Duties</Label>
              <Textarea 
                id="job-duties" 
                placeholder="List the job duties that would be affected without this accommodation" 
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="documentation">Supporting Documentation</Label>
              <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                <Button size="sm" variant="outline" className="mt-3">Select Files</Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="legally-required" defaultChecked />
              <Label htmlFor="legally-required" className="text-sm">This accommodation is required under the ADA</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="pinksync-support" defaultChecked />
              <Label htmlFor="pinksync-support" className="text-sm">I would like VR4Deaf to provide PinkSync-enabled support during implementation</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestAccommodation}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Missing components/imports
import { Send, InfoIcon } from 'lucide-react';