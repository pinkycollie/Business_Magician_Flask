/**
 * Notion Integration Service
 * 
 * This service provides functionality to interact with Notion API for:
 * - Project tracking
 * - Documentation
 * - Knowledge base management
 * - Business formation tracking
 */

import { Client } from '@notionhq/client';
import { z } from 'zod';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;

// Check if Notion is properly configured
export function isNotionConfigured(): boolean {
  return !!(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
}

// Notion record types
const recordTypes = {
  BUSINESS_FORMATION: 'Business Formation',
  API_INTEGRATION: 'API Integration',
  FEATURE: 'Feature',
  DOCUMENTATION: 'Documentation',
  KNOWLEDGE_BASE: 'Knowledge Base',
  ISSUE: 'Issue',
  USER_REQUEST: 'User Request',
} as const;

// Notion status types
const statusTypes = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  BLOCKED: 'Blocked',
  REVIEWING: 'Reviewing',
} as const;

// Zod schema for the creation of a Notion page
const CreatePageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum([
    recordTypes.BUSINESS_FORMATION,
    recordTypes.API_INTEGRATION,
    recordTypes.FEATURE,
    recordTypes.DOCUMENTATION,
    recordTypes.KNOWLEDGE_BASE,
    recordTypes.ISSUE,
    recordTypes.USER_REQUEST,
  ]),
  status: z.enum([
    statusTypes.NOT_STARTED,
    statusTypes.IN_PROGRESS,
    statusTypes.COMPLETED,
    statusTypes.BLOCKED,
    statusTypes.REVIEWING,
  ]).default(statusTypes.NOT_STARTED),
  url: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assignee: z.string().optional(),
});

// Type for creating a notion page
export type CreatePageInput = z.infer<typeof CreatePageSchema>;

/**
 * Creates a new page in the Notion database
 */
export async function createPage(input: CreatePageInput) {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }
  
  try {
    // Validate input
    const validatedInput = CreatePageSchema.parse(input);
    
    // Prepare page properties
    const properties: any = {
      Name: {
        title: [
          {
            text: {
              content: validatedInput.title,
            },
          },
        ],
      },
      Type: {
        select: {
          name: validatedInput.type,
        },
      },
      Status: {
        select: {
          name: validatedInput.status,
        },
      },
    };

    // Add optional properties if provided
    if (validatedInput.description) {
      properties.Description = {
        rich_text: [
          {
            text: {
              content: validatedInput.description,
            },
          },
        ],
      };
    }

    if (validatedInput.url) {
      properties.URL = {
        url: validatedInput.url,
      };
    }

    if (validatedInput.assignee) {
      properties.Assignee = {
        rich_text: [
          {
            text: {
              content: validatedInput.assignee,
            },
          },
        ],
      };
    }

    if (validatedInput.tags && validatedInput.tags.length > 0) {
      properties.Tags = {
        multi_select: validatedInput.tags.map(tag => ({ name: tag })),
      };
    }

    // Create the page
    const response = await notion.pages.create({
      parent: { database_id: databaseId! },
      properties: properties,
    });

    return {
      id: response.id,
      url: response.url,
    };
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
}

/**
 * Update an existing page in the Notion database
 */
export async function updatePage(pageId: string, input: Partial<CreatePageInput>) {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }

  try {
    const properties: any = {};

    if (input.title) {
      properties.Name = {
        title: [
          {
            text: {
              content: input.title,
            },
          },
        ],
      };
    }

    if (input.type) {
      properties.Type = {
        select: {
          name: input.type,
        },
      };
    }

    if (input.status) {
      properties.Status = {
        select: {
          name: input.status,
        },
      };
    }

    if (input.description) {
      properties.Description = {
        rich_text: [
          {
            text: {
              content: input.description,
            },
          },
        ],
      };
    }

    if (input.url) {
      properties.URL = {
        url: input.url,
      };
    }

    if (input.assignee) {
      properties.Assignee = {
        rich_text: [
          {
            text: {
              content: input.assignee,
            },
          },
        ],
      };
    }

    if (input.tags) {
      properties.Tags = {
        multi_select: input.tags.map(tag => ({ name: tag })),
      };
    }

    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties,
    });

    return {
      id: response.id,
      url: response.url,
    };
  } catch (error) {
    console.error('Error updating Notion page:', error);
    throw error;
  }
}

/**
 * Query pages in the Notion database
 */
export async function queryPages(filter?: { type?: string; status?: string; tags?: string[] }) {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }

  try {
    const queryOptions: any = {
      database_id: databaseId!,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    };

    if (filter) {
      const filterConditions: any[] = [];

      if (filter.type) {
        filterConditions.push({
          property: 'Type',
          select: {
            equals: filter.type,
          },
        });
      }

      if (filter.status) {
        filterConditions.push({
          property: 'Status',
          select: {
            equals: filter.status,
          },
        });
      }

      if (filter.tags && filter.tags.length > 0) {
        filterConditions.push({
          property: 'Tags',
          multi_select: {
            contains: filter.tags[0],
          },
        });
      }

      if (filterConditions.length > 0) {
        queryOptions.filter = filterConditions.length === 1
          ? filterConditions[0]
          : {
              and: filterConditions,
            };
      }
    }

    const response = await notion.databases.query(queryOptions);
    
    return response.results.map((page: any) => {
      const properties = page.properties;
      
      return {
        id: page.id,
        url: page.url,
        title: properties.Name.title[0]?.text.content || 'Untitled',
        type: properties.Type?.select?.name || '',
        status: properties.Status?.select?.name || '',
        description: properties.Description?.rich_text[0]?.text.content || '',
        externalUrl: properties.URL?.url || '',
        tags: properties.Tags?.multi_select.map((tag: any) => tag.name) || [],
        assignee: properties.Assignee?.rich_text[0]?.text.content || '',
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      };
    });
  } catch (error) {
    console.error('Error querying Notion pages:', error);
    throw error;
  }
}

/**
 * Add content blocks to a page
 */
export async function addContentToPage(pageId: string, content: string) {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }

  try {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');
    
    const children = paragraphs.map(paragraph => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: paragraph,
            },
          },
        ],
      },
    }));

    await notion.blocks.children.append({
      block_id: pageId,
      children: children,
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding content to Notion page:', error);
    throw error;
  }
}

/**
 * Creates a new documentation page for the project
 */
export async function createDocumentationPage(title: string, content: string, tags: string[] = []) {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }

  try {
    // Create the page first
    const page = await createPage({
      title,
      type: recordTypes.DOCUMENTATION,
      status: statusTypes.COMPLETED,
      tags,
    });

    // Then add the content to it
    await addContentToPage(page.id, content);

    return page;
  } catch (error) {
    console.error('Error creating documentation page:', error);
    throw error;
  }
}

/**
 * Create a knowledge base article in Notion
 */
export async function createKnowledgeBaseArticle(title: string, content: string, tags: string[] = []) {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }

  try {
    // Create the page first
    const page = await createPage({
      title,
      type: recordTypes.KNOWLEDGE_BASE,
      status: statusTypes.COMPLETED,
      tags,
    });

    // Then add the content to it
    await addContentToPage(page.id, content);

    return page;
  } catch (error) {
    console.error('Error creating knowledge base article:', error);
    throw error;
  }
}

/**
 * Create a business formation record in Notion
 */
export async function createBusinessFormationRecord(
  companyName: string,
  entityType: string,
  stateCode: string,
  status: keyof typeof statusTypes = 'IN_PROGRESS',
  additionalInfo: string = '',
) {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }

  try {
    // Create the page
    const page = await createPage({
      title: `${companyName} (${entityType} - ${stateCode})`,
      description: additionalInfo,
      type: recordTypes.BUSINESS_FORMATION,
      status: statusTypes[status],
      tags: [entityType, stateCode, 'Northwest Registered Agent'],
    });

    return page;
  } catch (error) {
    console.error('Error creating business formation record:', error);
    throw error;
  }
}

/**
 * Create an API integration record in Notion
 */
export async function createApiIntegrationRecord(
  apiName: string,
  description: string,
  status: keyof typeof statusTypes = 'IN_PROGRESS',
  url: string = '',
) {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }

  try {
    // Create the page
    const page = await createPage({
      title: `${apiName} Integration`,
      description,
      type: recordTypes.API_INTEGRATION,
      status: statusTypes[status],
      url,
      tags: ['API', apiName],
    });

    return page;
  } catch (error) {
    console.error('Error creating API integration record:', error);
    throw error;
  }
}

/**
 * Generate project documentation in Notion
 */
export async function generateProjectDocumentation() {
  if (!isNotionConfigured()) {
    throw new Error('Notion API is not configured');
  }

  try {
    // Create main project documentation
    const mainPage = await createDocumentationPage(
      "360 Business Magician Project Documentation",
      "This is the central documentation hub for the 360 Business Magician project. It includes information about the project architecture, API integrations, and business formation services.",
      ["Documentation", "Project Overview"]
    );

    // Create API integrations documentation
    await createDocumentationPage(
      "API Integrations",
      `# API Integrations
      
The 360 Business Magician integrates with several external APIs to provide business formation services.

## Northwest Registered Agent API
Used for business entity formation, registered agent services, and compliance tracking.

## Corporate Tools API
Integration with Corporate Tools for document generation, filing services, and business compliance.

## Authentication
JWT authentication is used for secure API communication with service providers.`,
      ["API", "Integration"]
    );

    // Create business formation documentation
    await createDocumentationPage(
      "Business Formation Services",
      `# Business Formation Services
      
The Business Formation feature allows users to:
      
1. Select a state for business registration
2. Choose an entity type (LLC, Corporation, etc.)
3. Review filing requirements and fees
4. Access state-specific business guides
5. Purchase registered agent services
6. Submit formation requests through Northwest Registered Agent

## Process Flow
1. User selects state and entity type
2. User reviews requirements and fees
3. User submits formation request
4. Northwest Registered Agent processes the formation
5. Formation status is tracked in the application`,
      ["Business Formation", "Services"]
    );

    // Create project architecture documentation
    await createDocumentationPage(
      "Project Architecture",
      `# Project Architecture
      
The 360 Business Magician platform is built with:

## Frontend
- React with TypeScript
- TanStack Query for data fetching
- Shadcn/UI components
- Wouter for routing

## Backend
- Express.js API server
- JWT authentication for API security
- Integration with multiple service providers
- Notion API for knowledge management

## Deployment
- Vercel for frontend hosting
- Serverless functions for API endpoints`,
      ["Architecture", "Technical"]
    );

    return {
      success: true,
      mainDocumentationUrl: mainPage.url
    };
  } catch (error) {
    console.error('Error generating project documentation:', error);
    throw error;
  }
}

// Export record and status types for use in other modules
export { recordTypes, statusTypes };