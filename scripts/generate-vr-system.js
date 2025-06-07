#!/usr/bin/env node

/**
 * VR Business Specialist System Generator
 * Automated setup script for complete VR tracking and management system
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// VR Service Categories from your cost analysis
const VR_SERVICE_CATEGORIES = [
  { name: 'Exploration & Concept Development', minCost: 122, maxCost: 551, weeks: 4 },
  { name: 'Feasibility Studies', minCost: 151, maxCost: 551, weeks: 4 },
  { name: 'Business Planning', minCost: 1286, maxCost: 1780, weeks: 4 },
  { name: 'Self-Employment Services Plan', minCost: 151, maxCost: 151, weeks: 4 },
  { name: 'Supported Start-Up', minCost: 2021, maxCost: 2021, weeks: 4 },
  { name: 'Business Maintenance', minCost: 1011, maxCost: 1011, weeks: 8 },
  { name: 'Business Stability', minCost: 1511, maxCost: 1511, weeks: 8 },
  { name: 'Service Closure', minCost: 3023, maxCost: 3023, weeks: 12 }
];

// Business milestones from your process checklist
const VR_MILESTONES = [
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

class VRSystemGenerator {
  constructor() {
    this.baseDir = process.cwd();
    this.templatesDir = path.join(this.baseDir, 'templates');
    this.outputDir = path.join(this.baseDir, 'generated-vr-system');
  }

  async generateCompleteSystem() {
    console.log('🎯 Generating VR Business Specialist System...');
    
    // Create output directory
    this.ensureDirectoryExists(this.outputDir);
    
    // Generate database schema
    await this.generateDatabaseSchema();
    
    // Generate API routes
    await this.generateAPIRoutes();
    
    // Generate React components
    await this.generateReactComponents();
    
    // Generate HTMX views
    await this.generateHTMXViews();
    
    // Generate configuration files
    await this.generateConfigFiles();
    
    // Generate documentation
    await this.generateDocumentation();
    
    console.log('✅ VR System generation complete!');
    console.log(`📁 Generated files in: ${this.outputDir}`);
  }

  async generateDatabaseSchema() {
    console.log('📊 Generating database schema...');
    
    const schema = `
-- VR Business Specialist Database Schema
-- Generated from 360 Business Magician automation system

-- VR Clients Table
CREATE TABLE vr_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    case_status VARCHAR(50) CHECK (case_status IN ('active', 'pending', 'completed', 'suspended')) DEFAULT 'pending',
    assigned_specialist VARCHAR(255) NOT NULL,
    current_milestone VARCHAR(255),
    next_action_date DATE,
    funding_eligibility BOOLEAN DEFAULT false,
    documents_submitted BOOLEAN DEFAULT false,
    map_location TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    service_category VARCHAR(255),
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2) DEFAULT 0,
    start_date DATE DEFAULT CURRENT_DATE,
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Milestones Table
CREATE TABLE vr_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES vr_clients(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    completion_date DATE,
    estimated_timeline VARCHAR(100),
    cost_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Service Categories Table
CREATE TABLE vr_service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(255) NOT NULL UNIQUE,
    min_cost DECIMAL(10,2) NOT NULL,
    max_cost DECIMAL(10,2) NOT NULL,
    description TEXT,
    estimated_weeks INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Specialists Table
CREATE TABLE vr_specialists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    specialization VARCHAR(255),
    certification_level VARCHAR(100),
    active_cases INTEGER DEFAULT 0,
    max_cases INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Progress Logs Table
CREATE TABLE vr_progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES vr_clients(id) ON DELETE CASCADE,
    milestone VARCHAR(255),
    progress_percentage INTEGER,
    notes TEXT,
    logged_by VARCHAR(255),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert service categories
${VR_SERVICE_CATEGORIES.map(cat => 
  `INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('${cat.name}', ${cat.minCost}, ${cat.maxCost}, ${cat.weeks});`
).join('\n')}

-- Create indexes for performance
CREATE INDEX idx_vr_clients_status ON vr_clients(case_status);
CREATE INDEX idx_vr_clients_specialist ON vr_clients(assigned_specialist);
CREATE INDEX idx_vr_milestones_client ON vr_milestones(client_id);
CREATE INDEX idx_vr_progress_client ON vr_progress_logs(client_id);
`;

    fs.writeFileSync(path.join(this.outputDir, 'vr-schema.sql'), schema);
  }

  async generateAPIRoutes() {
    console.log('🔗 Generating API routes...');
    
    // Use the existing API template with VR-specific customizations
    const apiTemplate = fs.readFileSync(path.join(this.templatesDir, 'api-crud.ts.hbs'), 'utf8');
    
    // Generate VR clients API
    const vrClientsAPI = this.processTemplate(apiTemplate, {
      name: 'vr-clients',
      pascalCase: (str) => 'VRClients',
      kebabCase: (str) => 'vr-clients',
      camelCase: (str) => 'vrClients',
      titleCase: (str) => 'VR Clients',
      lowerCase: (str) => 'vr clients',
      methods: ['get', 'post', 'put', 'delete'],
      auth: true,
      validation: true,
      includes: (arr, item) => arr.includes(item),
      eq: (a, b) => a === b
    });
    
    fs.writeFileSync(path.join(this.outputDir, 'vr-clients-api.ts'), vrClientsAPI);
    
    // Generate analytics API
    const analyticsAPI = `
import { Router } from 'express';
import { storage } from '../storage';
import { requireAuth } from '../middleware/auth';

const router = Router();

// VR Analytics Dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const analytics = {
      totalClients: await storage.countVRClients(),
      activeClients: await storage.countVRClients({ status: 'active' }),
      completedClients: await storage.countVRClients({ status: 'completed' }),
      totalInvestment: await storage.getTotalVRInvestment(),
      avgCompletionTime: await storage.getAvgCompletionTime(),
      milestoneDistribution: await storage.getMilestoneDistribution(),
      specialistWorkload: await storage.getSpecialistWorkload(),
      costByCategory: await storage.getCostByCategory()
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching VR analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
`;
    
    fs.writeFileSync(path.join(this.outputDir, 'vr-analytics-api.ts'), analyticsAPI);
  }

  async generateReactComponents() {
    console.log('⚛️ Generating React components...');
    
    // Copy the VR tracking dashboard template
    const dashboardTemplate = fs.readFileSync(path.join(this.templatesDir, 'vr-tracking-dashboard.tsx.hbs'), 'utf8');
    fs.writeFileSync(path.join(this.outputDir, 'VRTrackingDashboard.tsx'), dashboardTemplate);
    
    // Generate client profile component
    const clientProfileComponent = `
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
            <p className="text-sm font-semibold">$\{client.estimatedCost.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
`;
    
    fs.writeFileSync(path.join(this.outputDir, 'VRClientProfile.tsx'), clientProfileComponent);
  }

  async generateHTMXViews() {
    console.log('🌐 Generating HTMX views...');
    
    const vrDashboardView = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VR Business Specialist Dashboard</title>
    <script src="https://unpkg.com/htmx.org@1.9.12"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold mb-6">VR Business Specialist Dashboard</h1>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold">Active Cases</h3>
                <p class="text-2xl font-bold text-blue-600" hx-get="/api/vr/analytics/active-count" hx-trigger="load">-</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold">Total Investment</h3>
                <p class="text-2xl font-bold text-green-600" hx-get="/api/vr/analytics/total-investment" hx-trigger="load">-</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold">Success Rate</h3>
                <p class="text-2xl font-bold text-purple-600">87%</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold">Avg Timeline</h3>
                <p class="text-2xl font-bold text-orange-600">42 weeks</p>
            </div>
        </div>
        
        <!-- Client List -->
        <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Client Cases</h2>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add New Client
                    </button>
                </div>
            </div>
            <div hx-get="/api/vr/clients" hx-trigger="load" hx-target="#client-list">
                <div id="client-list" class="p-6">
                    Loading clients...
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
    
    fs.writeFileSync(path.join(this.outputDir, 'vr-dashboard.html'), vrDashboardView);
  }

  async generateConfigFiles() {
    console.log('⚙️ Generating configuration files...');
    
    // Environment configuration
    const envTemplate = `
# VR Business Specialist System Configuration

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vr_business_db

# Authentication
SESSION_SECRET=your-vr-session-secret-here

# External APIs
NOTION_API_KEY=your-notion-key
NOTION_VR_DATABASE_ID=your-vr-database-id

# Insurance Integration
MBTQ_INSURANCE_API_KEY=your-insurance-api-key

# Analytics
VR_ANALYTICS_ENABLED=true
VR_REPORTING_EMAIL=specialist@example.com

# Notifications
VR_EMAIL_NOTIFICATIONS=true
VR_SMS_NOTIFICATIONS=false
`;
    
    fs.writeFileSync(path.join(this.outputDir, '.env.vr-template'), envTemplate);
    
    // Docker configuration for VR system
    const dockerCompose = `
version: '3.8'
services:
  vr-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://vr_user:vr_pass@vr-postgres:5432/vr_business_db
    depends_on:
      - vr-postgres
      - vr-redis

  vr-postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=vr_business_db
      - POSTGRES_USER=vr_user
      - POSTGRES_PASSWORD=vr_pass
    volumes:
      - vr_postgres_data:/var/lib/postgresql/data
      - ./vr-schema.sql:/docker-entrypoint-initdb.d/init.sql

  vr-redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  vr_postgres_data:
`;
    
    fs.writeFileSync(path.join(this.outputDir, 'docker-compose.vr.yml'), dockerCompose);
  }

  async generateDocumentation() {
    console.log('📚 Generating documentation...');
    
    const vrDocumentation = `
# VR Business Specialist System

## Overview
Complete tracking and management system for vocational rehabilitation business cases.

## Features
- Client case management
- Milestone tracking with 52-week timeline
- Cost analysis based on standardized VR pricing
- Specialist workload management
- Progress analytics and reporting
- Integration with business formation services

## Service Categories
${VR_SERVICE_CATEGORIES.map(cat => 
  `- **${cat.name}**: $${cat.minCost} - $${cat.maxCost} (${cat.weeks} weeks)`
).join('\n')}

## Implementation Timeline
${VR_MILESTONES.map((milestone, index) => 
  `${index + 1}. ${milestone}`
).join('\n')}

## API Endpoints
- GET /api/vr/clients - List all clients
- POST /api/vr/clients - Create new client
- PUT /api/vr/clients/:id - Update client
- GET /api/vr/analytics/dashboard - Dashboard analytics
- GET /api/vr/milestones/:clientId - Client milestones

## Deployment
1. Set up environment variables from .env.vr-template
2. Run database schema: psql -f vr-schema.sql
3. Start services: docker-compose -f docker-compose.vr.yml up
4. Access dashboard at http://localhost:3000/vr-dashboard

## Integration
This system integrates with:
- 360 Business Magician platform
- MBTQ Insurance API
- Notion database for documentation
- Business formation services
`;
    
    fs.writeFileSync(path.join(this.outputDir, 'VR-SYSTEM-README.md'), vrDocumentation);
  }

  processTemplate(template, context) {
    let result = template;
    
    // Process simple variable substitutions
    Object.keys(context).forEach(key => {
      if (typeof context[key] === 'string') {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, context[key]);
      }
    });
    
    // Process helper functions
    result = result.replace(/{{(\w+) (\w+)}}/g, (match, helper, arg) => {
      if (context[helper] && typeof context[helper] === 'function') {
        return context[helper](arg);
      }
      return match;
    });
    
    return result;
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Run the generator
const generator = new VRSystemGenerator();
generator.generateCompleteSystem().catch(console.error);

export default VRSystemGenerator;