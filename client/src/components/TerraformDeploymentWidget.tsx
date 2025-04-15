import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Cloud, Server, Database, Globe, ShieldCheck, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Blueprint types
type CloudProvider = 'aws' | 'gcp' | 'azure';
type BlueprintType = 'webapp' | 'ecommerce' | 'api' | 'database';
type ResourceTier = 'starter' | 'business' | 'enterprise';

// Blueprint templates with details for each provider
const blueprintTemplates = {
  aws: {
    webapp: {
      name: "Web Application",
      description: "Deploy a scalable web app with AWS Amplify, S3, and CloudFront",
      services: ["Amplify", "S3", "CloudFront", "Lambda"],
      icon: <Globe className="h-6 w-6" />
    },
    ecommerce: {
      name: "E-Commerce Platform",
      description: "Full e-commerce stack with product catalog and payment processing",
      services: ["EC2", "RDS", "ElastiCache", "S3", "SES"],
      icon: <Globe className="h-6 w-6" />
    },
    api: {
      name: "API Backend",
      description: "Scalable API with API Gateway, Lambda, and DynamoDB",
      services: ["API Gateway", "Lambda", "DynamoDB"],
      icon: <Server className="h-6 w-6" />
    },
    database: {
      name: "Database Cluster",
      description: "Managed PostgreSQL database with automatic backups",
      services: ["RDS", "S3"],
      icon: <Database className="h-6 w-6" />
    }
  },
  gcp: {
    webapp: {
      name: "Web Application",
      description: "Deploy a web app with Cloud Run and Firebase Hosting",
      services: ["Cloud Run", "Cloud Storage", "Firebase Hosting"],
      icon: <Globe className="h-6 w-6" />
    },
    ecommerce: {
      name: "E-Commerce Platform",
      description: "Full e-commerce stack with managed services",
      services: ["GKE", "Cloud SQL", "Memorystore", "Cloud Storage"],
      icon: <Globe className="h-6 w-6" />
    },
    api: {
      name: "API Backend",
      description: "Scalable API with Cloud Functions and Firestore",
      services: ["Cloud Functions", "API Gateway", "Firestore"],
      icon: <Server className="h-6 w-6" />
    },
    database: {
      name: "Database Cluster",
      description: "Managed Cloud SQL database with automatic backups",
      services: ["Cloud SQL", "Cloud Storage"],
      icon: <Database className="h-6 w-6" />
    }
  },
  azure: {
    webapp: {
      name: "Web Application",
      description: "Deploy a web app with Azure App Service and Storage",
      services: ["App Service", "Storage", "CDN"],
      icon: <Globe className="h-6 w-6" />
    },
    ecommerce: {
      name: "E-Commerce Platform",
      description: "Full e-commerce stack with managed services",
      services: ["AKS", "Azure SQL", "Redis Cache", "Storage"],
      icon: <Globe className="h-6 w-6" />
    },
    api: {
      name: "API Backend",
      description: "Scalable API with Azure Functions and Cosmos DB",
      services: ["Functions", "API Management", "Cosmos DB"],
      icon: <Server className="h-6 w-6" />
    },
    database: {
      name: "Database Cluster",
      description: "Managed Azure SQL database with automatic backups",
      services: ["Azure SQL", "Storage"],
      icon: <Database className="h-6 w-6" />
    }
  }
};

// Pricing tiers
const resourceTiers = {
  starter: {
    name: "Starter",
    description: "Perfect for small projects and testing",
    estimatedCost: "$10-20/month",
    features: ["Low-cost resources", "Suitable for testing", "Manual scaling"]
  },
  business: {
    name: "Business",
    description: "Reliable setup for growing businesses",
    estimatedCost: "$50-100/month",
    features: ["Moderate resource sizes", "High availability", "Basic auto-scaling"]
  },
  enterprise: {
    name: "Enterprise",
    description: "High-performance, scalable infrastructure",
    estimatedCost: "$200+/month",
    features: ["High-performance resources", "Multi-region deployment", "Advanced auto-scaling"]
  }
};

export default function TerraformDeploymentWidget() {
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>('gcp');
  const [blueprintType, setBlueprintType] = useState<BlueprintType>('webapp');
  const [resourceTier, setResourceTier] = useState<ResourceTier>('starter');
  const [deploymentName, setDeploymentName] = useState('my-business-app');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deploymentMessage, setDeploymentMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Get the selected blueprint details
  const selectedBlueprint = blueprintTemplates[cloudProvider][blueprintType];
  const selectedTier = resourceTiers[resourceTier];

  // Handle the deployment
  const handleDeploy = async () => {
    if (!acceptTerms) {
      setDeploymentStatus('error');
      setDeploymentMessage('Please accept the terms and conditions before deploying.');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('deploying');
    setDeploymentMessage('Initializing deployment...');

    try {
      // In a real application, this would call your API
      // For now, we'll simulate an API call with a delay
      setTimeout(async () => {
        try {
          // This is where we'd make the actual API call in a real app
          // const response = await apiRequest('POST', '/api/terraform/deploy', {
          //   provider: cloudProvider,
          //   blueprint: blueprintType,
          //   tier: resourceTier,
          //   name: deploymentName
          // });
          
          // Simulate success
          setDeploymentStatus('success');
          setDeploymentMessage('Your infrastructure has been successfully deployed! Check your email for access details.');
        } catch (error) {
          setDeploymentStatus('error');
          setDeploymentMessage('Deployment failed. Please try again or contact support.');
        } finally {
          setIsDeploying(false);
        }
      }, 3000);
    } catch (error) {
      setDeploymentStatus('error');
      setDeploymentMessage('Failed to start deployment. Please check your connection and try again.');
      setIsDeploying(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Cloud className="h-6 w-6" />
              One-Click Infrastructure Deployment
            </CardTitle>
            <CardDescription>
              Set up your business infrastructure in minutes with ready-to-use blueprints
            </CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Powered by Terraform
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {deploymentStatus === 'success' ? (
          <Alert className="bg-green-50 border-green-200">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Deployment Successful!</AlertTitle>
            <AlertDescription className="text-green-700">
              {deploymentMessage}
            </AlertDescription>
            <Button 
              className="mt-4 bg-green-600 hover:bg-green-700 text-white" 
              onClick={() => setDeploymentStatus('idle')}
            >
              Start Another Deployment
            </Button>
          </Alert>
        ) : deploymentStatus === 'error' ? (
          <Alert className="bg-red-50 border-red-200">
            <ShieldCheck className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800">Deployment Failed</AlertTitle>
            <AlertDescription className="text-red-700">
              {deploymentMessage}
            </AlertDescription>
            <Button 
              className="mt-4 bg-red-600 hover:bg-red-700 text-white" 
              onClick={() => setDeploymentStatus('idle')}
            >
              Try Again
            </Button>
          </Alert>
        ) : (
          <Tabs defaultValue="configure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configure">Configure</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="configure" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cloud-provider">Cloud Provider</Label>
                    <Select
                      defaultValue={cloudProvider}
                      onValueChange={(value: CloudProvider) => setCloudProvider(value)}
                    >
                      <SelectTrigger id="cloud-provider">
                        <SelectValue placeholder="Select a cloud provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                        <SelectItem value="aws">Amazon Web Services</SelectItem>
                        <SelectItem value="azure">Microsoft Azure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="blueprint-type">Blueprint Type</Label>
                    <Select
                      defaultValue={blueprintType}
                      onValueChange={(value: BlueprintType) => setBlueprintType(value)}
                    >
                      <SelectTrigger id="blueprint-type">
                        <SelectValue placeholder="Select a blueprint type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webapp">Web Application</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce Platform</SelectItem>
                        <SelectItem value="api">API Backend</SelectItem>
                        <SelectItem value="database">Database Cluster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="resource-tier">Resource Tier</Label>
                    <Select
                      defaultValue={resourceTier}
                      onValueChange={(value: ResourceTier) => setResourceTier(value)}
                    >
                      <SelectTrigger id="resource-tier">
                        <SelectValue placeholder="Select a resource tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg flex items-center gap-2 mb-2">
                    {selectedBlueprint.icon}
                    {selectedBlueprint.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedBlueprint.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Cloud Services:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedBlueprint.services.map((service, i) => (
                          <Badge key={i} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Resource Tier:</span>
                      <p className="text-sm">{selectedTier.name} - {selectedTier.estimatedCost}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Features:</span>
                      <ul className="text-sm mt-1 list-disc pl-5 space-y-1">
                        {selectedTier.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4 pt-4">
              <div className="bg-black rounded-lg p-4 text-green-400 font-mono text-sm whitespace-pre overflow-auto h-64">
{`# Terraform Configuration Preview
# ${cloudProvider.toUpperCase()} ${blueprintType} Blueprint - ${resourceTier} Tier

provider "${cloudProvider}" {
  # Provider configuration will be populated automatically
}

resource "${cloudProvider}_project" "main" {
  name = "${deploymentName}"
  # Additional project settings
}

# Network configuration
resource "${cloudProvider}_network" "main" {
  name = "${deploymentName}-network"
  auto_create_subnetworks = false
}

# Application resources
resource "${cloudProvider}_${blueprintType === 'webapp' ? 'app_service' : blueprintType === 'api' ? 'api_gateway' : 'compute_instance'}" "main" {
  name = "${deploymentName}-app"
  # Service-specific configuration
  tier = "${resourceTier}"
  # Additional settings
}

# Storage resources
resource "${cloudProvider}_storage" "main" {
  name = "${deploymentName}-storage"
  # Storage configuration
}

# Database (if needed)
${blueprintType === 'database' || blueprintType === 'ecommerce' ? 
`resource "${cloudProvider}_database" "main" {
  name = "${deploymentName}-db"
  engine = "postgresql"
  # Database configuration
  tier = "${resourceTier}"
}` : '# No database resources required for this blueprint'}
`}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">What happens when you deploy?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  When you run this Terraform blueprint, it will:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-2">
                  <li>Create a new project in {cloudProvider === 'gcp' ? 'Google Cloud' : cloudProvider === 'aws' ? 'AWS' : 'Azure'}</li>
                  <li>Set up all required cloud resources based on your selections</li>
                  <li>Configure networking, security, and access controls</li>
                  <li>Deploy the infrastructure according to best practices</li>
                  <li>Provide you with access credentials and endpoints</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="deploy" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deployment-name">Deployment Name</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      id="deployment-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={deploymentName}
                      onChange={(e) => setDeploymentName(e.target.value)}
                      placeholder="my-business-app"
                    />
                  </div>
                </div>
                
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTitle className="text-yellow-800">Important Information</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    <p className="mb-2">This will create real resources in your cloud account that may incur charges. Estimated cost: {selectedTier.estimatedCost}</p>
                    <p>You'll need valid cloud provider credentials configured in your account.</p>
                  </AlertDescription>
                </Alert>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I understand that this will create resources in my cloud account that may incur charges
                  </label>
                </div>
                
                <Button 
                  onClick={handleDeploy} 
                  disabled={isDeploying || !acceptTerms || !deploymentName}
                  className="w-full"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {deploymentMessage}
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      Deploy Infrastructure
                    </>
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-500 mt-2">
                  <p>Need help setting up your cloud credentials?</p>
                  <Button variant="link" className="p-0 h-auto">Watch our ASL tutorial video</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-4 gap-4">
        <div className="text-sm text-gray-500">
          Cloud-native deployment powered by Terraform
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View Documentation
          </Button>
          <Button variant="secondary" size="sm">
            Contact Support
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}