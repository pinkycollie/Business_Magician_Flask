import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate business ideas using OpenAI
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
  try {
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("Error generating business ideas:", error);
    // Return a fallback message or re-throw based on your error handling strategy
    throw new Error(`Failed to generate business ideas: ${error.message}`);
  }
}

// Analyze business idea viability using OpenAI
export async function analyzeBusinessIdea(
  idea: string,
  targetMarket: string,
  competitionInfo?: string
): Promise<{
  viabilityScore: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
}> {
  try {
    const prompt = `Analyze the viability of this business idea: "${idea}" for the target market: "${targetMarket}". ${
      competitionInfo ? `Here's information about the competition: ${competitionInfo}.` : ""
    }
    
    Provide a SWOT analysis and recommendations for a deaf entrepreneur starting this business.
    
    Format your response as a JSON object with the following properties:
    - viabilityScore: a number between 1-10 representing overall viability
    - strengths: an array of strings highlighting key strengths
    - weaknesses: an array of strings highlighting key weaknesses
    - opportunities: an array of strings highlighting key opportunities
    - threats: an array of strings highlighting key threats
    - recommendations: an array of strings with actionable recommendations`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("Error analyzing business idea:", error);
    throw new Error(`Failed to analyze business idea: ${error.message}`);
  }
}

// Create a business plan outline using OpenAI
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
  try {
    const prompt = `Create a business plan outline for "${businessName}": ${businessDescription}. The target market is: ${targetMarket}.
    
    Generate an outline with the standard business plan sections, providing a brief description and 3-5 key points to address for each section.
    
    Keep in mind this is for a deaf entrepreneur who may require accommodations for communication with hearing clients/suppliers.
    
    Format your response as a JSON object with a 'sections' array containing objects with the properties: title, description, and keyPoints (an array of strings).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("Error creating business plan outline:", error);
    throw new Error(`Failed to create business plan outline: ${error.message}`);
  }
}