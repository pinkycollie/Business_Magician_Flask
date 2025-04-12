/**
 * Notion Service for 360 Business Magician
 * Handles saving API results to a Notion database
 */

import { Client } from '@notionhq/client';

// Initialize Notion client
export const initNotionClient = () => {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
  
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.warn('Notion integration not available: Missing API key or database ID');
    return null;
  }
  
  try {
    return new Client({ auth: NOTION_API_KEY });
  } catch (error) {
    console.error('Failed to initialize Notion client:', error);
    return null;
  }
};

// Save business idea to Notion
export const saveBusinessIdeaToNotion = async (idea) => {
  const notion = initNotionClient();
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  if (!notion || !databaseId) {
    console.warn('Could not save to Notion: Client or database ID missing');
    return { success: false, error: 'Notion integration not available' };
  }
  
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // These property names should match your Notion database structure
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
        Interests: {
          multi_select: idea.interests.map(interest => ({ name: interest }))
        },
        GeneratedAt: {
          date: {
            start: idea.generatedAt
          }
        },
        Type: {
          select: {
            name: "Business Idea"
          }
        }
      }
    });
    
    return { success: true, notionPageId: response.id };
  } catch (error) {
    console.error('Error saving to Notion:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to save to Notion',
      details: error.body || {}
    };
  }
};

// Save business tool result to Notion
export const saveToolResultToNotion = async (toolId, toolName, result) => {
  const notion = initNotionClient();
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  if (!notion || !databaseId) {
    console.warn('Could not save tool result to Notion: Client or database ID missing');
    return { success: false, error: 'Notion integration not available' };
  }
  
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: `${toolName} Result`
              }
            }
          ]
        },
        Description: {
          rich_text: [
            {
              text: {
                content: JSON.stringify(result)
              }
            }
          ]
        },
        GeneratedAt: {
          date: {
            start: new Date().toISOString()
          }
        },
        Type: {
          select: {
            name: "Tool Result"
          }
        },
        ToolId: {
          rich_text: [
            {
              text: {
                content: toolId
              }
            }
          ]
        }
      }
    });
    
    return { success: true, notionPageId: response.id };
  } catch (error) {
    console.error('Error saving tool result to Notion:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to save to Notion',
      details: error.body || {}
    };
  }
};