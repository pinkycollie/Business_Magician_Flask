/**
 * Google Workspace Integration Service for 360 Business Magician
 * 
 * Provides automation with Google Docs, Sheets, Forms, and Drive for MVP functionality
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// OAuth2 configuration
let oAuth2Client = null;

/**
 * Initialize the Google Workspace client
 * Use either API key or OAuth2 based on the available credentials
 */
function initializeGoogleClient() {
  if (oAuth2Client) return oAuth2Client;
  
  try {
    // Check if we have OAuth credentials
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI) {
      oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
      
      // Set credentials if refresh token is available
      if (process.env.GOOGLE_REFRESH_TOKEN) {
        oAuth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });
      }
      
      console.log('Google Workspace OAuth client initialized');
      return oAuth2Client;
    } 
    
    // Check if we have service account credentials
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/documents',
          'https://www.googleapis.com/auth/forms'
        ]
      });
      console.log('Google Workspace service account initialized');
      return auth;
    }
    
    console.warn('No Google Workspace credentials found. Service will not be available.');
    return null;
  } catch (error) {
    console.error('Error initializing Google client:', error);
    return null;
  }
}

/**
 * Get Google Drive service
 */
function getDriveService() {
  const auth = initializeGoogleClient();
  if (!auth) return null;
  return google.drive({ version: 'v3', auth });
}

/**
 * Get Google Sheets service
 */
function getSheetsService() {
  const auth = initializeGoogleClient();
  if (!auth) return null;
  return google.sheets({ version: 'v4', auth });
}

/**
 * Get Google Docs service
 */
function getDocsService() {
  const auth = initializeGoogleClient();
  if (!auth) return null;
  return google.docs({ version: 'v1', auth });
}

/**
 * Get Google Forms service
 */
function getFormsService() {
  const auth = initializeGoogleClient();
  if (!auth) return null;
  return google.forms({ version: 'v1', auth });
}

/**
 * Create a folder in Google Drive
 * @param {string} folderName - Name of the folder to create
 * @param {string} parentFolderId - Optional parent folder ID
 * @returns {Promise<Object>} - The folder data or error
 */
export async function createFolder(folderName, parentFolderId = null) {
  try {
    const drive = getDriveService();
    if (!drive) throw new Error('Drive service not available');
    
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };
    
    if (parentFolderId) {
      folderMetadata.parents = [parentFolderId];
    }
    
    const response = await drive.files.create({
      resource: folderMetadata,
      fields: 'id, name, webViewLink'
    });
    
    return {
      success: true,
      folderId: response.data.id,
      name: response.data.name,
      link: response.data.webViewLink
    };
  } catch (error) {
    console.error('Error creating Google Drive folder:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create a Google Docs document
 * @param {string} title - Title of the document
 * @param {string} folderId - Optional folder ID to place document in
 * @returns {Promise<Object>} - The document data or error
 */
export async function createDocument(title, folderId = null) {
  try {
    const drive = getDriveService();
    if (!drive) throw new Error('Drive service not available');
    
    const fileMetadata = {
      name: title,
      mimeType: 'application/vnd.google-apps.document'
    };
    
    if (folderId) {
      fileMetadata.parents = [folderId];
    }
    
    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name, webViewLink'
    });
    
    return {
      success: true,
      documentId: response.data.id,
      name: response.data.name,
      link: response.data.webViewLink
    };
  } catch (error) {
    console.error('Error creating Google Docs document:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Write content to a Google Docs document
 * @param {string} documentId - The document ID
 * @param {Object} content - Content to write (as per Google Docs API)
 * @returns {Promise<Object>} - The result of the operation
 */
export async function writeToDocument(documentId, content) {
  try {
    const docs = getDocsService();
    if (!docs) throw new Error('Docs service not available');
    
    const response = await docs.documents.batchUpdate({
      documentId,
      resource: {
        requests: content
      }
    });
    
    return {
      success: true,
      documentId,
      result: response.data
    };
  } catch (error) {
    console.error('Error writing to Google Docs document:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create a Google Sheets spreadsheet
 * @param {string} title - Title of the spreadsheet
 * @param {string} folderId - Optional folder ID to place spreadsheet in
 * @returns {Promise<Object>} - The spreadsheet data or error
 */
export async function createSpreadsheet(title, folderId = null) {
  try {
    const sheets = getSheetsService();
    if (!sheets) throw new Error('Sheets service not available');
    
    const resource = {
      properties: {
        title: title
      }
    };
    
    const response = await sheets.spreadsheets.create({
      resource,
      fields: 'spreadsheetId,properties.title,spreadsheetUrl'
    });
    
    // If folder ID is provided, move the file to that folder
    if (folderId) {
      const drive = getDriveService();
      await drive.files.update({
        fileId: response.data.spreadsheetId,
        addParents: folderId,
        fields: 'id, parents'
      });
    }
    
    return {
      success: true,
      spreadsheetId: response.data.spreadsheetId,
      title: response.data.properties.title,
      url: response.data.spreadsheetUrl
    };
  } catch (error) {
    console.error('Error creating Google Sheets spreadsheet:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update values in a Google Sheets spreadsheet
 * @param {string} spreadsheetId - The spreadsheet ID
 * @param {string} range - The range to update (e.g., 'Sheet1!A1:D5')
 * @param {Array} values - The values to update
 * @returns {Promise<Object>} - The result of the operation
 */
export async function updateSpreadsheetValues(spreadsheetId, range, values) {
  try {
    const sheets = getSheetsService();
    if (!sheets) throw new Error('Sheets service not available');
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values
      }
    });
    
    return {
      success: true,
      updatedCells: response.data.updatedCells,
      updatedRange: response.data.updatedRange
    };
  } catch (error) {
    console.error('Error updating Google Sheets values:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a business plan Google Doc
 * @param {Object} businessData - Business data for the plan
 * @returns {Promise<Object>} - The document data or error
 */
export async function generateBusinessPlan(businessData) {
  try {
    // Create a folder for the business
    const folderResult = await createFolder(`${businessData.name} - Business Documents`);
    if (!folderResult.success) {
      throw new Error(`Failed to create business folder: ${folderResult.error}`);
    }
    
    // Create a business plan document
    const docResult = await createDocument(`${businessData.name} - Business Plan`, folderResult.folderId);
    if (!docResult.success) {
      throw new Error(`Failed to create business plan document: ${docResult.error}`);
    }
    
    // Add content to the business plan
    const content = {
      requests: [
        {
          insertText: {
            location: {
              index: 1
            },
            text: `# ${businessData.name} - Business Plan\n\n`
          }
        },
        {
          insertText: {
            location: {
              index: businessData.name.length + 18
            },
            text: `## Executive Summary\n\n${businessData.description || 'A promising business opportunity'}\n\n`
          }
        },
        {
          insertText: {
            location: {
              index: 1000 // Arbitrary high index
            },
            text: `## Business Details\n\nType: ${businessData.businessType || 'TBD'}\nStatus: ${businessData.formationStatus || 'Startup'}\n\n## Next Steps\n\n1. Complete market research\n2. Validate business idea with potential customers\n3. Prepare financial projections\n4. Develop minimum viable product (MVP)`
          }
        }
      ]
    };
    
    await writeToDocument(docResult.documentId, content);
    
    // Create a financial projections spreadsheet
    const sheetResult = await createSpreadsheet(`${businessData.name} - Financial Projections`, folderResult.folderId);
    if (!sheetResult.success) {
      throw new Error(`Failed to create financial sheet: ${sheetResult.error}`);
    }
    
    // Add initial financial data to the spreadsheet
    const headers = [
      ['Month', 'Revenue', 'Expenses', 'Profit']
    ];
    const initialData = [
      [1, 0, 500, -500],
      [2, 500, 600, -100],
      [3, 1000, 700, 300],
      [4, 1500, 800, 700],
      [5, 2000, 900, 1100],
      [6, 2500, 1000, 1500]
    ];
    
    await updateSpreadsheetValues(sheetResult.spreadsheetId, 'Sheet1!A1:D1', headers);
    await updateSpreadsheetValues(sheetResult.spreadsheetId, 'Sheet1!A2:D7', initialData);
    
    return {
      success: true,
      businessName: businessData.name,
      folderId: folderResult.folderId,
      folderLink: folderResult.link,
      businessPlan: {
        documentId: docResult.documentId,
        link: docResult.link
      },
      financials: {
        spreadsheetId: sheetResult.spreadsheetId,
        url: sheetResult.url
      }
    };
  } catch (error) {
    console.error('Error generating business plan:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a business idea survey form
 * @param {Object} ideaData - Data for the survey
 * @returns {Promise<Object>} - The form data or error
 */
export async function createBusinessIdeaValidator(ideaData) {
  try {
    // Create a folder for the business validation
    const folderResult = await createFolder(`${ideaData.title} - Validation`);
    if (!folderResult.success) {
      throw new Error(`Failed to create validation folder: ${folderResult.error}`);
    }
    
    // Since Google Forms API is limited, we'll create a spreadsheet for tracking responses
    const sheetResult = await createSpreadsheet(`${ideaData.title} - Market Validation Responses`, folderResult.folderId);
    if (!sheetResult.success) {
      throw new Error(`Failed to create response sheet: ${sheetResult.error}`);
    }
    
    // Set up the tracking spreadsheet
    const headers = [
      ['Timestamp', 'Respondent', 'Interest Level (1-5)', 'Willingness to Pay ($)', 'Feedback']
    ];
    
    await updateSpreadsheetValues(sheetResult.spreadsheetId, 'Sheet1!A1:E1', headers);
    
    // Create a document with survey instructions and link
    const docResult = await createDocument(`${ideaData.title} - Market Validation Plan`, folderResult.folderId);
    if (!docResult.success) {
      throw new Error(`Failed to create validation document: ${docResult.error}`);
    }
    
    const content = {
      requests: [
        {
          insertText: {
            location: {
              index: 1
            },
            text: `# ${ideaData.title} - Market Validation Plan\n\n`
          }
        },
        {
          insertText: {
            location: {
              index: ideaData.title.length + 30
            },
            text: `## Business Idea Summary\n\n${ideaData.description || 'A promising business idea'}\n\n`
          }
        },
        {
          insertText: {
            location: {
              index: 1000 // Arbitrary high index
            },
            text: `## Validation Plan\n\n1. Create a simple Google Form with the following questions:\n   - How interested are you in this product/service? (1-5 scale)\n   - How much would you be willing to pay for this product/service?\n   - What features would you expect to see?\n   - What concerns would prevent you from purchasing?\n\n2. Share the form with at least 20 potential customers in your target market\n\n3. Track responses in the linked spreadsheet\n\n4. Analyze results to determine viability\n\n## Validation Spreadsheet\n\nTrack responses in this spreadsheet: ${sheetResult.url}\n\n## Next Steps\n\nAfter collecting at least 20 responses:\n1. Calculate average interest level (should be >3.5)\n2. Calculate average willingness to pay (should exceed your cost)\n3. Identify common requested features\n4. Address common concerns in your business plan`
          }
        }
      ]
    };
    
    await writeToDocument(docResult.documentId, content);
    
    return {
      success: true,
      ideaTitle: ideaData.title,
      folderId: folderResult.folderId,
      folderLink: folderResult.link,
      validationPlan: {
        documentId: docResult.documentId,
        link: docResult.link
      },
      responsesSheet: {
        spreadsheetId: sheetResult.spreadsheetId,
        url: sheetResult.url
      }
    };
  } catch (error) {
    console.error('Error creating business idea validator:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create a business formation checklist
 * @param {Object} businessData - Business formation data
 * @returns {Promise<Object>} - The document data or error
 */
export async function createBusinessFormationChecklist(businessData) {
  try {
    // Create or use existing folder
    let folderId = null;
    if (businessData.folderId) {
      folderId = businessData.folderId;
    } else {
      const folderResult = await createFolder(`${businessData.name} - Business Formation`);
      if (!folderResult.success) {
        throw new Error(`Failed to create business formation folder: ${folderResult.error}`);
      }
      folderId = folderResult.folderId;
    }
    
    // Create a checklist document
    const docResult = await createDocument(`${businessData.name} - Formation Checklist`, folderId);
    if (!docResult.success) {
      throw new Error(`Failed to create checklist document: ${docResult.error}`);
    }
    
    // Get state-specific items if applicable
    const stateSpecificItems = getStateSpecificItems(businessData.formationState);
    
    // Add content to the checklist
    const content = {
      requests: [
        {
          insertText: {
            location: {
              index: 1
            },
            text: `# ${businessData.name} - Business Formation Checklist\n\n`
          }
        },
        {
          insertText: {
            location: {
              index: businessData.name.length + 35
            },
            text: `## Business Information\n\nName: ${businessData.name}\nType: ${businessData.businessType || 'TBD'}\nState: ${businessData.formationState || 'TBD'}\n\n`
          }
        },
        {
          insertText: {
            location: {
              index: 1000 // Arbitrary high index
            },
            text: `## Required Steps\n\n- [ ] Choose your business name\n- [ ] Check business name availability\n- [ ] Select your business structure (LLC, Corporation, etc.)\n- [ ] Register your business with state authorities\n- [ ] Obtain EIN from the IRS\n- [ ] Open business bank account\n- [ ] Apply for necessary business licenses\n- [ ] Register for state and local taxes\n- [ ] Set up accounting system\n- [ ] Obtain business insurance\n\n## State-Specific Requirements - ${businessData.formationState || 'General'}\n\n${stateSpecificItems}\n\n## Accessibility Considerations\n\n- [ ] Ensure business website meets WCAG standards\n- [ ] Provide ASL interpretation services if offering customer-facing operations\n- [ ] Review ADA compliance for physical locations\n- [ ] Include accessibility statement in business documentation\n- [ ] Consider VR counseling resources for hiring employees`
          }
        }
      ]
    };
    
    await writeToDocument(docResult.documentId, content);
    
    // Create a formation tracking sheet
    const sheetResult = await createSpreadsheet(`${businessData.name} - Formation Tracking`, folderId);
    if (!sheetResult.success) {
      throw new Error(`Failed to create tracking sheet: ${sheetResult.error}`);
    }
    
    // Add tracking columns to the spreadsheet
    const headers = [
      ['Task', 'Due Date', 'Status', 'Assigned To', 'Notes', 'Cost ($)', 'Completion Date']
    ];
    
    const initialData = [
      ['Business Name Registration', '', 'Not Started', '', '', '', ''],
      ['EIN Application', '', 'Not Started', '', '', '', ''],
      ['State Filing', '', 'Not Started', '', '', '', ''],
      ['Business License', '', 'Not Started', '', '', '', ''],
      ['Bank Account Setup', '', 'Not Started', '', '', '', ''],
      ['Insurance Applications', '', 'Not Started', '', '', '', '']
    ];
    
    await updateSpreadsheetValues(sheetResult.spreadsheetId, 'Sheet1!A1:G1', headers);
    await updateSpreadsheetValues(sheetResult.spreadsheetId, 'Sheet1!A2:G7', initialData);
    
    return {
      success: true,
      businessName: businessData.name,
      folderId: folderId,
      checklist: {
        documentId: docResult.documentId,
        link: docResult.link
      },
      formationTracking: {
        spreadsheetId: sheetResult.spreadsheetId,
        url: sheetResult.url
      }
    };
  } catch (error) {
    console.error('Error creating business formation checklist:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get state-specific business formation requirements
 * @param {string} state - Two-letter state code or state name
 * @returns {string} - State-specific checklist items
 */
function getStateSpecificItems(state) {
  // Default general items
  if (!state) {
    return "- [ ] Research specific requirements for your state\n- [ ] Check county/city specific requirements";
  }
  
  const stateMap = {
    'DE': '- [ ] File Certificate of Formation with Delaware Division of Corporations\n- [ ] Appoint a Registered Agent in Delaware\n- [ ] Pay annual franchise tax\n- [ ] File Annual Report',
    'CA': '- [ ] File Articles of Organization/Incorporation with California Secretary of State\n- [ ] Obtain California EIN/Tax ID\n- [ ] File Statement of Information within 90 days\n- [ ] Register for California Sales Tax Permit if applicable\n- [ ] Comply with California-specific employment regulations',
    'NY': '- [ ] File Articles of Organization with New York Department of State\n- [ ] Publish notice of formation in two newspapers\n- [ ] File Certificate of Publication with NY DOS\n- [ ] Register for New York State and local taxes',
    'TX': '- [ ] File Certificate of Formation with Texas Secretary of State\n- [ ] Apply for Texas state tax permits\n- [ ] Check local municipality requirements\n- [ ] No state income tax filing required (for certain entities)'
  };
  
  // Check for state code or normalize state name
  const stateCode = state.length === 2 ? state.toUpperCase() : null;
  
  return stateMap[stateCode] || "- [ ] Research specific requirements for your state\n- [ ] Check county/city specific requirements";
}

export default {
  generateBusinessPlan,
  createBusinessIdeaValidator,
  createBusinessFormationChecklist,
  createFolder,
  createDocument,
  writeToDocument,
  createSpreadsheet,
  updateSpreadsheetValues
};