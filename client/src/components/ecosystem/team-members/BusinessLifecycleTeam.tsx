import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Hammer, TrendingUp, Settings, Video, Users, Check, Star, Award, Briefcase, BarChart3, Globe, Server, Code, Database, CreditCard, Bot, Clock, Phone, CalendarDays } from 'lucide-react';

// Team member interface
interface TeamMember {
  id: string;
  name: string;
  title: string;
  department: string;
  profileImageUrl?: string;
  businessPhases: ('idea' | 'build' | 'grow' | 'manage')[];
  specialties: string[];
  isPinkSyncCertified: boolean;
  languages: string[];
  isDeaf: boolean;
  biography: string;
  videoUrl?: string;
  contactMethods: {
    email: string;
    videoCall?: string;
    phone?: string;
  };
}

// Mock team members data
const teamMembers: TeamMember[] = [
  // IDEA Phase Team
  {
    id: 'tm-001',
    name: 'Jennifer Martinez',
    title: 'Business Idea Consultant',
    department: 'Idea Generation',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-001',
    businessPhases: ['idea'],
    specialties: ['Market Research', 'Business Model Canvas', 'Idea Validation'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    isDeaf: true,
    biography: 'Jennifer is a deaf entrepreneur who has launched three successful businesses. She specializes in helping deaf founders identify viable business opportunities that align with their strengths and market needs.',
    videoUrl: 'https://example.com/videos/jennifer-intro.mp4',
    contactMethods: {
      email: 'jennifer.martinez@360magicians.com',
      videoCall: 'https://pinksync.com/meet/jennifer'
    }
  },
  {
    id: 'tm-002',
    name: 'Carlos Washington',
    title: 'Market Research Specialist',
    department: 'Idea Generation',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-002',
    businessPhases: ['idea'],
    specialties: ['Competitive Analysis', 'Market Sizing', 'Consumer Insights'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    isDeaf: false,
    biography: 'Carlos leverages data analytics to uncover market opportunities. He is PinkSync certified and specializes in making complex market data accessible to deaf entrepreneurs.',
    videoUrl: 'https://example.com/videos/carlos-intro.mp4',
    contactMethods: {
      email: 'carlos.washington@360magicians.com',
      videoCall: 'https://pinksync.com/meet/carlos',
      phone: '+1-555-123-4567'
    }
  },
  {
    id: 'tm-003',
    name: 'Sarah Johnson',
    title: 'ASL Business Model Consultant',
    department: 'Idea Generation',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-003',
    businessPhases: ['idea'],
    specialties: ['Business Model Canvas', 'Idea Validation', 'Financial Forecasting'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English', 'SEE'],
    isDeaf: false,
    biography: 'Sarah is a nationally certified interpreter with over 10 years of experience in business settings. She specializes in helping deaf entrepreneurs navigate the early stages of business development.',
    videoUrl: 'https://example.com/videos/sarah-intro.mp4',
    contactMethods: {
      email: 'sarah.johnson@360magicians.com',
      videoCall: 'https://pinksync.com/meet/sarah',
      phone: '+1-555-234-5678'
    }
  },
  
  // BUILD Phase Team
  {
    id: 'tm-004',
    name: 'David Kim',
    title: 'Business Formation Specialist',
    department: 'Legal & Formation',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-004',
    businessPhases: ['build'],
    specialties: ['LLC Formation', 'Corporate Structure', 'Business Registration'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English', 'Korean'],
    isDeaf: false,
    biography: 'David combines his legal expertise with interpreting skills to provide specialized business formation services for deaf business owners.',
    videoUrl: 'https://example.com/videos/david-intro.mp4',
    contactMethods: {
      email: 'david.kim@360magicians.com',
      videoCall: 'https://pinksync.com/meet/david',
      phone: '+1-555-345-6789'
    }
  },
  {
    id: 'tm-005',
    name: 'Michael Chen',
    title: 'Technology Implementation Lead',
    department: 'Technology',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-005',
    businessPhases: ['build'],
    specialties: ['Web Development', 'E-commerce', 'Cloud Infrastructure'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    isDeaf: false,
    biography: 'Michael specializes in technical implementation for deaf business owners in the technology sector. He has a background in computer science and deep understanding of technical concepts.',
    videoUrl: 'https://example.com/videos/michael-intro.mp4',
    contactMethods: {
      email: 'michael.chen@360magicians.com',
      videoCall: 'https://pinksync.com/meet/michael',
      phone: '+1-555-456-7890'
    }
  },
  {
    id: 'tm-006',
    name: 'Sophia Garcia',
    title: 'Brand Development Lead',
    department: 'Marketing',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-006',
    businessPhases: ['build'],
    specialties: ['Visual Branding', 'Logo Design', 'Brand Identity'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English', 'Spanish'],
    isDeaf: true,
    biography: 'Sophia is a deaf designer who creates visually stunning brands that resonate with both deaf and hearing audiences. Her unique perspective ensures brands are truly accessible.',
    videoUrl: 'https://example.com/videos/sophia-intro.mp4',
    contactMethods: {
      email: 'sophia.garcia@360magicians.com',
      videoCall: 'https://pinksync.com/meet/sophia'
    }
  },
  
  // GROW Phase Team
  {
    id: 'tm-007',
    name: 'Jamal Washington',
    title: 'Business Growth Strategist',
    department: 'Growth',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-007',
    businessPhases: ['grow'],
    specialties: ['Business Operations', 'Growth Strategy', 'Process Optimization'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    isDeaf: false,
    biography: 'Jamal combines his MBA and interpreting certifications to provide specialized guidance for scaling business operations, optimizing processes, and managing growth.',
    videoUrl: 'https://example.com/videos/jamal-intro.mp4',
    contactMethods: {
      email: 'jamal.washington@360magicians.com',
      videoCall: 'https://pinksync.com/meet/jamal',
      phone: '+1-555-567-8901'
    }
  },
  {
    id: 'tm-008',
    name: 'Elena Rodriguez',
    title: 'Marketing Director',
    department: 'Marketing',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-008',
    businessPhases: ['grow'],
    specialties: ['Marketing Strategy', 'Customer Acquisition', 'Social Media'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English', 'Spanish'],
    isDeaf: false,
    biography: 'Elena is a trilingual marketing specialist who helps deaf entrepreneurs connect with both deaf and hearing markets through inclusive marketing strategies.',
    videoUrl: 'https://example.com/videos/elena-intro.mp4',
    contactMethods: {
      email: 'elena.rodriguez@360magicians.com',
      videoCall: 'https://pinksync.com/meet/elena',
      phone: '+1-555-678-9012'
    }
  },
  {
    id: 'tm-009',
    name: 'Marcus Johnson',
    title: 'Sales & Customer Acquisition Lead',
    department: 'Sales',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-009',
    businessPhases: ['grow'],
    specialties: ['Sales Strategy', 'Customer Acquisition', 'Negotiation'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    isDeaf: true,
    biography: 'Marcus is a deaf sales expert who has developed unique visual selling techniques. He trains business owners on how to effectively present their products and services to diverse audiences.',
    videoUrl: 'https://example.com/videos/marcus-intro.mp4',
    contactMethods: {
      email: 'marcus.johnson@360magicians.com',
      videoCall: 'https://pinksync.com/meet/marcus'
    }
  },
  
  // MANAGE Phase Team
  {
    id: 'tm-010',
    name: 'Priya Patel',
    title: 'Financial Management Specialist',
    department: 'Finance',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-010',
    businessPhases: ['manage'],
    specialties: ['Financial Management', 'Bookkeeping', 'Tax Planning'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    isDeaf: false,
    biography: 'Priya specializes in financial management for deaf business owners. She ensures accounting systems and financial reporting are fully accessible.',
    videoUrl: 'https://example.com/videos/priya-intro.mp4',
    contactMethods: {
      email: 'priya.patel@360magicians.com',
      videoCall: 'https://pinksync.com/meet/priya',
      phone: '+1-555-789-0123'
    }
  },
  {
    id: 'tm-011',
    name: 'Jordan Lee',
    title: 'Operations & Process Specialist',
    department: 'Operations',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-011',
    businessPhases: ['manage'],
    specialties: ['Process Optimization', 'Automation', 'Operational Efficiency'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    isDeaf: true,
    biography: 'Jordan is a deaf operations specialist who has developed visual workflow systems that improve efficiency while ensuring complete accessibility for deaf team members.',
    videoUrl: 'https://example.com/videos/jordan-intro.mp4',
    contactMethods: {
      email: 'jordan.lee@360magicians.com',
      videoCall: 'https://pinksync.com/meet/jordan'
    }
  },
  {
    id: 'tm-012',
    name: 'Olivia Parker',
    title: 'HR & Team Development',
    department: 'Human Resources',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tm-012',
    businessPhases: ['manage'],
    specialties: ['Recruiting', 'Team Development', 'Workplace Accommodation'],
    isPinkSyncCertified: true,
    languages: ['ASL', 'English'],
    isDeaf: false,
    biography: 'Olivia specializes in creating inclusive workplaces that support both deaf and hearing employees. She helps business owners implement best practices for accessibility and accommodation.',
    videoUrl: 'https://example.com/videos/olivia-intro.mp4',
    contactMethods: {
      email: 'olivia.parker@360magicians.com',
      videoCall: 'https://pinksync.com/meet/olivia',
      phone: '+1-555-890-1234'
    }
  }
];

// Role types to filter team members
const roleTypes = [
  { id: 'all', label: 'All Roles' },
  { id: 'asl', label: 'ASL Specialists', filter: (member: TeamMember) => member.languages.includes('ASL') },
  { id: 'deaf', label: 'Deaf Team Members', filter: (member: TeamMember) => member.isDeaf },
  { id: 'pinksync', label: 'PinkSync Certified', filter: (member: TeamMember) => member.isPinkSyncCertified }
];

export default function BusinessLifecycleTeam() {
  const [activePhase, setActivePhase] = useState<string>('all');
  const [activeRole, setActiveRole] = useState<string>('all');
  
  const filteredMembers = teamMembers.filter(member => {
    // Filter by phase
    const phaseMatches = activePhase === 'all' || member.businessPhases.includes(activePhase as any);
    
    // Filter by role type
    const roleTypeFilter = roleTypes.find(role => role.id === activeRole);
    const roleMatches = activeRole === 'all' || (roleTypeFilter?.filter && roleTypeFilter.filter(member));
    
    return phaseMatches && roleMatches;
  });
  
  // Phase details to display in headers
  const phaseDetails = {
    idea: {
      title: 'Idea Phase Team',
      description: 'Specialists in business ideation, market research, and validation',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'bg-indigo-100 text-indigo-800'
    },
    build: {
      title: 'Build Phase Team',
      description: 'Experts in business formation, branding, and implementation',
      icon: <Hammer className="h-5 w-5" />,
      color: 'bg-teal-100 text-teal-800'
    },
    grow: {
      title: 'Grow Phase Team',
      description: 'Specialists in marketing, sales, and business scaling',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-amber-100 text-amber-800'
    },
    manage: {
      title: 'Manage Phase Team',
      description: 'Experts in operations, finance, and business administration',
      icon: <Settings className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-800'
    },
    all: {
      title: 'Complete Business Lifecycle Team',
      description: 'Our full team of specialists covering all phases of your business journey',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-gray-100 text-gray-800'
    }
  };
  
  // Get the current phase details
  const currentPhase = phaseDetails[activePhase as keyof typeof phaseDetails];
  
  // Map departments to icons
  const departmentIcons: Record<string, React.ReactNode> = {
    'Idea Generation': <Lightbulb className="h-4 w-4" />,
    'Marketing': <BarChart3 className="h-4 w-4" />,
    'Legal & Formation': <Briefcase className="h-4 w-4" />,
    'Technology': <Server className="h-4 w-4" />,
    'Growth': <TrendingUp className="h-4 w-4" />,
    'Sales': <CreditCard className="h-4 w-4" />,
    'Finance': <Database className="h-4 w-4" />,
    'Operations': <Settings className="h-4 w-4" />,
    'Human Resources': <Users className="h-4 w-4" />
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-3">360 Magicians Team</h2>
          <p className="text-gray-600 max-w-3xl">
            Our dedicated team consists of both deaf and hearing specialists, all equipped with PinkSync
            technology to ensure seamless communication and support throughout your business journey.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-pink-200">
            <Video className="h-6 w-6 text-pink-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-pink-900">PinkSync Certified Team</h3>
            <p className="text-gray-700 mb-3">
              <strong>All team members are PinkSync certified</strong>, meaning they are equipped with 
              the specialized communication tools and training needed to provide seamless support for 
              deaf entrepreneurs. This certification ensures:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Fluent ASL Communication</p>
                  <p className="text-sm text-gray-600">Either native or certified interpreting skills</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Visual Communication Training</p>
                  <p className="text-sm text-gray-600">Expertise in visual-first business concepts</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Deaf Culture Competency</p>
                  <p className="text-sm text-gray-600">Deep understanding of deaf culture and needs</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Real-time Translation Technology</p>
                  <p className="text-sm text-gray-600">Access to PinkSync's AI-powered tools</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Visual Business Materials</p>
                  <p className="text-sm text-gray-600">Creation of ASL-friendly resources</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Accommodation Expertise</p>
                  <p className="text-sm text-gray-600">Knowledge of business accommodation best practices</p>
                </div>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-pink-700">
              Learn more about our PinkSync certification
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filter by Business Phase</CardTitle>
            <CardDescription>
              Find specialists for your current stage of business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activePhase} onValueChange={setActivePhase}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all" className="gap-2">
                  <Users className="h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="idea" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Idea
                </TabsTrigger>
                <TabsTrigger value="build" className="gap-2">
                  <Hammer className="h-4 w-4" />
                  Build
                </TabsTrigger>
                <TabsTrigger value="grow" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Grow
                </TabsTrigger>
                <TabsTrigger value="manage" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Manage
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filter by Role Type</CardTitle>
            <CardDescription>
              Find team members by specialization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeRole} onValueChange={setActiveRole}>
              <TabsList className="grid grid-cols-4">
                {roleTypes.map(role => (
                  <TabsTrigger key={role.id} value={role.id} className="gap-2">
                    {role.id === 'asl' && <MessageSquare className="h-4 w-4" />}
                    {role.id === 'deaf' && <Users className="h-4 w-4" />}
                    {role.id === 'pinksync' && <Video className="h-4 w-4" />}
                    {role.id === 'all' && <Users className="h-4 w-4" />}
                    {role.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          {currentPhase.icon}
          <div>
            <h3 className="text-2xl font-bold">{currentPhase.title}</h3>
            <p className="text-gray-600">{currentPhase.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <Card key={member.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={member.profileImageUrl} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription className="text-xs">{member.title}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    {member.isDeaf && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs border-blue-200">
                        Deaf Team Member
                      </Badge>
                    )}
                    {member.isPinkSyncCertified && (
                      <Badge className="bg-pink-100 text-pink-800 text-xs border-pink-200">
                        PinkSync Certified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3 flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="gap-1 text-xs">
                      {departmentIcons[member.department] || <Briefcase className="h-3 w-3" />}
                      {member.department}
                    </Badge>
                  </div>
                  
                  <div className="line-clamp-2 text-sm text-gray-600 mb-2">
                    {member.biography}
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium mb-1">Specialties</div>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map(specialty => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium mb-1">Languages</div>
                    <div className="flex flex-wrap gap-1">
                      {member.languages.map(language => (
                        <Badge key={language} variant="secondary" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium mb-1">Business Phases</div>
                    <div className="flex flex-wrap gap-1">
                      {member.businessPhases.map(phase => (
                        <Badge key={phase} 
                          className={`capitalize text-xs ${
                            phase === 'idea' ? 'bg-indigo-100 text-indigo-800' :
                            phase === 'build' ? 'bg-teal-100 text-teal-800' :
                            phase === 'grow' ? 'bg-amber-100 text-amber-800' :
                            'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {phase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t">
                <div className="grid grid-cols-3 gap-2 w-full">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Video className="h-3.5 w-3.5" /> Video
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> Schedule
                  </Button>
                  <Button variant="default" size="sm" className="gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Contact
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredMembers.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No team members found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your filters to see more team members
            </p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setActivePhase('all');
              setActiveRole('all');
            }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}