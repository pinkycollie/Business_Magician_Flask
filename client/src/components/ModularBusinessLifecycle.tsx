import { useState } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  Compass, 
  CreditCard, 
  FileText, 
  Lightbulb, 
  Rocket, 
  Settings, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// The four lifecycle phases of a business
const phases = [
  {
    id: 'idea',
    name: 'Idea',
    icon: <Lightbulb className="h-5 w-5" />,
    color: 'text-amber-500',
    description: 'Generate and validate business ideas',
    tasks: [
      { 
        id: 'idea-1',
        name: 'Idea Generation',
        description: 'Generate and evaluate potential business ideas through brainstorming, market research, and customer surveys',
        hasASL: true
      },
      { 
        id: 'idea-2',
        name: 'Market Research',
        description: 'Identify your target market, analyze competition, and understand customer needs',
        hasASL: true
      },
      { 
        id: 'idea-3',
        name: 'Idea Validation',
        description: 'Validate your business idea by creating an MVP, gathering feedback, and making necessary adjustments',
        hasASL: true
      }
    ],
    tools: [
      {
        id: 'idea-tool-1',
        name: 'Business Idea Generator',
        description: 'Create customized business ideas based on your interests, skills, and market trends',
        type: 'AI'
      },
      {
        id: 'idea-tool-2',
        name: 'Market Research Tool',
        description: 'Analyze your target market, competition, and potential customer base',
        type: 'AI'
      }
    ]
  },
  {
    id: 'build',
    name: 'Build',
    icon: <Settings className="h-5 w-5" />,
    color: 'text-blue-500',
    description: 'Develop your business foundation',
    tasks: [
      { 
        id: 'build-1',
        name: 'Business Plan',
        description: 'Create a comprehensive business plan including your mission, vision, goals, and strategies',
        hasASL: true
      },
      { 
        id: 'build-2',
        name: 'Legal Formation',
        description: 'Choose your business structure and complete the legal requirements for formation',
        hasASL: true
      },
      { 
        id: 'build-3',
        name: 'Funding',
        description: 'Explore funding options including bootstrapping, loans, grants, and investors',
        hasASL: true
      }
    ],
    tools: [
      {
        id: 'build-tool-1',
        name: 'Business Formation Assistant',
        description: 'Guide through business structure selection and registration process',
        type: 'External API'
      },
      {
        id: 'build-tool-2',
        name: 'Financial Calculator',
        description: 'Calculate startup costs, projected revenue, and break-even analysis',
        type: 'Calculator'
      }
    ]
  },
  {
    id: 'grow',
    name: 'Grow',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-green-500',
    description: 'Expand your business reach',
    tasks: [
      { 
        id: 'grow-1',
        name: 'Marketing Strategy',
        description: 'Develop a comprehensive marketing strategy to reach and engage your target audience',
        hasASL: true
      },
      { 
        id: 'grow-2',
        name: 'Sales Development',
        description: 'Build and optimize your sales funnel to convert leads into customers',
        hasASL: true
      },
      { 
        id: 'grow-3',
        name: 'Team Expansion',
        description: 'Recruit, hire, and train team members to support your business growth',
        hasASL: true
      }
    ],
    tools: [
      {
        id: 'grow-tool-1',
        name: 'Marketing Plan Creator',
        description: 'Generate customized marketing strategies for your specific business',
        type: 'AI'
      },
      {
        id: 'grow-tool-2',
        name: 'Team Builder',
        description: 'Create job descriptions and hiring plans for your growing team',
        type: 'External API'
      }
    ]
  },
  {
    id: 'manage',
    name: 'Manage',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'text-purple-500',
    description: 'Optimize and maintain your business',
    tasks: [
      { 
        id: 'manage-1',
        name: 'Financial Management',
        description: 'Set up accounting systems, track expenses, and manage your business finances',
        hasASL: true
      },
      { 
        id: 'manage-2',
        name: 'Operations',
        description: 'Streamline your business operations to maximize efficiency and productivity',
        hasASL: true
      },
      { 
        id: 'manage-3',
        name: 'Monitoring & Optimization',
        description: 'Track key metrics and optimize your business based on data-driven insights',
        hasASL: true
      }
    ],
    tools: [
      {
        id: 'manage-tool-1',
        name: 'AI Business Analytics',
        description: 'Get detailed insights into your business performance',
        type: 'AI'
      },
      {
        id: 'manage-tool-2',
        name: 'Financial Dashboard',
        description: 'Track income, expenses, and profitability in real-time',
        type: 'Dashboard'
      }
    ]
  }
];

export default function ModularBusinessLifecycle() {
  const [activePhase, setActivePhase] = useState('idea');
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Business Lifecycle</h1>
        <p className="text-slate-600">
          Navigate through each phase of your business journey with specialized tools and resources
        </p>
      </div>
      
      <Tabs 
        value={activePhase} 
        onValueChange={setActivePhase}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 w-full">
          {phases.map(phase => (
            <TabsTrigger 
              key={phase.id} 
              value={phase.id}
              className="flex items-center gap-2"
            >
              <span className={phase.color}>{phase.icon}</span>
              <span className="hidden md:inline">{phase.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {phases.map(phase => (
          <TabsContent key={phase.id} value={phase.id} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <span className={phase.color}>{phase.icon}</span>
                          {phase.name} Phase
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {phase.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <Clock className="h-3 w-3" />
                        <span>Phase {phases.findIndex(p => p.id === phase.id) + 1} of 4</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-4">Key Tasks</h3>
                    <div className="space-y-4">
                      {phase.tasks.map((task, index) => (
                        <div 
                          key={task.id}
                          className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{task.name}</h4>
                              {task.hasASL && (
                                <Badge variant="secondary" className="text-xs">
                                  ASL Video
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm mt-1">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Start {phase.name} Phase
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tools & Resources</CardTitle>
                    <CardDescription>
                      Specialized tools to help you succeed in this phase
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {phase.tools.map(tool => (
                      <div key={tool.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{tool.name}</h4>
                          <Badge variant="outline">{tool.type}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {tool.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full text-xs gap-1"
                        >
                          Launch Tool
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Support Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3 items-center p-3 border rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Phase Guide</div>
                        <div className="text-slate-600">Comprehensive guide with ASL video</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-center p-3 border rounded-lg">
                      <div className="bg-amber-100 p-2 rounded-md text-amber-600">
                        <Compass className="h-5 w-5" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">PinkSync Connect</div>
                        <div className="text-slate-600">ASL interpreter assistance</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-center p-3 border rounded-lg">
                      <div className="bg-green-100 p-2 rounded-md text-green-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Schedule Consultation</div>
                        <div className="text-slate-600">Free ASL-accessible counseling</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Success Stories</CardTitle>
                <CardDescription>
                  Learn from deaf entrepreneurs who have succeeded in this phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-slate-200 h-10 w-10 rounded-full"></div>
                      <div>
                        <div className="font-medium">Sarah Johnson</div>
                        <div className="text-sm text-slate-600">Tech Founder</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">
                      "Using the business idea generator helped me find my niche in accessibility technology that I wouldn't have discovered otherwise."
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-slate-200 h-10 w-10 rounded-full"></div>
                      <div>
                        <div className="font-medium">David Chen</div>
                        <div className="text-sm text-slate-600">E-commerce Owner</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">
                      "PinkSync's ASL guidance through the market research phase gave me insights I would have missed with text-only resources."
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-slate-200 h-10 w-10 rounded-full"></div>
                      <div>
                        <div className="font-medium">Alex Rivera</div>
                        <div className="text-sm text-slate-600">Marketing Agency</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">
                      "The VR counselor connection helped me secure funding I didn't even know was available for deaf entrepreneurs."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}