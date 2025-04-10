#!/usr/bin/env node

// Database migration script for production environments
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Check for database URL
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set.');
  console.error('Set this variable before running migrations.');
  process.exit(1);
}

// Create migrations directory if it doesn't exist
const migrationsDir = path.join(rootDir, 'migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
  console.log('Created migrations directory.');
}

// Main function to run migrations
async function runMigrations() {
  try {
    console.log('Generating migration files...');
    execSync('npm run db:generate', {
      stdio: 'inherit',
      cwd: rootDir,
      env: process.env
    });
    
    console.log('Applying migrations to database...');
    execSync('npm run db:push', {
      stdio: 'inherit',
      cwd: rootDir,
      env: process.env
    });
    
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migrations
runMigrations().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});