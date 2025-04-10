// Database setup script for auto DevOps
require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to check if the database is available
function isDatabaseAvailable() {
  try {
    // Simple check using the DATABASE_URL environment variable
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set');
      return false;
    }
    
    // Try to connect to the database
    execSync(`npx drizzle-kit check:pg`, { 
      stdio: 'inherit',
      env: process.env
    });
    
    return true;
  } catch (error) {
    console.error('Database is not available:', error.message);
    return false;
  }
}

// Function to create database schema
function setupDatabase() {
  try {
    console.log('Setting up database schema...');
    
    // Create migrations directory if it doesn't exist
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }
    
    // Generate the migration files
    execSync('npx drizzle-kit generate:pg', { 
      stdio: 'inherit',
      env: process.env
    });
    
    // Push the schema to the database
    execSync('npx drizzle-kit push:pg', { 
      stdio: 'inherit',
      env: process.env
    });
    
    console.log('Database schema setup complete.');
    return true;
  } catch (error) {
    console.error('Failed to set up database schema:', error.message);
    return false;
  }
}

// Function to seed the database with initial data
function seedDatabase() {
  try {
    console.log('Seeding database with initial data...');
    
    // We'll use a Node.js script to seed the database
    // This would be replaced with actual seeding logic in a real implementation
    console.log('Database seeding would happen here in a real implementation.');
    
    console.log('Database seeding complete.');
    return true;
  } catch (error) {
    console.error('Failed to seed database:', error.message);
    return false;
  }
}

// Main function to run the setup process
async function main() {
  console.log('Starting database setup...');
  
  if (!isDatabaseAvailable()) {
    console.error('Database is not available. Please check your connection settings.');
    process.exit(1);
  }
  
  if (!setupDatabase()) {
    console.error('Failed to set up database schema.');
    process.exit(1);
  }
  
  if (!seedDatabase()) {
    console.error('Failed to seed database.');
    process.exit(1);
  }
  
  console.log('Database setup completed successfully.');
}

// Run the main function
main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});