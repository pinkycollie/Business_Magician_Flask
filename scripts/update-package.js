// Script to update package.json with new database scripts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current module's file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Current scripts
const currentScripts = packageJson.scripts || {};

// Add new database scripts
const newScripts = {
  ...currentScripts,
  "db:push": "drizzle-kit push:pg",
  "db:studio": "drizzle-kit studio", 
  "db:generate": "drizzle-kit generate:pg",
  "db:migrate": "node scripts/db-setup.js",
  "db:check": "drizzle-kit check:pg",
  "lint": "echo 'Add your linting configuration here'",
  "typecheck": "tsc --noEmit",
  "test": "echo 'Add your testing command here'"
};

// Update the package.json with new scripts
packageJson.scripts = newScripts;

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Successfully updated package.json with new database scripts');