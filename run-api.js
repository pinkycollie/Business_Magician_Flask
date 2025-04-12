// Run the API server
import { exec } from 'child_process';

console.log('Starting the API server...');

// Run the ESM-compatible script
exec('node api-server.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Server output: ${stdout}`);
});