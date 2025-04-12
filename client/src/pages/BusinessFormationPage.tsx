import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Building, 
  FileText, 
  ChevronRight, 
  AlertCircle,
  Building2,
  Landmark,
  FileCheck,
  BadgeCheck,
  Globe,
  Phone,
  Mail,
  User,
  MapPin,
  Package,
  Briefcase,
  UsersRound,
  FileCog,
  BookOpen,
  Banknote,
  Map
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Business Formation Page
 * Provides access to business formation services through multiple providers
 */
export default function BusinessFormationPage() {
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("services");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch available business formation providers
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/business-formation/providers');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setProviders(data.providers || []);
        // For testing purposes, if no providers are returned from the API, set some defaults
        if (!data.providers || data.providers.length === 0) {
          setProviders(['corporatetools', 'northwest', 'zenbusiness']);
        }
      } catch (err) {
        console.error('Failed to fetch business formation providers:', err);
        setError('Failed to load business formation providers. Please try again later.');
        // For testing/demo purposes, set default providers even if API fails
        setProviders(['corporatetools', 'northwest', 'zenbusiness']);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Map provider ID to display info
  const getProviderInfo = (providerId: string) => {
    switch (providerId) {
      case 'corporatetools':
        return {
          name: 'Corporate Tools',
          description: 'Comprehensive business formation services with easy-to-use online filing',
          icon: <Building className="h-6 w-6 text-blue-600" />,
          color: 'border-blue-200 bg-blue-50'
        };
      case 'northwest':
        return {
          name: 'Northwest Registered Agent',
          description: 'Premium registered agent services with business formation options',
          icon: <Landmark className="h-6 w-6 text-purple-600" />,
          color: 'border-purple-200 bg-purple-50'
        };
      case 'zenbusiness':
        return {
          name: 'ZenBusiness',
          description: 'Streamlined formation services with advanced compliance tools',
          icon: <Building2 className="h-6 w-6 text-green-600" />,
          color: 'border-green-200 bg-green-50'
        };
      default:
        return {
          name: providerId,
          description: 'Business formation services',
          icon: <Building className="h-6 w-6 text-gray-600" />,
          color: 'border-gray-200 bg-gray-50'
        };
    }
  };

  const handleStartFormation = (provider: string) => {
    toast({
      title: "Formation Service Selected",
      description: `You selected ${getProviderInfo(provider).name}. Redirecting to formation form.`,
    });
    // Will navigate to provider-specific form in a real implementation
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-600">Loading business formation services...</p>
        </div>
      </div>
    );
  }

  // Error state (but with default providers for demo purposes)
  if (error && providers.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Services component
  const ServicesSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-primary" />
            <CardTitle>Filing Services</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Form an LLC</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Incorporate</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Form a Nonprofit</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Stay Compliant</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Foreign Qualification</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <CardTitle>Identity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Business Identity</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Instant Domain Name</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Business Website</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Business Email</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Phone Service</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Landmark className="h-6 w-6 text-primary" />
            <CardTitle>Registered Agent</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Registered Agent Service</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Change Registered Agents</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>BOC-3 Process Agent</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>National Registered Agent</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            <CardTitle>Additional Services</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Mail Forwarding</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Virtual Office</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Trademark Service</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>EIN Service</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  // Resources component
  const ResourcesSection = () => (
    <div className="space-y-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-primary" />
              <CardTitle>Get Started</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Start a Business</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Small Business Ideas</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>LLC vs. Corporation</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Get a DBA Name</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileCog className="h-6 w-6 text-primary" />
              <CardTitle>Keep it Running</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Maintain a Business</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Certificate of Good Standing</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Apostille</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Certified Copy</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <CardTitle>Business Documents</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Legal Forms</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>LLC Operating Agreements</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Single-Member LLC Operating Agreement</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>LLC Bank Account Resolution</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Corporate Bylaws</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Certificate of Stock</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Initial Board Meeting</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Nonprofit Bylaws</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // State-by-State section
  const StateByStateSection = () => (
    <div className="space-y-8 mb-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Map className="h-6 w-6 text-primary" />
            <CardTitle>State-by-State Business Formation</CardTitle>
          </div>
          <CardDescription>
            Access detailed guides for starting a business in each U.S. state and territory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="popular-states">
              <AccordionTrigger>Popular States</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                  <Button variant="outline" className="justify-start">
                    <MapPin className="mr-2 h-4 w-4" /> Texas
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MapPin className="mr-2 h-4 w-4" /> California
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MapPin className="mr-2 h-4 w-4" /> Florida
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MapPin className="mr-2 h-4 w-4" /> New York
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MapPin className="mr-2 h-4 w-4" /> Delaware
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MapPin className="mr-2 h-4 w-4" /> Illinois
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="all-states">
              <AccordionTrigger>All States</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                  {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
                    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
                    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
                    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
                    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
                    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
                    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 
                    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
                    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 
                    'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'].map(state => (
                    <Button key={state} variant="outline" className="justify-start">
                      <MapPin className="mr-2 h-4 w-4" /> {state}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="territories">
              <AccordionTrigger>U.S. Territories</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {['Puerto Rico', 'U.S. Virgin Islands', 'Guam', 
                    'American Samoa', 'Northern Mariana Islands'].map(territory => (
                    <Button key={territory} variant="outline" className="justify-start">
                      <MapPin className="mr-2 h-4 w-4" /> {territory}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>Corporate Guides</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Our Manifesto</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Privacy by Default</span>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Live Privately with an LLC</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  // Main component render
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Business Formation Services</h1>
        <p className="text-lg text-slate-600 mb-8">
          Form your business entity with our trusted partners. We provide seamless integration with top business formation providers.
        </p>
        
        <Tabs defaultValue="services" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="services" onClick={() => setActiveTab("services")}>Services</TabsTrigger>
            <TabsTrigger value="providers" onClick={() => setActiveTab("providers")}>Formation Providers</TabsTrigger>
            <TabsTrigger value="resources" onClick={() => setActiveTab("resources")}>Resources</TabsTrigger>
            <TabsTrigger value="state-guides" onClick={() => setActiveTab("state-guides")}>State Guides</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services">
            <h2 className="text-2xl font-semibold mb-6">Available Services</h2>
            <ServicesSection />
          </TabsContent>
          
          <TabsContent value="providers">
            <h2 className="text-2xl font-semibold mb-6">Formation Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {providers.map((provider) => {
                const info = getProviderInfo(provider);
                return (
                  <Card key={provider} className={`border-2 ${info.color}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {info.icon}
                          <CardTitle>{info.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription>{info.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">LLC, Corporation, and Partnership filings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">All 50 states supported</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">Registered agent services available</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => handleStartFormation(provider)}
                      >
                        Start Formation <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            <div className="bg-slate-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Business Formation Process</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li className="text-slate-700">Select a business formation provider</li>
                <li className="text-slate-700">Choose your business entity type</li>
                <li className="text-slate-700">Provide business and owner information</li>
                <li className="text-slate-700">Select any additional services (registered agent, EIN, etc.)</li>
                <li className="text-slate-700">Review and submit your formation</li>
                <li className="text-slate-700">Track your filing status in real-time</li>
                <li className="text-slate-700">Receive your formation documents digitally</li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <h2 className="text-2xl font-semibold mb-6">Business Resources</h2>
            <ResourcesSection />
          </TabsContent>
          
          <TabsContent value="state-guides">
            <h2 className="text-2xl font-semibold mb-6">State-Specific Formation Guides</h2>
            <StateByStateSection />
          </TabsContent>
        </Tabs>
        
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
          <h2 className="text-xl font-bold mb-4">ASL Support for Business Formation</h2>
          <p className="mb-4">
            All our business formation services include ASL video support at each step of the process.
            Our dedicated ASL interpreters will guide you through the entire formation process.
          </p>
          <Button variant="outline">
            View ASL Formation Guides
          </Button>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Business Tools
          </Button>
        </div>
      </div>
    </div>
  );
}