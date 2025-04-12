import { getOpenAIClient } from "./services/aiLazyLoader";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

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
    // Get OpenAI client using lazy loader
    const openai = getOpenAIClient();
    
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
  } catch (error) {
    console.error("Error generating business ideas:", error);
    // Fall back to sample ideas if OpenAI fails
    return {
      ideas: [
        {
          title: "Accessible Tech Consulting",
          description: "Provide consultation services to businesses looking to make their technology more accessible to deaf and hard-of-hearing individuals.",
          marketPotential: "High",
          difficultyLevel: "Medium",
          startupCosts: "$5,000 - $15,000"
        },
        {
          title: "ASL Learning Platform",
          description: "Develop an interactive platform that teaches American Sign Language through immersive lessons and real-time feedback.",
          marketPotential: "Medium",
          difficultyLevel: "High",
          startupCosts: "$20,000 - $50,000"
        },
        {
          title: "Deaf-Owned Coffee Shop",
          description: "A café that employs deaf individuals and creates an inclusive environment with visual cues and technology integration.",
          marketPotential: "Medium",
          difficultyLevel: "Medium",
          startupCosts: "$80,000 - $150,000"
        }
      ]
    };
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
    // Get OpenAI client using lazy loader
    const openai = getOpenAIClient();
    
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