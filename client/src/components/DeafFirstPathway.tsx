import { useState } from 'react';
import { 
  Video, 
  ShoppingBag, 
  Briefcase, 
  ArrowRight, 
  CheckCircle, 
  Play, 
  HandMetal,
  FileText,
  BarChart,
  Building,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// ASL Video player component with accessibility features
const ASLVideoPlayer = ({ videoTitle, videoUrl, thumbnailUrl }: { videoTitle: string, videoUrl: string, thumbnailUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="relative rounded-lg overflow-hidden group">
      {!isPlaying ? (
        <div className="relative">
          <img src={thumbnailUrl} alt={`Thumbnail for ${videoTitle}`} className="w-full h-full object-cover rounded-lg" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity group-hover:bg-opacity-50">
            <button 
              className="bg-white bg-opacity-90 text-indigo-700 rounded-full p-3 transform transition-transform group-hover:scale-110"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ASL video: ${videoTitle}`}
            >
              <Play className="h-8 w-8" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <Badge className="bg-indigo-600 text-white">ASL Video</Badge>
            <h3 className="text-white font-medium mt-1">{videoTitle}</h3>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video bg-black">
          <video 
            src={videoUrl} 
            className="w-full h-full" 
            controls 
            autoPlay 
            onEnded={() => setIsPlaying(false)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

// Visual navigation card with clear imagery 
const PathwayCard = ({ 
  title, 
  icon, 
  description, 
  color,
  features,
  videoThumbnail,
  onClick
}: { 
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  features: string[];
  videoThumbnail: string;
  onClick: () => void;
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-0 group">
      <div className={`h-3 ${color}`}></div>
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-full ${color.replace('bg-', 'bg-').replace('600', '100')} ${color.replace('bg-', 'text-')}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <ASLVideoPlayer 
              videoTitle={`About ${title}`}
              videoUrl="/videos/sample.mp4" // This would be replaced with actual video
              thumbnailUrl={videoThumbnail}
            />
          </div>
          
          <ul className="space-y-2 mb-6">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            className={`mt-auto w-full ${color} border-0 group-hover:translate-y-0 transition-transform text-white`}
            onClick={onClick}
          >
            <span>Select This Path</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DeafFirstPathway() {
  const [selectedTab, setSelectedTab] = useState('all');
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <HandMetal className="h-10 w-10 text-indigo-600 mr-3" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">360° Deaf First Platform</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose your path and access tools specially designed for deaf entrepreneurs and professionals
        </p>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="mb-8"
      >
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="all" className="rounded-full">
              All Pathways
            </TabsTrigger>
            <TabsTrigger value="business" className="rounded-full">
              Business
            </TabsTrigger>
            <TabsTrigger value="job" className="rounded-full">
              Job
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(selectedTab === 'all' || selectedTab === 'business') && (
          <>
            <PathwayCard
              title="Business Magician"
              icon={<ShoppingBag className="h-8 w-8" />}
              description="Start and grow your business with accessible tools and resources"
              color="bg-indigo-600"
              features={[
                "Business formation with Northwest Agent",
                "SBA-aligned resources and guidance",
                "IONOS hosting partner discounts",
                "Complete lifecycle management",
                "ASL video guides for every step"
              ]}
              videoThumbnail="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              onClick={() => console.log('Business Magician selected')}
            />
            
            <PathwayCard
              title="Startup Founder"
              icon={<Lightbulb className="h-8 w-8" />}
              description="Launch your tech startup with specialized resources"
              color="bg-purple-600"
              features={[
                "AI-powered business idea generation",
                "Terraform infrastructure deployment",
                "Integration with cloud platforms",
                "Pitch deck creation tools",
                "Investor matching resources"
              ]}
              videoThumbnail="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              onClick={() => console.log('Startup Founder selected')}
            />
          </>
        )}
        
        {(selectedTab === 'all' || selectedTab === 'job') && (
          <>
            <PathwayCard
              title="Job Magician"
              icon={<Briefcase className="h-8 w-8" />}
              description="Find the perfect job with deaf-friendly employers"
              color="bg-teal-600"
              features={[
                "Resume builder with accessibility focus",
                "Job matching with deaf-friendly employers",
                "Interview preparation with ASL",
                "Workplace accommodation guides",
                "Professional skills development"
              ]}
              videoThumbnail="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              onClick={() => console.log('Job Magician selected')}
            />
            
            <PathwayCard
              title="Content Creator"
              icon={<Video className="h-8 w-8" />}
              description="Build your brand and create accessible content"
              color="bg-rose-600"
              features={[
                "Automated captioning tools",
                "ASL-friendly video editing",
                "Content planning for accessibility",
                "Social media management",
                "Audience growth strategies"
              ]}
              videoThumbnail="https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              onClick={() => console.log('Content Creator selected')}
            />
          </>
        )}
        
        {selectedTab === 'all' && (
          <PathwayCard
            title="VR Counseling"
            icon={<Building className="h-8 w-8" />}
            description="Connect with VR counselors specialized in deaf services"
            color="bg-amber-600"
            features={[
              "VR counselor matching service",
              "Scheduling with ASL interpreters",
              "Document management system",
              "Progress tracking dashboard",
              "Resource library for VR services"
            ]}
            videoThumbnail="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            onClick={() => console.log('VR Counseling selected')}
          />
        )}
      </div>
      
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-indigo-100 p-3 rounded-full">
            <BarChart className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Your Services Dashboard</h2>
            <p className="text-gray-600">Track your progress across all 360 Magicians services</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Business Creation</h3>
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">In Progress</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Business Formation</span>
                  <span className="text-green-600">Completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Website Setup</span>
                  <span className="text-amber-600">50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-1/2"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Marketing Plan</span>
                  <span className="text-gray-600">Not Started</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-400 h-2 rounded-full w-0"></div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">Continue</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Job Applications</h3>
              <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">Active</Badge>
            </div>
            <div className="space-y-1 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Applications Submitted:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Interviews Scheduled:</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resume Completeness:</span>
                <span className="font-medium">85%</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">View Jobs</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Resources</h3>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">4 New</Badge>
            </div>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Business Plan Template</p>
                  <p className="text-xs text-gray-500">SBA-approved format</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tax Guide for Entrepreneurs</p>
                  <p className="text-xs text-gray-500">Updated for 2025</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Video className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">ASL: Hiring Your First Employee</p>
                  <p className="text-xs text-gray-500">20 min video guide</p>
                </div>
              </li>
            </ul>
            <Button variant="outline" className="w-full">View All Resources</Button>
          </div>
        </div>
      </div>
    </div>
  );
}