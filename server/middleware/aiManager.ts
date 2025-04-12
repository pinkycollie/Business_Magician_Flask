/**
 * AI Manager Middleware (Ultra-Optimized for Memory Usage)
 * 
 * IMPORTANT: This module has been heavily optimized to minimize memory usage during startup
 * by deferring all non-essential calculations and initializations until they're actually needed.
 */

import { z } from 'zod';

// Type imports (only for type annotations, not for actual imports)
import type OpenAI from 'openai';
import type Anthropic from '@anthropic-ai/sdk';

// Lazy load other imports and data structures as needed
let aiLazyLoader: any = null;

// Module state cache (all initialized on demand)
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;
let serviceConfigurations: any = null;
let environmentSettings: any = null;

// Types of AI services available in the 360 Business Magician ecosystem
export enum AIServiceType {
  BUSINESS_ASSISTANT = 'business_assistant',
  DOCUMENT_PROCESSOR = 'document_processor',
  TRANSLATION = 'translation',
  VR_SPECIALIST = 'vr_specialist',
  CHATBOT = 'chatbot'
}

// Environment contexts
export enum AIEnvironment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

// AI model providers
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  INTERNAL = 'internal',
  FALLBACK = 'fallback'
}

// Check if keys are available - don't actually load any modules
function hasOpenAIKey() {
  return !!(process.env.OPENAI_API_KEY || 
         process.env.OPENAI_MANAGED_KEY || 
         process.env.OPENAI_API_IDEA_KEY || 
         process.env.OPENAI_API_BUILD_KEY || 
         process.env.OPENAI_API_GROW_KEY);
}

function hasAnthropicKey() {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Just log status without initializing any clients
export function logAIServicesStatus() {
  console.log('AI services status:');
  console.log(`- OpenAI: ${hasOpenAIKey() ? 'Available (key present)' : 'Not available (API key missing)'}`);
  console.log(`- Anthropic: ${hasAnthropicKey() ? 'Available (key present)' : 'Not available (API key missing)'}`);
}

// Get current environment
export function getCurrentEnvironment(): AIEnvironment {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') return AIEnvironment.PRODUCTION;
  if (env === 'staging') return AIEnvironment.STAGING;
  return AIEnvironment.DEVELOPMENT;
}

// Lazy initialization functions
function getServiceConfigurations() {
  if (serviceConfigurations === null) {
    serviceConfigurations = {
      [AIServiceType.BUSINESS_ASSISTANT]: {
        preferredProvider: AIProvider.ANTHROPIC,
        fallbackProvider: AIProvider.OPENAI,
        requiresAuth: true,
        contextLimit: 100000,
        allowStreaming: true,
        cacheResponses: false,
        logLevel: 'detailed'
      },
      [AIServiceType.DOCUMENT_PROCESSOR]: {
        preferredProvider: AIProvider.OPENAI,
        fallbackProvider: AIProvider.GOOGLE,
        requiresAuth: true,
        contextLimit: 32000,
        allowStreaming: false,
        cacheResponses: true,
        logLevel: 'basic'
      },
      [AIServiceType.TRANSLATION]: {
        preferredProvider: AIProvider.OPENAI,
        fallbackProvider: AIProvider.GOOGLE,
        requiresAuth: false,
        contextLimit: 4000,
        allowStreaming: true,
        cacheResponses: false,
        logLevel: 'basic'
      },
      [AIServiceType.VR_SPECIALIST]: {
        preferredProvider: AIProvider.ANTHROPIC,
        fallbackProvider: AIProvider.INTERNAL,
        requiresAuth: true,
        contextLimit: 64000,
        allowStreaming: true,
        cacheResponses: false,
        logLevel: 'detailed'
      },
      [AIServiceType.CHATBOT]: {
        preferredProvider: AIProvider.OPENAI,
        fallbackProvider: AIProvider.ANTHROPIC,
        requiresAuth: false,
        contextLimit: 16000,
        allowStreaming: true,
        cacheResponses: true,
        logLevel: 'basic'
      }
    };
  }
  return serviceConfigurations;
}

function getEnvironmentSettings() {
  if (environmentSettings === null) {
    environmentSettings = {
      [AIEnvironment.DEVELOPMENT]: {
        enabledServices: Object.values(AIServiceType),
        requireAuth: false,
        logRequests: true,
        useFallbacks: true,
        allowMocks: true
      },
      [AIEnvironment.STAGING]: {
        enabledServices: Object.values(AIServiceType),
        requireAuth: true,
        logRequests: true,
        useFallbacks: true,
        allowMocks: false
      },
      [AIEnvironment.PRODUCTION]: {
        enabledServices: Object.values(AIServiceType),
        requireAuth: true,
        logRequests: true,
        useFallbacks: true,
        allowMocks: false
      }
    };
  }
  return environmentSettings;
}

// Get OpenAI client (lazy loading)
function getOrInitOpenAIClient() {
  if (!openaiClient) {
    if (!aiLazyLoader) {
      aiLazyLoader = require('../services/aiLazyLoader');
    }
    openaiClient = aiLazyLoader.getOpenAIClient();
  }
  return openaiClient;
}

// Get Anthropic client (lazy loading)
function getOrInitAnthropicClient() {
  if (!anthropicClient) {
    if (!aiLazyLoader) {
      aiLazyLoader = require('../services/aiLazyLoader');
    }
    anthropicClient = aiLazyLoader.getAnthropicClient();
  }
  return anthropicClient;
}

// Check if a service is available
export function isServiceAvailable(serviceType: AIServiceType): boolean {
  const environment = getCurrentEnvironment();
  const settings = getEnvironmentSettings()[environment];
  
  // Check if service is enabled in this environment
  if (!settings.enabledServices.includes(serviceType)) {
    return false;
  }
  
  // Check if required provider is available
  const config = getServiceConfigurations()[serviceType];
  
  if (config.preferredProvider === AIProvider.OPENAI && !hasOpenAIKey()) {
    return config.fallbackProvider !== AIProvider.OPENAI || settings.useFallbacks;
  }
  
  if (config.preferredProvider === AIProvider.ANTHROPIC && !hasAnthropicKey()) {
    return config.fallbackProvider !== AIProvider.ANTHROPIC || settings.useFallbacks;
  }
  
  return true;
}

// Get all available AI services
export function getAvailableServices(): AIServiceType[] {
  return Object.values(AIServiceType).filter(service => isServiceAvailable(service));
}

// Get information about AI services for client use
export function getServicesInfo() {
  const available = getAvailableServices();
  const environment = getCurrentEnvironment();
  
  return {
    available,
    environment,
    providers: {
      openai: hasOpenAIKey(),
      anthropic: hasAnthropicKey(),
      google: false,
      internal: true
    }
  };
}

// Schemas - defined on demand
let businessAssistanceSchemaInstance: any = null;
let documentProcessSchemaInstance: any = null;
let translationSchemaInstance: any = null;

// Schema for business assistance requests (lazy loaded)
export function getBusinessAssistanceSchema() {
  if (!businessAssistanceSchemaInstance) {
    businessAssistanceSchemaInstance = z.object({
      query: z.string().min(5).max(2000),
      businessContext: z.string().optional(),
      userId: z.number().optional(),
      includeResources: z.boolean().optional().default(true),
      format: z.enum(['text', 'json']).optional().default('text')
    });
  }
  return businessAssistanceSchemaInstance;
}

// Schema for document processing requests (lazy loaded)
export function getDocumentProcessSchema() {
  if (!documentProcessSchemaInstance) {
    documentProcessSchemaInstance = z.object({
      documentType: z.enum(['business_plan', 'marketing', 'financial', 'legal', 'other']),
      content: z.string().min(10),
      templateId: z.string().optional(),
      outputFormat: z.enum(['pdf', 'docx', 'txt', 'json']).optional().default('pdf')
    });
  }
  return documentProcessSchemaInstance;
}

// Schema for translation requests (lazy loaded)
export function getTranslationSchema() {
  if (!translationSchemaInstance) {
    translationSchemaInstance = z.object({
      text: z.string().min(1),
      sourceLanguage: z.string().optional(),
      targetLanguage: z.string(),
      preserveFormatting: z.boolean().optional().default(true)
    });
  }
  return translationSchemaInstance;
}

// Example processing function for business assistance (with lazy loading)
export async function processBusineseAssistance(params: any) {
  const environment = getCurrentEnvironment();
  const serviceType = AIServiceType.BUSINESS_ASSISTANT;
  
  if (!isServiceAvailable(serviceType)) {
    throw new Error(`${serviceType} service is not available in ${environment} environment`);
  }
  
  const config = getServiceConfigurations()[serviceType];
  const settings = getEnvironmentSettings()[environment];
  
  try {
    // Try preferred provider with lazy loading
    if (config.preferredProvider === AIProvider.ANTHROPIC) {
      const client = getOrInitAnthropicClient();
      if (client) {
        return await processWithAnthropic(params);
      }
    } 
    
    if (config.preferredProvider === AIProvider.OPENAI) {
      const client = getOrInitOpenAIClient();
      if (client) {
        return await processWithOpenAI(params);
      }
    }
    
    // Fall back if needed and allowed
    if (settings.useFallbacks) {
      if (config.fallbackProvider === AIProvider.ANTHROPIC) {
        const client = getOrInitAnthropicClient();
        if (client) {
          return await processWithAnthropic(params);
        }
      }
      
      if (config.fallbackProvider === AIProvider.OPENAI) {
        const client = getOrInitOpenAIClient();
        if (client) {
          return await processWithOpenAI(params);
        }
      }
      
      if (config.fallbackProvider === AIProvider.INTERNAL || settings.allowMocks) {
        return await processWithInternalModel(params);
      }
    }
    
    throw new Error('No available AI provider for this request');
  } catch (error) {
    console.error(`Error in ${serviceType} service:`, error);
    
    // If we already tried fallback or fallbacks are disabled, throw error
    if (!settings.useFallbacks) {
      throw error;
    }
    
    // Last resort fallback
    return await processWithInternalModel(params);
  }
}

// Implementation with Anthropic/Claude (lazy loaded)
async function processWithAnthropic(params: any) {
  // Get client using lazy loading
  const client = getOrInitAnthropicClient();
  if (!client) throw new Error('Anthropic client not available');
  
  const systemPrompt = `You are 360 Business Magician, an expert business assistant for deaf entrepreneurs.
  Provide clear, concise, and actionable advice related to business formation, management, and growth.
  Focus particularly on accessibility considerations and resources for deaf business owners.`;
  
  try {
    // Use default values for max_tokens and temperature if needed
    const response = await client.messages.create({
      model: "claude-3-7-sonnet-20250219", // the newest Anthropic model
      system: systemPrompt,
      max_tokens: 1024,
      messages: [
        { 
          role: "user", 
          content: `${params.businessContext ? 'Context: ' + params.businessContext + '\n\n' : ''}Question: ${params.query}` 
        }
      ],
    });
    
    const content = response.content[0];
    if ('text' in content) {
      if (params.format === 'json') {
        try {
          // Attempt to parse as JSON if that's what was requested
          return JSON.parse(content.text);
        } catch (e) {
          // If not valid JSON, return text with warning
          return { 
            response: content.text,
            warning: "Response could not be formatted as JSON"
          };
        }
      }
      
      return { response: content.text };
    } else {
      throw new Error("Unexpected response format from Claude");
    }
  } catch (error: any) {
    console.error("Error in Anthropic processing:", error);
    throw new Error(`Anthropic API error: ${error.message}`);
  }
}

// Implementation with OpenAI (lazy loaded)
async function processWithOpenAI(params: any) {
  // Get client using lazy loading
  const client = getOrInitOpenAIClient();
  if (!client) throw new Error('OpenAI client not available');
  
  const systemPrompt = `You are 360 Business Magician, an expert business assistant for deaf entrepreneurs.
  Provide clear, concise, and actionable advice related to business formation, management, and growth.
  Focus particularly on accessibility considerations and resources for deaf business owners.`;
  
  try {
    const requestOptions: any = {
      model: "gpt-4o", // the newest OpenAI model
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `${params.businessContext ? 'Context: ' + params.businessContext + '\n\n' : ''}Question: ${params.query}` 
        }
      ],
      max_tokens: 1024
    };
    
    // Add JSON format if requested
    if (params.format === 'json') {
      requestOptions.response_format = { type: "json_object" };
    }
    
    const response = await client.chat.completions.create(requestOptions);
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }
    
    if (params.format === 'json') {
      try {
        return JSON.parse(content);
      } catch (e) {
        return { 
          response: content,
          warning: "Response could not be formatted as JSON"
        };
      }
    }
    
    return { response: content };
  } catch (error: any) {
    console.error("Error in OpenAI processing:", error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

// Fallback internal implementation (lightweight)
async function processWithInternalModel(params: any) {
  // Simple fallback only loads template data if actually needed
  const query = params.query.toLowerCase();
  let responseType = 'general';
  
  if (query.includes('plan') || query.includes('strategy')) {
    responseType = 'business_plan';
  } else if (query.includes('fund') || query.includes('money') || query.includes('invest')) {
    responseType = 'funding';
  } else if (query.includes('market') || query.includes('advertis')) {
    responseType = 'marketing';
  } else if (query.includes('legal') || query.includes('law')) {
    responseType = 'legal';
  }
  
  // Get appropriate response
  const responseText = getFallbackResponse(responseType);
  
  if (params.format === 'json') {
    return {
      response: responseText,
      source: "internal",
      disclaimer: "This is a fallback response from the internal system."
    };
  }
  
  return { response: responseText };
}

// Fallback templates (loaded only when needed)
function getFallbackResponse(type: string): string {
  const responses: {[key: string]: string} = {
    business_plan: "To create a business plan, focus on these key areas: executive summary, company description, market analysis, organization structure, product/service details, marketing strategy, financial projections, and funding requirements. Consider accessibility aspects in each section.",
    funding: "For funding options, consider: SBA loans (especially those with accessibility provisions), grants for deaf entrepreneurs, angel investors familiar with the deaf community, and crowdfunding platforms. The NTID Center for Employment has specific resources.",
    marketing: "When marketing as a deaf entrepreneur, emphasize your unique perspective as a strength. Use visual platforms like Instagram, YouTube, and TikTok. Ensure all marketing materials are accessible with captions, transcripts, and visual clarity.",
    legal: "For legal considerations, focus on: proper business registration, trademark protection, accessibility compliance (ADA), and communication accommodation policies. Consider working with attorneys familiar with deaf business owners' needs.",
    general: "As a deaf entrepreneur, leverage resources from organizations like the National Deaf Business Institute, National Association of the Deaf, and NTID Center for Employment. Build networks within both deaf and hearing business communities."
  };
  
  return responses[type] || responses.general;
}

// Log AI service availability at startup - doesn't initialize clients
logAIServicesStatus();