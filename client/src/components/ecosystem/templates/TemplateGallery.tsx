import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Github, Code, Copy, Download, Play, Star } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'website' | 'app' | 'business' | 'collaboration' | 'ecommerce';
  previewImageUrl: string;
  demoUrl: string;
  githubUrl?: string;
  vercelDeployUrl?: string;
  technologies: string[];
  featured?: boolean;
  stars?: number;
  author: string;
}

const templates: Template[] = [
  {
    id: 'liveblocks-starter',
    name: 'Liveblocks Collaboration Starter Kit',
    description: 'Next.js starter with real-time collaboration features including comments, presence, and live cursors',
    category: 'collaboration',
    previewImageUrl: '/liveblocks-preview.jpg',
    demoUrl: 'https://liveblocks.io/examples/nextjs-starter-kit',
    githubUrl: 'https://github.com/liveblocks/liveblocks/tree/main/templates/nextjs-starter-kit',
    vercelDeployUrl: 'https://vercel.com/templates/next.js/liveblocks-starter-kit',
    technologies: ['Next.js', 'React', 'TypeScript', 'Liveblocks'],
    featured: true,
    stars: 2800,
    author: 'Liveblocks Team'
  },
  {
    id: 'business-formation',
    name: 'Business Formation Toolkit',
    description: 'Complete business formation workflow with Northwest Agent integration and ASL guidance',
    category: 'business',
    previewImageUrl: '/business-formation-preview.jpg',
    demoUrl: 'https://360magicians.com/templates/business-formation',
    technologies: ['React', 'Express', 'TypeScript', 'Northwest API'],
    featured: true,
    stars: 120,
    author: '360 Magicians'
  },
  {
    id: 'asl-video-platform',
    name: 'ASL Video Learning Platform',
    description: 'Video-first learning platform with MUX integration, optimized for deaf users',
    category: 'app',
    previewImageUrl: '/asl-platform-preview.jpg',
    demoUrl: 'https://360magicians.com/templates/asl-video-platform',
    githubUrl: 'https://github.com/360magicians/asl-video-platform',
    technologies: ['React', 'Express', 'MUX', 'TypeScript'],
    stars: 85,
    author: '360 Magicians'
  },
  {
    id: 'deaf-ecommerce',
    name: 'Accessible E-commerce Store',
    description: 'Fully accessible e-commerce template with ASL product videos and visual navigation',
    category: 'ecommerce',
    previewImageUrl: '/deaf-ecommerce-preview.jpg',
    demoUrl: 'https://360magicians.com/templates/deaf-ecommerce',
    technologies: ['React', 'Stripe', 'TypeScript', 'Tailwind'],
    stars: 67,
    author: '360 Magicians'
  },
  {
    id: 'business-website',
    name: 'Deaf Business Website',
    description: 'Professional business website template with integrated ASL videos and visual communication',
    category: 'website',
    previewImageUrl: '/business-website-preview.jpg',
    demoUrl: 'https://360magicians.com/templates/business-website',
    vercelDeployUrl: 'https://vercel.com/new?repository=https://github.com/360magicians/business-website-template',
    technologies: ['Next.js', 'React', 'TypeScript', 'GSAP'],
    stars: 42,
    author: '360 Magicians'
  }
];

export default function TemplateGallery() {
  const [category, setCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredTemplates = 
    category === 'all' 
      ? templates 
      : templates.filter(template => template.category === category);
  
  const featuredTemplates = templates.filter(template => template.featured);
  
  const handleOpenDetails = (template: Template) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };
  
  const handleCopyDeployCommand = () => {
    if (!selectedTemplate?.githubUrl) return;
    
    // Extract repo name from GitHub URL
    const repoUrlParts = selectedTemplate.githubUrl.split('/');
    const repoPath = repoUrlParts.slice(-2).join('/');
    
    const deployCommand = `git clone https://github.com/${repoPath}.git && cd ${repoPath.split('/')[1]} && npm install`;
    
    navigator.clipboard.writeText(deployCommand);
    toast({
      title: 'Command Copied!',
      description: 'Deployment command copied to clipboard',
    });
  };
  
  const categoryIcons = {
    website: <Globe className="h-4 w-4" />,
    app: <Smartphone className="h-4 w-4" />,
    business: <Briefcase className="h-4 w-4" />,
    collaboration: <Users className="h-4 w-4" />,
    ecommerce: <ShoppingCart className="h-4 w-4" />
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Template Gallery</h2>
        <p className="text-gray-600">
          Launch your project with one of our ready-made templates, designed for accessibility and deaf entrepreneurs.
        </p>
      </div>
      
      <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="website">Websites</TabsTrigger>
          <TabsTrigger value="app">Apps</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {category === 'all' && featuredTemplates.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Featured Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTemplates.map(template => (
              <Card key={template.id} className="overflow-hidden border-2 border-primary/20">
                <div className="aspect-video bg-muted relative">
                  {/* Would use real preview image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
                    <span className="text-2xl font-bold text-primary/70">
                      {template.name}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{template.name}</CardTitle>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      Featured
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.technologies.map(tech => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
                    <span>{template.stars}</span>
                    <span className="mx-2">•</span>
                    <span>By {template.author}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleOpenDetails(template)}>
                    View Details
                  </Button>
                  <Button asChild>
                    <a href={template.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      Live Demo <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {category === 'all' ? 'All Templates' : `${category.charAt(0).toUpperCase() + category.slice(1)} Templates`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates
            .filter(template => category === 'all' ? !template.featured : true)
            .map(template => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {/* Would use real preview image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted-foreground/5 to-muted-foreground/20">
                    <span className="text-xl font-bold text-muted-foreground/70">
                      {template.name}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.technologies.slice(0, 3).map(tech => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                    {template.technologies.length > 3 && (
                      <Badge variant="outline">+{template.technologies.length - 3}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
                    <span>{template.stars}</span>
                    <span className="mx-2">•</span>
                    <span>By {template.author}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDetails(template)}>
                    Details
                  </Button>
                  <Button size="sm" asChild>
                    <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
      
      {/* Template Details Dialog */}
      {selectedTemplate && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogDescription>
                {selectedTemplate.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="aspect-video bg-muted relative rounded-md overflow-hidden">
              {/* Would use real preview image */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
                <span className="text-2xl font-bold text-primary/70">
                  {selectedTemplate.name}
                </span>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div>
                <h4 className="font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.technologies.map(tech => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Category:</div>
                  <div className="font-medium capitalize">{selectedTemplate.category}</div>
                  
                  <div>Author:</div>
                  <div className="font-medium">{selectedTemplate.author}</div>
                  
                  <div>Stars:</div>
                  <div className="font-medium flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
                    {selectedTemplate.stars}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Getting Started</h4>
                {selectedTemplate.githubUrl && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedTemplate.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <Github className="h-3.5 w-3.5" /> GitHub
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopyDeployCommand}>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy Clone Command
                    </Button>
                  </div>
                )}
                
                {selectedTemplate.vercelDeployUrl && (
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedTemplate.vercelDeployUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <img src="/vercel-icon.svg" alt="Vercel" className="h-3.5 w-3.5" /> Deploy to Vercel
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button asChild>
                <a href={selectedTemplate.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <Play className="h-3.5 w-3.5" /> Live Demo
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Import missing components
import { Globe, Smartphone, Users, ShoppingCart, Briefcase } from 'lucide-react';