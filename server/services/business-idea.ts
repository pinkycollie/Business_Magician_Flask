/**
 * Business Idea Generation Service
 * 
 * This service provides AI-powered business idea generation
 * specifically tailored for deaf entrepreneurs.
 */

import { getOpenAIClient } from './aiLazyLoader';

/**
 * Generate business ideas based on user interests and constraints
 */
export async function generateBusinessIdeas(
  interests: string[],
  marketInfo?: string,
  constraints?: string[]
): Promise<{
  ideas: Array<{
    title: string;
    description: string;
    accessibilityFeatures: string[];
    targetMarket: string;
    startupCosts: string;
    potentialChallenges: string[];
  }>;
  source: string;
}> {
  // Get OpenAI client using lazy loader
  const openai = getOpenAIClient();
  
  // Create prompt for the AI
  const prompt = `Generate 3 innovative business ideas for a deaf entrepreneur with the following interests: ${interests.join(", ")}.
  ${marketInfo ? `Consider this market information: ${marketInfo}.` : ""}
  ${constraints && constraints.length > 0 ? `The business must satisfy these constraints: ${constraints.join(", ")}.` : ""}

  Each idea should include:
  1. A clear, concise title
  2. A brief description (2-3 sentences)
  3. Key accessibility features that make this business deaf-friendly
  4. Target market description
  5. Estimated startup costs (as a range)
  6. Potential challenges specific to deaf entrepreneurs

  Focus on businesses that leverage the entrepreneur's unique perspective as a deaf individual and create value for both deaf and hearing communities.
  
  Format your response as a JSON object with an 'ideas' array containing objects with the properties: title, description, accessibilityFeatures (array), targetMarket, startupCosts, and potentialChallenges (array).`;

  try {
    // Generate business ideas using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    // Parse and return the ideas
    return {
      ...JSON.parse(content),
      source: 'openai'
    };
  } catch (error: any) {
    console.error("Error generating business ideas:", error);
    throw new Error(`Business idea generation failed: ${error.message}`);
  }
}

/**
 * Analyze a business idea for viability and accessibility
 */
export async function analyzeBusinessIdea(
  title: string,
  description: string,
  targetMarket: string
): Promise<{
  viabilityScore: number;
  accessibilityScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  deafCommunityConsiderations: string[];
  source: string;
}> {
  // Get OpenAI client using lazy loader
  const openai = getOpenAIClient();
  
  const prompt = `Analyze this business idea for a deaf entrepreneur:
  
  Business Idea: ${title}
  Description: ${description}
  Target Market: ${targetMarket}
  
  Provide a comprehensive analysis with:
  1. Viability score (1-10)
  2. Accessibility score for deaf entrepreneurs (1-10)
  3. Key strengths (3-5 points)
  4. Potential weaknesses (3-5 points)
  5. Specific recommendations for improvement (3-5 points)
  6. Special considerations for the deaf community (3-5 points)
  
  Format your response as a JSON object with these properties: viabilityScore (number), accessibilityScore (number), strengths (array), weaknesses (array), recommendations (array), and deafCommunityConsiderations (array).`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return {
      ...JSON.parse(content),
      source: 'openai'
    };
  } catch (error: any) {
    console.error("Error analyzing business idea:", error);
    throw new Error(`Business idea analysis failed: ${error.message}`);
  }
}