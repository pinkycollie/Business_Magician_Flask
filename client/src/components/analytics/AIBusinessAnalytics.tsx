import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, 
  BarChart2, 
  BarChart3, 
  Brain, 
  CircleDollarSign, 
  FileQuestion, 
  LineChart, 
  Loader2, 
  LucideIcon, 
  PieChart, 
  Refresh, 
  Search, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  Users,
  Zap,
  ExternalLink,
  Download,
  Info
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Sample data interfaces
interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  lastYear?: number;
}

interface ExpenseData {
  category: string;
  amount: number;
  budget: number;
  percentage: number;
}

interface CustomerData {
  segment: string;
  count: number;
  revenue: number;
  retention: number;
  change: number;
}

interface CompetitorData {
  name: string;
  marketShare: number;
  strengthScore: number;
  weaknessScore: number;
  opportunity: number;
  threat: number;
}

interface InsightItem {
  id: string;
  category: 'opportunity' | 'risk' | 'trend' | 'action';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  aiConfidence: number;
  source: string;
}

// Sample data - in a real app, this would come from API
const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 12500, target: 12000, lastYear: 10200 },
  { month: 'Feb', revenue: 14200, target: 13000, lastYear: 10800 },
  { month: 'Mar', revenue: 15800, target: 14000, lastYear: 11500 },
  { month: 'Apr', revenue: 16500, target: 15000, lastYear: 12200 },
  { month: 'May', revenue: 18000, target: 16000, lastYear: 13000 },
  { month: 'Jun', revenue: 17200, target: 17000, lastYear: 14500 },
];

const expenseData: ExpenseData[] = [
  { category: 'Marketing', amount: 3500, budget: 4000, percentage: 20.5 },
  { category: 'Technology', amount: 4200, budget: 4000, percentage: 24.6 },
  { category: 'Operations', amount: 5100, budget: 5000, percentage: 29.8 },
  { category: 'Personnel', amount: 3800, budget: 4500, percentage: 22.2 },
  { category: 'Administrative', amount: 500, budget: 600, percentage: 2.9 },
];

const customerData: CustomerData[] = [
  { segment: 'New Startups', count: 184, revenue: 28500, retention: 72, change: 8.2 },
  { segment: 'Small Business', count: 312, revenue: 63400, retention: 84, change: 5.7 },
  { segment: 'Mid-Market', count: 76, revenue: 42800, retention: 91, change: 12.4 },
  { segment: 'Enterprise', count: 14, revenue: 32100, retention: 95, change: -2.1 },
];

const competitorData: CompetitorData[] = [
  { name: 'TechSolve Inc', marketShare: 27, strengthScore: 8.2, weaknessScore: 6.4, opportunity: 7.1, threat: 8.3 },
  { name: 'DataFlow Systems', marketShare: 18, strengthScore: 7.4, weaknessScore: 5.2, opportunity: 6.8, threat: 7.2 },
  { name: 'Your Business', marketShare: 12, strengthScore: 7.8, weaknessScore: 5.8, opportunity: 8.4, threat: 6.1 },
  { name: 'InnoSolutions', marketShare: 15, strengthScore: 6.9, weaknessScore: 6.2, opportunity: 6.5, threat: 6.8 },
  { name: 'CloudServe Pro', marketShare: 21, strengthScore: 8.6, weaknessScore: 7.1, opportunity: 7.3, threat: 8.5 },
];

const insightItems: InsightItem[] = [
  {
    id: 'ins-1',
    category: 'opportunity',
    title: 'New Market Segment Identified',
    description: 'Small healthcare practices show a 23% increase in demand for your services. Consider focused marketing.',
    impact: 'high',
    timestamp: '2 days ago',
    aiConfidence: 92,
    source: 'Market data + Customer analytics'
  },
  {
    id: 'ins-2',
    category: 'risk',
    title: 'Rising Customer Acquisition Cost',
    description: 'CAC has increased 18% in the last quarter. Current growth rate may not be sustainable without addressing this trend.',
    impact: 'medium',
    timestamp: '5 days ago',
    aiConfidence: 87,
    source: 'Financial analytics'
  },
  {
    id: 'ins-3',
    category: 'trend',
    title: 'Seasonal Demand Pattern',
    description: 'Your business shows a strong Q2 seasonality. Consider inventory adjustments and marketing plans accordingly.',
    impact: 'medium',
    timestamp: '1 week ago',
    aiConfidence: 95,
    source: 'Sales data analysis'
  },
  {
    id: 'ins-4',
    category: 'action',
    title: 'Product Feature Prioritization',
    description: 'Based on customer feedback analysis, adding mobile support should be prioritized over social sharing features.',
    impact: 'high',
    timestamp: '3 days ago',
    aiConfidence: 89,
    source: 'Customer feedback + Usage data'
  },
  {
    id: 'ins-5',
    category: 'opportunity',
    title: 'Partnership Potential',
    description: 'CrossTech Solutions has complementary offerings. AI suggests exploring partnership opportunities.',
    impact: 'high',
    timestamp: '1 day ago',
    aiConfidence: 83,
    source: 'Market intelligence'
  }
];

export default function AIBusinessAnalytics() {
  const [activeTab, setActiveTab] = useState('insights');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insightCategory, setInsightCategory] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const { toast } = useToast();
  
  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate API call for refreshing data analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Your business data has been analyzed with the latest AI models.",
      });
    }, 2500);
  };
  
  const filteredInsights = insightItems.filter(insight => {
    if (insightCategory !== 'all' && insight.category !== insightCategory) {
      return false;
    }
    
    if (query && !insight.title.toLowerCase().includes(query.toLowerCase()) && 
        !insight.description.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleAskQuestion = () => {
    toast({
      title: "Question Submitted",
      description: "Your business question is being analyzed by our AI. Results will appear shortly.",
    });
  };
  
  const insightCategoryIcon = (category: string): React.ReactNode => {
    switch (category) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'risk':
        return <FileQuestion className="h-4 w-4 text-red-600" />;
      case 'trend':
        return <BarChart className="h-4 w-4 text-blue-600" />;
      case 'action':
        return <Zap className="h-4 w-4 text-amber-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const insightCategoryColor = (category: string): string => {
    switch (category) {
      case 'opportunity':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'trend':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'action':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const impactColor = (impact: string): string => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Analytics</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights for your business growth
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2" 
            onClick={handleRefreshAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Refresh className="h-4 w-4" />
            )}
            Refresh Analysis
          </Button>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Brain className="h-4 w-4" />
            Ask AI Assistant
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <PerformanceCard 
          title="Revenue Performance" 
          value="$95,400" 
          change="+12.5%" 
          description="Monthly recurring revenue" 
          icon={<CircleDollarSign className="h-5 w-5 text-green-600" />}
          trend="up"
        />
        <PerformanceCard 
          title="Customer Growth" 
          value="586" 
          change="+8.3%" 
          description="Total active customers" 
          icon={<Users className="h-5 w-5 text-blue-600" />}
          trend="up"
        />
        <PerformanceCard 
          title="Profitability" 
          value="23.7%" 
          change="-2.1%" 
          description="Profit margin" 
          icon={<PieChart className="h-5 w-5 text-amber-600" />}
          trend="down"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid md:w-full md:grid-cols-5">
          <TabsTrigger value="insights" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2">
            <CircleDollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="market" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Market Analysis
          </TabsTrigger>
          <TabsTrigger value="ask" className="gap-2">
            <Brain className="h-4 w-4" />
            Ask AI
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="insights" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-2">
            <Select value={insightCategory} onValueChange={setInsightCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Insights</SelectItem>
                <SelectItem value="opportunity">Opportunities</SelectItem>
                <SelectItem value="risk">Risks</SelectItem>
                <SelectItem value="trend">Trends</SelectItem>
                <SelectItem value="action">Recommended Actions</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search insights..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-4">
            {filteredInsights.length > 0 ? (
              filteredInsights.map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg">No insights found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance vs targets</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-80 relative">
                  {/* This would be a real chart component in production */}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/5 rounded border border-dashed">
                    <BarChart3 className="h-16 w-16 text-primary/20" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span>Current Year</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-primary/30"></div>
                  <span>Previous Year</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-primary/10 border border-primary/30"></div>
                  <span>Target</span>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Current expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseData.map(expense => (
                    <div key={expense.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{expense.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">${expense.amount}</span>
                          <span className="text-xs text-muted-foreground">({expense.percentage}%)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${expense.amount > expense.budget ? 'bg-red-500' : 'bg-primary'}`}
                          style={{ width: `${expense.amount / expense.budget * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">
                          Budget: ${expense.budget}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>AI Financial Analysis</CardTitle>
                <CardDescription>AI-generated insights about your financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Brain className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Cash Flow Prediction</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Based on your current revenue and expense patterns, our AI predicts a positive cash 
                          flow for the next quarter, with an estimated increase of 8-12% in operating capital. 
                          This will likely provide sufficient funds for your planned technology investments.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 92%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-amber-100">
                        <Brain className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Margin Optimization</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your profit margin decreased by 2.1% this quarter. AI analysis identified that
                          technology expenses are growing faster than revenue. Consider consolidating software 
                          subscriptions and renegotiating vendor contracts to optimize costs.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 87%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <Brain className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Growth Opportunity</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          The Mid-Market customer segment is showing the strongest growth with a 12.4% increase. 
                          This segment also has the highest profit margin at 32%. AI recommends reallocating 15% 
                          of your marketing budget from New Startups to Mid-Market to capitalize on this trend.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 94%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>
                  Breakdown of customer base by segment
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-80 relative">
                  {/* This would be a real chart component in production */}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/5 rounded border border-dashed">
                    <PieChart className="h-16 w-16 text-primary/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
                <CardDescription>Key performance indicators by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 bg-muted p-2 text-xs font-medium">
                    <div className="col-span-2">Segment</div>
                    <div className="text-right">Count</div>
                    <div className="text-right">Revenue</div>
                    <div className="text-right">Retention</div>
                    <div className="text-right">Change</div>
                  </div>
                  <div className="divide-y">
                    {customerData.map(segment => (
                      <div key={segment.segment} className="grid grid-cols-6 p-2 text-sm">
                        <div className="col-span-2 font-medium">{segment.segment}</div>
                        <div className="text-right">{segment.count}</div>
                        <div className="text-right">${segment.revenue.toLocaleString()}</div>
                        <div className="text-right">{segment.retention}%</div>
                        <div className={`text-right ${segment.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {segment.change >= 0 ? '+' : ''}{segment.change}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Customer Journey Analytics</CardTitle>
                <CardDescription>AI-powered insights into customer behavior and journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Brain className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Conversion Bottleneck Identified</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          AI analysis has identified a significant drop-off (42%) at the pricing page stage
                          of your customer journey. Users spend an average of 3:45 minutes on this page before
                          leaving. A/B testing different pricing structures is recommended.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 89%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <Brain className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Customer Retention Pattern</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Customers who engage with your support team within the first 14 days show a 78% 
                          higher retention rate. The AI recommends implementing a proactive outreach program
                          for new customers to schedule an initial support call.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 95%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-purple-100">
                        <Brain className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Feature Usage Analysis</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Usage data shows that your reporting feature is used by 92% of retained customers, 
                          but only 34% of customers who churned. Consider highlighting this feature during
                          onboarding and improving its visibility in your interface.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 91%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="market" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Share Analysis</CardTitle>
                <CardDescription>
                  Competitive positioning in your market
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-80 relative">
                  {/* This would be a real chart component in production */}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/5 rounded border border-dashed">
                    <PieChart className="h-16 w-16 text-primary/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
                <CardDescription>SWOT metrics for key competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="grid grid-cols-7 bg-muted p-2 text-xs font-medium">
                    <div className="col-span-3">Competitor</div>
                    <div className="text-right">Share</div>
                    <div className="text-right">Strength</div>
                    <div className="text-right">Weakness</div>
                    <div className="text-right">Threat</div>
                  </div>
                  <div className="divide-y">
                    {competitorData.map(competitor => (
                      <div 
                        key={competitor.name} 
                        className={`grid grid-cols-7 p-2 text-sm ${competitor.name === 'Your Business' ? 'bg-primary/5 font-medium' : ''}`}
                      >
                        <div className="col-span-3">{competitor.name}</div>
                        <div className="text-right">{competitor.marketShare}%</div>
                        <div className="text-right">{competitor.strengthScore}</div>
                        <div className="text-right">{competitor.weaknessScore}</div>
                        <div className="text-right">{competitor.threat}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>AI-powered market analysis and competitor intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-indigo-100">
                        <Brain className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Competitive Advantage Identified</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Our AI has analyzed 537 customer reviews across 5 competitors and found that 
                          your customer service response time (avg. 4 hours) is 68% faster than your 
                          closest competitor. Consider highlighting this in your marketing materials.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 93%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-amber-100">
                        <Brain className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Emerging Market Trend</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Social media analysis shows a 43% increase in discussions about privacy and data 
                          protection in your industry over the past 3 months. None of your top competitors 
                          are directly addressing this concern in their marketing yet.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 88%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-100 rounded-md">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-red-100">
                        <Brain className="h-5 w-5 text-red-700" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Competitive Threat Alert</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          CloudServe Pro has increased their marketing spend by an estimated 35% in the last
                          quarter and is targeting your core customer segments. They've also lowered their
                          prices by 12% on average and introduced three new features.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>AI confidence score: 85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ask" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ask AI Business Assistant</CardTitle>
              <CardDescription>
                Ask specific questions about your business data and get AI-powered answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Your Business Question</Label>
                  <Textarea 
                    id="question" 
                    placeholder="E.g. 'Which customer segment has the highest growth potential?' or 'How can I improve my profit margin?'" 
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="include-financial" />
                      <Label htmlFor="include-financial" className="text-sm">Include financial data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-customer" defaultChecked />
                      <Label htmlFor="include-customer" className="text-sm">Include customer data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-market" defaultChecked />
                      <Label htmlFor="include-market" className="text-sm">Include market data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-historical" />
                      <Label htmlFor="include-historical" className="text-sm">Include historical trends</Label>
                    </div>
                  </div>
                  <Button onClick={handleAskQuestion} className="w-full gap-2">
                    <Brain className="h-4 w-4" />
                    Analyze with AI
                  </Button>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border">
                  <h3 className="font-medium mb-2">Recent Questions</h3>
                  <ScrollArea className="h-36">
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start text-sm font-normal h-auto py-2">
                        What are my fastest growing customer segments?
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm font-normal h-auto py-2">
                        How does my customer retention compare to industry benchmarks?
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm font-normal h-auto py-2">
                        What is driving the decrease in profit margin this quarter?
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm font-normal h-auto py-2">
                        Which marketing channels have the best ROI?
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm font-normal h-auto py-2">
                        What competitive advantages should I highlight in marketing?
                      </Button>
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">AI Assistant Response</h3>
                      <p className="text-muted-foreground mb-4">
                        Ask a question above to get an AI-powered analysis of your business data. Your
                        question will be analyzed using PinkSync's advanced business intelligence models,
                        specialized for deaf entrepreneurs.
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/5">Powered by PinkSync AI</Badge>
                        <Badge variant="outline" className="bg-primary/5">ASL-aware analysis</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Performance Card Component
function PerformanceCard({ 
  title, 
  value, 
  change, 
  description, 
  icon,
  trend
}: {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center gap-1 ${
            trend === 'up' 
              ? 'text-green-600' 
              : trend === 'down' 
                ? 'text-red-600' 
                : 'text-muted-foreground'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4" />
            ) : trend === 'down' ? (
              <div className="rotate-180">
                <TrendingUp className="h-4 w-4" />
              </div>
            ) : null}
            <span>{change}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// Insight Card Component
function InsightCard({ insight }: { insight: InsightItem }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex md:flex-col items-center md:items-start gap-2">
            <div className={`p-2 rounded-full ${insightCategoryColor(insight.category)}`}>
              {insightCategoryIcon(insight.category)}
            </div>
            <Badge variant="outline" className={insightCategoryColor(insight.category)}>
              {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
            </Badge>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <h3 className="font-medium">{insight.title}</h3>
              <Badge variant="outline" className={impactColor(insight.impact)}>
                {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {insight.description}
            </p>
            
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Brain className="h-3.5 w-3.5" />
                  <span>AI Confidence: {insight.aiConfidence}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {insight.timestamp}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Share2 className="h-3.5 w-3.5 mr-1" />
                  Share
                </Button>
                <Button size="sm" className="h-8">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}