import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, Check, X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SEOMetric = {
  name: string;
  score: number;
  description: string;
  status: 'good' | 'warning' | 'bad';
  tips: string[];
};

export default function SEOOptimizationWidget() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SEOMetric[] | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  
  // Simple analysis that doesn't need API keys
  const analyzeSEO = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      // Demo data - in real app, this would come from API
      const demoResults: SEOMetric[] = [
        {
          name: 'Keyword in Title',
          score: 85,
          description: 'Your main keyword should appear in your page title',
          status: 'good',
          tips: [
            'Keep title under 60 characters',
            'Put important keywords at the beginning'
          ]
        },
        {
          name: 'Keyword in Headers',
          score: 65,
          description: 'Use your keyword in H1, H2, or H3 tags',
          status: 'warning',
          tips: [
            'Include keyword in at least one main heading',
            'Use related keywords in subheadings'
          ]
        },
        {
          name: 'Content Length',
          score: 70,
          description: 'Pages with more content often rank better',
          status: 'warning',
          tips: [
            'Aim for at least 300 words on important pages',
            'Focus on quality and relevance, not just length'
          ]
        },
        {
          name: 'Image Optimization',
          score: 40,
          description: 'Images should have alt text with keywords',
          status: 'bad',
          tips: [
            'Add descriptive alt text to all images',
            'Include your keyword in at least one image alt text',
            'Compress images to improve page speed'
          ]
        },
        {
          name: 'Mobile Friendly',
          score: 90,
          description: 'Your site should work well on mobile devices',
          status: 'good',
          tips: [
            'Test your site on multiple devices',
            'Ensure text is readable without zooming'
          ]
        }
      ];
      
      // Calculate overall score
      const calculatedScore = Math.round(
        demoResults.reduce((sum, item) => sum + item.score, 0) / demoResults.length
      );
      
      setResults(demoResults);
      setOverallScore(calculatedScore);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  const getStatusColor = (status: 'good' | 'warning' | 'bad') => {
    switch(status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'bad': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };
  
  const getStatusIcon = (status: 'good' | 'warning' | 'bad') => {
    switch(status) {
      case 'good': return <Check className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'bad': return <X className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Search className="h-6 w-6" />
          SEO Optimization Helper
        </CardTitle>
        <CardDescription>
          Improve your website's visibility with simple SEO checks and tips
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyze">Analyze Your Website</TabsTrigger>
            <TabsTrigger value="tips">SEO Quick Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyze" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="website-url">Your Website URL</Label>
                <Input 
                  id="website-url" 
                  placeholder="https://www.yourbusiness.com" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="main-keyword">Main Keyword</Label>
                <Input 
                  id="main-keyword" 
                  placeholder="e.g. deaf-owned coffee shop" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={analyzeSEO}
                disabled={!url || !keyword || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : "Analyze SEO"}
              </Button>
            </div>
            
            {results && (
              <div className="mt-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Overall SEO Score</h3>
                  <div className="mt-2 flex flex-col items-center gap-2">
                    <Progress value={overallScore} className="w-full h-3" />
                    <span className="text-2xl font-bold">{overallScore}/100</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Detailed Analysis</h3>
                  
                  {results.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          {getStatusIcon(metric.status)}
                          {metric.name}
                        </h4>
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.score}/100
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                      
                      {metric.tips.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Tips to improve:</p>
                          <ul className="text-sm list-disc pl-5 space-y-1">
                            {metric.tips.map((tip, tipIndex) => (
                              <li key={tipIndex}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">SEO Basics for Small Business Owners</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Search Engine Optimization doesn't have to be complicated. Here are simple steps anyone can take:
                </p>
                
                <ul className="space-y-3">
                  <li className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-medium">1. Use clear, descriptive page titles</h4>
                    <p className="text-sm text-gray-600">Every page should have a unique title that includes your main keyword.</p>
                  </li>
                  
                  <li className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-medium">2. Create helpful, original content</h4>
                    <p className="text-sm text-gray-600">Write for your customers first, not search engines. Answer their questions.</p>
                  </li>
                  
                  <li className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-medium">3. Use headers to organize your content</h4>
                    <p className="text-sm text-gray-600">Break up text with H2 and H3 headers that include relevant keywords.</p>
                  </li>
                  
                  <li className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-medium">4. Make your site mobile-friendly</h4>
                    <p className="text-sm text-gray-600">Most people search on phones now. Test your site on mobile devices.</p>
                  </li>
                  
                  <li className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-medium">5. Get listed in local directories</h4>
                    <p className="text-sm text-gray-600">Add your business to Google Business Profile and other local directories.</p>
                  </li>
                  
                  <li className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-medium">6. Improve your site's loading speed</h4>
                    <p className="text-sm text-gray-600">Compress images and minimize unnecessary scripts to make your site faster.</p>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Want a free personalized SEO plan?</h3>
                <div className="space-y-3">
                  <Textarea placeholder="Describe your business in a few sentences..." className="min-h-[100px]" />
                  <Button className="w-full">Generate SEO Plan</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-gray-500">Updated April 2025</p>
        <Button variant="ghost" size="sm">
          Watch ASL Tutorial
        </Button>
      </CardFooter>
    </Card>
  );
}