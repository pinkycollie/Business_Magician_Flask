import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { MapPin, Calendar, FileText, Users, DollarSign, TrendingUp } from 'lucide-react';

interface VRClient {
  id: string;
  name: string;
  caseStatus: 'active' | 'pending' | 'completed' | 'suspended';
  assignedSpecialist: string;
  currentMilestone: string;
  nextActionDate: string;
  fundingEligibility: boolean;
  documentsSubmitted: boolean;
  mapLocation: string;
  progress: number;
  serviceCategory: string;
  estimatedCost: number;
}

export function VRTrackingDashboard() {
  const [clients, setClients] = useState<VRClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<VRClient | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Service categories from your cost analysis
  const serviceCategories = [
    { name: 'Exploration & Concept Development', cost: '$122 - $551' },
    { name: 'Feasibility Studies', cost: '$151 - $551' },
    { name: 'Business Planning', cost: '$1,286 - $1,780' },
    { name: 'Self-Employment Services Plan', cost: '$151' },
    { name: 'Supported Start-Up', cost: '$2,021' },
    { name: 'Business Maintenance', cost: '$1,011' },
    { name: 'Business Stability', cost: '$1,511' },
    { name: 'Service Closure', cost: '$3,023' }
  ];

  // Business milestones from your process checklist
  const milestones = [
    'VR Assessment Complete',
    'Concept Development & Feasibility',
    'Business Plan Development',
    'Financial Planning',
    'Services Plan Completion',
    'Business Start-Up (5 days)',
    'Business Maintenance (112 days)',
    'Business Stability (168 days)',
    'Service Closure (90 days)'
  ];

  const filteredClients = clients.filter(client => {
    const matchesFilter = filter === 'all' || client.caseStatus === filter;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.assignedSpecialist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalCosts = () => {
    return clients.reduce((total, client) => total + client.estimatedCost, 0);
  };

  const getActiveClients = () => {
    return clients.filter(client => client.caseStatus === 'active').length;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">VR Business Specialist Dashboard</h1>
          <p className="text-gray-600">Track and manage vocational rehabilitation business cases</p>
        </div>
        <Button onClick={() => {/* Add new client logic */}}>
          Add New Client
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold">{getActiveClients()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Investment</p>
                <p className="text-2xl font-bold">${calculateTotalCosts().toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Timeline</p>
                <p className="text-2xl font-bold">42 weeks</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search clients or specialists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'completed', 'suspended'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList>
          <TabsTrigger value="clients">Client Tracking</TabsTrigger>
          <TabsTrigger value="milestones">Milestone Analysis</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="map">Geographic View</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedClient(client)}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <p className="text-sm text-gray-600">{client.assignedSpecialist}</p>
                    </div>
                    
                    <div>
                      <Badge className={getStatusColor(client.caseStatus)}>
                        {client.caseStatus}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">{client.currentMilestone}</p>
                      <Progress value={client.progress} className="w-full mt-1" />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Next Action</p>
                      <p className="text-sm font-medium">{client.nextActionDate}</p>
                    </div>
                    
                    <div className="flex justify-center space-x-2">
                      <Badge variant={client.fundingEligibility ? 'default' : 'secondary'}>
                        {client.fundingEligibility ? 'Funded' : 'Pending'}
                      </Badge>
                      <Badge variant={client.documentsSubmitted ? 'default' : 'destructive'}>
                        {client.documentsSubmitted ? 'Docs ✓' : 'Docs ✗'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Milestone Progress Overview</CardTitle>
              <CardDescription>Track clients across the 52-week implementation timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => {
                  const clientsAtMilestone = clients.filter(c => c.currentMilestone === milestone).length;
                  return (
                    <div key={milestone} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{milestone}</span>
                      </div>
                      <Badge variant="outline">{clientsAtMilestone} clients</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Cost Analysis</CardTitle>
              <CardDescription>Based on standardized VR service pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {serviceCategories.map((category) => (
                  <div key={category.name} className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="outline">{category.cost}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Client locations and specialist coverage areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Interactive map would be displayed here</p>
                <Button className="ml-4" onClick={() => {/* Integrate Google Maps */}}>
                  Load Map View
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Detail Modal/Sidebar */}
      {selectedClient && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{selectedClient.name}</h2>
            <Button variant="ghost" onClick={() => setSelectedClient(null)}>×</Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Assigned Specialist</label>
              <p>{selectedClient.assignedSpecialist}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Current Milestone</label>
              <p>{selectedClient.currentMilestone}</p>
              <Progress value={selectedClient.progress} className="mt-2" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Service Category</label>
              <p>{selectedClient.serviceCategory}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Estimated Investment</label>
              <p className="text-lg font-semibold">${selectedClient.estimatedCost.toLocaleString()}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button className="flex-1">Update Progress</Button>
              <Button variant="outline" className="flex-1">View Documents</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VRTrackingDashboard;