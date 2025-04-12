/**
 * Unified AI Service Layer
 * 
 * This service provides an abstraction over multiple AI services:
 * - OpenAI
 * - Claude (Anthropic)
 * - Google AI Platform
 * 
 * It handles fallbacks and can route requests to the most appropriate service.
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Get OpenAI API key from any available key
const getOpenAIApiKey = () => {
  return process.env.OPENAI_API_KEY || 
         process.env.OPENAI_MANAGED_KEY || 
         process.env.OPENAI_API_IDEA_KEY || 
         process.env.OPENAI_API_BUILD_KEY || 
         process.env.OPENAI_API_GROW_KEY;
};

// Service configurations
const openai = getOpenAIApiKey() ? 
  new OpenAI({ apiKey: getOpenAIApiKey() }) : null;

const anthropic = process.env.ANTHROPIC_API_KEY ? 
  new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

// Service availability flags
export const availableServices = {
  openai: !!getOpenAIApiKey(),
  anthropic: !!process.env.ANTHROPIC_API_KEY,
  googleAI: false, // Will be updated when implemented
};

export type AIServiceProvider = 'openai' | 'anthropic' | 'googleAI' | 'auto';

/**
 * AI Service Configuration
 */
interface AIServiceConfig {
  provider: AIServiceProvider;
  temperature?: number;
  maxTokens?: number;
}

const defaultConfig: AIServiceConfig = {
  provider: 'auto',
  temperature: 0.7,
  maxTokens: 1000
};

/**
 * Generate business ideas using any available AI service
 */
export async function generateBusinessIdeas(
  interests: string[],
  marketInfo?: string,
  constraints?: string[],
  config: Partial<AIServiceConfig> = {}
): Promise<{
  ideas: Array<{
    title: string;
    description: string;
    marketPotential: string;
    difficultyLevel: string;
    startupCosts: string;
  }>;
  provider: string;
}> {
  const finalConfig = { ...defaultConfig, ...config };
  const provider = determineProvider(finalConfig.provider);
  
  const prompt = `Generate 3 innovative business ideas for a deaf entrepreneur with the following interests: ${interests.join(
    ", "
  )}. ${marketInfo ? `Consider this market information: ${marketInfo}.` : ""} ${
    constraints && constraints.length > 0
      ? `The business must satisfy these constraints: ${constraints.join(", ")}.`
      : ""
  }

  For each idea, provide:
  1. A title
  2. A brief description (1-2 sentences)
  3. Market potential (High, Medium, or Low)
  4. Difficulty level (High, Medium, or Low)
  5. Estimated startup costs (as a range)

  Focus on businesses that leverage the entrepreneur's unique perspective as a deaf individual and create value for both deaf and hearing communities.
  
  Format your response as a JSON object with an 'ideas' array containing objects with the properties: title, description, marketPotential, difficultyLevel, and startupCosts.`;

  try {
    if (provider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: finalConfig.maxTokens,
        temperature: finalConfig.temperature,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content returned from OpenAI");
      }

      return {
        ...JSON.parse(content),
        provider: 'openai'
      };
    } 
    else if (provider === 'anthropic' && anthropic) {
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        system: "You are a business strategy consultant specializing in advising entrepreneurs with disabilities, particularly deaf entrepreneurs.",
        max_tokens: finalConfig.maxTokens || 4000,
        temperature: finalConfig.temperature,
        messages: [{ role: "user", content: prompt }],
      });

      // Parse content safely
      const content = response.content[0];
      if ('text' in content) {
        return {
          ...JSON.parse(content.text),
          provider: 'anthropic'
        };
      } else {
        throw new Error("Unexpected response format from Claude");
      }
    }
    else {
      // Fallback to rule-based system
      return {
        ideas: generateFallbackIdeas(interests, marketInfo),
        provider: 'fallback'
      };
    }
  } catch (error: any) {
    console.error("Error generating business ideas:", error);
    // Provide fallback
    return {
      ideas: generateFallbackIdeas(interests, marketInfo),
      provider: 'fallback'
    };
  }
}

/**
 * Analyze a business idea using any available AI service
 */
export async function analyzeBusinessIdea(
  ideaTitle: string,
  ideaDescription: string,
  targetMarket: string,
  config: Partial<AIServiceConfig> = {}
): Promise<{
  valid: boolean;
  viabilityScore: number;
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: string[];
  accessibilityConsiderations: string[];
  provider: string;
}> {
  const finalConfig = { ...defaultConfig, ...config };
  const provider = determineProvider(finalConfig.provider);
  
  const prompt = `Analyze this business idea for a deaf entrepreneur:
  
  Business Idea: ${ideaTitle}
  Description: ${ideaDescription}
  Target Market: ${targetMarket}
  
  Provide a comprehensive analysis including:
  1. Overall viability (valid or needs improvement)
  2. Viability score (1-10)
  3. Key strengths and weaknesses
  4. Recommendations for improvement
  5. Accessibility considerations for deaf entrepreneurs
  
  Format your response as a JSON object with these properties: valid (boolean), viabilityScore (number), strengthsWeaknesses (object with strengths and weaknesses arrays), recommendations (array), and accessibilityConsiderations (array).`;

  try {
    if (provider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: finalConfig.maxTokens,
        temperature: finalConfig.temperature,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content returned from OpenAI");
      }

      return {
        ...JSON.parse(content),
        provider: 'openai'
      };
    } 
    else if (provider === 'anthropic' && anthropic) {
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // the newest Anthropic model
        system: "You are a business analyst specializing in evaluating business plans for entrepreneurs with disabilities, particularly deaf entrepreneurs.",
        max_tokens: finalConfig.maxTokens || 4000,
        temperature: finalConfig.temperature,
        messages: [{ role: "user", content: prompt }],
      });

      // Parse content safely
      const content = response.content[0];
      if ('text' in content) {
        return {
          ...JSON.parse(content.text),
          provider: 'anthropic'
        };
      } else {
        throw new Error("Unexpected response format from Claude");
      }
    }
    else {
      // Fallback to rule-based analysis
      return generateFallbackAnalysis(ideaTitle, ideaDescription, targetMarket);
    }
  } catch (error: any) {
    console.error("Error analyzing business idea:", error);
    // Provide fallback
    return generateFallbackAnalysis(ideaTitle, ideaDescription, targetMarket);
  }
}

/**
 * Determine which AI provider to use based on configuration and availability
 */
function determineProvider(requestedProvider: AIServiceProvider): 'openai' | 'anthropic' | 'fallback' {
  if (requestedProvider === 'auto') {
    // Try to use the best available provider
    if (availableServices.anthropic) return 'anthropic';
    if (availableServices.openai) return 'openai';
    return 'fallback';
  }
  
  // Use the requested provider if available
  if (requestedProvider === 'anthropic' && availableServices.anthropic) return 'anthropic';
  if (requestedProvider === 'openai' && availableServices.openai) return 'openai';
  
  // If requested provider is not available, use the fallback
  return 'fallback';
}

/**
 * Generate fallback business ideas using rules-based approach
 */
function generateFallbackIdeas(
  interests: string[],
  marketInfo?: string
): Array<{
  title: string;
  description: string;
  marketPotential: string;
  difficultyLevel: string;
  startupCosts: string;
}> {
  // Basic business templates
  const businessTypes = [
    "e-commerce store",
    "consulting service",
    "mobile app",
    "subscription service",
    "online marketplace"
  ];
  
  // Select random business type
  const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
  
  // Combine with user interests
  const primaryInterest = interests[0];
  const secondaryInterest = interests.length > 1 ? interests[1] : interests[0];
  
  return [
    {
      title: `${primaryInterest.charAt(0).toUpperCase() + primaryInterest.slice(1)} ${businessType}`,
      description: `A ${businessType} focused on ${primaryInterest} and ${secondaryInterest} for the ${marketInfo || 'general'} market.`,
      marketPotential: "Medium",
      difficultyLevel: "Medium",
      startupCosts: "$5,000 - $15,000"
    },
    {
      title: `Accessible ${secondaryInterest} platform`,
      description: `An accessible platform designed for the ${primaryInterest} community, focusing on ${secondaryInterest}.`,
      marketPotential: "High",
      difficultyLevel: "Medium",
      startupCosts: "$10,000 - $25,000"
    }
  ];
}

/**
 * Generate fallback business analysis using rules-based approach
 */
function generateFallbackAnalysis(
  ideaTitle: string,
  ideaDescription: string,
  targetMarket: string
): {
  valid: boolean;
  viabilityScore: number;
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: string[];
  accessibilityConsiderations: string[];
  provider: string;
} {
  // Default positive analysis
  return {
    valid: true,
    viabilityScore: 7,
    strengthsWeaknesses: {
      strengths: [
        "Addresses a specific market need",
        "Leverages unique perspective of deaf entrepreneurs",
        "Has potential for both deaf and hearing customer bases"
      ],
      weaknesses: [
        "May require specialized marketing strategies",
        "Could face competition from established businesses"
      ]
    },
    recommendations: [
      "Conduct market research with potential customers",
      "Develop a clear accessibility plan",
      "Consider starting with a minimum viable product"
    ],
    accessibilityConsiderations: [
      "Ensure all customer communications have ASL options",
      "Design user interfaces with deaf users in mind",
      "Consider partnerships with deaf community organizations"
    ],
    provider: 'fallback'
  };
}