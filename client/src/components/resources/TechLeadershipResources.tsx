import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Users, Code, Shield, Brain, BarChart } from 'lucide-react';

// Resource categories based on Awesome CTO
const RESOURCE_CATEGORIES = [
  { id: 'leadership', name: 'Leadership', icon: <Users className="h-4 w-4" /> },
  { id: 'management', name: 'Engineering Management', icon: <Code className="h-4 w-4" /> },
  { id: 'hiring', name: 'Hiring & Team Building', icon: <Users className="h-4 w-4" /> },
  { id: 'architecture', name: 'Technical Architecture', icon: <Code className="h-4 w-4" /> },
  { id: 'security', name: 'Security & Compliance', icon: <Shield className="h-4 w-4" /> },
  { id: 'ai', name: 'AI & ML Resources', icon: <Brain className="h-4 w-4" /> },
  { id: 'growth', name: 'Growth & Scaling', icon: <BarChart className="h-4 w-4" /> },
];

// Curated resources from Awesome CTO repository
const RESOURCES = [
  {
    id: 1,
    title: 'The CTO Handbook',
    url: 'https://github.com/kuchin/awesome-cto',
    description: 'A comprehensive collection of resources for Chief Technology Officers, organized by topic.',
    category: 'leadership',
    hasASL: true,
  },
  {
    id: 2,
    title: 'The Manager\'s Path',
    url: 'http://shop.oreilly.com/product/0636920056843.do',
    description: 'A guide for tech leaders navigating growth and change in organizations.',
    category: 'management',
    hasASL: true,
  },
  {
    id: 3,
    title: 'Engineering Management for the Rest of Us',
    url: 'https://www.engmanagement.dev/',
    description: 'A practical guide to engineering management with actionable advice.',
    category: 'management',
    hasASL: false,
  },
  {
    id: 4,
    title: 'The Startup CTO\'s Handbook',
    url: 'https://github.com/ZachGoldberg/Startup-CTO-Handbook',
    description: 'A comprehensive resource for technical founders and CTOs of startups.',
    category: 'leadership',
    hasASL: true,
  },
  {
    id: 5,
    title: 'The Inclusive Tech Leader',
    url: 'https://deaffounders.org/inclusive-tech-leadership',
    description: 'Specially designed resources for deaf and hard-of-hearing technical leaders.',
    category: 'leadership',
    hasASL: true,
  },
  {
    id: 6,
    title: 'System Design Interview',
    url: 'https://www.systemdesign.one/',
    description: 'Resources for technical architecture and system design for scaling businesses.',
    category: 'architecture',
    hasASL: false,
  },
  {
    id: 7,
    title: 'Accessible AI Implementation',
    url: 'https://github.com/collections/ai-model-development',
    description: 'AI resources with a focus on accessibility and inclusive design.',
    category: 'ai',
    hasASL: true,
  },
  {
    id: 8,
    title: 'Tech Lead Expectations for Engineering Projects',
    url: 'https://github.com/charlax/engineering-management#tech-lead--engineering-lead',
    description: 'Practical guide to tech leadership for engineering projects with a focus on execution.',
    category: 'leadership',
    hasASL: false,
  },
  {
    id: 9,
    title: 'The Security Handbook for Startups',
    url: 'https://github.com/forter/security-101-for-saas-startups/blob/english/security.md',
    description: 'Essential security practices for startups from the beginning stages through growth.',
    category: 'security',
    hasASL: true,
  },
  {
    id: 10,
    title: 'Scaling Engineering Organizations',
    url: 'https://stripe.com/atlas/guides/scaling-eng',
    description: 'Proven strategies for growing and scaling engineering teams effectively.',
    category: 'growth',
    hasASL: false,
  },
  {
    id: 11,
    title: 'The Hiring Playbook',
    url: 'https://www.holloway.com/g/technical-recruiting-hiring',
    description: 'Comprehensive guide to building technical teams with diverse talent.',
    category: 'hiring',
    hasASL: true,
  },
  {
    id: 12,
    title: 'Accessibility in Tech Leadership',
    url: 'https://www.a11yproject.com/resources/',
    description: 'Resources for ensuring accessibility is prioritized in technology development.',
    category: 'leadership',
    hasASL: true,
  },
  {
    id: 13,
    title: 'AI for Startup CTOs',
    url: 'https://github.com/microsoft/ai-for-beginners',
    description: 'Practical implementation guide for artificial intelligence in startups.',
    category: 'ai',
    hasASL: false,
  },
  {
    id: 14,
    title: 'The Tech Debt Playbook',
    url: 'https://github.com/kuchin/awesome-cto#technical-debt',
    description: 'Strategic approaches to managing technical debt in growing companies.',
    category: 'architecture',
    hasASL: true,
  },
];

export default function TechLeadershipResources() {
  const [activeCategory, setActiveCategory] = useState('leadership');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter resources based on active category and search query
  const filteredResources = RESOURCES.filter(resource => 
    (activeCategory === 'all' || resource.category === activeCategory) &&
    (resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Technical Leadership Resources</h1>
        <p className="text-slate-600">
          Curated resources for deaf entrepreneurs in technical leadership roles, inspired by the 
          <a 
            href="https://github.com/kuchin/awesome-cto" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 mx-1 inline-flex items-center"
          >
            Awesome CTO
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
          collection.
        </p>
      </div>
      
      {/* ASL Support Banner */}
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-8 flex items-center gap-4">
        <div className="bg-purple-100 p-2 rounded-full text-purple-800">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium text-purple-900">ASL Interpretation Available</h3>
          <p className="text-sm text-purple-800">
            Resources with the ASL badge have sign language interpretation available through PinkSync.
            Click the ASL button on those resources to view the signed version.
          </p>
        </div>
      </div>
      
      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {RESOURCE_CATEGORIES.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                {category.icon}
                <span className="hidden md:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="relative">
            <input 
              type="text"
              placeholder="Search resources..."
              className="py-2 px-3 border border-slate-300 rounded-md text-sm w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {RESOURCE_CATEGORIES.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
              
              {filteredResources.length === 0 && (
                <div className="col-span-2 py-8 text-center">
                  <p className="text-slate-500">No resources found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Resource Addition Banner */}
      <Card className="mt-12">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-1">Contribute to our Resource Library</h3>
              <p className="text-slate-600 text-sm">
                Know a great resource for deaf entrepreneurs in technical leadership? Share it with our community.
              </p>
            </div>
            <Button className="whitespace-nowrap">
              Submit a Resource
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource }: { resource: any }) {
  const [showAslRequest, setShowAslRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  
  const handleAslRequest = () => {
    // In a real implementation, this would send a request to the backend
    // to queue this resource for ASL translation through PinkSync
    console.log(`Requested ASL translation for: ${resource.title}`);
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowAslRequest(false);
    }, 3000);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{resource.title}</CardTitle>
            <CardDescription className="mt-1">{resource.description}</CardDescription>
          </div>
          {resource.hasASL ? (
            <Badge className="bg-purple-100 text-purple-800 h-fit">ASL</Badge>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setShowAslRequest(true)}
            >
              Request ASL
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge variant="outline">
            {RESOURCE_CATEGORIES.find(c => c.id === resource.category)?.name}
          </Badge>
          <div className="flex items-center gap-2">
            {resource.hasASL && (
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  View ASL
                </div>
              </Button>
            )}
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              View Resource
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
        
        {/* ASL Translation Request Dialog */}
        {showAslRequest && (
          <div className="mt-4 p-3 bg-purple-50 rounded-md border border-purple-100">
            {!requestSubmitted ? (
              <>
                <p className="text-sm text-purple-800 mb-2">
                  Request ASL translation for this resource through PinkSync?
                </p>
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowAslRequest(false)}
                    className="h-7 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleAslRequest}
                    className="h-7 text-xs"
                  >
                    Request Translation
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-purple-800">
                Translation request submitted! We'll notify you when it's ready.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}