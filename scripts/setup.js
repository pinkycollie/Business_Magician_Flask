#!/usr/bin/env node

// Project setup script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main function to run the setup process
async function main() {
  console.log('🧙‍♂️ 360 Business Magician - Project Setup');
  console.log('=========================================');
  
  // Check if .env file exists
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('Creating .env file from template...');
    fs.copyFileSync(path.join(rootDir, '.env.example'), envPath);
    console.log('✅ Created .env file. Please update it with your values.');
  }
  
  // Install dependencies
  console.log('Installing dependencies...');
  try {
    execSync('npm ci', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Dependencies installed.');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
  
  // Check for required environment variables
  console.log('Checking environment configuration...');
  const requiredEnvVars = [
    'DATABASE_URL',
  ];
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingVars = requiredEnvVars.filter(varName => {
    const pattern = new RegExp(`${varName}=(.+)`);
    const match = envContent.match(pattern);
    return !match || match[1].includes('your-') || match[1].includes('localhost');
  });
  
  if (missingVars.length > 0) {
    console.warn('⚠️ The following environment variables need to be configured:');
    missingVars.forEach(varName => console.warn(`  - ${varName}`));
    console.warn('Please update these in your .env file.');
  }
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(rootDir, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created.');
  }
  
  // Prompt for database setup
  rl.question('Do you want to set up the database now? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('Setting up database...');
      try {
        execSync('npm run db:migrate', { stdio: 'inherit', cwd: rootDir });
        console.log('✅ Database setup complete.');
      } catch (error) {
        console.error('❌ Database setup failed:', error.message);
      }
    }
    
    console.log('');
    console.log('🎉 Setup complete! You can now start the development server:');
    console.log('   npm run dev');
    
    rl.close();
  });
}

// Run the main function
main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});