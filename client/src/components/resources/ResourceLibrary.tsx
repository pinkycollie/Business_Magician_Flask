import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SiFile } from 'react-icons/si';
import { Link } from 'wouter';
import {
  FileText,
  Link as LinkIcon,
  Search,
  Filter,
  Download,
  FileVideo,
  BookOpen
} from 'lucide-react';
import type { Resource } from '@shared/schema';

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const isFile = Boolean(resource.fileUrl);
  const isExternalLink = Boolean(resource.url);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg mb-1">{resource.title}</CardTitle>
          {resource.sbaRelated && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              SBA
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3 flex-grow">
        <div className="text-sm text-muted-foreground mb-2">
          <span className="font-medium">Source:</span> {resource.source}
        </div>

        {resource.subcategory && (
          <div className="text-sm text-muted-foreground mb-2">
            <span className="font-medium">Category:</span> {resource.category} / {resource.subcategory}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mt-3">
          {resource.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {isFile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            asChild
          >
            <a href={resource.fileUrl as string} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download File
            </a>
          </Button>
        )}

        {isExternalLink && (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full" 
            asChild
          >
            <a href={resource.url as string} target="_blank" rel="noopener noreferrer">
              <LinkIcon className="mr-2 h-4 w-4" />
              Visit Resource
            </a>
          </Button>
        )}

        {!isFile && !isExternalLink && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled
          >
            <BookOpen className="mr-2 h-4 w-4" />
            No Link Available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const ResourceLibrary = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSBAOnly, setShowSBAOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['/api/resources'],
    staleTime: 60000,
  });

  const filteredResources = resources?.filter((resource: Resource) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = resource.title.toLowerCase().includes(query);
      const matchesDesc = resource.description.toLowerCase().includes(query);
      const matchesSource = resource.source.toLowerCase().includes(query);
      const matchesTags = resource.tags?.some(tag => tag.toLowerCase().includes(query));
      
      if (!(matchesTitle || matchesDesc || matchesSource || matchesTags)) {
        return false;
      }
    }
    
    // Filter by category
    if (selectedCategory && resource.category !== selectedCategory) {
      return false;
    }
    
    // Filter by SBA
    if (showSBAOnly && !resource.sbaRelated) {
      return false;
    }
    
    // Filter by resource type (tab)
    if (activeTab === 'documents' && !resource.fileUrl) {
      return false;
    }
    
    if (activeTab === 'links' && !resource.url) {
      return false;
    }
    
    return true;
  });

  // Get unique categories
  const categories = [...new Set(resources?.map((r: Resource) => r.category) || [])];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Resource Library</h2>
        <p className="text-muted-foreground">
          Access guides, templates, and tools to help with your business journey. 
          Resources marked with SBA are from the Small Business Administration.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <Select
            value={selectedCategory || ''}
            onValueChange={(value) => setSelectedCategory(value || null)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="sba-filter" 
              checked={showSBAOnly}
              onCheckedChange={setShowSBAOnly}
            />
            <Label htmlFor="sba-filter">SBA Resources Only</Label>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="links">Web Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">Loading resources...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading resources. Please try again.
            </div>
          ) : filteredResources?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No resources found matching your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources?.map((resource: Resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">Loading resources...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading resources. Please try again.
            </div>
          ) : filteredResources?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No document resources found matching your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources?.map((resource: Resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="links" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">Loading resources...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading resources. Please try again.
            </div>
          ) : filteredResources?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No web link resources found matching your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources?.map((resource: Resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceLibrary;