/**
 * Business Formation Page
 * 
 * This page allows users to form a business using services from 
 * Northwest Registered Agent through our branded interface.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building, FileText, ClipboardCheck, Map, Briefcase, HelpCircle, ExternalLink } from "lucide-react";
import { NorthwestAgentApi, EntityType, StateRequirement } from '@/lib/business-formation-api';

// List of US states
const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];

const BusinessFormationPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');
  const [activeTab, setActiveTab] = useState('services');

  // Check Northwest API status
  const { data: apiStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: [`${NorthwestAgentApi.checkStatus}`],
    queryFn: NorthwestAgentApi.checkStatus,
    enabled: true,
  });

  // Query entity types when a state is selected
  const { 
    data: entityTypesData, 
    isLoading: isEntityTypesLoading 
  } = useQuery({
    queryKey: [`${NorthwestAgentApi.getEntityTypes}`, selectedState],
    queryFn: () => NorthwestAgentApi.getEntityTypes(selectedState),
    enabled: !!selectedState && selectedState.length > 0,
  });

  // Query state requirements when a state is selected
  const { 
    data: stateRequirementsData, 
    isLoading: isRequirementsLoading 
  } = useQuery({
    queryKey: [`${NorthwestAgentApi.getStateRequirements}`, selectedState],
    queryFn: () => NorthwestAgentApi.getStateRequirements(selectedState),
    enabled: !!selectedState && selectedState.length > 0,
  });

  // Query registered agent services
  const { 
    data: agentServicesData, 
    isLoading: isServicesLoading 
  } = useQuery({
    queryKey: [`${NorthwestAgentApi.getRegisteredAgentServices}`],
    queryFn: NorthwestAgentApi.getRegisteredAgentServices,
    enabled: true,
  });

  const handleStartFormation = () => {
    if (!selectedState) {
      toast({
        title: "State Required",
        description: "Please select a state to form your business in.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEntityType) {
      toast({
        title: "Entity Type Required",
        description: "Please select a business entity type.",
        variant: "destructive",
      });
      return;
    }

    // Redirect to form page or open modal
    toast({
      title: "Starting Business Formation",
      description: `Preparing to form your ${selectedEntityType} in ${selectedState}`,
    });
    // Here you would navigate to a detailed form
  };

  const renderEntityTypes = () => {
    if (isEntityTypesLoading) {
      return <div className="flex justify-center p-8">Loading entity types...</div>;
    }

    if (!entityTypesData?.entityTypes || entityTypesData.entityTypes.length === 0) {
      return (
        <div className="p-8 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p>Please select a state to view available entity types.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {entityTypesData.entityTypes.map((entityType: EntityType) => (
          <Card 
            key={entityType.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedEntityType === entityType.id ? 'border-primary border-2' : ''
            }`}
            onClick={() => setSelectedEntityType(entityType.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{entityType.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{entityType.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Advantages:</p>
                <ul className="text-sm pl-5 list-disc space-y-1">
                  {entityType.advantages.map((advantage, i) => (
                    <li key={`adv-${i}`}>{advantage}</li>
                  ))}
                </ul>
              </div>
              
              {entityType.disadvantages.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Considerations:</p>
                  <ul className="text-sm pl-5 list-disc space-y-1">
                    {entityType.disadvantages.map((disadvantage, i) => (
                      <li key={`dis-${i}`}>{disadvantage}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedEntityType === entityType.id ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelectedEntityType(entityType.id)}
              >
                {selectedEntityType === entityType.id ? 'Selected' : 'Select'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderStateRequirements = () => {
    if (isRequirementsLoading) {
      return <div className="flex justify-center p-8">Loading state requirements...</div>;
    }

    if (!stateRequirementsData?.requirements || stateRequirementsData.requirements.length === 0) {
      return (
        <div className="p-8 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p>Please select a state to view filing requirements.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4">
        <h3 className="text-lg font-medium">Filing Requirements for {US_STATES.find(s => s.code === selectedState)?.name}</h3>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-10 px-4 text-left align-middle font-medium">Requirement</th>
                <th className="h-10 px-4 text-left align-middle font-medium">Description</th>
                <th className="h-10 px-4 text-left align-middle font-medium">Required</th>
                <th className="h-10 px-4 text-right align-middle font-medium">Fee</th>
              </tr>
            </thead>
            <tbody>
              {stateRequirementsData.requirements.map((req: StateRequirement) => (
                <tr key={req.id} className="border-b">
                  <td className="p-4 align-middle font-medium">{req.name}</td>
                  <td className="p-4 align-middle">{req.description}</td>
                  <td className="p-4 align-middle">
                    {req.isRequired ? (
                      <span className="rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs font-medium">
                        Required
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium">
                        Optional
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle text-right">
                    {req.additionalFee ? `$${req.additionalFee.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRegisteredAgentServices = () => {
    if (isServicesLoading) {
      return <div className="flex justify-center p-8">Loading registered agent services...</div>;
    }

    if (!agentServicesData?.services || agentServicesData.services.length === 0) {
      return (
        <div className="p-8 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p>No registered agent services available.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {agentServicesData.services.map((service: any) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">${service.annualFee}/year</p>
              <ul className="space-y-2">
                {service.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <ClipboardCheck className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Select Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderStateGuides = () => {
    if (!selectedState) {
      return (
        <div className="p-8 text-center">
          <Map className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p>Please select a state to view business formation guides.</p>
        </div>
      );
    }

    const stateName = US_STATES.find(s => s.code === selectedState)?.name;

    return (
      <div className="space-y-6 p-4">
        <h3 className="text-xl font-semibold">Business Formation Guide for {stateName}</h3>
        <p className="text-muted-foreground">
          Everything you need to know about forming a business in {stateName}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Registration Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn about the step-by-step process to register your business in {stateName}.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Read Guide</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Tax Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Understand the tax implications of different business structures in {stateName}.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Read Guide</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Licensing Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discover what licenses and permits your business may need in {stateName}.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Read Guide</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                {stateName} Business Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                External resources and government websites for business owners in {stateName}.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Resources</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Form Your Business Today</h1>
        <p className="text-muted-foreground mt-2">
          Professional business formation services powered by Northwest Registered Agent
        </p>
      </div>

      {isStatusLoading ? (
        <div className="flex justify-center py-8">Loading API status...</div>
      ) : !apiStatus?.configured ? (
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle className="text-orange-500">API Not Configured</CardTitle>
            <CardDescription>
              The Northwest Registered Agent API is not properly configured.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please contact support to fix this issue.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="mb-4">
              <Label htmlFor="state-select">Select State of Formation</Label>
              <Select
                value={selectedState}
                onValueChange={(value) => {
                  setSelectedState(value);
                  setSelectedEntityType('');
                }}
              >
                <SelectTrigger id="state-select">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="entity-types">Entity Types</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="state-guides">State Guides</TabsTrigger>
            </TabsList>
            <div className="mt-6 border rounded-lg">
              <TabsContent value="services" className="m-0">
                {renderRegisteredAgentServices()}
              </TabsContent>
              <TabsContent value="entity-types" className="m-0">
                {renderEntityTypes()}
              </TabsContent>
              <TabsContent value="requirements" className="m-0">
                {renderStateRequirements()}
              </TabsContent>
              <TabsContent value="state-guides" className="m-0">
                {renderStateGuides()}
              </TabsContent>
            </div>
          </Tabs>

          <div className="max-w-xs mx-auto mt-8">
            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleStartFormation}
              disabled={!selectedState || !selectedEntityType}
            >
              Start Business Formation
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessFormationPage;