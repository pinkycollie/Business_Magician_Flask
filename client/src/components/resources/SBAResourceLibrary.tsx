import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Video, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Building, 
  Users, 
  TrendingUp,
  Filter,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

// Interface for resource items
interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'template' | 'guide' | 'event' | 'funding' | 'tool';
  category: 'legal' | 'financial' | 'marketing' | 'operations' | 'planning' | 'management';
  phase: 'idea' | 'build' | 'grow' | 'manage';
  link: string;
  aslSupport: boolean;
  sbaAligned: boolean;
  tags: string[];
}

// Sample resource data organized by SBA principles
const resourcesData: ResourceItem[] = [
  {
    id: '1',
    title: 'Business Plan Essentials',
    description: 'Learn how to create a comprehensive business plan that follows SBA guidelines and standards.',
    type: 'guide',
    category: 'planning',
    phase: 'idea',
    link: '/resources/business-plan-guide',
    aslSupport: true,
    sbaAligned: true,
    tags: ['business plan', 'startup', 'planning']
  },
  {
    id: '2',
    title: 'SBA Funding Options Overview',
    description: 'Explore various SBA loan programs and funding opportunities available for small businesses.',
    type: 'article',
    category: 'financial',
    phase: 'build',
    link: '/resources/sba-funding-options',
    aslSupport: true,
    sbaAligned: true,
    tags: ['funding', 'loans', 'grants']
  },
  {
    id: '3',
    title: 'Market Research Strategies',
    description: 'SBA-recommended approaches to conduct effective market research for your business idea.',
    type: 'video',
    category: 'marketing',
    phase: 'idea',
    link: '/resources/market-research-video',
    aslSupport: true,
    sbaAligned: true,
    tags: ['market research', 'competition', 'analysis']
  },
  {
    id: '4',
    title: 'Legal Structure Selection Guide',
    description: 'Understand different business structures (LLC, Corp, etc.) and their implications.',
    type: 'guide',
    category: 'legal',
    phase: 'build',
    link: '/resources/legal-structures',
    aslSupport: true,
    sbaAligned: true,
    tags: ['legal', 'business structure', 'llc', 'corporation']
  },
  {
    id: '5',
    title: 'Financial Projection Templates',
    description: 'SBA-approved templates for creating financial projections for your business.',
    type: 'template',
    category: 'financial',
    phase: 'build',
    link: '/resources/financial-templates',
    aslSupport: false,
    sbaAligned: true,
    tags: ['financial', 'projections', 'budgeting']
  },
  {
    id: '6',
    title: 'Marketing Plan Development',
    description: 'Step-by-step guide to creating a marketing plan that aligns with your business goals.',
    type: 'guide',
    category: 'marketing',
    phase: 'grow',
    link: '/resources/marketing-plan',
    aslSupport: true,
    sbaAligned: true,
    tags: ['marketing', 'strategy', 'growth']
  },
  {
    id: '7',
    title: 'Hiring Your First Employee',
    description: 'Guidelines and legal considerations when hiring employees for your small business.',
    type: 'article',
    category: 'operations',
    phase: 'grow',
    link: '/resources/hiring-guide',
    aslSupport: true,
    sbaAligned: true,
    tags: ['hiring', 'employees', 'hr']
  },
  {
    id: '8',
    title: 'SBA Virtual Networking Event',
    description: 'Connect with other entrepreneurs and small business owners in this virtual networking session.',
    type: 'event',
    category: 'planning',
    phase: 'build',
    link: '/events/sba-networking',
    aslSupport: true,
    sbaAligned: true,
    tags: ['networking', 'event', 'community']
  },
  {
    id: '9',
    title: 'Cash Flow Management Strategies',
    description: 'Learn essential techniques for managing cash flow in your small business.',
    type: 'guide',
    category: 'financial',
    phase: 'manage',
    link: '/resources/cash-flow-management',
    aslSupport: false,
    sbaAligned: true,
    tags: ['cash flow', 'finance', 'management']
  },
  {
    id: '10',
    title: 'Tax Preparation for Small Businesses',
    description: 'Annual tax considerations and preparation guidelines for small business owners.',
    type: 'guide',
    category: 'financial',
    phase: 'manage',
    link: '/resources/tax-preparation',
    aslSupport: true,
    sbaAligned: true,
    tags: ['taxes', 'accounting', 'financial']
  },
  {
    id: '11',
    title: 'SBA Mentor Connection Program',
    description: 'Get connected with experienced business mentors through the SBA mentor program.',
    type: 'tool',
    category: 'management',
    phase: 'grow',
    link: '/tools/find-mentor',
    aslSupport: true,
    sbaAligned: true,
    tags: ['mentorship', 'coaching', 'guidance']
  },
  {
    id: '12',
    title: 'Business Scaling Strategies',
    description: 'Explore proven strategies for scaling your business operations and revenue.',
    type: 'article',
    category: 'operations',
    phase: 'grow',
    link: '/resources/scaling-strategies',
    aslSupport: false,
    sbaAligned: true,
    tags: ['scaling', 'growth', 'expansion']
  },
  {
    id: '13',
    title: 'Understanding Business Insurance',
    description: 'Overview of different types of business insurance and determining what you need.',
    type: 'guide',
    category: 'legal',
    phase: 'build',
    link: '/resources/business-insurance',
    aslSupport: true,
    sbaAligned: true,
    tags: ['insurance', 'risk management', 'legal']
  },
  {
    id: '14',
    title: 'SBA Grant Opportunities for Deaf Entrepreneurs',
    description: 'Specific grant programs and funding opportunities for deaf business owners.',
    type: 'funding',
    category: 'financial',
    phase: 'build',
    link: '/resources/grants-deaf-entrepreneurs',
    aslSupport: true,
    sbaAligned: true,
    tags: ['grants', 'funding', 'deaf-owned']
  },
  {
    id: '15',
    title: 'Accessible Customer Service Practices',
    description: 'Guidelines for creating accessible and inclusive customer service experiences.',
    type: 'guide',
    category: 'operations',
    phase: 'manage',
    link: '/resources/accessible-customer-service',
    aslSupport: true,
    sbaAligned: true,
    tags: ['accessibility', 'customer service', 'inclusion']
  }
];

// Helper function to get icon based on resource type
const getResourceIcon = (type: string) => {
  switch (type) {
    case 'article':
      return <FileText className="h-4 w-4" />;
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'template':
      return <FileText className="h-4 w-4" />;
    case 'guide':
      return <BookOpen className="h-4 w-4" />;
    case 'event':
      return <Calendar className="h-4 w-4" />;
    case 'funding':
      return <DollarSign className="h-4 w-4" />;
    case 'tool':
      return <Building className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

// Helper function to get color based on resource category
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'legal':
      return 'bg-blue-100 text-blue-800';
    case 'financial':
      return 'bg-green-100 text-green-800';
    case 'marketing':
      return 'bg-purple-100 text-purple-800';
    case 'operations':
      return 'bg-orange-100 text-orange-800';
    case 'planning':
      return 'bg-amber-100 text-amber-800';
    case 'management':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function SBAResourceLibrary() {
  const [currentPhase, setCurrentPhase] = useState<string>('idea');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterASL, setFilterASL] = useState<boolean>(false);
  const [filterSBA, setFilterSBA] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Filter resources based on search term, phase, and filters
  const filteredResources = resourcesData.filter(resource => {
    // Match phase
    if (currentPhase !== 'all' && resource.phase !== currentPhase) return false;
    
    // Match search term
    if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !resource.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by ASL support
    if (filterASL && !resource.aslSupport) return false;
    
    // Filter by SBA alignment
    if (filterSBA && !resource.sbaAligned) return false;
    
    // Filter by category
    if (selectedCategory !== 'all' && resource.category !== selectedCategory) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SBA Resource Library</h2>
          <p className="text-slate-500">
            Access business resources aligned with SBA principles and guidance
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filterSBA ? (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 border-green-200 text-green-700">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>SBA Aligned</span>
              <button 
                onClick={() => setFilterSBA(false)}
                className="ml-1 w-3.5 h-3.5 rounded-full hover:bg-green-200 flex items-center justify-center"
              >
                ×
              </button>
            </Badge>
          ) : null}
          
          {filterASL ? (
            <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 border-purple-200 text-purple-700">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>ASL Support</span>
              <button 
                onClick={() => setFilterASL(false)}
                className="ml-1 w-3.5 h-3.5 rounded-full hover:bg-purple-200 flex items-center justify-center"
              >
                ×
              </button>
            </Badge>
          ) : null}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search resources..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilterASL(!filterASL)}
              className={filterASL ? "bg-purple-100 border-purple-200 text-purple-800" : ""}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              ASL Support
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterSBA(!filterSBA)}
              className={filterSBA ? "bg-green-100 border-green-200 text-green-800" : ""}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              SBA Aligned
            </Button>
            
            <div className="relative">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Category
              </Button>
            </div>
          </div>
        </div>
      
        <Tabs value={currentPhase} onValueChange={setCurrentPhase}>
          <TabsList className="w-full grid grid-cols-5 mb-6">
            <TabsTrigger value="all">All Phases</TabsTrigger>
            <TabsTrigger value="idea">Idea</TabsTrigger>
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="grow">Grow</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ResourceGrid resources={filteredResources} />
          </TabsContent>
          
          <TabsContent value="idea" className="mt-0">
            <ResourceGrid resources={filteredResources} />
          </TabsContent>
          
          <TabsContent value="build" className="mt-0">
            <ResourceGrid resources={filteredResources} />
          </TabsContent>
          
          <TabsContent value="grow" className="mt-0">
            <ResourceGrid resources={filteredResources} />
          </TabsContent>
          
          <TabsContent value="manage" className="mt-0">
            <ResourceGrid resources={filteredResources} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Resource Grid Component
function ResourceGrid({ resources }: { resources: ResourceItem[] }) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-md">
        <p className="text-slate-500">No resources match your filters. Try adjusting your search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex gap-1.5 flex-wrap">
                  <Badge className={getCategoryColor(resource.category)}>
                    {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                  </Badge>
                  
                  {resource.aslSupport && (
                    <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                      ASL
                    </Badge>
                  )}
                </div>
                
                <div className="bg-slate-100 p-1.5 rounded-md">
                  {getResourceIcon(resource.type)}
                </div>
              </div>
              
              <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
              <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs bg-slate-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <div className="px-6 pb-4 mt-auto">
              <Button variant="outline" className="w-full flex items-center justify-center gap-1.5">
                <span>Access Resource</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}