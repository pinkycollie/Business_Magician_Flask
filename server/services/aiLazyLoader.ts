/**
 * AI Service Lazy Loader
 * 
 * This service manages the lazy loading of AI providers (OpenAI, Anthropic)
 * to reduce memory consumption during application startup.
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Track initialized clients
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

/**
 * Get the OpenAI client instance, creating it if needed
 * @param key Optional API key override
 */
export function getOpenAIClient(key?: string): OpenAI {
  // Only initialize when actually needed
  if (!openaiClient) {
    const apiKey = key || 
      process.env.OPENAI_API_KEY || 
      process.env.OPENAI_MANAGED_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not available');
    }
    
    openaiClient = new OpenAI({ apiKey });
    console.log('OpenAI client initialized on demand');
  }
  
  return openaiClient;
}

/**
 * Get the Anthropic client instance, creating it if needed
 * @param key Optional API key override
 */
export function getAnthropicClient(key?: string): Anthropic {
  // Only initialize when actually needed
  if (!anthropicClient) {
    const apiKey = key || process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('Anthropic API key not available');
    }
    
    anthropicClient = new Anthropic({ apiKey });
    console.log('Anthropic client initialized on demand');
  }
  
  return anthropicClient;
}

/**
 * Reset AI clients (for testing or to free memory)
 */
export function resetAIClients(): void {
  openaiClient = null;
  anthropicClient = null;
}

/**
 * Check if AI services are available without initializing them
 */
export function checkAIServicesAvailability(): {
  openai: boolean;
  anthropic: boolean;
} {
  return {
    openai: !!(process.env.OPENAI_API_KEY || process.env.OPENAI_MANAGED_KEY),
    anthropic: !!process.env.ANTHROPIC_API_KEY
  };
}