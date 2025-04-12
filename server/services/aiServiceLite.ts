/**
 * Lightweight AI Service
 * 
 * This is a simplified version of the AI service that initializes
 * clients on-demand rather than at startup to reduce memory usage.
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Check if keys are available
const hasOpenAIKey = () => {
  return !!(process.env.OPENAI_API_KEY || 
         process.env.OPENAI_MANAGED_KEY || 
         process.env.OPENAI_API_IDEA_KEY || 
         process.env.OPENAI_API_BUILD_KEY || 
         process.env.OPENAI_API_GROW_KEY);
};

const hasAnthropicKey = () => {
  return !!process.env.ANTHROPIC_API_KEY;
};

// Service availability flags
export const availableServices = {
  openai: hasOpenAIKey(),
  anthropic: hasAnthropicKey(),
  googleAI: false
};

// Get OpenAI client when needed
export const getOpenAIClient = (): OpenAI | null => {
  if (!hasOpenAIKey()) return null;
  
  const key = process.env.OPENAI_API_KEY || 
         process.env.OPENAI_MANAGED_KEY || 
         process.env.OPENAI_API_IDEA_KEY || 
         process.env.OPENAI_API_BUILD_KEY || 
         process.env.OPENAI_API_GROW_KEY;
  
  return new OpenAI({ apiKey: key });
};

// Get Anthropic client when needed
export const getAnthropicClient = (): Anthropic | null => {
  if (!hasAnthropicKey()) return null;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
};

// Log status of AI services
export function logAIServicesStatus() {
  if (hasOpenAIKey()) {
    console.log('OpenAI client available (key present)');
  } else {
    console.log('OpenAI client not available (API key missing)');
  }
  
  if (hasAnthropicKey()) {
    console.log('Anthropic client available (key present)');
  } else {
    console.log('Anthropic client not available (API key missing)');
  }
}

// Don't initialize at startup - will be initialized on demand