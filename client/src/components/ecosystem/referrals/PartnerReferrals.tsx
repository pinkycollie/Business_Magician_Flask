import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, CreditCard, Server, Globe, Briefcase, CheckCircle } from "lucide-react";

interface PartnerReferral {
  id: string;
  name: string;
  description: string;
  category: 'hosting' | 'services' | 'tools' | 'legal' | 'financial';
  referralUrl: string;
  discount?: string;
  commission: string;
  logoUrl: string;
  featured?: boolean;
}

const partnerReferrals: PartnerReferral[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Cloud platform for static sites and Serverless Functions',
    category: 'hosting',
    referralUrl: 'https://vercel.com/?utm_source=360magicians&utm_campaign=oss',
    discount: '10% off Pro plan first 3 months',
    commission: '$30 credit for you',
    logoUrl: '/vercel-logo.svg',
    featured: true
  },
  {
    id: 'ionos',
    name: 'IONOS',
    description: 'Web hosting, domains, and cloud solutions',
    category: 'hosting',
    referralUrl: 'https://www.ionos.com/partner/?utm_source=360magicians&utm_medium=referral',
    discount: '25% off first year hosting',
    commission: '$50 per referral',
    logoUrl: '/ionos-logo.svg'
  },
  {
    id: 'northwest',
    name: 'Northwest Registered Agent',
    description: 'Business formation and registered agent services',
    category: 'legal',
    referralUrl: 'https://www.northwestregisteredagent.com/?utm_source=360magicians&utm_medium=referral',
    discount: '$100 off LLC formation',
    commission: '$25 per formation',
    logoUrl: '/northwest-logo.svg',
    featured: true
  },
  {
    id: 'legalshield',
    name: 'LegalShield',
    description: 'Legal protection and services for businesses',
    category: 'legal',
    referralUrl: 'https://www.legalshield.com/?utm_source=360magicians&utm_medium=referral',
    discount: 'First month free',
    commission: '$15 per signup',
    logoUrl: '/legalshield-logo.svg'
  },
  {
    id: 'mbtq',
    name: 'MBTQ Tax & Insurance',
    description: 'Tax preparation and insurance services',
    category: 'financial',
    referralUrl: 'https://www.mbtq.com/?utm_source=360magicians&utm_medium=referral',
    commission: '$25 per client',
    logoUrl: '/mbtq-logo.svg'
  },
  {
    id: 'mux',
    name: 'MUX',
    description: 'Video API for developers',
    category: 'tools',
    referralUrl: 'https://mux.com/?utm_source=360magicians&utm_medium=referral',
    discount: '$20 credit for new accounts',
    commission: '$30 per referral',
    logoUrl: '/mux-logo.svg',
    featured: true
  },
  {
    id: 'liveblocks',
    name: 'Liveblocks',
    description: 'Collaboration APIs for real-time apps',
    category: 'tools',
    referralUrl: 'https://liveblocks.io/?utm_source=360magicians&utm_medium=referral',
    discount: '25% off first 3 months',
    commission: '20% of first payment',
    logoUrl: '/liveblocks-logo.svg'
  }
];

export default function PartnerReferrals() {
  const [category, setCategory] = useState<string>('all');
  const { toast } = useToast();
  
  const filteredPartners = 
    category === 'all' 
      ? partnerReferrals 
      : partnerReferrals.filter(partner => partner.category === category);
  
  const featuredPartners = partnerReferrals.filter(partner => partner.featured);
  
  const handleCopyReferral = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL Copied!',
      description: 'Partner referral link copied to clipboard',
    });
  };
  
  const categoryIcons = {
    hosting: <Globe className="h-4 w-4" />,
    services: <Briefcase className="h-4 w-4" />,
    tools: <Server className="h-4 w-4" />,
    legal: <CheckCircle className="h-4 w-4" />,
    financial: <CreditCard className="h-4 w-4" />
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Partner Ecosystem</h2>
        <p className="text-gray-600">
          Exclusive deals from our trusted partners. Use these referral links to get discounts and support our platform.
        </p>
      </div>
      
      <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Partners</TabsTrigger>
          <TabsTrigger value="hosting">Hosting</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {category === 'all' && featuredPartners.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Featured Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPartners.map(partner => (
              <Card key={partner.id} className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {/* Image placeholder - would use real partner logo */}
                      <div className="text-2xl font-bold text-primary/70">
                        {partner.name.charAt(0)}
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      Featured
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{partner.name}</CardTitle>
                  <CardDescription>{partner.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {partner.discount && (
                      <div className="text-sm">
                        <span className="font-medium">Discount:</span> {partner.discount}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium">You earn:</span> {partner.commission}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleCopyReferral(partner.referralUrl)}>
                    Copy Link
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="default" size="sm" asChild>
                          <a href={partner.referralUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            Visit <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open partner website (includes your referral)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {category === 'all' ? 'All Partners' : `${category.charAt(0).toUpperCase() + category.slice(1)} Partners`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map(partner => (
            <Card key={partner.id} className={partner.featured && category !== 'all' ? 'border-2 border-primary/20' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {/* Category icon */}
                      {categoryIcons[partner.category]}
                    </div>
                    {partner.featured && category !== 'all' && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                </div>
                <CardTitle className="mt-2">{partner.name}</CardTitle>
                <CardDescription>{partner.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {partner.discount && (
                    <div className="text-sm">
                      <span className="font-medium">Discount:</span> {partner.discount}
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="font-medium">You earn:</span> {partner.commission}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleCopyReferral(partner.referralUrl)}>
                  Copy Link
                </Button>
                <Button variant="default" size="sm" asChild>
                  <a href={partner.referralUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}