import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { brandColors } from '@/lib/brandKit';

// Define the structure of pricing data
interface PricingItem {
  category: string;
  costRange: string;
  description: string;
}

// Define the structure of benchmark data
interface BenchmarkItem {
  name: string;
  cost: string;
  description: string;
}

const SelfEmploymentPricing: React.FC = () => {
  // Services and pricing data
  const pricingData: PricingItem[] = [
    {
      category: "Exploration & Concept Development",
      costRange: "$122 - $551",
      description: "Customer profile, self-employment exploration, concept development (simple/comprehensive)"
    },
    {
      category: "Feasibility Studies",
      costRange: "$151 - $551",
      description: "Feasibility study for concept validation, cost assessment, viability analysis"
    },
    {
      category: "Business Planning",
      costRange: "$1,286 - $1,780",
      description: "Full business plan preparation, review services, financial forecasting"
    }
  ];

  // Benchmark data
  const benchmarkData: BenchmarkItem[] = [
    {
      name: "Benchmark 1: Self-Employment Services Plan",
      cost: "$151",
      description: "Initial self-employment service setup, business concept confirmation"
    },
    {
      name: "Benchmark 2: Supported Self-Employment Start-Up",
      cost: "$2,021",
      description: "Operational setup, regulatory compliance, tracking first 5 days of operation"
    },
    {
      name: "Benchmark 3: Supported Self-Employment Maintenance",
      cost: "$1,011",
      description: "Business monitoring for first 112 days, compliance checks, revenue tracking"
    },
    {
      name: "Benchmark 4: Supported Self-Employment Stability",
      cost: "$1,511",
      description: "Long-term business stability confirmation, financial and operational review"
    },
    {
      name: "Benchmark 5: Supported Self-Employment Service Closure",
      cost: "$3,023",
      description: "Business operation verification, proof of independent sustainability"
    }
  ];

  // Calculate total benchmark cost
  const totalBenchmarkCost = benchmarkData.reduce((total, benchmark) => {
    return total + parseFloat(benchmark.cost.replace('$', '').replace(',', ''));
  }, 0);

  return (
    <Card className="w-full border border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="text-lg font-medium">Self-Employment Services Pricing</CardTitle>
        <CardDescription>
          Estimated costs for VR-funded self-employment services
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="services">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="services">Service Pricing</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-medium">Category</TableHead>
                    <TableHead className="font-medium">Cost Range (USD)</TableHead>
                    <TableHead className="font-medium">Key Variables & Tasks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-center">{item.costRange}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                * Pricing varies based on complexity, state requirements, and individual business needs.
                Contact your VR counselor for personalized estimates.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="benchmarks">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-medium">Benchmark</TableHead>
                    <TableHead className="font-medium text-center">Cost (USD)</TableHead>
                    <TableHead className="font-medium">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benchmarkData.map((benchmark, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{benchmark.name}</TableCell>
                      <TableCell className="text-center">{benchmark.cost}</TableCell>
                      <TableCell>{benchmark.description}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50 font-medium">
                    <TableCell>Total Benchmark Cost</TableCell>
                    <TableCell className="text-center">${totalBenchmarkCost.toLocaleString()}</TableCell>
                    <TableCell>Complete self-employment support through all stages</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Important Note About VR Funding</h4>
              <p className="text-sm text-blue-700">
                Vocational Rehabilitation services are subject to financial needs assessment. Benchmark payments
                are made directly to service providers upon successful completion of each milestone. All expenses 
                must be pre-approved in the Individual Plan for Employment (IPE).
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SelfEmploymentPricing;