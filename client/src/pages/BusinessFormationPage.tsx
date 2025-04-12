import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Building, 
  FileText, 
  ChevronRight, 
  AlertCircle,
  Building2,
  Landmark
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
      } catch (err) {
        console.error('Failed to fetch business formation providers:', err);
        setError('Failed to load business formation providers. Please try again later.');
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

  // Error state
  if (error) {
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

  // No providers available
  if (providers.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Business Formation</CardTitle>
            <CardDescription>
              Form your business entity with trusted providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Providers Available</AlertTitle>
              <AlertDescription>
                There are currently no business formation providers configured. 
                Please contact support to set up integration with business formation services.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Business Formation Services</h1>
        <p className="text-lg mb-10">
          Form your business entity with our trusted partners. We provide seamless integration with top business formation providers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">LLC, Corporation, and Partnership filings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">All 50 states supported</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
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
          <h2 className="text-xl font-bold mb-4">Business Formation Process</h2>
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
        
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Business Tools
          </Button>
        </div>
      </div>
    </div>
  );
}