import { getAnthropicClient, checkAIServicesAvailability } from './aiLazyLoader';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025

// Function to check if Anthropic service is available
export const hasAnthropicKey = (): boolean => {
  return checkAIServicesAvailability().anthropic;
};

// Generate business ideas using Claude
export async function generateBusinessIdeas(
  interests: string[],
  marketInfo?: string,
  constraints?: string[]
): Promise<{
  ideas: Array<{
    title: string;
    description: string;
    marketPotential: string;
    difficultyLevel: string;
    startupCosts: string;
  }>;
}> {
  if (!hasAnthropicKey()) {
    throw new Error("Anthropic API key not configured");
  }
  
  try {
    // Get Anthropic client using lazy loader
    const anthropic = getAnthropicClient();
    
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

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      system: "You are a business strategy consultant specializing in advising entrepreneurs with disabilities, particularly deaf entrepreneurs.",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    // Parse content safely
    const content = response.content[0];
    if ('text' in content) {
      return JSON.parse(content.text);
    } else {
      throw new Error("Unexpected response format from Claude");
    }
  } catch (error: any) {
    console.error("Error generating business ideas:", error);
    throw new Error(`Failed to generate business ideas: ${error.message}`);
  }
}

// Analyze a business idea using Claude
export async function analyzeBusinessIdea(
  ideaTitle: string,
  ideaDescription: string,
  targetMarket: string
): Promise<{
  valid: boolean;
  viabilityScore: number;
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: string[];
  accessibilityConsiderations: string[];
}> {
  if (!hasAnthropicKey()) {
    throw new Error("Anthropic API key not configured");
  }
  
  try {
    // Get Anthropic client using lazy loader
    const anthropic = getAnthropicClient();
    
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

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      system: "You are a business analyst specializing in evaluating business plans for entrepreneurs with disabilities, particularly deaf entrepreneurs.",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    // Parse content safely
    const content = response.content[0];
    if ('text' in content) {
      return JSON.parse(content.text);
    } else {
      throw new Error("Unexpected response format from Claude");
    }
  } catch (error: any) {
    console.error("Error analyzing business idea:", error);
    throw new Error(`Failed to analyze business idea: ${error.message}`);
  }
}

// Create a business plan outline using Claude
export async function createBusinessPlanOutline(
  businessName: string,
  businessDescription: string,
  targetMarket: string
): Promise<{
  sections: Array<{
    title: string;
    description: string;
    keyPoints: string[];
  }>;
}> {
  if (!hasAnthropicKey()) {
    throw new Error("Anthropic API key not configured");
  }
  
  try {
    // Get Anthropic client using lazy loader
    const anthropic = getAnthropicClient();
    
    const prompt = `Create a business plan outline for "${businessName}": ${businessDescription}. The target market is: ${targetMarket}.
    
    Generate an outline with the standard business plan sections, providing a brief description and 3-5 key points to address for each section.
    
    Keep in mind this is for a deaf entrepreneur who may require accommodations for communication with hearing clients/suppliers.
    
    Format your response as a JSON object with a 'sections' array containing objects with the properties: title, description, and keyPoints (an array of strings).`;

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      system: "You are a business plan consultant who specializes in helping entrepreneurs with disabilities, particularly deaf entrepreneurs.",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    // Parse content safely
    const content = response.content[0];
    if ('text' in content) {
      return JSON.parse(content.text);
    } else {
      throw new Error("Unexpected response format from Claude");
    }
  } catch (error: any) {
    console.error("Error creating business plan:", error);
    throw new Error(`Failed to create business plan: ${error.message}`);
  }
}