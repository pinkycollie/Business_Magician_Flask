/**
 * AI Tool Generator Service
 * 
 * Allows users to create and customize their own AI-powered tools
 * that can be embedded on their websites and track usage via webhooks.
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Types for tool generation
export const toolTypeSchema = z.enum([
  'business_idea_generator',
  'marketing_plan_creator',
  'financial_projection_calculator',
  'accessibility_analyzer',
  'document_creator',
  'customer_profile_generator',
  'custom'
]);

export type ToolType = z.infer<typeof toolTypeSchema>;

// Tool configuration schema
export const toolConfigSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  type: toolTypeSchema,
  customInstructions: z.string().optional(),
  aiProvider: z.enum(['openai', 'anthropic', 'auto']).default('auto'),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).default('#3B82F6'),
  logoUrl: z.string().url().optional(),
  inputFields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'textarea', 'select', 'checkbox', 'radio']),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional()
  })).min(1).max(10),
  outputFormat: z.enum(['text', 'json', 'html']).default('text'),
  webhookUrl: z.string().url().optional(),
  accessControl: z.object({
    requireEmail: z.boolean().default(false),
    allowedDomains: z.array(z.string()).optional(),
    maxUsagePerDay: z.number().optional()
  }).optional()
});

export type ToolConfig = z.infer<typeof toolConfigSchema>;

// Tool instance with generated unique ID and embed code
export interface ToolInstance extends ToolConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  embedCode: string;
  totalUsage: number;
  apiEndpoint: string;
}

// Get AI provider API key
function getApiKey(provider: 'openai' | 'anthropic'): string | undefined {
  if (provider === 'openai') {
    return process.env.OPENAI_API_IDEA_KEY || 
           process.env.OPENAI_API_KEY || 
           process.env.OPENAI_MANAGED_KEY;
  } else {
    return process.env.ANTHROPIC_API_KEY;
  }
}

/**
 * Create a new tool instance based on configuration
 */
export async function createToolInstance(
  config: ToolConfig,
  userId: number
): Promise<ToolInstance> {
  // Generate unique ID for the tool
  const toolId = uuidv4().substring(0, 8);
  const now = new Date().toISOString();
  
  // Generate the tool's API endpoint
  const apiEndpoint = `/api/v1/tools/${toolId}`;
  
  // Generate embed code for the tool
  const embedCode = generateEmbedCode(toolId, config);
  
  // Create the tool instance
  const toolInstance: ToolInstance = {
    ...config,
    id: toolId,
    createdAt: now,
    updatedAt: now,
    embedCode,
    totalUsage: 0,
    apiEndpoint
  };
  
  // In a real implementation, save to database
  // await db.insert(tools).values({
  //   id: toolId,
  //   userId,
  //   config: JSON.stringify(config),
  //   createdAt: now,
  //   updatedAt: now
  // });
  
  return toolInstance;
}

/**
 * Generate HTML/JS embed code for a tool
 */
function generateEmbedCode(toolId: string, config: ToolConfig): string {
  return `<div id="360bm-tool-${toolId}" class="360bm-tool">
  <script>
    (function() {
      var script = document.createElement('script');
      script.src = "https://app.360businessmagician.com/embed.js";
      script.async = true;
      script.dataset.toolId = "${toolId}";
      document.head.appendChild(script);
    })();
  </script>
  <noscript>
    Please enable JavaScript to use the ${config.name} tool.
  </noscript>
</div>`;
}

/**
 * Process a tool request with AI
 */
export async function processToolRequest(
  toolId: string,
  inputs: Record<string, any>
): Promise<any> {
  // In a real implementation, fetch tool config from database
  // const toolConfig = await db.query.tools.findFirst({
  //   where: eq(tools.id, toolId)
  // });
  
  // For demonstration, create a mock response
  const mockResponse = {
    result: "This is where the AI-generated content would appear based on the user's inputs.",
    generatedAt: new Date().toISOString(),
    toolId
  };
  
  // Track usage and fire webhook if configured
  // if (toolConfig.webhookUrl) {
  //   await triggerWebhook(toolConfig.webhookUrl, {
  //     event: 'tool_used',
  //     toolId,
  //     timestamp: new Date().toISOString(),
  //     inputs: Object.keys(inputs),
  //     userId: inputs.email || 'anonymous'
  //   });
  // }
  
  return mockResponse;
}

/**
 * Trigger webhook for tool events
 */
async function triggerWebhook(
  webhookUrl: string,
  payload: Record<string, any>
): Promise<void> {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Failed to trigger webhook:', error);
    // Non-blocking - we don't want tool usage to fail if webhook fails
  }
}

/**
 * Get templates for different tool types
 */
export function getToolTemplates(): Record<ToolType, Partial<ToolConfig>> {
  return {
    business_idea_generator: {
      name: "Business Idea Generator",
      description: "Generate innovative business ideas based on your interests and market needs",
      inputFields: [
        {
          name: "interests",
          label: "Your interests (comma separated)",
          type: "text",
          required: true,
          placeholder: "e.g., technology, education, health"
        },
        {
          name: "marketNeed",
          label: "What market need are you addressing?",
          type: "textarea",
          required: false,
          placeholder: "Describe the problem you want to solve..."
        },
        {
          name: "targetAudience",
          label: "Target audience",
          type: "select",
          required: false,
          options: ["General public", "Businesses", "Deaf community", "Other entrepreneurs"]
        }
      ],
      outputFormat: "json"
    },
    marketing_plan_creator: {
      name: "Marketing Plan Creator",
      description: "Create a customized marketing plan for your business",
      inputFields: [
        {
          name: "businessName",
          label: "Business name",
          type: "text",
          required: true
        },
        {
          name: "businessDescription",
          label: "Brief business description",
          type: "textarea",
          required: true
        },
        {
          name: "targetAudience",
          label: "Who is your target audience?",
          type: "textarea",
          required: true
        },
        {
          name: "budget",
          label: "Monthly marketing budget",
          type: "select",
          required: false,
          options: ["$0-$500", "$500-$2000", "$2000-$5000", "$5000+"]
        }
      ],
      outputFormat: "html"
    },
    financial_projection_calculator: {
      name: "Financial Projection Calculator",
      description: "Get projected financials for your startup",
      inputFields: [
        {
          name: "startupCosts",
          label: "Estimated startup costs ($)",
          type: "text",
          required: true
        },
        {
          name: "monthlyCosts",
          label: "Estimated monthly costs ($)",
          type: "text",
          required: true
        },
        {
          name: "projectedRevenue",
          label: "Projected monthly revenue ($)",
          type: "text",
          required: true
        },
        {
          name: "growthRate",
          label: "Expected monthly growth rate (%)",
          type: "text",
          required: false,
          placeholder: "e.g., 5"
        }
      ],
      outputFormat: "json"
    },
    accessibility_analyzer: {
      name: "Business Accessibility Analyzer",
      description: "Analyze how accessible your business is for deaf customers and employees",
      inputFields: [
        {
          name: "businessType",
          label: "Type of business",
          type: "select",
          required: true,
          options: ["Retail", "Service", "Online", "Food & Beverage", "Other"]
        },
        {
          name: "currentMeasures",
          label: "Current accessibility measures in place",
          type: "textarea",
          required: false
        },
        {
          name: "staffTraining",
          label: "Does your staff have accessibility training?",
          type: "radio",
          required: false,
          options: ["Yes", "No", "Partially"]
        }
      ],
      outputFormat: "html"
    },
    document_creator: {
      name: "Business Document Creator",
      description: "Create professional business documents",
      inputFields: [
        {
          name: "documentType",
          label: "Type of document",
          type: "select",
          required: true,
          options: ["Business Plan", "Marketing Plan", "Executive Summary", "Pitch Deck"]
        },
        {
          name: "businessName",
          label: "Business name",
          type: "text",
          required: true
        },
        {
          name: "businessDescription",
          label: "Business description",
          type: "textarea",
          required: true
        }
      ],
      outputFormat: "html"
    },
    customer_profile_generator: {
      name: "Ideal Customer Profile Generator",
      description: "Create detailed profiles of your ideal customers",
      inputFields: [
        {
          name: "product",
          label: "Your product or service",
          type: "text",
          required: true
        },
        {
          name: "targetMarket",
          label: "Target market description",
          type: "textarea",
          required: true
        },
        {
          name: "specialNeeds",
          label: "Special needs to consider",
          type: "checkbox",
          required: false,
          options: ["Deaf community", "Hard of hearing", "Other disabilities", "None"]
        }
      ],
      outputFormat: "json"
    },
    custom: {
      name: "Custom AI Tool",
      description: "Create your own custom AI tool",
      customInstructions: "Provide detailed instructions for what your tool should do...",
      inputFields: [
        {
          name: "prompt",
          label: "User input",
          type: "textarea",
          required: true,
          placeholder: "Enter your question or request..."
        }
      ],
      outputFormat: "text"
    }
  };
}