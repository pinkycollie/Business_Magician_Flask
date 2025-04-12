import React from 'react';
import { WrapifaiEmbed } from '../components/wrapifai/WrapifaiEmbed';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

/**
 * Business Tools Page
 * 
 * This page showcases the WRAPIFAI tool generator and provides
 * instructions for users to create and embed their own tools
 */
export function BusinessToolsPage() {
  const [webhookUrl, setWebhookUrl] = React.useState('https://app.360businessmagician.com/api/webhooks/wrapifai');
  const [embedId, setEmbedId] = React.useState(''); // Store user's WRAPIFAI embed ID
  
  // Example embed code that users can copy
  const getEmbedCode = () => {
    return `<!-- 360 Business Magician Tool Generator -->
<div id="tool-generator-container">
  <iframe
    src="https://app.wrapifai.com/embed/${embedId}"
    width="100%"
    height="600px"
    frameborder="0"
    title="AI Tool Generator"
    loading="lazy">
  </iframe>
</div>`;
  };
  
  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Business Tools Generator</h1>
      <p className="text-lg mb-10">
        Create custom AI-powered tools for your business and embed them on your website to engage customers and generate leads.
      </p>
      
      <Tabs defaultValue="creator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creator">Tool Creator</TabsTrigger>
          <TabsTrigger value="embed">Embed Your Tool</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="creator" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Your AI Tool</CardTitle>
              <CardDescription>
                Use the WRAPIFAI tool generator to create custom AI-powered tools for your business.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Embed the WRAPIFAI tool generator */}
              <WrapifaiEmbed 
                embedId="default" 
                height="650px" 
                className="border border-gray-200 rounded-lg"
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground mb-2">
                After creating your tool, you'll receive an embed ID that you can use to add it to your website.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="embed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Embed Your Tool</CardTitle>
              <CardDescription>
                Add your custom AI tool to your website to engage visitors and generate leads.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="embedId" className="block text-sm font-medium mb-2">
                  Your WRAPIFAI Embed ID
                </label>
                <div className="flex gap-2">
                  <Input 
                    id="embedId"
                    value={embedId}
                    onChange={(e) => setEmbedId(e.target.value)}
                    placeholder="Enter your WRAPIFAI embed ID"
                    className="flex-1"
                  />
                </div>
              </div>
              
              {embedId && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Your Embed Code
                  </label>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {getEmbedCode()}
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(getEmbedCode())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {embedId && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Preview Your Tool</h3>
                  <div className="border border-gray-200 rounded-lg p-1 bg-white">
                    <WrapifaiEmbed 
                      embedId={embedId} 
                      height="450px" 
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhook" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Integration</CardTitle>
              <CardDescription>
                Receive real-time notifications when users interact with your tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="webhookUrl" className="block text-sm font-medium mb-2">
                  Your Webhook URL
                </label>
                <div className="flex gap-2">
                  <Input 
                    id="webhookUrl"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(webhookUrl)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Copy this URL and add it in the WRAPIFAI tool settings to receive events when users interact with your tool.
                </p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Event Types</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>tool_created</strong> - Fired when you create a new tool</li>
                  <li><strong>tool_used</strong> - Fired when a user uses your tool</li>
                  <li><strong>lead_captured</strong> - Fired when a user submits their email</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Example Webhook Payload</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "event": "lead_captured",
  "timestamp": "2025-04-12T15:32:10Z",
  "toolId": "abc123",
  "userId": "user@example.com",
  "data": {
    "email": "user@example.com",
    "toolName": "Business Idea Generator",
    "inputs": {
      "interests": "technology, education",
      "marketSize": "small business"
    }
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BusinessToolsPage;