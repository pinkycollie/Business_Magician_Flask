/**
 * 360 Business Magician - Generate Business Idea to Notion
 * 
 * This standalone script generates a business idea and saves it directly to Notion.
 * It doesn't require running a server, making it more reliable for testing.
 */

import { Client } from '@notionhq/client';

// Initialize Notion client
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('Error: Missing Notion API key or database ID');
  console.error('Make sure NOTION_API_KEY and NOTION_DATABASE_ID environment variables are set');
  process.exit(1);
}

console.log('Initializing Notion client...');
const notion = new Client({ auth: NOTION_API_KEY });

// Business idea generator function
function generateBusinessIdea(interests = ['technology'], marketInfo = 'general', constraints = []) {
  console.log(`Generating business idea for interests: ${interests.join(', ')}`);
  console.log(`Market info: ${marketInfo}`);
  console.log(`Constraints: ${constraints.join(', ')}`);
  
  // Business idea templates
  const ideaTemplates = [
    { 
      name: "Mobile App for Deaf Entrepreneurs", 
      description: "A specialized mobile app that provides business guidance, resources and networking opportunities specifically designed for deaf entrepreneurs."
    },
    { 
      name: "ASL Business Training Platform", 
      description: "Online platform offering business courses and certifications in American Sign Language."
    },
    { 
      name: "Accessibility Consulting Service", 
      description: "Consulting service that helps businesses improve accessibility for deaf and hard-of-hearing customers and employees."
    },
    { 
      name: "Deaf-Friendly Co-working Space", 
      description: "Co-working space designed with deaf entrepreneurs in mind, featuring visual alerts, specialized meeting rooms, and sign language interpreters."
    },
    { 
      name: "ASL Interpretation Booking Platform", 
      description: "Platform connecting businesses with qualified ASL interpreters for meetings, events, and customer service."
    },
    { 
      name: "Visual Alert Smart Home System", 
      description: "Smart home system specifically designed for deaf individuals that uses visual alerts instead of auditory ones for doorbells, alarms, and other notifications."
    },
    { 
      name: "Accessible Video Communication Platform", 
      description: "Video communication platform with built-in caption generation and sign language interpretation for business meetings."
    },
    { 
      name: "Deaf-Owned Products Marketplace", 
      description: "Online marketplace exclusively featuring products and services from deaf-owned businesses."
    },
    { 
      name: "ASL Financial Services App", 
      description: "Mobile app providing financial management tools and education with ASL video support."
    },
    { 
      name: "Deaf Entrepreneurship Community", 
      description: "Online and in-person community platform connecting deaf entrepreneurs for networking, mentorship, and resource sharing."
    }
  ];

  // Select random idea from templates
  const randomIndex = Math.floor(Math.random() * ideaTemplates.length);
  
  // Return complete idea object
  return {
    ...ideaTemplates[randomIndex],
    generatedAt: new Date().toISOString(),
    interests: interests,
    viabilityScore: Math.floor(Math.random() * 100),
    implementationComplexity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)]
  };
}

// Function to save business idea to Notion
async function saveIdeaToNotion(idea) {
  console.log('Saving business idea to Notion...');
  console.log(`Idea: ${idea.name}`);
  
  try {
    // Construct Notion page properties
    const properties = {
      Name: {
        title: [
          {
            text: {
              content: idea.name
            }
          }
        ]
      },
      Description: {
        rich_text: [
          {
            text: {
              content: idea.description
            }
          }
        ]
      },
      ViabilityScore: {
        number: idea.viabilityScore
      },
      Complexity: {
        select: {
          name: idea.implementationComplexity
        }
      },
      Type: {
        select: {
          name: "Business Idea"
        }
      },
      GeneratedAt: {
        date: {
          start: idea.generatedAt
        }
      }
    };

    // Add interests as multi-select
    if (Array.isArray(idea.interests) && idea.interests.length > 0) {
      properties.Interests = {
        multi_select: idea.interests.map(interest => ({ name: interest }))
      };
    }

    // Create page in Notion database
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: properties
    });

    console.log('✅ Successfully saved to Notion!');
    console.log(`Notion Page ID: ${response.id}`);
    console.log(`Notion Page URL: https://notion.so/${response.id.replace(/-/g, '')}`);
    
    return response;
  } catch (error) {
    console.error('❌ Error saving to Notion:');
    console.error(error.message);
    if (error.body) {
      console.error('Error details:', error.body);
    }
    
    throw error;
  }
}

// Main execution function
async function main() {
  try {
    // Parse command line arguments if provided
    let interests = ['technology', 'accessibility'];
    let marketInfo = 'deaf entrepreneurs';
    let constraints = ['low startup cost'];
    
    // Command line arguments override defaults
    const args = process.argv.slice(2);
    if (args.length >= 1) {
      interests = args[0].split(',').map(i => i.trim());
    }
    if (args.length >= 2) {
      marketInfo = args[1];
    }
    if (args.length >= 3) {
      constraints = args[2].split(',').map(c => c.trim());
    }
    
    // Generate a business idea
    const idea = generateBusinessIdea(interests, marketInfo, constraints);
    
    // Print the generated idea
    console.log('\nGenerated Business Idea:');
    console.log('=====================');
    console.log(`Name: ${idea.name}`);
    console.log(`Description: ${idea.description}`);
    console.log(`Viability Score: ${idea.viabilityScore}/100`);
    console.log(`Complexity: ${idea.implementationComplexity}`);
    console.log(`Interests: ${idea.interests.join(', ')}`);
    console.log(`Generated At: ${new Date(idea.generatedAt).toLocaleString()}`);
    console.log('=====================\n');
    
    // Save the idea to Notion
    await saveIdeaToNotion(idea);
    
    process.exit(0);
  } catch (error) {
    console.error('An error occurred during execution:');
    console.error(error);
    process.exit(1);
  }
}

// Execute the main function
main();