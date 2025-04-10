#!/usr/bin/env node

// Vercel deployment script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.log('Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

// Check for the presence of required environment variables
const requiredEnvVars = [
  'VERCEL_TOKEN',
  'VERCEL_PROJECT_ID',
  'VERCEL_ORG_ID',
  'DATABASE_URL'
];

// Check if a .env file exists
const envPath = path.join(rootDir, '.env');
let missingVars = [];

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  missingVars = requiredEnvVars.filter(varName => {
    return !envContent.includes(`${varName}=`) && !process.env[varName];
  });
} else {
  missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
}

if (missingVars.length > 0) {
  console.error('The following environment variables are required but missing:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  console.error('Please set these variables in your .env file or environment before deploying.');
  process.exit(1);
}

// Prepare for deployment
console.log('Building for production...');
execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

// Deploy to Vercel
try {
  console.log('Deploying to Vercel...');
  
  // Use environment variables if available, otherwise try to use from .env file
  const vercelToken = process.env.VERCEL_TOKEN;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID;
  const vercelOrgId = process.env.VERCEL_ORG_ID;
  
  // Set up deployment environment
  const deployEnv = {
    ...process.env,
    VERCEL_TOKEN: vercelToken,
    VERCEL_PROJECT_ID: vercelProjectId,
    VERCEL_ORG_ID: vercelOrgId
  };
  
  // Execute deployment command
  execSync('vercel deploy --prod', { 
    stdio: 'inherit', 
    cwd: rootDir,
    env: deployEnv
  });
  
  console.log('Deployment successful!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}