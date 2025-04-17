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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowUpDown,
  BookOpen,
  BriefcaseIcon, 
  Building,
  CheckCircle2,
  Copy,
  Cpu,
  FileCheck, 
  FileText,
  Filter,
  Gauge,
  GaugeCircle,
  Globe,
  HandHelping, 
  ImageIcon,
  Laptop,
  Layout,
  Lightbulb,
  Link,
  MessageSquare, 
  Newspaper,
  PanelLeft,
  PencilRuler,
  PersonStanding,
  Plus,
  Radio, 
  RefreshCw, 
  Save,
  Search, 
  SlidersHorizontal,
  Sparkles,
  Star, 
  Upload,
  UserPlus,
  Users,
  Video,
  X,
  ChevronDown,
  AlertCircle,
  Pencil,
  Trash2,
  Share,
  UserCircle,
  DollarSign,
  FileCheck2,
  Send,
  PieChart,
  Calendar as CalendarDays,
  Download
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Types for job positions in a startup
interface JobPosition {
  id: string;
  title: string;
  department: 'engineering' | 'design' | 'marketing' | 'operations' | 'customer-service' | 'finance' | 'leadership';
  status: 'draft' | 'published' | 'filled' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  location: 'remote' | 'hybrid' | 'on-site';
  type: 'full-time' | 'part-time' | 'contract';
  salaryRange?: string;
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
  deafFriendly: boolean;
  publishedDate?: string;
  applications?: number;
  deafApplicants?: number;
  heardApplicants?: number;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  status: 'applied' | 'screening' | 'interviewing' | 'offer' | 'rejected' | 'hired';
  experience: number;
  skills: string[];
  isDeafOrHoh: boolean;
  interviewDate?: string;
  needsInterpreter: boolean;
  resumeUrl: string;
  coverLetterUrl?: string;
  videoIntroUrl?: string;
  notes?: string;
  applied: string;
}

interface JobTemplate {
  id: string;
  title: string;
  category: 'engineering' | 'design' | 'marketing' | 'operations' | 'customer-service' | 'finance' | 'leadership';
  description: string;
  features: string[];
  deaf_friendly: boolean;
}

// Sample data
const sampleJobPositions: JobPosition[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    department: 'engineering',
    status: 'published',
    priority: 'high',
    location: 'remote',
    type: 'full-time',
    salaryRange: '$80,000 - $110,000',
    skills: ['React', 'TypeScript', 'CSS', 'Responsive Design'],
    responsibilities: [
      'Build user interfaces using React and TypeScript',
      'Collaborate with designers to implement visual components',
      'Ensure responsive design across all devices',
      'Write clean, maintainable code'
    ],
    qualifications: [
      '2+ years of experience with React',
      'Strong TypeScript skills',
      'Experience with modern CSS practices',
      'Portfolio of previous work'
    ],
    deafFriendly: true,
    publishedDate: '2023-03-15',
    applications: 12,
    deafApplicants: 4,
    heardApplicants: 8
  },
  {
    id: 'job-2',
    title: 'UI/UX Designer',
    department: 'design',
    status: 'published',
    priority: 'medium',
    location: 'hybrid',
    type: 'full-time',
    salaryRange: '$75,000 - $95,000',
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    responsibilities: [
      'Create user-centered designs for our products',
      'Conduct user research and usability testing',
      'Develop wireframes, prototypes, and high-fidelity mockups',
      'Work closely with developers to implement designs'
    ],
    qualifications: [
      '3+ years of product design experience',
      'Strong portfolio demonstrating UX process',
      'Experience with Figma or similar tools',
      'Knowledge of accessibility standards'
    ],
    deafFriendly: true,
    publishedDate: '2023-03-10',
    applications: 8,
    deafApplicants: 2,
    heardApplicants: 6
  },
  {
    id: 'job-3',
    title: 'Digital Marketing Specialist',
    department: 'marketing',
    status: 'draft',
    priority: 'medium',
    location: 'remote',
    type: 'full-time',
    salaryRange: '$65,000 - $85,000',
    skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
    responsibilities: [
      'Develop and implement digital marketing strategies',
      'Manage social media accounts and content calendar',
      'Analyze marketing performance metrics',
      'Optimize campaigns based on data insights'
    ],
    qualifications: [
      '2+ years experience in digital marketing',
      'Proficiency with Google Analytics and marketing tools',
      'Experience with content creation and social media management',
      'Strong analytical skills'
    ],
    deafFriendly: true
  },
  {
    id: 'job-4',
    title: 'Backend Developer',
    department: 'engineering',
    status: 'filled',
    priority: 'high',
    location: 'remote',
    type: 'full-time',
    salaryRange: '$90,000 - $120,000',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'API Development'],
    responsibilities: [
      'Design and develop backend services and APIs',
      'Implement database schemas and queries',
      'Ensure high performance and security',
      'Document code and APIs'
    ],
    qualifications: [
      '3+ years experience with Node.js',
      'Strong knowledge of database design',
      'Experience with RESTful API development',
      'Understanding of security best practices'
    ],
    deafFriendly: true,
    publishedDate: '2023-02-15'
  }
];

const sampleCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Alex Morgan',
    position: 'Frontend Developer',
    status: 'interviewing',
    experience: 3,
    skills: ['React', 'TypeScript', 'CSS', 'Redux'],
    isDeafOrHoh: true,
    interviewDate: '2023-04-12T14:00:00Z',
    needsInterpreter: true,
    resumeUrl: '/resumes/alex-morgan.pdf',
    coverLetterUrl: '/cover-letters/alex-morgan.pdf',
    videoIntroUrl: '/video-intros/alex-morgan.mp4',
    notes: 'Strong portfolio, especially in frontend accessibility work',
    applied: '2023-03-18'
  },
  {
    id: 'cand-2',
    name: 'Jamie Taylor',
    position: 'Frontend Developer',
    status: 'screening',
    experience: 2,
    skills: ['React', 'JavaScript', 'CSS', 'Material UI'],
    isDeafOrHoh: false,
    needsInterpreter: false,
    resumeUrl: '/resumes/jamie-taylor.pdf',
    notes: 'Good experience but missing TypeScript',
    applied: '2023-03-20'
  },
  {
    id: 'cand-3',
    name: 'Casey Chen',
    position: 'UI/UX Designer',
    status: 'applied',
    experience: 4,
    skills: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
    isDeafOrHoh: true,
    needsInterpreter: true,
    resumeUrl: '/resumes/casey-chen.pdf',
    coverLetterUrl: '/cover-letters/casey-chen.pdf',
    videoIntroUrl: '/video-intros/casey-chen.mp4',
    applied: '2023-03-12'
  },
  {
    id: 'cand-4',
    name: 'Jordan Williams',
    position: 'Frontend Developer',
    status: 'offer',
    experience: 5,
    skills: ['React', 'TypeScript', 'CSS', 'NextJS', 'GraphQL'],
    isDeafOrHoh: false,
    needsInterpreter: false,
    resumeUrl: '/resumes/jordan-williams.pdf',
    coverLetterUrl: '/cover-letters/jordan-williams.pdf',
    notes: 'Senior level candidate with strong skills match',
    applied: '2023-03-16'
  },
  {
    id: 'cand-5',
    name: 'Sam Rodriguez',
    position: 'UI/UX Designer',
    status: 'interviewing',
    experience: 3,
    skills: ['Figma', 'UI Design', 'Accessibility Design', 'User Testing'],
    isDeafOrHoh: true,
    interviewDate: '2023-04-14T15:30:00Z',
    needsInterpreter: true,
    resumeUrl: '/resumes/sam-rodriguez.pdf',
    videoIntroUrl: '/video-intros/sam-rodriguez.mp4',
    notes: 'Strong portfolio with focus on accessibility',
    applied: '2023-03-15'
  }
];

const jobTemplates: JobTemplate[] = [
  {
    id: 'template-1',
    title: 'Frontend Developer',
    category: 'engineering',
    description: 'A complete job description for a Frontend Developer role with accessibility considerations built-in',
    features: ['Skills assessment', 'Accessibility requirements', 'Modern tech stack', 'Remote-friendly'],
    deaf_friendly: true
  },
  {
    id: 'template-2',
    title: 'UI/UX Designer',
    category: 'design',
    description: 'A comprehensive job description for a UI/UX Designer with focus on inclusive design practices',
    features: ['Portfolio requirements', 'Accessibility knowledge', 'User testing experience', 'Inclusive design'],
    deaf_friendly: true
  },
  {
    id: 'template-3',
    title: 'Backend Developer',
    category: 'engineering',
    description: 'A detailed job description for a Backend Developer role with clear expectations',
    features: ['Technical requirements', 'API development', 'Database experience', 'Performance optimization'],
    deaf_friendly: true
  },
  {
    id: 'template-4',
    title: 'Digital Marketing Specialist',
    category: 'marketing',
    description: 'A comprehensive job description for a Digital Marketing Specialist with focus on data-driven approaches',
    features: ['Analytics experience', 'Content marketing', 'Social media', 'Campaign management'],
    deaf_friendly: true
  },
  {
    id: 'template-5',
    title: 'Customer Support Representative',
    category: 'customer-service',
    description: 'A job description for a Customer Support Representative with multiple communication channel options',
    features: ['Text-based support', 'Knowledge base management', 'Problem-solving', 'Customer satisfaction'],
    deaf_friendly: true
  },
  {
    id: 'template-6',
    title: 'Product Manager',
    category: 'leadership',
    description: 'A detailed job description for a Product Manager with inclusive team leadership focus',
    features: ['Product roadmap', 'Team coordination', 'Feature prioritization', 'User research'],
    deaf_friendly: true
  }
];

export default function StartupTeamBuilder() {
  const [activeTab, setActiveTab] = useState('positions');
  const { toast } = useToast();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Startup Team Builder</h1>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
              PinkSync Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Build and manage your startup team with deaf-friendly hiring practices
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="sm" variant="outline" className="gap-2">
            <FileCheck className="h-4 w-4" />
            Hiring Guide
          </Button>
          <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
            <UserPlus className="h-4 w-4" />
            Create Position
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatsCard
          title="Open Positions"
          value="3"
          icon={<BriefcaseIcon className="h-5 w-5 text-blue-600" />}
          description="2 published, 1 draft"
          trend="up"
        />
        <StatsCard
          title="Active Candidates"
          value="5"
          icon={<Users className="h-5 w-5 text-green-600" />}
          description="3 in process, 2 new"
          trend="up"
        />
        <StatsCard
          title="Deaf Applicants"
          value="60%"
          icon={<GaugeCircle className="h-5 w-5 text-purple-600" />}
          description="Above target (40%)"
          trend="up"
        />
        <StatsCard
          title="Time to Hire"
          value="18"
          icon={<Gauge className="h-5 w-5 text-amber-600" />}
          description="Days (avg)"
          trend="down"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid md:w-full md:grid-cols-4">
          <TabsTrigger value="positions" className="gap-2">
            <BriefcaseIcon className="h-4 w-4" />
            Job Positions
          </TabsTrigger>
          <TabsTrigger value="candidates" className="gap-2">
            <Users className="h-4 w-4" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            Job Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <Gauge className="h-4 w-4" />
            Hiring Analytics
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="positions" className="space-y-4">
          <PositionsTab />
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-4">
          <CandidatesTab />
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <TemplatesTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stats card component
function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div className={`flex items-center gap-1 ${
              trend === 'up' 
                ? 'text-green-600' 
                : trend === 'down' 
                  ? 'text-red-600' 
                  : 'text-muted-foreground'
            }`}>
              {trend === 'up' ? (
                <ArrowUpDown className="h-4 w-4" />
              ) : trend === 'down' ? (
                <div className="rotate-180">
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// Positions Tab Component
function PositionsTab() {
  const [jobs, setJobs] = useState<JobPosition[]>(sampleJobPositions);
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCreateJob = () => {
    toast({
      title: "Job position created",
      description: "Your new job position has been created as a draft.",
    });
    setIsCreateJobOpen(false);
  };
  
  const handleViewJob = (job: JobPosition) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
  };
  
  const handlePublishJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: 'published', publishedDate: new Date().toISOString().split('T')[0] } 
        : job
    ));
    
    toast({
      title: "Job published",
      description: "Your job position is now live and accepting applications.",
    });
    
    setIsJobDetailOpen(false);
  };
  
  const filterJobsByStatus = (status: JobPosition['status'] | 'all') => {
    if (status === 'all') return jobs;
    return jobs.filter(job => job.status === status);
  };
  
  const renderJobCard = (job: JobPosition) => (
    <Card key={job.id} className="overflow-hidden">
      <div className="p-4 border-b flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{job.title}</h3>
            {job.deafFriendly && (
              <Badge className="bg-purple-100 text-purple-800 text-xs">Deaf-Friendly</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {job.type.replace('-', ' ')} • {job.location.replace('-', ' ')}
            {job.salaryRange && ` • ${job.salaryRange}`}
          </p>
        </div>
        <Badge className={`
          ${job.status === 'published' ? 'bg-green-100 text-green-800' : 
            job.status === 'draft' ? 'bg-amber-100 text-amber-800' : 
            job.status === 'filled' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'}
        `}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">Department</p>
            <Badge variant="outline">
              {job.department.charAt(0).toUpperCase() + job.department.slice(1).replace('-', ' ')}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Key Skills</p>
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map(skill => (
                <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">+{job.skills.length - 3} more</Badge>
              )}
            </div>
          </div>
          
          {job.status === 'published' && job.applications !== undefined && (
            <div>
              <p className="text-sm font-medium mb-1">Applications</p>
              <div className="flex items-center gap-2">
                <p className="text-sm">{job.applications} total</p>
                {job.deafApplicants !== undefined && job.heardApplicants !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    ({job.deafApplicants} deaf / {job.heardApplicants} hearing)
                  </p>
                )}
              </div>
            </div>
          )}
          
          {job.publishedDate && (
            <div>
              <p className="text-sm font-medium mb-1">
                {job.status === 'published' ? 'Published' : 'Last Updated'}
              </p>
              <p className="text-sm">{job.publishedDate}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 p-3 flex justify-between">
        <Badge variant="outline" className={`
          ${job.priority === 'high' ? 'bg-red-50 text-red-800 border-red-200' : 
            job.priority === 'medium' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
            'bg-green-50 text-green-800 border-green-200'}
        `}>
          {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)} Priority
        </Badge>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => handleViewJob(job)}>
          <Search className="h-3.5 w-3.5" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Job Positions</h3>
        <Button size="sm" onClick={() => setIsCreateJobOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Create Position
        </Button>
      </div>
      
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Video className="h-5 w-5 text-purple-700 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1 text-purple-900">Deaf-Friendly Hiring with PinkSync</h3>
            <p className="text-sm text-gray-700 mb-2">
              Create inclusive job positions that attract qualified deaf candidates:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
              <li>ASL video job descriptions alongside text</li>
              <li>Interview interpreter services through PinkSync</li>
              <li>Video application options for ASL users</li>
              <li>Accessibility-first job descriptions and requirements</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Positions</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="filled">Filled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterJobsByStatus('all').map(renderJobCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterJobsByStatus('published').map(renderJobCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterJobsByStatus('draft').map(renderJobCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="filled" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterJobsByStatus('filled').map(renderJobCard)}
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedJob && (
        <Dialog open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
                <Badge className={`
                  ${selectedJob.status === 'published' ? 'bg-green-100 text-green-800' : 
                    selectedJob.status === 'draft' ? 'bg-amber-100 text-amber-800' : 
                    selectedJob.status === 'filled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}
                `}>
                  {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                </Badge>
              </div>
              <DialogDescription>
                {selectedJob.department.charAt(0).toUpperCase() + selectedJob.department.slice(1).replace('-', ' ')} Department • 
                {selectedJob.type.charAt(0).toUpperCase() + selectedJob.type.slice(1).replace('-', ' ')} • 
                {selectedJob.location.charAt(0).toUpperCase() + selectedJob.location.slice(1).replace('-', ' ')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Job Description</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Responsibilities</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedJob.responsibilities.map((item, idx) => (
                          <li key={idx} className="text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Qualifications</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedJob.qualifications.map((item, idx) => (
                          <li key={idx} className="text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedJob.skills.map(skill => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedJob.deafFriendly && (
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-md">
                    <div className="flex gap-3">
                      <Video className="h-5 w-5 text-purple-700" />
                      <div>
                        <h4 className="font-medium text-purple-900 mb-1">Deaf-Friendly Job Features</h4>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
                          <li>ASL video job description available</li>
                          <li>ASL video application option</li>
                          <li>PinkSync interview interpreters provided</li>
                          <li>Communication flexibility in the workplace</li>
                          <li>Text-based alternatives for audio content</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Job Details</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Department</p>
                      <p className="text-sm font-medium">
                        {selectedJob.department.charAt(0).toUpperCase() + selectedJob.department.slice(1).replace('-', ' ')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Employment Type</p>
                      <p className="text-sm font-medium">
                        {selectedJob.type.charAt(0).toUpperCase() + selectedJob.type.slice(1).replace('-', ' ')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                      <p className="text-sm font-medium">
                        {selectedJob.location.charAt(0).toUpperCase() + selectedJob.location.slice(1).replace('-', ' ')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Salary Range</p>
                      <p className="text-sm font-medium">
                        {selectedJob.salaryRange || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Priority</p>
                      <Badge className={`
                        ${selectedJob.priority === 'high' ? 'bg-red-50 text-red-800 border-red-200' : 
                          selectedJob.priority === 'medium' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
                          'bg-green-50 text-green-800 border-green-200'}
                      `}>
                        {selectedJob.priority.charAt(0).toUpperCase() + selectedJob.priority.slice(1)} Priority
                      </Badge>
                    </div>
                    
                    {selectedJob.publishedDate && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">
                          {selectedJob.status === 'published' ? 'Published Date' : 'Last Updated'}
                        </p>
                        <p className="text-sm font-medium">{selectedJob.publishedDate}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedJob.status === 'published' && selectedJob.applications !== undefined && (
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Application Stats</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Total Applications</p>
                        <p className="text-sm font-medium">{selectedJob.applications}</p>
                      </div>
                      
                      {selectedJob.deafApplicants !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Deaf/HoH Applicants</p>
                          <p className="text-sm font-medium">{selectedJob.deafApplicants} ({Math.round((selectedJob.deafApplicants / selectedJob.applications) * 100)}%)</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Application Stage</p>
                        <div className="space-y-1 mt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Review</span>
                            <span>8</span>
                          </div>
                          <Progress value={66} className="h-1.5" />
                          
                          <div className="flex items-center justify-between text-xs">
                            <span>Interview</span>
                            <span>3</span>
                          </div>
                          <Progress value={25} className="h-1.5" />
                          
                          <div className="flex items-center justify-between text-xs">
                            <span>Offer</span>
                            <span>1</span>
                          </div>
                          <Progress value={8} className="h-1.5" />
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full gap-1">
                        <Users className="h-3.5 w-3.5" />
                        View Candidates
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">PinkSync Options</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="asl-video" defaultChecked={selectedJob.deafFriendly} />
                      <Label htmlFor="asl-video" className="text-sm">Create ASL video description</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox id="deaf-friendly" defaultChecked={selectedJob.deafFriendly} />
                      <Label htmlFor="deaf-friendly" className="text-sm">Mark as deaf-friendly position</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox id="video-app" defaultChecked={selectedJob.deafFriendly} />
                      <Label htmlFor="video-app" className="text-sm">Allow video applications</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox id="interpreter" defaultChecked={selectedJob.deafFriendly} />
                      <Label htmlFor="interpreter" className="text-sm">Provide interview interpreters</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </Button>
              </div>
              
              {selectedJob.status === 'draft' ? (
                <Button onClick={() => handlePublishJob(selectedJob.id)} className="gap-1">
                  <Globe className="h-4 w-4" />
                  Publish Job
                </Button>
              ) : selectedJob.status === 'published' ? (
                <Button className="gap-1">
                  <Users className="h-4 w-4" />
                  View Candidates
                </Button>
              ) : (
                <Button variant="outline" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Reopen Position
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <Dialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Job Position</DialogTitle>
            <DialogDescription>
              Create a new job opening for your startup
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input id="job-title" placeholder="e.g. Frontend Developer" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                      <option value="engineering">Engineering</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="operations">Operations</option>
                      <option value="customer-service">Customer Service</option>
                      <option value="finance">Finance</option>
                      <option value="leadership">Leadership</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="job-type">Job Type</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="on-site">On-site</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="salary-range">Salary Range (Optional)</Label>
                  <Input id="salary-range" placeholder="e.g. $80,000 - $100,000" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="skills">Skills (Comma separated)</Label>
                  <Input id="skills" placeholder="e.g. React, TypeScript, CSS" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea 
                    id="responsibilities" 
                    placeholder="List the key responsibilities for this position" 
                    rows={4}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Textarea 
                    id="qualifications" 
                    placeholder="List the required qualifications for this position" 
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-3">PinkSync Integration</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="deaf-friendly-job" defaultChecked />
                    <label htmlFor="deaf-friendly-job" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Mark as deaf-friendly position</label>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Deaf-friendly positions include the following accommodations:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="asl-desc" defaultChecked />
                      <label htmlFor="asl-desc" className="text-sm leading-none">ASL video job description</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="video-application" defaultChecked />
                      <label htmlFor="video-application" className="text-sm leading-none">Accept ASL video applications</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interpreter-provided" defaultChecked />
                      <label htmlFor="interpreter-provided" className="text-sm leading-none">Provide interview interpreters</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="flexible-comm" defaultChecked />
                      <label htmlFor="flexible-comm" className="text-sm leading-none">Flexible communication options</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-3">Publication Options</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="save-as-draft" defaultChecked />
                    <label htmlFor="save-as-draft" className="text-sm font-medium leading-none">Save as draft</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="create-template" />
                    <label htmlFor="create-template" className="text-sm font-medium leading-none">Also save as template</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="publish-immediately" />
                    <label htmlFor="publish-immediately" className="text-sm font-medium leading-none">Publish immediately</label>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-3">Distribution Channels</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="company-website" defaultChecked />
                    <label htmlFor="company-website" className="text-sm leading-none">Company website</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="deaf-job-boards" defaultChecked />
                    <label htmlFor="deaf-job-boards" className="text-sm leading-none">Deaf-specific job boards</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="general-job-boards" />
                    <label htmlFor="general-job-boards" className="text-sm leading-none">General job boards</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="social-media" />
                    <label htmlFor="social-media" className="text-sm leading-none">Social media</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateJobOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob}>
              Create Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Candidates Tab Component
function CandidatesTab() {
  const [candidates, setCandidates] = useState<Candidate[]>(sampleCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isCandidateDetailOpen, setIsCandidateDetailOpen] = useState(false);
  const { toast } = useToast();
  
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsCandidateDetailOpen(true);
  };
  
  const handleStatusChange = (candidateId: string, newStatus: Candidate['status']) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: newStatus } 
        : candidate
    ));
    
    toast({
      title: "Candidate status updated",
      description: `The candidate's status has been updated to ${newStatus}.`,
    });
    
    setIsCandidateDetailOpen(false);
  };
  
  const getCandidateStatusBadge = (status: Candidate['status']) => {
    switch(status) {
      case 'applied':
        return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>;
      case 'screening':
        return <Badge className="bg-purple-100 text-purple-800">Screening</Badge>;
      case 'interviewing':
        return <Badge className="bg-amber-100 text-amber-800">Interviewing</Badge>;
      case 'offer':
        return <Badge className="bg-green-100 text-green-800">Offer</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'hired':
        return <Badge className="bg-green-100 text-green-800">Hired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Candidates</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>
      
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Video className="h-5 w-5 text-purple-700 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1 text-purple-900">Deaf Candidate Support</h3>
            <p className="text-sm text-gray-700 mb-2">
              Streamline your hiring process for deaf candidates:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
              <li>Automatic ASL interpreter scheduling for interviews</li>
              <li>Video resume support with optional transcription</li>
              <li>Accessible screening and assessment tools</li>
              <li>Onboarding preparation with workplace accommodations</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
          <CardDescription>
            Track candidates through your hiring process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Communications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map(candidate => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        {candidate.isDeafOrHoh && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            Deaf/HoH
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>
                    {getCandidateStatusBadge(candidate.status)}
                  </TableCell>
                  <TableCell>{candidate.experience} years</TableCell>
                  <TableCell>{new Date(candidate.applied).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {candidate.needsInterpreter ? (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        PinkSync Interpreter
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Standard</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleViewCandidate(candidate)}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Interviewing This Week</CardTitle>
            <CardDescription>
              Upcoming interviews with scheduling details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{candidates[0].name}</h3>
                    <p className="text-sm text-muted-foreground">{candidates[0].position}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Tomorrow</Badge>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>April 12, 2023 • 2:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>Video Interview • Round 2 (Technical)</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-100 rounded-md mb-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs font-medium">PinkSync Interpreter Scheduled</p>
                      <p className="text-xs text-muted-foreground">Sarah Johnson • Pre-meeting at 1:30 PM</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    View Resume
                  </Button>
                  <Button size="sm" className="gap-1">
                    <Video className="h-3.5 w-3.5" />
                    Join Meeting
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{candidates[4].name}</h3>
                    <p className="text-sm text-muted-foreground">{candidates[4].position}</p>
                  </div>
                  <Badge variant="outline">April 14</Badge>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>April 14, 2023 • 3:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>Video Interview • Round 1 (Portfolio Review)</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-100 rounded-md mb-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs font-medium">PinkSync Interpreter Scheduled</p>
                      <p className="text-xs text-muted-foreground">Michael Chen • Pre-meeting at 3:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    View Portfolio
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Video className="h-3.5 w-3.5" />
                    View Video Intro
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Deaf/HoH Candidate Stats</CardTitle>
            <CardDescription>
              Metrics on deaf and hard of hearing candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Deaf/HoH Applications</span>
                  <span className="font-medium">38%</span>
                </div>
                <Progress value={38} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  Target: 30% • <span className="text-green-600">+8%</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Interview Pass Rate</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hearing candidates: 82%</span>
                  <span className="text-green-600">+3%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Offer Acceptance</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hearing candidates: 85%</span>
                  <span className="text-green-600">+7%</span>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-md">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1 text-purple-900">PinkSync Impact</h3>
                    <p className="text-sm text-gray-700">
                      PinkSync's deaf-friendly hiring process has improved your hiring metrics:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4 mt-1">
                      <li>38% higher application rate from deaf candidates</li>
                      <li>45% faster interview scheduling</li>
                      <li>92% candidate satisfaction with interview process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedCandidate && (
        <Dialog open={isCandidateDetailOpen} onOpenChange={setIsCandidateDetailOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{selectedCandidate.name}</DialogTitle>
                {getCandidateStatusBadge(selectedCandidate.status)}
              </div>
              <DialogDescription>
                Candidate for {selectedCandidate.position} • Applied on {new Date(selectedCandidate.applied).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{selectedCandidate.position}</Badge>
                      <Badge variant="outline">{selectedCandidate.experience} years experience</Badge>
                      {selectedCandidate.isDeafOrHoh && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Deaf/HoH
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="py-1 px-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedCandidate.notes && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notes</h3>
                    <p className="text-sm">{selectedCandidate.notes}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Application Materials</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">Resume</h4>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Search className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {selectedCandidate.coverLetterUrl && (
                      <div className="border rounded-md p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <h4 className="font-medium">Cover Letter</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Search className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedCandidate.videoIntroUrl && (
                      <div className="border rounded-md p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Video className="h-5 w-5 text-purple-600" />
                          <h4 className="font-medium">ASL Video Introduction</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Video className="h-3.5 w-3.5" />
                            Play Video
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            View Transcript
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedCandidate.status === 'interviewing' && selectedCandidate.interviewDate && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
                    <h3 className="font-medium text-amber-900 mb-2">Upcoming Interview</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="h-4 w-4 text-amber-700" />
                        <span>{new Date(selectedCandidate.interviewDate).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-amber-700" />
                        <span>Technical Interview with Engineering Team</span>
                      </div>
                      
                      {selectedCandidate.needsInterpreter && (
                        <div className="p-2 bg-purple-50 border border-purple-100 rounded-md">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="text-xs font-medium">PinkSync Interpreter: Sarah Johnson</p>
                              <p className="text-xs text-muted-foreground">Pre-meeting briefing at 1:30 PM</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">Candidate Status</h3>
                  <div className="space-y-3">
                    <select 
                      className="w-full border rounded-md p-2"
                      value={selectedCandidate.status}
                      onChange={(e) => handleStatusChange(selectedCandidate.id, e.target.value as Candidate['status'])}
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    
                    <Button size="sm" className="w-full gap-1">
                      <Save className="h-3.5 w-3.5" />
                      Update Status
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">Communication</h3>
                  <div className="space-y-3">
                    {selectedCandidate.isDeafOrHoh ? (
                      <>
                        <div className="p-2 bg-purple-50 border border-purple-100 rounded-md">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="text-xs font-medium">PinkSync Communication</p>
                              <p className="text-xs text-muted-foreground">ASL-accessible communication enabled</p>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="w-full gap-1 bg-purple-600 hover:bg-purple-700">
                          <Video className="h-3.5 w-3.5" />
                          Send ASL Video Message
                        </Button>
                        <Button size="sm" variant="outline" className="w-full gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Send Text Message
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" className="w-full gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Send Message
                        </Button>
                        <Button size="sm" variant="outline" className="w-full gap-1">
                          <Video className="h-3.5 w-3.5" />
                          Schedule Video Call
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">Interview Schedule</h3>
                  <div className="space-y-3">
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Schedule Interview
                    </Button>
                    
                    {selectedCandidate.isDeafOrHoh && (
                      <div className="flex items-center space-x-2">
                        <Checkbox id="interpreter-needed" defaultChecked={selectedCandidate.needsInterpreter} />
                        <label htmlFor="interpreter-needed" className="text-sm leading-none">
                          Include PinkSync interpreter
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">Assessment</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 border rounded-md">
                        <p className="text-sm font-medium">Skills Match</p>
                        <p className="text-xl font-bold text-green-600">85%</p>
                      </div>
                      <div className="text-center p-2 border rounded-md">
                        <p className="text-sm font-medium">Culture Fit</p>
                        <p className="text-xl font-bold text-amber-600">72%</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <FileCheck2 className="h-3.5 w-3.5" />
                      Full Assessment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Pencil className="h-3.5 w-3.5" />
                  Add Note
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share className="h-3.5 w-3.5" />
                  Share Profile
                </Button>
              </div>
              
              {selectedCandidate.status === 'applied' ? (
                <Button onClick={() => handleStatusChange(selectedCandidate.id, 'screening')} className="gap-1">
                  <UserCircle className="h-4 w-4" />
                  Start Screening
                </Button>
              ) : selectedCandidate.status === 'screening' ? (
                <Button onClick={() => handleStatusChange(selectedCandidate.id, 'interviewing')} className="gap-1">
                  <Video className="h-4 w-4" />
                  Schedule Interview
                </Button>
              ) : selectedCandidate.status === 'interviewing' ? (
                <Button onClick={() => handleStatusChange(selectedCandidate.id, 'offer')} className="gap-1">
                  <DollarSign className="h-4 w-4" />
                  Make Offer
                </Button>
              ) : selectedCandidate.status === 'offer' ? (
                <Button onClick={() => handleStatusChange(selectedCandidate.id, 'hired')} className="gap-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Hire Candidate
                </Button>
              ) : null}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Templates Tab Component
function TemplatesTab() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<JobTemplate[]>(jobTemplates);
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false);
  
  const handleUseTemplate = (templateId: string) => {
    toast({
      title: "Template selected",
      description: "The job template has been loaded into the job creation form.",
    });
  };
  
  const handleCreateTemplate = () => {
    toast({
      title: "Template created",
      description: "Your new job template has been saved.",
    });
    setIsNewTemplateOpen(false);
  };
  
  const getCategoryIcon = (category: JobTemplate['category']) => {
    switch(category) {
      case 'engineering':
        return <Cpu className="h-4 w-4 text-blue-600" />;
      case 'design':
        return <PencilRuler className="h-4 w-4 text-purple-600" />;
      case 'marketing':
        return <Newspaper className="h-4 w-4 text-green-600" />;
      case 'operations':
        return <Gauge className="h-4 w-4 text-amber-600" />;
      case 'customer-service':
        return <HandHelping className="h-4 w-4 text-red-600" />;
      case 'finance':
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'leadership':
        return <Users className="h-4 w-4 text-indigo-600" />;
      default:
        return <BriefcaseIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Job Templates</h3>
        <Button size="sm" onClick={() => setIsNewTemplateOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>
      
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Video className="h-5 w-5 text-purple-700 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1 text-purple-900">Deaf-Friendly Templates</h3>
            <p className="text-sm text-gray-700 mb-2">
              All job templates are designed with deaf accessibility in mind:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
              <li>Built-in PinkSync integration for ASL job descriptions</li>
              <li>Inclusive language and requirements</li>
              <li>Communication flexibility highlighted</li>
              <li>Accessibility-focused qualifications</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <Card key={template.id} className="overflow-hidden">
            <div className="p-4 border-b flex justify-between items-start">
              <div className="flex items-center gap-2">
                {getCategoryIcon(template.category)}
                <h3 className="font-medium">{template.title}</h3>
              </div>
              {template.deaf_friendly && (
                <Badge className="bg-purple-100 text-purple-800">Deaf-Friendly</Badge>
              )}
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Category</p>
                  <Badge variant="outline">
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-3 flex justify-between">
              <Button size="sm" variant="outline" className="gap-1">
                <Search className="h-3.5 w-3.5" />
                Preview
              </Button>
              <Button size="sm" className="gap-1" onClick={() => handleUseTemplate(template.id)}>
                <FileText className="h-3.5 w-3.5" />
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={isNewTemplateOpen} onOpenChange={setIsNewTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Job Template</DialogTitle>
            <DialogDescription>
              Create a reusable job description template for your startup
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-title">Template Title</Label>
              <Input id="template-title" placeholder="e.g. Frontend Developer" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="template-category">Category</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="customer-service">Customer Service</option>
                <option value="finance">Finance</option>
                <option value="leadership">Leadership</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="template-description">Description</Label>
              <Textarea 
                id="template-description" 
                placeholder="Briefly describe this job template" 
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="template-responsibilities">Responsibilities</Label>
              <Textarea 
                id="template-responsibilities" 
                placeholder="List the key responsibilities for this position" 
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="template-qualifications">Qualifications</Label>
              <Textarea 
                id="template-qualifications" 
                placeholder="List the required qualifications for this position" 
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="template-skills">Skills (Comma separated)</Label>
              <Input id="template-skills" placeholder="e.g. React, TypeScript, CSS" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="deaf-friendly-template" defaultChecked />
              <label htmlFor="deaf-friendly-template" className="text-sm font-medium leading-none">
                Make this a deaf-friendly template
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTemplateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Hiring Analytics</h3>
        <Button size="sm" variant="outline" className="gap-1">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiring Pipeline Metrics</CardTitle>
            <CardDescription>
              Performance metrics for your hiring funnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Application to Hire Conversion</h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Applications</span>
                      <span>53 (100%)</span>
                    </div>
                    <Progress value={100} className="h-2 bg-slate-100" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Resume Screen</span>
                      <span>32 (60%)</span>
                    </div>
                    <Progress value={60} className="h-2 bg-slate-100" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>First Interview</span>
                      <span>18 (34%)</span>
                    </div>
                    <Progress value={34} className="h-2 bg-slate-100" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Second Interview</span>
                      <span>8 (15%)</span>
                    </div>
                    <Progress value={15} className="h-2 bg-slate-100" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Offer Extended</span>
                      <span>4 (7.5%)</span>
                    </div>
                    <Progress value={7.5} className="h-2 bg-slate-100" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Offer Accepted</span>
                      <span>3 (5.7%)</span>
                    </div>
                    <Progress value={5.7} className="h-2 bg-slate-100" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium">Time to Hire (Average)</span>
                <span className="text-sm font-medium">18 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Diversity Analytics</CardTitle>
            <CardDescription>
              Metrics on deaf and hard of hearing candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Application Demographics</h4>
                <div className="h-40 relative">
                  {/* This would be a real chart component in production */}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/5 rounded border border-dashed">
                    <PieChart className="h-16 w-16 text-primary/20" />
                  </div>
                </div>
                <div className="flex justify-around mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs">Deaf/HoH (38%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs">Hearing (62%)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <h4 className="text-sm font-medium">Pipeline Comparison</h4>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Resume Screen Pass Rate</span>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="text-xs bg-purple-50">Deaf: 68%</Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50">Hearing: 62%</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Interview Pass Rate</span>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="text-xs bg-purple-50">Deaf: 85%</Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50">Hearing: 82%</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Offer Acceptance Rate</span>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="text-xs bg-purple-50">Deaf: 92%</Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50">Hearing: 85%</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                <div className="flex gap-3">
                  <Video className="h-5 w-5 text-purple-700" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">PinkSync Impact</p>
                    <p className="text-xs text-gray-700">
                      PinkSync-enabled hiring has increased deaf candidate success rates by 28% across all stages of the hiring process compared to industry benchmarks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Hiring Optimization Insights</CardTitle>
          <CardDescription>
            AI-powered insights to improve your hiring process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Interview Efficiency</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Analysis shows that your technical interviews for engineering positions are 35% longer than 
                    industry average, but don't correlate with better hiring decisions. Consider shortening 
                    technical interviews and focusing on key skills assessment.
                  </p>
                  <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-100 rounded-md">
              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Deaf Candidate Success</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Your PinkSync-enabled hiring process has resulted in deaf candidates having a 12% higher 
                    success rate than hearing candidates in technical assessments. This suggests your 
                    accommodations are working effectively and providing a level playing field.
                  </p>
                  <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-amber-100">
                  <Gauge className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Bottleneck Identified</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    There's a significant drop-off (42%) between first and second interviews for design 
                    positions. Analysis of feedback suggests that portfolio reviews are inconsistent. 
                    Consider standardizing the portfolio review process with clear evaluation criteria.
                  </p>
                  <Button size="sm" variant="outline" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-100 rounded-md">
              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Video className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">PinkSync Recommendation</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Adding ASL video job descriptions to your engineering positions increased 
                    deaf/HoH applications by 68% compared to positions without video descriptions. 
                    Consider adding ASL videos to all job positions to maximize reach.
                  </p>
                  <Button size="sm" variant="outline" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    Enable for All Positions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}