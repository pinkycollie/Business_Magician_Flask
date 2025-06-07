
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface VRClientProfileProps {
  client: {
    id: string;
    name: string;
    caseStatus: string;
    currentMilestone: string;
    progress: number;
    estimatedCost: number;
    serviceCategory: string;
  };
}

export function VRClientProfile({ client }: VRClientProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {client.name}
          <Badge variant={client.caseStatus === 'active' ? 'default' : 'secondary'}>
            {client.caseStatus}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Current Milestone</label>
          <p>{client.currentMilestone}</p>
          <Progress value={client.progress} className="mt-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Service Category</label>
            <p className="text-sm">{client.serviceCategory}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Estimated Cost</label>
            <p className="text-sm font-semibold">${client.estimatedCost.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
