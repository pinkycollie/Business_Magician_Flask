import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ASLVideo from '@/components/asl/ASLVideo';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Code, Database, ExternalLink, Layers, Play, Server } from 'lucide-react';

// Validation schemas
const ideaValidationSchema = z.object({
  idea: z.string().min(10, "Your idea must be at least 10 characters"),
  market: z.string().min(3, "Please describe your target market"),
  constraints: z.string().optional()
});

const templateConfigSchema = z.object({
  templateType: z.enum(["e-commerce", "marketplace", "saas", "service", "job-board"], {
    required_error: "Please select a template type",
  }),
  database: z.enum(["postgres", "mongodb"], {
    required_error: "Please select a database type",
  }),
  framework: z.enum(["react", "next", "vue"], {
    required_error: "Please select a framework",
  }),
  accessibility: z.object({
    aslSupport: z.boolean().default(true),
    screenReader: z.boolean().default(true),
    highContrast: z.boolean().default(false)
  }),
  features: z.array(z.string()).min(1, "Select at least one feature")
});

export function StartupPipeline() {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("idea");
  const [ideaResult, setIdeaResult] = useState<any>(null);
  const [businessId, setBusinessId] = useState<number | null>(null);
  
  // Idea validation form
  const ideaForm = useForm<z.infer<typeof ideaValidationSchema>>({
    resolver: zodResolver(ideaValidationSchema),
    defaultValues: {
      idea: "",
      market: "",
      constraints: ""
    }
  });
  
  // Template configuration form
  const templateForm = useForm<z.infer<typeof templateConfigSchema>>({
    resolver: zodResolver(templateConfigSchema),
    defaultValues: {
      templateType: "e-commerce",
      database: "postgres",
      framework: "react",
      accessibility: {
        aslSupport: true,
        screenReader: true,
        highContrast: false
      },
      features: ["authentication"]
    }
  });
  
  // API mutations
  const validateIdeaMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ideaValidationSchema>) => {
      const constraints = data.constraints 
        ? data.constraints.split(',').map(c => c.trim()).filter(Boolean) 
        : [];
      
      return apiRequest('/api/pipeline/ideas/validate', {
        method: 'POST',
        body: JSON.stringify({
          idea: data.idea,
          market: data.market,
          constraints
        }),
      });
    },
    onSuccess: (data) => {
      setIdeaResult(data);
      if (data.valid) {
        toast({
          title: "Idea validated successfully!",
          description: "Your business idea shows promise. Consider proceeding to template configuration.",
        });
        // Automatically move to next tab after successful validation
        setTimeout(() => setCurrentTab("template"), 1500);
      } else {
        toast({
          title: "Idea needs improvement",
          description: data.feedback || "Please review the suggestions and try again.",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Validation failed",
        description: error.message || "There was an error validating your idea. Please try again.",
        variant: "destructive"
      });
      
      if (error.missingApiKey) {
        toast({
          title: "API Key Missing",
          description: "OpenAI API key is not configured. Please contact the administrator.",
          variant: "destructive"
        });
      }
    }
  });
  
  const generateTemplateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof templateConfigSchema>) => {
      return apiRequest('/api/pipeline/templates/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Template generated!",
        description: "Your startup template has been created successfully.",
      });
      // In a real app, you would probably create a business record here
      // and set the businessId for the next steps
      setBusinessId(1); // Mock business ID
      setTimeout(() => setCurrentTab("deploy"), 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Template generation failed",
        description: error.message || "There was an error generating your template. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const deployBusinessMutation = useMutation({
    mutationFn: async ({id, environment}: {id: number, environment: string}) => {
      return apiRequest(`/api/pipeline/businesses/${id}/deploy`, {
        method: 'POST',
        body: JSON.stringify({ environment }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Deployment successful!",
        description: `Your business has been deployed to ${data.environment}. Visit ${data.deploymentUrl} to see it in action.`,
      });
      setTimeout(() => setCurrentTab("lifecycle"), 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Deployment failed",
        description: error.message || "There was an error deploying your business. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const updateLifecycleMutation = useMutation({
    mutationFn: async ({id, stage}: {id: number, stage: string}) => {
      return apiRequest(`/api/pipeline/businesses/${id}/lifecycle`, {
        method: 'PATCH',
        body: JSON.stringify({ stage }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Lifecycle updated",
        description: `Your business lifecycle has been updated to ${data.business.apiData.lifecycleStage}.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/businesses/${businessId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the lifecycle stage. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Event handlers
  const handleIdeaSubmit = (data: z.infer<typeof ideaValidationSchema>) => {
    validateIdeaMutation.mutate(data);
  };
  
  const handleTemplateSubmit = (data: z.infer<typeof templateConfigSchema>) => {
    generateTemplateMutation.mutate(data);
  };
  
  const handleDeploy = (environment: "development" | "staging" | "production") => {
    if (businessId) {
      deployBusinessMutation.mutate({id: businessId, environment});
    } else {
      toast({
        title: "No business selected",
        description: "Please complete the previous steps first.",
        variant: "destructive"
      });
    }
  };
  
  const handleLifecycleUpdate = (stage: string) => {
    if (businessId) {
      updateLifecycleMutation.mutate({id: businessId, stage});
    } else {
      toast({
        title: "No business selected",
        description: "Please complete the previous steps first.",
        variant: "destructive"
      });
    }
  };
  
  // Available template features
  const availableFeatures = [
    { id: "authentication", label: "User Authentication" },
    { id: "payments", label: "Payment Integration" },
    { id: "blog", label: "Blog System" },
    { id: "admin", label: "Admin Dashboard" },
    { id: "api", label: "REST API" },
    { id: "chat", label: "Live Chat" },
    { id: "analytics", label: "Analytics Dashboard" },
    { id: "seo", label: "SEO Optimization" },
    { id: "multilingual", label: "Multilingual Support" },
    { id: "notifications", label: "Push Notifications" }
  ];

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <Card className="mb-8">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Micro-Startup Pipeline</CardTitle>
              <CardDescription>Build, deploy, and manage your startup with this step-by-step pipeline</CardDescription>
            </div>
            <ASLVideo videoUrl="/asl/startup-pipeline.mp4" title="Startup Pipeline" className="w-16 h-16" />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full rounded-none">
              <TabsTrigger value="idea">1. Idea</TabsTrigger>
              <TabsTrigger value="template">2. Template</TabsTrigger>
              <TabsTrigger value="deploy">3. Deploy</TabsTrigger>
              <TabsTrigger value="lifecycle">4. Lifecycle</TabsTrigger>
            </TabsList>
            
            {/* Idea Validation Tab */}
            <TabsContent value="idea" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Validate Your Business Idea</h3>
                  <Form {...ideaForm}>
                    <form onSubmit={ideaForm.handleSubmit(handleIdeaSubmit)} className="space-y-4">
                      <FormField
                        control={ideaForm.control}
                        name="idea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Idea</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your business idea in detail" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Be specific about what problem your business solves
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={ideaForm.control}
                        name="market"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Market</FormLabel>
                            <FormControl>
                              <Input placeholder="Who are your customers?" {...field} />
                            </FormControl>
                            <FormDescription>
                              Describe your ideal customer demographic
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={ideaForm.control}
                        name="constraints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Constraints (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Budget, time, resources, etc." 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Comma-separated list of constraints
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={validateIdeaMutation.isPending}
                      >
                        {validateIdeaMutation.isPending ? "Validating..." : "Validate Idea"}
                      </Button>
                    </form>
                  </Form>
                </div>
                
                <div className="space-y-4">
                  {validateIdeaMutation.isPending ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground mb-2">Analyzing your idea...</p>
                      <Progress value={70} className="w-full max-w-xs" />
                    </div>
                  ) : ideaResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">Analysis Results</h3>
                        {ideaResult.valid ? (
                          <Badge className="bg-green-100 text-green-800">Valid Idea</Badge>
                        ) : (
                          <Badge variant="destructive">Needs Improvement</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">Viability</div>
                          <div className="text-2xl font-bold">{ideaResult.viabilityScore}/10</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">Market</div>
                          <div className="text-2xl font-bold">{ideaResult.marketScore}/10</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">Complexity</div>
                          <div className="text-2xl font-bold">{ideaResult.complexityScore}/10</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Strengths</h4>
                        <ul className="text-sm list-disc ml-5 space-y-1">
                          {ideaResult.strengths?.map((strength: string, i: number) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Weaknesses</h4>
                        <ul className="text-sm list-disc ml-5 space-y-1">
                          {ideaResult.weaknesses?.map((weakness: string, i: number) => (
                            <li key={i}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Suggestions</h4>
                        <ul className="text-sm list-disc ml-5 space-y-1">
                          {ideaResult.suggestions?.map((suggestion: string, i: number) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {ideaResult.valid && (
                        <Button onClick={() => setCurrentTab("template")} className="w-full">
                          Continue to Template Configuration
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 rounded-lg p-8">
                      <AlertCircle className="h-12 w-12 text-slate-300 mb-2" />
                      <h3 className="text-lg font-medium text-slate-700">No Analysis Yet</h3>
                      <p className="text-sm text-center text-slate-500 max-w-xs mt-2">
                        Submit your business idea on the left to receive a detailed analysis and validation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Template Configuration Tab */}
            <TabsContent value="template" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Configure Your Startup Template</h3>
                  <Form {...templateForm}>
                    <form onSubmit={templateForm.handleSubmit(handleTemplateSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Template Type</h4>
                        <FormField
                          control={templateForm.control}
                          name="templateType"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-2 gap-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="e-commerce" id="e-commerce" />
                                    <label htmlFor="e-commerce" className="text-sm">E-commerce</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="marketplace" id="marketplace" />
                                    <label htmlFor="marketplace" className="text-sm">Marketplace</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="saas" id="saas" />
                                    <label htmlFor="saas" className="text-sm">SaaS</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="service" id="service" />
                                    <label htmlFor="service" className="text-sm">Service</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="job-board" id="job-board" />
                                    <label htmlFor="job-board" className="text-sm">Job Board</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Framework</h4>
                          <FormField
                            control={templateForm.control}
                            name="framework"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="space-y-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="react" id="react" />
                                      <label htmlFor="react" className="text-sm">React</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="next" id="next" />
                                      <label htmlFor="next" className="text-sm">Next.js</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="vue" id="vue" />
                                      <label htmlFor="vue" className="text-sm">Vue</label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Database</h4>
                          <FormField
                            control={templateForm.control}
                            name="database"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="space-y-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="postgres" id="postgres" />
                                      <label htmlFor="postgres" className="text-sm">PostgreSQL</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="mongodb" id="mongodb" />
                                      <label htmlFor="mongodb" className="text-sm">MongoDB</label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Accessibility Options</h4>
                        <FormField
                          control={templateForm.control}
                          name="accessibility.aslSupport"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>ASL Video Support</FormLabel>
                                <FormDescription>
                                  Include ASL video components
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={templateForm.control}
                          name="accessibility.screenReader"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Screen Reader Optimization</FormLabel>
                                <FormDescription>
                                  Optimize for screen readers
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={templateForm.control}
                          name="accessibility.highContrast"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>High Contrast Mode</FormLabel>
                                <FormDescription>
                                  Add high contrast theme support
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Features</h4>
                        <FormField
                          control={templateForm.control}
                          name="features"
                          render={() => (
                            <FormItem>
                              <div className="grid grid-cols-2 gap-2">
                                {availableFeatures.map((feature) => (
                                  <FormField
                                    key={feature.id}
                                    control={templateForm.control}
                                    name="features"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={feature.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(feature.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, feature.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== feature.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm">
                                            {feature.label}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={generateTemplateMutation.isPending}
                      >
                        {generateTemplateMutation.isPending ? "Generating..." : "Generate Template"}
                      </Button>
                    </form>
                  </Form>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-medium mb-4">Template Preview</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Layers className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {templateForm.watch("templateType")} Application
                          </div>
                          <div className="text-xs text-slate-500">
                            Starter template for your business
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-medium">Framework</span>
                          </div>
                          <div className="bg-slate-100 rounded px-3 py-1 text-sm inline-block">
                            {templateForm.watch("framework")}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-medium">Database</span>
                          </div>
                          <div className="bg-slate-100 rounded px-3 py-1 text-sm inline-block">
                            {templateForm.watch("database")}
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-slate-500" />
                          <span className="text-xs font-medium">Features</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {templateForm.watch("features").map((feature) => (
                            <Badge 
                              key={feature} 
                              variant="outline"
                              className="bg-slate-100"
                            >
                              {availableFeatures.find(f => f.id === feature)?.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Accessibility Features</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {templateForm.watch("accessibility.aslSupport") && (
                            <Badge variant="outline" className="bg-slate-100">ASL Support</Badge>
                          )}
                          {templateForm.watch("accessibility.screenReader") && (
                            <Badge variant="outline" className="bg-slate-100">Screen Reader</Badge>
                          )}
                          {templateForm.watch("accessibility.highContrast") && (
                            <Badge variant="outline" className="bg-slate-100">High Contrast</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">What You'll Get</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Complete project scaffolding with your selected tech stack
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Database migrations and seed data
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Authentication and user management
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Accessibility features and compliance
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        CI/CD pipeline configuration
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Documentation and code samples
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Deployment Tab */}
            <TabsContent value="deploy" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Development</CardTitle>
                    <CardDescription>Testing environment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Automatic deployments
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Debug mode enabled
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Test data included
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleDeploy("development")}
                      disabled={deployBusinessMutation.isPending}
                    >
                      {deployBusinessMutation.isPending && deployBusinessMutation.variables?.environment === "development" 
                        ? "Deploying..." 
                        : "Deploy to Development"}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Staging</CardTitle>
                    <CardDescription>Pre-production environment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Production-like setup
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Limited debug info
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Testing analytics
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleDeploy("staging")}
                      disabled={deployBusinessMutation.isPending}
                    >
                      {deployBusinessMutation.isPending && deployBusinessMutation.variables?.environment === "staging" 
                        ? "Deploying..." 
                        : "Deploy to Staging"}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Production</CardTitle>
                    <CardDescription>Live environment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Maximum performance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Full security features
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        CDN integration
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleDeploy("production")}
                      disabled={deployBusinessMutation.isPending}
                    >
                      {deployBusinessMutation.isPending && deployBusinessMutation.variables?.environment === "production" 
                        ? "Deploying..." 
                        : "Deploy to Production"}
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="col-span-1 md:col-span-3 space-y-4">
                  <h3 className="text-lg font-medium">CI/CD Pipeline</h3>
                  
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-col space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          Build
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          Test
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          Deploy
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-2 bg-green-200 rounded">
                          <div className="h-2 bg-green-500 rounded w-full"></div>
                        </div>
                        <div className="h-2 bg-green-200 rounded">
                          <div className="h-2 bg-green-500 rounded w-full"></div>
                        </div>
                        <div className="h-2 bg-green-200 rounded">
                          <div className="h-2 bg-green-500 rounded w-3/4"></div>
                        </div>
                      </div>
                      
                      <div className="pt-2 text-xs text-slate-500">
                        Your deployment pipeline is configured with GitHub Actions and ready to deploy your application to your chosen environment.
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <h4 className="text-sm font-medium mb-2">Connected Services</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2088FF]/10 flex items-center justify-center text-[#2088FF]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">GitHub</div>
                          <div className="text-xs text-slate-500">Source Control</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FF4F00]/10 flex items-center justify-center text-[#FF4F00]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.443 5.35c.639 0 1.23.05 1.773.149a8.548 8.548 0 0 1 1.613.448c.52.198.98.445 1.382.743.408.297.775.638 1.103 1.024.334.385.61.803.83 1.25.223.447.393.929.51 1.438a8.25 8.25 0 0 1 .178 1.731c0 .597-.075 1.148-.224 1.655-.149.506-.368.97-.657 1.39a4.993 4.993 0 0 1-1.09 1.131c-.435.328-.932.608-1.49.841.533.247 1.001.533 1.405.854.408.32.742.683 1.004 1.09.262.407.45.853.566 1.338.115.485.173.999.173 1.538 0 .645-.073 1.27-.222 1.88-.148.607-.384 1.16-.707 1.655a6.207 6.207 0 0 1-1.185 1.362 6.811 6.811 0 0 1-1.65.98c-.59.263-1.28.466-2.065.607-.786.142-1.636.212-2.552.212-.905 0-1.733-.07-2.485-.212a9.041 9.041 0 0 1-1.953-.597 5.748 5.748 0 0 1-1.509-.948 4.994 4.994 0 0 1-1.065-1.265c-.282-.481-.49-.995-.628-1.546-.138-.55-.208-1.13-.208-1.74 0-.505.058-.983.173-1.433a4.415 4.415 0 0 1 .564-1.313c.262-.407.595-.776 1.004-1.108a6.99 6.99 0 0 1 1.47-.889c-.532-.234-1.012-.5-1.44-.799a4.869 4.869 0 0 1-1.09-1.064 4.348 4.348 0 0 1-.684-1.367 5.728 5.728 0 0 1-.237-1.707c0-.602.069-1.16.208-1.67.138-.507.352-.959.64-1.355.294-.4.65-.743 1.07-1.029.421-.286.911-.524 1.470-.712.547-.188 1.156-.331 1.826-.425.67-.94 1.398-.141 2.183-.141zm0 12.627c-.657 0-1.261.073-1.813.224-.552.148-1.022.362-1.41.643-.383.28-.68.627-.891 1.04-.207.412-.311.883-.311 1.417 0 .467.086.882.255 1.245.17.362.42.669.743.919.327.246.725.443 1.191.586.47.142 1.004.212 1.599.212.643 0 1.224-.076 1.744-.23.519-.154.97-.368 1.348-.643.378-.275.67-.605.877-.99.208-.385.31-.8.31-1.248 0-.473-.093-.896-.282-1.267a2.868 2.868 0 0 0-.776-.95 3.568 3.568 0 0 0-1.183-.596 5.063 5.063 0 0 0-1.401-.212zm.05-9.096c-.504 0-.972.062-1.401.184a3.468 3.468 0 0 0-1.133.533 2.57 2.57 0 0 0-.768.854c-.188.336-.282.72-.282 1.153 0 .437.09.825.27 1.164.18.34.421.628.724.864.303.233.655.41 1.055.528a4.4 4.4 0 0 0 1.272.178c.483 0 .936-.065 1.36-.195a3.563 3.563 0 0 0 1.117-.559 2.718 2.718 0 0 0 .761-.874c.188-.347.282-.747.282-1.197 0-.412-.074-.783-.223-1.113a2.457 2.457 0 0 0-.627-.878 3.037 3.037 0 0 0-.99-.578 3.98 3.98 0 0 0-1.28-.212l-.137.148zM23.5 10H19V4h-2v6h-5v2h5v6h2v-6h4.5"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Google Cloud</div>
                          <div className="text-xs text-slate-500">Infrastructure</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#764ABC]/10 flex items-center justify-center text-[#764ABC]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm0,2.21A9.79,9.79,0,1,1,2.21,12,9.79,9.79,0,0,1,12,2.21Zm1.54,14.93c.67-.9,2-1.49,2.73-1.85a.41.41,0,0,0,.17-.56l-1-1.68a.42.42,0,0,0-.57-.17,11.18,11.18,0,0,0-2.7,1.82.41.41,0,0,0-.08.58l.86,1.78A.39.39,0,0,0,13.54,17.14ZM8.73,6.87a.41.41,0,0,0,.58-.11l1-1.65a.42.42,0,0,0-.1-.57C9.52,4.12,8.14,3.5,7.47,3.5A.4.4,0,0,0,7.08,4v1.92A.4.4,0,0,0,7.48,6.3,5.81,5.81,0,0,1,8.73,6.87Zm8.39,5.3c.14,0,.33-.26.43-.67a.41.41,0,0,0-.27-.51L15.41,10a.39.39,0,0,0-.51.27c-.19.72-.32,1.67-.64,2.49a.42.42,0,0,0,.21.54l1.77.83A.44.44,0,0,0,17.12,12.17ZM16.72,8.8l1.86.27A.39.39,0,0,0,19,8.81a2.5,2.5,0,0,0-1-2.24.4.4,0,0,0-.56.09l-1,1.55A.42.42,0,0,0,16.72,8.8ZM6.5,15.64a4.19,4.19,0,0,0,2.91,1.51.4.4,0,0,0,.42-.4V14.8a.4.4,0,0,0-.4-.4,5.72,5.72,0,0,1-1.74-.51.42.42,0,0,0-.54.16l-.78,1.21A.39.39,0,0,0,6.5,15.64ZM9.83,13.5a.4.4,0,0,0,.4-.4V5.5a.4.4,0,0,0-.4-.4H7.9a.4.4,0,0,0-.4.4v7.6a.4.4,0,0,0,.4.4ZM5.29,10a.39.39,0,0,0,.33.45l1.94.3a.42.42,0,0,0,.46-.32A5.42,5.42,0,0,1,8.44,9a.4.4,0,0,0-.09-.56L7,7.41a.43.43,0,0,0-.59.09A2.65,2.65,0,0,0,5.29,10Zm7.24,1.52V5.5a.4.4,0,0,0-.4-.4H10.2a.4.4,0,0,0-.4.4v6a.4.4,0,0,0,.4.4h1.93A.4.4,0,0,0,12.53,11.52Zm6.17-1a2.65,2.65,0,0,0-1.08-2.52.42.42,0,0,0-.58.09l-1.37,1a.42.42,0,0,0-.9.57,5.65,5.65,0,0,1,.42,1.43.4.4,0,0,0,.45.31l1.94-.28A.41.41,0,0,0,18.7,10.48Zm-5.77,1H15a.39.39,0,0,0,.39-.33c.3-2.2.94-2.4,1.13-2.4S16.88,9,17,9.65a.4.4,0,0,0,.45.32l1.93-.23a.4.4,0,0,0,.35-.43,2.08,2.08,0,0,0-2.4-2.35,3.33,3.33,0,0,0-3.07,2.07v-4a.41.41,0,0,0-.41-.41H12a.41.41,0,0,0-.4.41V11a.41.41,0,0,0,.4.41Z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">CircleCI</div>
                          <div className="text-xs text-slate-500">CI/CD Pipeline</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Lifecycle Management Tab */}
            <TabsContent value="lifecycle" className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-medium mb-6">Business Lifecycle Management</h3>
                  
                  <div className="relative">
                    <div className="absolute top-0 left-4 bottom-0 w-1 bg-slate-200"></div>
                    
                    <div className="space-y-8 relative">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLifecycleUpdate("idea")}
                          className="relative z-10 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center"
                        >
                          <span>1</span>
                        </button>
                        <div className="flex-1 pt-1">
                          <h4 className="text-md font-medium">Idea Phase</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Idea validation, market research, and feasibility analysis
                          </p>
                          <div className="flex mt-2">
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleLifecycleUpdate("idea")}>
                              Update Stage
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLifecycleUpdate("build")}
                          className="relative z-10 w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center"
                        >
                          <span>2</span>
                        </button>
                        <div className="flex-1 pt-1">
                          <h4 className="text-md font-medium">Build Phase</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Development, testing, and initial deployment
                          </p>
                          <div className="flex mt-2">
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleLifecycleUpdate("build")}>
                              Update Stage
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLifecycleUpdate("launch")}
                          className="relative z-10 w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center"
                        >
                          <span>3</span>
                        </button>
                        <div className="flex-1 pt-1">
                          <h4 className="text-md font-medium">Launch Phase</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Production deployment, marketing, and initial customer acquisition
                          </p>
                          <div className="flex mt-2">
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleLifecycleUpdate("launch")}>
                              Update Stage
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLifecycleUpdate("growth")}
                          className="relative z-10 w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center"
                        >
                          <span>4</span>
                        </button>
                        <div className="flex-1 pt-1">
                          <h4 className="text-md font-medium">Growth Phase</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Scaling operations, expanding market reach, and optimizing conversion
                          </p>
                          <div className="flex mt-2">
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleLifecycleUpdate("growth")}>
                              Update Stage
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLifecycleUpdate("optimization")}
                          className="relative z-10 w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center"
                        >
                          <span>5</span>
                        </button>
                        <div className="flex-1 pt-1">
                          <h4 className="text-md font-medium">Optimization Phase</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Fine-tuning processes, improving metrics, and enhancing profitability
                          </p>
                          <div className="flex mt-2">
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleLifecycleUpdate("optimization")}>
                              Update Stage
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLifecycleUpdate("exit")}
                          className="relative z-10 w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center"
                        >
                          <span>6</span>
                        </button>
                        <div className="flex-1 pt-1">
                          <h4 className="text-md font-medium">Exit Phase</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Preparing for acquisition, merger, or other exit strategies
                          </p>
                          <div className="flex mt-2">
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleLifecycleUpdate("exit")}>
                              Update Stage
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Analytics</CardTitle>
                      <CardDescription>Performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Visitors</span>
                            <span className="font-medium">4,271</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full">
                            <div className="h-2 bg-primary rounded-full w-4/5"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Conversion Rate</span>
                            <span className="font-medium">2.4%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full">
                            <div className="h-2 bg-primary rounded-full w-1/4"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Revenue</span>
                            <span className="font-medium">$3,824</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full">
                            <div className="h-2 bg-primary rounded-full w-3/5"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href="#" className="flex items-center justify-center gap-1">
                          View Full Analytics <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Growth Opportunities</CardTitle>
                      <CardDescription>Expansion options</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm">
                          <Play className="h-3 w-3 text-primary" />
                          <span>Add international shipping</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Play className="h-3 w-3 text-primary" />
                          <span>Implement loyalty program</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Play className="h-3 w-3 text-primary" />
                          <span>Expand product catalog</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Play className="h-3 w-3 text-primary" />
                          <span>Optimize mobile experience</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Play className="h-3 w-3 text-primary" />
                          <span>Add subscription model</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Generate Growth Plan
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Support Resources</CardTitle>
                      <CardDescription>Business assistance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs">VR</div>
                          <span>VR Counselor Connection</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs">SB</div>
                          <span>SBA Resources</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs">$</div>
                          <span>Funding Opportunities</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-xs">M</div>
                          <span>Mentorship Program</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Connect with Resources
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}