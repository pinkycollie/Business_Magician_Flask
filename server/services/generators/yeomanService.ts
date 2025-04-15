import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

/**
 * YeomanService - Interface with Yeoman generators to scaffold projects
 * 
 * This service allows the application to programmatically create new projects
 * using Yeoman generators.
 */
export interface GeneratorOptions {
  generatorName: string;
  outputPath: string;
  answers: Record<string, any>;
  skipInstall?: boolean;
}

export interface GeneratorResult {
  success: boolean;
  outputPath: string;
  logs: string[];
  error?: string;
  generatedFiles?: string[];
}

class YeomanService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'yeoman-generators');
    
    // Ensure temp directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Run a Yeoman generator with specified options
   */
  public async runGenerator(options: GeneratorOptions): Promise<GeneratorResult> {
    const logs: string[] = [];
    const projectDir = path.join(this.tempDir, `${options.generatorName}-${Date.now()}`);
    
    try {
      // Create project directory
      fs.mkdirSync(projectDir, { recursive: true });
      
      // Check if generator is installed
      logs.push(`Checking if generator ${options.generatorName} is installed...`);
      try {
        await execAsync(`yo --generators`);
      } catch (error) {
        logs.push('Yeoman CLI not found. Installing Yeoman...');
        await execAsync('npm install -g yo');
      }
      
      try {
        await execAsync(`yo --generators | grep ${options.generatorName}`);
      } catch (error) {
        logs.push(`Generator ${options.generatorName} not found. Installing...`);
        await execAsync(`npm install -g generator-${options.generatorName}`);
      }
      
      // Create answers file for non-interactive mode
      const answersPath = path.join(projectDir, '.yo-rc.json');
      const answersJson = {
        [`generator-${options.generatorName}`]: options.answers
      };
      fs.writeFileSync(answersPath, JSON.stringify(answersJson, null, 2));
      
      // Run the generator
      logs.push(`Running generator ${options.generatorName}...`);
      const skipInstallFlag = options.skipInstall ? '--skip-install' : '';
      const { stdout, stderr } = await execAsync(
        `cd ${projectDir} && yo ${options.generatorName} --skip-cache ${skipInstallFlag}`,
        { timeout: 300000 } // 5 minute timeout
      );
      
      logs.push('Generator output:');
      logs.push(stdout);
      
      if (stderr) {
        logs.push('Generator errors:');
        logs.push(stderr);
      }
      
      // Copy the generated files to the output path
      if (!fs.existsSync(options.outputPath)) {
        fs.mkdirSync(options.outputPath, { recursive: true });
      }
      
      await this.copyDirectory(projectDir, options.outputPath);
      
      // Get list of generated files
      const generatedFiles = this.getFilesRecursive(options.outputPath)
        .map(file => file.replace(options.outputPath, ''));
      
      return {
        success: true,
        outputPath: options.outputPath,
        logs,
        generatedFiles
      };
    } catch (error) {
      return {
        success: false,
        outputPath: options.outputPath,
        logs,
        error: error.message || 'Unknown error occurred'
      };
    } finally {
      // Clean up temporary directory
      if (fs.existsSync(projectDir)) {
        try {
          fs.rmSync(projectDir, { recursive: true, force: true });
        } catch (error) {
          console.error('Failed to clean up temporary directory:', error);
        }
      }
    }
  }

  /**
   * Get available generators on the system
   */
  public async getAvailableGenerators(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('yo --generators');
      
      // Parse the output to extract available generators
      const generators: string[] = [];
      const lines = stdout.split('\n');
      
      let isInGeneratorsList = false;
      for (const line of lines) {
        if (line.includes('Available Generators:')) {
          isInGeneratorsList = true;
          continue;
        }
        
        if (isInGeneratorsList && line.trim()) {
          const match = line.match(/^\s*\*\s+([a-zA-Z0-9-_:]+)/);
          if (match && match[1]) {
            generators.push(match[1]);
          }
        }
      }
      
      return generators;
    } catch (error) {
      console.error('Failed to get available generators:', error);
      return [];
    }
  }

  /**
   * Get template questions for a specific generator
   */
  public async getGeneratorQuestions(generatorName: string): Promise<any> {
    try {
      // This is a more complex operation and would typically require
      // a custom approach to extract questions from a generator.
      // A simplified version would return hardcoded questions for known generators.
      
      // For now, we'll return placeholder data
      const commonQuestions = {
        name: {
          type: 'string',
          required: true,
          description: 'Project name'
        },
        description: {
          type: 'string',
          required: false,
          description: 'Project description'
        },
        version: {
          type: 'string',
          required: false,
          default: '0.1.0',
          description: 'Initial version'
        },
        author: {
          type: 'string',
          required: false,
          description: 'Author name'
        }
      };
      
      return {
        generator: generatorName,
        questions: commonQuestions
      };
    } catch (error) {
      console.error(`Failed to get questions for generator ${generatorName}:`, error);
      return {
        generator: generatorName,
        questions: {},
        error: error.message
      };
    }
  }
  
  // Helper method to recursively copy directories
  private async copyDirectory(source: string, destination: string): Promise<void> {
    const files = fs.readdirSync(source);
    
    for (const file of files) {
      if (file === 'node_modules' || file === '.git' || file === '.yo-rc.json') {
        continue;
      }
      
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);
      
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        await this.copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }
  
  // Helper method to get all files recursively in a directory
  private getFilesRecursive(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        results = results.concat(this.getFilesRecursive(filePath));
      } else {
        results.push(filePath);
      }
    }
    
    return results;
  }
}

export const yeomanService = new YeomanService();