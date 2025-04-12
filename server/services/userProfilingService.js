/**
 * User Profiling Service for 360 Business Magician
 * 
 * Provides personalized profiling and tailored content for different user types
 * Integrates with Google Workspace for form creation and intake processing
 */

import { google } from 'googleapis';
import googleWorkspace from './googleWorkspaceService.js';

// User profile types
const USER_TYPES = {
  DEAF_ENTREPRENEUR: 'deaf_entrepreneur',
  VR_CLIENT: 'vr_client',
  SBA_CLIENT: 'sba_client',
  GENERAL_ENTREPRENEUR: 'general_entrepreneur',
  EXISTING_BUSINESS_OWNER: 'existing_business_owner'
};

// ASL preference levels
const ASL_PREFERENCE = {
  REQUIRED: 'required',
  PREFERRED: 'preferred',
  NOT_NEEDED: 'not_needed'
};

// Business experience levels
const EXPERIENCE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

/**
 * Create an intake form in Google Forms
 * @returns {Promise<Object>} - The created intake form or error
 */
export async function createIntakeForm() {
  try {
    // Since direct Forms API is limited, we'll create a drive document with instructions
    // and a Sheet to track responses
    
    // Create a folder for intake
    const folderResult = await googleWorkspace.createFolder("360 Business Magician - Intake");
    if (!folderResult.success) {
      throw new Error(`Failed to create intake folder: ${folderResult.error}`);
    }
    
    // Create instructions document
    const docResult = await googleWorkspace.createDocument("Business Magician Intake Instructions", folderResult.folderId);
    if (!docResult.success) {
      throw new Error(`Failed to create intake instructions: ${docResult.error}`);
    }
    
    // Create intake tracking spreadsheet
    const sheetResult = await googleWorkspace.createSpreadsheet("360 Business Magician - Intake Responses", folderResult.folderId);
    if (!sheetResult.success) {
      throw new Error(`Failed to create intake responses sheet: ${sheetResult.error}`);
    }
    
    // Set up the content for the instructions
    const content = {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: "# 360 Business Magician - User Intake Form Instructions\n\n"
          }
        },
        {
          insertText: {
            location: { index: 50 },
            text: "## Welcome to 360 Business Magician!\n\nTo create a personalized experience, please follow these steps to complete your intake process:\n\n"
          }
        },
        {
          insertText: {
            location: { index: 200 },
            text: "1. Create a Google Form with the following questions:\n\n" +
                  "   - Full Name (Short Answer)\n" +
                  "   - Email Address (Short Answer)\n" +
                  "   - Phone Number (Short Answer)\n" +
                  "   - Are you deaf or hard of hearing? (Multiple Choice: Yes, No, Prefer not to say)\n" +
                  "   - Do you prefer ASL communication? (Multiple Choice: Yes - required, Yes - preferred, No)\n" +
                  "   - Are you a Vocational Rehabilitation (VR) client? (Multiple Choice: Yes, No, Not Sure)\n" +
                  "   - Are you working with the Small Business Administration (SBA)? (Multiple Choice: Yes, No, Not Sure)\n" +
                  "   - Business Stage (Multiple Choice: Idea Stage, Starting Up, Already Operating, Expanding)\n" +
                  "   - Business Experience Level (Multiple Choice: Beginner, Intermediate, Advanced)\n" +
                  "   - Industry Interest/Focus (Short Answer)\n" +
                  "   - Do you have specific accessibility needs? (Paragraph)\n" +
                  "   - What are your main goals for your business? (Paragraph)\n" +
                  "   - How did you hear about us? (Short Answer)\n\n" +
                  "2. Configure the form to collect responses in this spreadsheet: " + sheetResult.url + "\n\n" +
                  "3. Share the form with your target audience\n\n"
          }
        },
        {
          insertText: {
            location: { index: 1500 },
            text: "## After Collecting Responses\n\n" +
                 "Once you have collected intake responses, the 360 Business Magician system will:\n\n" +
                 "1. Generate personalized business formation materials tailored to each user's profile\n" +
                 "2. Create customized Google Drive folders with appropriate documents for their needs\n" +
                 "3. Provide a customized dashboard with relevant resources\n\n" +
                 "## Spreadsheet Structure\n\n" +
                 "The linked spreadsheet will track all user responses and allow you to monitor intake status."
          }
        }
      ]
    };
    
    // Add content to the instructions document
    await googleWorkspace.writeToDocument(docResult.documentId, content);
    
    // Set up the tracking spreadsheet
    const headers = [
      [
        'Timestamp', 'Name', 'Email', 'Phone', 'Deaf/HoH', 'ASL Preference',
        'VR Client', 'SBA Client', 'Business Stage', 'Experience Level',
        'Industry', 'Accessibility Needs', 'Business Goals', 'Referral Source',
        'User Type', 'Profile Folder', 'Status'
      ]
    ];
    
    await googleWorkspace.updateSpreadsheetValues(sheetResult.spreadsheetId, 'Sheet1!A1:Q1', headers);
    
    return {
      success: true,
      intakeFolder: {
        id: folderResult.folderId,
        link: folderResult.link
      },
      instructionsDoc: {
        id: docResult.documentId,
        link: docResult.link
      },
      responsesSheet: {
        id: sheetResult.spreadsheetId,
        url: sheetResult.url
      }
    };
  } catch (error) {
    console.error('Error creating intake form:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Process user intake data and create personalized content
 * @param {Object} userData - User intake data 
 * @returns {Promise<Object>} - The user profile and custom content
 */
export async function processUserIntake(userData) {
  try {
    // Determine user type based on intake
    const userType = determineUserType(userData);
    
    // Create user profile folder
    const userFolder = await googleWorkspace.createFolder(`${userData.name} - Business Profile`);
    if (!userFolder.success) {
      throw new Error(`Failed to create user folder: ${userFolder.error}`);
    }
    
    // Create customized welcome document
    const welcomeDoc = await createWelcomeDocument(userData, userType, userFolder.folderId);
    if (!welcomeDoc.success) {
      throw new Error(`Failed to create welcome document: ${welcomeDoc.error}`);
    }
    
    // Create customized task list
    const taskList = await createTaskList(userData, userType, userFolder.folderId);
    if (!taskList.success) {
      throw new Error(`Failed to create task list: ${taskList.error}`);
    }
    
    // Generate personalized business resources
    const resources = await generateBusinessResources(userData, userType, userFolder.folderId);
    if (!resources.success) {
      throw new Error(`Failed to generate resources: ${resources.error}`);
    }
    
    // Create a personalized form for further input if needed
    let followUpForm = null;
    if (needsFollowUpForm(userData, userType)) {
      followUpForm = await createFollowUpForm(userData, userType, userFolder.folderId);
    }
    
    // Update intake tracking sheet with user type and folder
    // (This would require the original sheet ID from createIntakeForm)
    
    return {
      success: true,
      userType,
      userFolder: {
        id: userFolder.folderId,
        link: userFolder.link
      },
      welcomeDocument: welcomeDoc,
      taskList: taskList,
      resources: resources,
      followUpForm: followUpForm
    };
  } catch (error) {
    console.error('Error processing user intake:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Determine user type based on intake data
 * @param {Object} userData - User intake data
 * @returns {string} - User type
 */
function determineUserType(userData) {
  // Check if user is deaf/HoH
  const isDeaf = userData.isDeaf === 'Yes';
  
  // Check if user is VR client
  const isVRClient = userData.isVRClient === 'Yes';
  
  // Check if user is SBA client
  const isSBAClient = userData.isSBAClient === 'Yes';
  
  // Check business stage
  const isExistingBusiness = 
    userData.businessStage === 'Already Operating' || 
    userData.businessStage === 'Expanding';
  
  // Determine primary user type
  if (isDeaf && isVRClient) {
    return USER_TYPES.DEAF_ENTREPRENEUR;
  } else if (isVRClient) {
    return USER_TYPES.VR_CLIENT;
  } else if (isSBAClient) {
    return USER_TYPES.SBA_CLIENT;
  } else if (isExistingBusiness) {
    return USER_TYPES.EXISTING_BUSINESS_OWNER;
  } else {
    return USER_TYPES.GENERAL_ENTREPRENEUR;
  }
}

/**
 * Create a personalized welcome document for the user
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @param {string} folderId - User's Google Drive folder ID
 * @returns {Promise<Object>} - The created document or error
 */
async function createWelcomeDocument(userData, userType, folderId) {
  try {
    // Create welcome document
    const docResult = await googleWorkspace.createDocument(
      `Welcome to 360 Business Magician - ${userData.name}`,
      folderId
    );
    
    if (!docResult.success) {
      throw new Error(`Failed to create welcome document: ${docResult.error}`);
    }
    
    // Get personalized welcome content based on user type
    const welcomeContent = getWelcomeContent(userData, userType);
    
    // Add content to the document
    await googleWorkspace.writeToDocument(docResult.documentId, welcomeContent);
    
    return {
      success: true,
      documentId: docResult.documentId,
      link: docResult.link
    };
  } catch (error) {
    console.error('Error creating welcome document:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate welcome document content based on user type
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @returns {Object} - Document content in Google Docs API format
 */
function getWelcomeContent(userData, userType) {
  // Base welcome header
  let welcomeText = `# Welcome to 360 Business Magician, ${userData.name}!\n\n`;
  
  // Personalized intro based on user type
  let intro = '';
  let resources = '';
  let nextSteps = '';
  
  switch (userType) {
    case USER_TYPES.DEAF_ENTREPRENEUR:
      intro = "We're excited to support you as a deaf entrepreneur starting your business journey! Our platform is designed with accessibility in mind, and we provide ASL resources throughout the process.\n\n";
      resources = "## Your Personalized Resources\n\n" +
        "- ASL video guides for each phase of business development\n" +
        "- Connections to VR services and benefits\n" +
        "- Deaf-owned business network opportunities\n" +
        "- Accessibility-focused business planning tools\n" +
        "- Communication resources for business meetings\n\n";
      nextSteps = "## Next Steps\n\n" +
        "1. Review your personalized task list\n" +
        "2. Schedule a virtual meeting with a VR counselor\n" +
        "3. Begin your business idea validation\n" +
        "4. Access ASL resources for business formation\n\n";
      break;
      
    case USER_TYPES.VR_CLIENT:
      intro = "Welcome to our platform designed to work alongside your VR services! We'll help you develop your business while maximizing your vocational rehabilitation benefits.\n\n";
      resources = "## Your Personalized Resources\n\n" +
        "- VR-approved business planning templates\n" +
        "- Guidelines for using VR funding for business startup\n" +
        "- Tools to document business progress for your VR counselor\n" +
        "- Accessibility resources for your specific needs\n\n";
      nextSteps = "## Next Steps\n\n" +
        "1. Share your task list with your VR counselor\n" +
        "2. Complete the business assessment form\n" +
        "3. Begin your market research\n" +
        "4. Schedule a progress check-in\n\n";
      break;
      
    case USER_TYPES.SBA_CLIENT:
      intro = "As an SBA client, you have access to specialized resources through our platform that complement your SBA services. We'll help you navigate both systems efficiently.\n\n";
      resources = "## Your Personalized Resources\n\n" +
        "- SBA-compatible business plan templates\n" +
        "- Guidance for SBA loan applications\n" +
        "- Tools for meeting SBA requirements\n" +
        "- Resource navigator for additional SBA services\n\n";
      nextSteps = "## Next Steps\n\n" +
        "1. Complete the SBA readiness assessment\n" +
        "2. Review SBA-focused business checklist\n" +
        "3. Begin financial projections for SBA applications\n" +
        "4. Schedule a meeting with your SBA advisor\n\n";
      break;
      
    case USER_TYPES.EXISTING_BUSINESS_OWNER:
      intro = "Welcome to 360 Business Magician! As an established business owner, we've customized our resources to focus on your growth and optimization needs.\n\n";
      resources = "## Your Personalized Resources\n\n" +
        "- Business expansion planning tools\n" +
        "- Market growth analysis templates\n" +
        "- Operational efficiency assessments\n" +
        "- Employee hiring and management resources\n\n";
      nextSteps = "## Next Steps\n\n" +
        "1. Complete the business assessment\n" +
        "2. Review your growth opportunity analysis\n" +
        "3. Update your business plan for expansion\n" +
        "4. Schedule a business optimization consultation\n\n";
      break;
      
    case USER_TYPES.GENERAL_ENTREPRENEUR:
    default:
      intro = "Welcome to 360 Business Magician! We're excited to help you turn your business ideas into reality with our comprehensive platform and resources.\n\n";
      resources = "## Your Personalized Resources\n\n" +
        "- Business idea validation tools\n" +
        "- Startup planning templates\n" +
        "- Market research guides\n" +
        "- Financial planning resources\n" +
        "- Legal formation checklists\n\n";
      nextSteps = "## Next Steps\n\n" +
        "1. Complete your business idea profile\n" +
        "2. Work through the idea validation checklist\n" +
        "3. Begin your market research\n" +
        "4. Draft your initial business plan\n\n";
      break;
  }
  
  // ASL preference note if applicable
  let aslNote = '';
  if (userData.aslPreference === 'Yes - required' || userData.aslPreference === 'Yes - preferred') {
    aslNote = "## ASL Resources\n\nWe've noted your preference for ASL communication. All of your business resources include ASL video guides, and you can request ASL interpreters for any virtual meetings through our platform.\n\n";
  }
  
  // Industry-specific note
  let industryNote = '';
  if (userData.industry) {
    industryNote = `## Industry Focus: ${userData.industry}\n\nWe've tailored your resources to focus on the ${userData.industry} industry. Your task list and templates will reflect industry-specific considerations and best practices.\n\n`;
  }
  
  // Compose the full document content
  const fullContent = welcomeText + intro + resources + aslNote + industryNote + nextSteps +
    "## Support\n\nIf you need any assistance, please contact us at support@360businessmagician.com or through the chat feature in our application.\n\n" +
    "We're excited to be part of your business journey!";
  
  // Format for Google Docs API
  return {
    requests: [
      {
        insertText: {
          location: { index: 1 },
          text: fullContent
        }
      }
    ]
  };
}

/**
 * Create a personalized task list for the user
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @param {string} folderId - User's Google Drive folder ID
 * @returns {Promise<Object>} - The created spreadsheet or error
 */
async function createTaskList(userData, userType, folderId) {
  try {
    // Create task list spreadsheet
    const sheetResult = await googleWorkspace.createSpreadsheet(
      `${userData.name} - Business Task List`,
      folderId
    );
    
    if (!sheetResult.success) {
      throw new Error(`Failed to create task list: ${sheetResult.error}`);
    }
    
    // Set up headers
    const headers = [
      ['Task', 'Phase', 'Due Date', 'Priority', 'Status', 'Notes', 'ASL Resource Link']
    ];
    
    await googleWorkspace.updateSpreadsheetValues(
      sheetResult.spreadsheetId, 
      'Sheet1!A1:G1', 
      headers
    );
    
    // Get personalized tasks based on user type
    const tasks = getPersonalizedTasks(userData, userType);
    
    // Add tasks to the spreadsheet
    await googleWorkspace.updateSpreadsheetValues(
      sheetResult.spreadsheetId,
      `Sheet1!A2:G${tasks.length + 1}`,
      tasks
    );
    
    return {
      success: true,
      spreadsheetId: sheetResult.spreadsheetId,
      url: sheetResult.url
    };
  } catch (error) {
    console.error('Error creating task list:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate personalized tasks based on user type
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @returns {Array} - Array of task rows for spreadsheet
 */
function getPersonalizedTasks(userData, userType) {
  // Base tasks that everyone gets
  const baseTasks = [
    ['Complete business profile', 'Setup', '', 'High', 'Not Started', '', ''],
    ['Set business goals and objectives', 'Planning', '', 'High', 'Not Started', '', '']
  ];
  
  // Type-specific tasks
  let typeTasks = [];
  
  switch (userType) {
    case USER_TYPES.DEAF_ENTREPRENEUR:
      typeTasks = [
        ['Connect with VR counselor', 'Setup', '', 'High', 'Not Started', '', 'https://example.com/asl/vr-connection'],
        ['Complete VR business assessment', 'Setup', '', 'High', 'Not Started', '', 'https://example.com/asl/vr-assessment'],
        ['Review accessibility requirements', 'Planning', '', 'Medium', 'Not Started', '', 'https://example.com/asl/accessibility'],
        ['Identify ASL-friendly business tools', 'Planning', '', 'Medium', 'Not Started', '', 'https://example.com/asl/business-tools'],
        ['Join deaf entrepreneur network', 'Networking', '', 'Medium', 'Not Started', '', 'https://example.com/asl/deaf-network'],
        ['Schedule ASL business mentor meeting', 'Mentorship', '', 'Medium', 'Not Started', '', 'https://example.com/asl/find-mentor']
      ];
      break;
      
    case USER_TYPES.VR_CLIENT:
      typeTasks = [
        ['Submit business concept to VR counselor', 'Approval', '', 'High', 'Not Started', '', ''],
        ['Complete VR business assessment', 'Assessment', '', 'High', 'Not Started', '', ''],
        ['Research VR funding eligibility', 'Funding', '', 'High', 'Not Started', '', ''],
        ['Prepare VR business plan draft', 'Planning', '', 'Medium', 'Not Started', '', ''],
        ['Document accessibility accommodations', 'Planning', '', 'Medium', 'Not Started', '', ''],
        ['Create VR progress reporting schedule', 'Management', '', 'Medium', 'Not Started', '', '']
      ];
      break;
      
    case USER_TYPES.SBA_CLIENT:
      typeTasks = [
        ['Schedule SBA advisor meeting', 'Setup', '', 'High', 'Not Started', '', ''],
        ['Complete SBA loan assessment', 'Funding', '', 'High', 'Not Started', '', ''],
        ['Prepare SBA business plan', 'Planning', '', 'High', 'Not Started', '', ''],
        ['Research SBA grant opportunities', 'Funding', '', 'Medium', 'Not Started', '', ''],
        ['Complete SBA financial projections', 'Planning', '', 'Medium', 'Not Started', '', ''],
        ['Register for SBA training webinars', 'Education', '', 'Low', 'Not Started', '', '']
      ];
      break;
      
    case USER_TYPES.EXISTING_BUSINESS_OWNER:
      typeTasks = [
        ['Complete business assessment', 'Analysis', '', 'High', 'Not Started', '', ''],
        ['Identify growth opportunities', 'Strategy', '', 'High', 'Not Started', '', ''],
        ['Analyze current financials', 'Finance', '', 'High', 'Not Started', '', ''],
        ['Update business plan', 'Planning', '', 'Medium', 'Not Started', '', ''],
        ['Evaluate staffing needs', 'Operations', '', 'Medium', 'Not Started', '', ''],
        ['Review marketing strategy', 'Marketing', '', 'Medium', 'Not Started', '', ''],
        ['Assess technology improvements', 'Operations', '', 'Low', 'Not Started', '', '']
      ];
      break;
      
    case USER_TYPES.GENERAL_ENTREPRENEUR:
    default:
      typeTasks = [
        ['Define your business idea', 'Ideation', '', 'High', 'Not Started', '', ''],
        ['Conduct initial market research', 'Research', '', 'High', 'Not Started', '', ''],
        ['Create business name ideas', 'Branding', '', 'Medium', 'Not Started', '', ''],
        ['Build minimal viable product plan', 'Development', '', 'Medium', 'Not Started', '', ''],
        ['Draft initial business plan', 'Planning', '', 'Medium', 'Not Started', '', ''],
        ['Research funding options', 'Finance', '', 'Medium', 'Not Started', '', ''],
        ['Create marketing strategy', 'Marketing', '', 'Low', 'Not Started', '', '']
      ];
      break;
  }
  
  // Experience level specific tasks
  let experienceTasks = [];
  
  if (userData.experienceLevel === EXPERIENCE_LEVELS.BEGINNER) {
    experienceTasks = [
      ['Complete business basics training', 'Education', '', 'High', 'Not Started', '', ''],
      ['Research business structures', 'Legal', '', 'High', 'Not Started', '', ''],
      ['Schedule beginner mentorship session', 'Mentorship', '', 'Medium', 'Not Started', '', '']
    ];
  } else if (userData.experienceLevel === EXPERIENCE_LEVELS.ADVANCED) {
    experienceTasks = [
      ['Develop advanced financial projections', 'Finance', '', 'Medium', 'Not Started', '', ''],
      ['Create detailed business metrics', 'Analytics', '', 'Medium', 'Not Started', '', ''],
      ['Develop scaling strategy', 'Growth', '', 'Medium', 'Not Started', '', '']
    ];
  }
  
  // ASL-specific tasks if needed
  let aslTasks = [];
  
  if (userData.aslPreference === 'Yes - required' || userData.aslPreference === 'Yes - preferred') {
    aslTasks = [
      ['Connect with ASL business resources', 'Accessibility', '', 'High', 'Not Started', '', 'https://example.com/asl/business-resources'],
      ['Set up ASL interpretation for meetings', 'Accessibility', '', 'Medium', 'Not Started', '', 'https://example.com/asl/interpretation'],
      ['Review ASL-friendly communication tools', 'Tools', '', 'Medium', 'Not Started', '', 'https://example.com/asl/communication-tools']
    ];
  }
  
  // Combine all tasks
  return [...baseTasks, ...typeTasks, ...experienceTasks, ...aslTasks];
}

/**
 * Generate personalized business resources
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @param {string} folderId - User's Google Drive folder ID
 * @returns {Promise<Object>} - The created resources or error
 */
async function generateBusinessResources(userData, userType, folderId) {
  try {
    // Create resources sub-folder
    const resourcesFolderResult = await googleWorkspace.createFolder(
      `${userData.name} - Business Resources`,
      folderId
    );
    
    if (!resourcesFolderResult.success) {
      throw new Error(`Failed to create resources folder: ${resourcesFolderResult.error}`);
    }
    
    // Create resource document
    const resourcesDocResult = await googleWorkspace.createDocument(
      `${userData.name} - Business Resources Guide`,
      resourcesFolderResult.folderId
    );
    
    if (!resourcesDocResult.success) {
      throw new Error(`Failed to create resources guide: ${resourcesDocResult.error}`);
    }
    
    // Generate personalized resources content
    const resourcesContent = getResourcesContent(userData, userType);
    
    // Add content to the document
    await googleWorkspace.writeToDocument(resourcesDocResult.documentId, resourcesContent);
    
    // Generate appropriate template documents based on user type
    const templates = await generateTemplateDocuments(userData, userType, resourcesFolderResult.folderId);
    
    return {
      success: true,
      resourcesFolder: {
        id: resourcesFolderResult.folderId,
        link: resourcesFolderResult.link
      },
      resourcesGuide: {
        id: resourcesDocResult.documentId,
        link: resourcesDocResult.link
      },
      templates: templates
    };
  } catch (error) {
    console.error('Error generating business resources:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate resources guide content
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @returns {Object} - Document content in Google Docs API format
 */
function getResourcesContent(userData, userType) {
  // Base header
  let resourcesText = `# Business Resources for ${userData.name}\n\n`;
  
  // Personalized resources intro based on user type
  let intro = '';
  let resources = '';
  let templates = '';
  
  switch (userType) {
    case USER_TYPES.DEAF_ENTREPRENEUR:
      intro = "We've compiled these specialized resources for deaf entrepreneurs. All resources include ASL video guides or have been specifically selected for accessibility.\n\n";
      resources = "## Key Resources for Deaf Entrepreneurs\n\n" +
        "- **Deaf Entrepreneurs Network**: Connect with other deaf business owners - https://example.com/deaf-entrepreneurs\n" +
        "- **VR Business Services**: Guide to vocational rehabilitation services for entrepreneurs - https://example.com/vr-business\n" +
        "- **Communication Access Funds**: Grants for interpretation services - https://example.com/comm-access\n" +
        "- **Accessible Business Tools**: Software and services with strong accessibility features - https://example.com/access-tools\n" +
        "- **ASL Business Mentorship**: Connect with experienced deaf business owners - https://example.com/asl-mentors\n\n";
      templates = "## Your Custom Templates\n\n" +
        "We've created these custom templates for your business planning:\n\n" +
        "1. **Accessible Business Plan**: Template with ASL video guides for each section\n" +
        "2. **VR Funding Request**: Template to request business startup funding through VR\n" +
        "3. **Accessibility Plan**: Document your business accessibility features\n" +
        "4. **Communication Preferences Guide**: Share with partners and customers\n\n";
      break;
      
    case USER_TYPES.VR_CLIENT:
      intro = "These resources are specifically selected to work with your VR services and benefits.\n\n";
      resources = "## VR Client Business Resources\n\n" +
        "- **VR Business Funding Guide**: How to secure business startup funding - https://example.com/vr-funding\n" +
        "- **Business Plan for VR Approval**: Key elements your plan needs for VR - https://example.com/vr-business-plan\n" +
        "- **VR Counselor Collaboration**: Tools to work effectively with your counselor - https://example.com/vr-collaboration\n" +
        "- **Accommodation Planning**: Work accommodation resources - https://example.com/accommodations\n" +
        "- **Benefits Planning**: How business income affects benefits - https://example.com/benefits-planning\n\n";
      templates = "## Your Custom Templates\n\n" +
        "We've created these custom templates for your VR business planning:\n\n" +
        "1. **VR-Approved Business Plan**: Template meeting VR requirements\n" +
        "2. **VR Progress Report**: Monthly reporting template for your counselor\n" +
        "3. **Benefits Analysis Worksheet**: Track income vs. benefits\n" +
        "4. **Accommodation Request Forms**: Templates for different scenarios\n\n";
      break;
      
    case USER_TYPES.SBA_CLIENT:
      intro = "These resources complement your SBA services and help you maximize SBA benefits.\n\n";
      resources = "## SBA-Focused Business Resources\n\n" +
        "- **SBA Loan Application Guide**: Step-by-step process - https://example.com/sba-loans\n" +
        "- **SBA Business Plan Template**: Official SBA-approved format - https://example.com/sba-plan\n" +
        "- **SBA Mentor Connection**: Find an SBA business mentor - https://example.com/sba-mentors\n" +
        "- **Government Contract Guide**: Accessing government contracts - https://example.com/gov-contracts\n" +
        "- **SBA Grant Opportunities**: Current funding options - https://example.com/sba-grants\n\n";
      templates = "## Your Custom Templates\n\n" +
        "We've created these custom templates for SBA requirements:\n\n" +
        "1. **SBA Loan Application Package**: Complete documents needed\n" +
        "2. **SBA-Format Business Plan**: Template following SBA guidelines\n" +
        "3. **SBA Financial Projections**: 3-year financial model template\n" +
        "4. **Government Contract Readiness**: Assessment and preparation\n\n";
      break;
      
    case USER_TYPES.EXISTING_BUSINESS_OWNER:
      intro = "These growth-focused resources are selected for established businesses looking to optimize and expand.\n\n";
      resources = "## Business Growth Resources\n\n" +
        "- **Business Expansion Planning**: Strategic growth models - https://example.com/expansion\n" +
        "- **Operational Efficiency Guide**: Streamlining your business - https://example.com/efficiency\n" +
        "- **Market Expansion Strategies**: Entering new markets - https://example.com/market-expansion\n" +
        "- **Business Valuation Guide**: Understanding your business worth - https://example.com/valuation\n" +
        "- **Funding Growth**: Capital options for expansion - https://example.com/growth-funding\n\n";
      templates = "## Your Custom Templates\n\n" +
        "We've created these custom templates for business growth:\n\n" +
        "1. **Business Growth Plan**: Strategic expansion template\n" +
        "2. **Operational Assessment**: Identify optimization opportunities\n" +
        "3. **Staff Planning Worksheet**: Hiring and training plans\n" +
        "4. **Market Research Template**: New market analysis\n\n";
      break;
      
    case USER_TYPES.GENERAL_ENTREPRENEUR:
    default:
      intro = "We've gathered these essential startup resources to help you build your business from the ground up.\n\n";
      resources = "## Business Startup Resources\n\n" +
        "- **Idea Validation Guide**: Test your business concept - https://example.com/idea-validation\n" +
        "- **Business Planning 101**: Step-by-step business planning - https://example.com/biz-planning\n" +
        "- **Startup Funding Options**: Ways to fund your business - https://example.com/startup-funding\n" +
        "- **Legal Formation Guide**: Choosing your business structure - https://example.com/legal-guide\n" +
        "- **Marketing Fundamentals**: Reaching your first customers - https://example.com/marketing-101\n\n";
      templates = "## Your Custom Templates\n\n" +
        "We've created these custom templates for your business startup:\n\n" +
        "1. **Lean Business Plan**: Streamlined business planning template\n" +
        "2. **Market Research Workbook**: Customer and competitor analysis\n" +
        "3. **Startup Budget Template**: Initial costs and projections\n" +
        "4. **Marketing Strategy Outline**: Basic marketing plan\n\n";
      break;
  }
  
  // Industry-specific resources
  let industryResources = '';
  if (userData.industry) {
    industryResources = `## ${userData.industry} Industry Resources\n\n` +
      "- Industry association membership information\n" +
      "- Industry-specific regulations guide\n" +
      "- Market trends and analysis\n" +
      "- Key competitors overview\n" +
      "- Industry-specific marketing channels\n\n";
  }
  
  // Compose the full document content
  const fullContent = resourcesText + intro + resources + industryResources + templates +
    "## Accessing Your Templates\n\n" +
    "All of the templates listed above are available in this folder. Simply open each document to begin customizing it for your business.\n\n" +
    "## Need More Resources?\n\n" +
    "If you need additional resources or templates, please contact your 360 Business Magician advisor.";
  
  // Format for Google Docs API
  return {
    requests: [
      {
        insertText: {
          location: { index: 1 },
          text: fullContent
        }
      }
    ]
  };
}

/**
 * Generate template documents for the user
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @param {string} folderId - User's resources folder ID
 * @returns {Promise<Object>} - The created templates or error
 */
async function generateTemplateDocuments(userData, userType, folderId) {
  try {
    // Determine which templates to create based on user type
    const templateList = getTemplateList(userData, userType);
    
    // Create each template
    const createdTemplates = [];
    
    for (const template of templateList) {
      // Create template document
      const docResult = await googleWorkspace.createDocument(
        template.name,
        folderId
      );
      
      if (!docResult.success) {
        console.error(`Failed to create template ${template.name}: ${docResult.error}`);
        continue;
      }
      
      // Add content to the template
      await googleWorkspace.writeToDocument(docResult.documentId, template.content);
      
      createdTemplates.push({
        name: template.name,
        id: docResult.documentId,
        link: docResult.link
      });
    }
    
    return {
      success: true,
      templates: createdTemplates
    };
  } catch (error) {
    console.error('Error generating template documents:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get template list based on user type
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @returns {Array} - List of templates to create with content
 */
function getTemplateList(userData, userType) {
  // Base templates that all users get
  const baseTemplates = [
    {
      name: "Business Plan Template",
      content: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: "# Business Plan\n\n" +
                    "## Executive Summary\n\n[Write a brief overview of your business plan here]\n\n" +
                    "## Business Description\n\n[Describe your business concept here]\n\n" +
                    "## Market Analysis\n\n[Outline your target market and competition here]\n\n" +
                    "## Organization & Management\n\n[Describe your business structure and team here]\n\n" +
                    "## Service or Product Line\n\n[Describe what you sell here]\n\n" +
                    "## Marketing & Sales\n\n[Outline your marketing strategy here]\n\n" +
                    "## Financial Projections\n\n[Include your financial forecasts here]\n\n" +
                    "## Funding Request\n\n[If seeking funding, outline your needs here]\n\n" +
                    "## Appendix\n\n[Include additional information here]"
            }
          }
        ]
      }
    }
  ];
  
  // Type-specific templates
  let typeTemplates = [];
  
  switch (userType) {
    case USER_TYPES.DEAF_ENTREPRENEUR:
      typeTemplates = [
        {
          name: "Accessibility Plan Template",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# Business Accessibility Plan\n\n" +
                        "## Communication Access\n\n" +
                        "- Video communication platforms: [List preferred platforms]\n" +
                        "- Interpreting services: [List providers or arrangements]\n" +
                        "- Text-based communication: [List tools and protocols]\n\n" +
                        "## Customer Accessibility\n\n" +
                        "- How will deaf/HoH customers contact your business?\n" +
                        "- What accessibility features will your website have?\n" +
                        "- What staff training will be implemented?\n\n" +
                        "## Employee Accommodations\n\n" +
                        "- What accommodations will be available for employees?\n" +
                        "- How will meetings be made accessible?\n" +
                        "- What technology will be used to support communication?\n\n" +
                        "## Marketing Accessibility\n\n" +
                        "- Will you create ASL versions of marketing material?\n" +
                        "- How will you ensure videos are captioned?\n" +
                        "- Will you highlight accessibility in your marketing?\n\n" +
                        "## Accessibility Budget\n\n" +
                        "- Interpreting services: $[Amount]\n" +
                        "- Technology and tools: $[Amount]\n" +
                        "- Staff training: $[Amount]\n" +
                        "- Other accessibility costs: $[Amount]"
                  }
                }
              ]
            }
        },
        {
          name: "VR Funding Request Template",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# Vocational Rehabilitation Business Funding Request\n\n" +
                        "## Personal Information\n\n" +
                        "Name: [Your Name]\n" +
                        "VR Counselor: [Counselor Name]\n" +
                        "VR Office: [Office Location]\n\n" +
                        "## Business Concept\n\n" +
                        "[Brief description of your business]\n\n" +
                        "## Requested Items\n\n" +
                        "| Item | Purpose | Cost | Vendor |\n" +
                        "|------|---------|------|--------|\n" +
                        "| [Item 1] | [Business purpose] | $[Amount] | [Vendor name] |\n" +
                        "| [Item 2] | [Business purpose] | $[Amount] | [Vendor name] |\n" +
                        "| [Item 3] | [Business purpose] | $[Amount] | [Vendor name] |\n\n" +
                        "Total Request: $[Total Amount]\n\n" +
                        "## Business Viability\n\n" +
                        "[Explain why your business is likely to succeed]\n\n" +
                        "## Income Potential\n\n" +
                        "[Describe expected income from this business]\n\n" +
                        "## Timeline\n\n" +
                        "[Outline when you'll use items and begin generating income]\n\n" +
                        "## Attachments\n\n" +
                        "- Business Plan\n" +
                        "- Market Research\n" +
                        "- Vendor Quotes\n" +
                        "- Financial Projections"
                  }
                }
              ]
            }
        }
      ];
      break;
      
    case USER_TYPES.VR_CLIENT:
      typeTemplates = [
        {
          name: "VR Progress Report Template",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# VR Business Progress Report\n\n" +
                        "## Reporting Period\n\n" +
                        "From: [Start Date]\n" +
                        "To: [End Date]\n\n" +
                        "## Business Development Progress\n\n" +
                        "### Completed Tasks\n" +
                        "- [Task 1]\n" +
                        "- [Task 2]\n" +
                        "- [Task 3]\n\n" +
                        "### In Progress Tasks\n" +
                        "- [Task 4] - [Percent complete]\n" +
                        "- [Task 5] - [Percent complete]\n\n" +
                        "### Challenges Encountered\n" +
                        "- [Challenge 1]\n" +
                        "- [Challenge 2]\n\n" +
                        "### Solutions Implemented\n" +
                        "- [Solution 1]\n" +
                        "- [Solution 2]\n\n" +
                        "## Financial Summary\n\n" +
                        "- Funds used: $[Amount]\n" +
                        "- Income generated: $[Amount]\n" +
                        "- Current balance: $[Amount]\n\n" +
                        "## Next Steps\n\n" +
                        "- [Next step 1]\n" +
                        "- [Next step 2]\n" +
                        "- [Next step 3]\n\n" +
                        "## Support Needed\n\n" +
                        "[Describe any support needed from VR]"
                  }
                }
              ]
            }
        },
        {
          name: "Benefits Analysis Worksheet",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# Benefits Analysis Worksheet\n\n" +
                        "## Current Benefits\n\n" +
                        "| Benefit Type | Monthly Amount | Annual Amount |\n" +
                        "|-------------|----------------|---------------|\n" +
                        "| [Benefit 1] | $[Amount] | $[Annual amount] |\n" +
                        "| [Benefit 2] | $[Amount] | $[Annual amount] |\n" +
                        "| Total | $[Total] | $[Annual total] |\n\n" +
                        "## Income Thresholds\n\n" +
                        "| Benefit | Income Limit | Effect of Exceeding |\n" +
                        "|---------|-------------|----------------------|\n" +
                        "| [Benefit 1] | $[Limit] | [Effect] |\n" +
                        "| [Benefit 2] | $[Limit] | [Effect] |\n\n" +
                        "## Projected Business Income\n\n" +
                        "| Month | Income | Expenses | Net Profit |\n" +
                        "|-------|--------|----------|------------|\n" +
                        "| 1 | $[Amount] | $[Amount] | $[Amount] |\n" +
                        "| 2 | $[Amount] | $[Amount] | $[Amount] |\n" +
                        "| 3 | $[Amount] | $[Amount] | $[Amount] |\n\n" +
                        "## Benefit Impact Analysis\n\n" +
                        "| Income Level | Benefit 1 Impact | Benefit 2 Impact | Total Impact |\n" +
                        "|--------------|------------------|------------------|-------------|\n" +
                        "| $[Level 1] | [Impact] | [Impact] | [Total change] |\n" +
                        "| $[Level 2] | [Impact] | [Impact] | [Total change] |\n\n" +
                        "## Break-Even Analysis\n\n" +
                        "Income needed to offset benefit loss: $[Amount]\n\n" +
                        "## Work Incentives to Explore\n\n" +
                        "- [Incentive 1]\n" +
                        "- [Incentive 2]\n" +
                        "- [Incentive 3]\n\n" +
                        "## Notes\n\n" +
                        "[Additional notes and considerations]"
                  }
                }
              ]
            }
        }
      ];
      break;
      
    case USER_TYPES.SBA_CLIENT:
      typeTemplates = [
        {
          name: "SBA Loan Application Package Checklist",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# SBA Loan Application Package Checklist\n\n" +
                        "## Personal Information\n\n" +
                        "- [ ] SBA Form 1919 (Borrower Information Form)\n" +
                        "- [ ] Statement of Personal History\n" +
                        "- [ ] Personal Financial Statement\n" +
                        "- [ ] Personal Tax Returns (last 3 years)\n" +
                        "- [ ] Personal Identification (Driver's License or Passport)\n" +
                        "- [ ] Resume or Biography\n\n" +
                        "## Business Information\n\n" +
                        "- [ ] Business Plan\n" +
                        "- [ ] Business Tax Returns (if existing business)\n" +
                        "- [ ] Business Financial Statements\n" +
                        "- [ ] Business Licenses and Registrations\n" +
                        "- [ ] Articles of Incorporation/Organization\n" +
                        "- [ ] Bylaws or Operating Agreement\n" +
                        "- [ ] Business Lease or Purchase Agreement\n\n" +
                        "## Financial Information\n\n" +
                        "- [ ] SBA Form 413 (Personal Financial Statement)\n" +
                        "- [ ] Detailed Project Costs and Uses of Loan Funds\n" +
                        "- [ ] Equipment Quotes or Purchase Agreements\n" +
                        "- [ ] Income Projections (3 years)\n" +
                        "- [ ] Cash Flow Projections (12 months)\n" +
                        "- [ ] Balance Sheet Projections\n\n" +
                        "## Collateral Information\n\n" +
                        "- [ ] List of Collateral\n" +
                        "- [ ] Real Estate Appraisals (if applicable)\n" +
                        "- [ ] Equipment Valuations (if applicable)\n\n" +
                        "## Additional Documents\n\n" +
                        "- [ ] Business Debt Schedule\n" +
                        "- [ ] Franchise Agreements (if applicable)\n" +
                        "- [ ] List of Suppliers and Customers\n" +
                        "- [ ] Environmental Studies (if applicable)\n\n" +
                        "## Notes\n\n" +
                        "- Submit all documents in order listed above\n" +
                        "- Keep copies of all documents submitted\n" +
                        "- Follow up with SBA lender weekly\n" +
                        "- Prepare for in-person or virtual interview"
                  }
                }
              ]
            }
        },
        {
          name: "SBA Financial Projections Template",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# SBA Financial Projections Template\n\n" +
                        "## Instructions\n\n" +
                        "This document provides guidance for creating SBA-acceptable financial projections. For the actual projections, use the accompanying spreadsheet.\n\n" +
                        "## Required Financial Statements\n\n" +
                        "1. **Income Statement (Profit & Loss)**\n" +
                        "   - Monthly for first year\n" +
                        "   - Quarterly for second year\n" +
                        "   - Annual for third year\n\n" +
                        "2. **Cash Flow Statement**\n" +
                        "   - Monthly for first year\n" +
                        "   - Quarterly for second year\n" +
                        "   - Annual for third year\n\n" +
                        "3. **Balance Sheet**\n" +
                        "   - Beginning balance\n" +
                        "   - End of year for three years\n\n" +
                        "## Key Assumptions to Document\n\n" +
                        "- Sales growth rates\n" +
                        "- Gross margin percentages\n" +
                        "- Operating expense categories\n" +
                        "- Inventory turnover\n" +
                        "- Accounts receivable terms\n" +
                        "- Accounts payable terms\n" +
                        "- Loan repayment terms\n" +
                        "- Capital expenditure plans\n\n" +
                        "## SBA Guidance\n\n" +
                        "- Be realistic, not overly optimistic\n" +
                        "- Include both best case and worst case scenarios\n" +
                        "- Clearly explain the basis for your projections\n" +
                        "- Be prepared to defend all assumptions\n" +
                        "- Tie projections to your market research\n" +
                        "- Demonstrate adequate cash flow to repay the loan\n\n" +
                        "## Common SBA Financial Requirements\n\n" +
                        "- Debt Service Coverage Ratio of at least 1.15\n" +
                        "- 10-20% owner equity injection\n" +
                        "- Working capital reserves adequate for the business type\n\n" +
                        "## Notes\n\n" +
                        "- Complete the accompanying spreadsheet template\n" +
                        "- Have projections reviewed by an accountant if possible\n" +
                        "- Be prepared to explain any unusual items or significant changes"
                  }
                }
              ]
            }
        }
      ];
      break;
      
    case USER_TYPES.EXISTING_BUSINESS_OWNER:
      typeTemplates = [
        {
          name: "Business Growth Plan Template",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# Business Growth Plan\n\n" +
                        "## Executive Summary\n\n" +
                        "[Brief overview of your growth strategy]\n\n" +
                        "## Current Business Assessment\n\n" +
                        "### Strengths\n" +
                        "- [Strength 1]\n" +
                        "- [Strength 2]\n\n" +
                        "### Weaknesses\n" +
                        "- [Weakness 1]\n" +
                        "- [Weakness 2]\n\n" +
                        "### Key Metrics (Last 12 Months)\n" +
                        "- Revenue: $[Amount]\n" +
                        "- Growth Rate: [Percentage]\n" +
                        "- Profit Margin: [Percentage]\n" +
                        "- Customer Acquisition Cost: $[Amount]\n" +
                        "- Customer Lifetime Value: $[Amount]\n\n" +
                        "## Growth Opportunities\n\n" +
                        "### Market Expansion\n" +
                        "- [Opportunity 1]\n" +
                        "- [Opportunity 2]\n\n" +
                        "### Product/Service Expansion\n" +
                        "- [Opportunity 1]\n" +
                        "- [Opportunity 2]\n\n" +
                        "### Operational Improvements\n" +
                        "- [Opportunity 1]\n" +
                        "- [Opportunity 2]\n\n" +
                        "## Growth Strategy\n\n" +
                        "### Strategic Priorities\n" +
                        "1. [Priority 1]\n" +
                        "2. [Priority 2]\n" +
                        "3. [Priority 3]\n\n" +
                        "### Marketing Strategy\n" +
                        "[Marketing strategy overview]\n\n" +
                        "### Sales Strategy\n" +
                        "[Sales strategy overview]\n\n" +
                        "### Operational Strategy\n" +
                        "[Operational strategy overview]\n\n" +
                        "## Resource Requirements\n\n" +
                        "### Human Resources\n" +
                        "- [Position 1]: $[Cost]\n" +
                        "- [Position 2]: $[Cost]\n\n" +
                        "### Capital Requirements\n" +
                        "- [Investment 1]: $[Cost]\n" +
                        "- [Investment 2]: $[Cost]\n" +
                        "- Total Investment Required: $[Total]\n\n" +
                        "### Technology Requirements\n" +
                        "- [Technology 1]: $[Cost]\n" +
                        "- [Technology 2]: $[Cost]\n\n" +
                        "## Implementation Timeline\n\n" +
                        "| Milestone | Date | Owner | Status |\n" +
                        "|-----------|------|-------|--------|\n" +
                        "| [Milestone 1] | [Date] | [Owner] | [Status] |\n" +
                        "| [Milestone 2] | [Date] | [Owner] | [Status] |\n\n" +
                        "## Financial Projections\n\n" +
                        "### Year 1\n" +
                        "- Revenue: $[Projected]\n" +
                        "- Expenses: $[Projected]\n" +
                        "- Profit: $[Projected]\n" +
                        "- ROI: [Percentage]\n\n" +
                        "### Year 2\n" +
                        "- Revenue: $[Projected]\n" +
                        "- Expenses: $[Projected]\n" +
                        "- Profit: $[Projected]\n" +
                        "- ROI: [Percentage]\n\n" +
                        "## Risk Assessment\n\n" +
                        "| Risk | Likelihood | Impact | Mitigation Strategy |\n" +
                        "|------|------------|--------|---------------------|\n" +
                        "| [Risk 1] | [High/Med/Low] | [High/Med/Low] | [Strategy] |\n" +
                        "| [Risk 2] | [High/Med/Low] | [High/Med/Low] | [Strategy] |"
                  }
                }
              ]
            }
        },
        {
          name: "Operational Assessment Template",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# Business Operational Assessment\n\n" +
                        "## Business Information\n\n" +
                        "- Business Name: [Name]\n" +
                        "- Assessment Date: [Date]\n" +
                        "- Conducted By: [Name]\n\n" +
                        "## Process Efficiency Analysis\n\n" +
                        "| Process | Current Time | Bottlenecks | Improvement Opportunity | Priority |\n" +
                        "|---------|--------------|-------------|-------------------------|----------|\n" +
                        "| [Process 1] | [Time] | [Bottlenecks] | [Opportunity] | [H/M/L] |\n" +
                        "| [Process 2] | [Time] | [Bottlenecks] | [Opportunity] | [H/M/L] |\n\n" +
                        "## Resource Utilization\n\n" +
                        "### Staff Utilization\n" +
                        "| Position | Capacity Used | Optimal Capacity | Gap Analysis |\n" +
                        "|----------|---------------|------------------|-------------|\n" +
                        "| [Position 1] | [Percentage] | [Percentage] | [Analysis] |\n" +
                        "| [Position 2] | [Percentage] | [Percentage] | [Analysis] |\n\n" +
                        "### Equipment Utilization\n" +
                        "| Equipment | Capacity Used | Optimal Capacity | Replacement Needed? |\n" +
                        "|-----------|---------------|------------------|---------------------|\n" +
                        "| [Equipment 1] | [Percentage] | [Percentage] | [Yes/No - When] |\n" +
                        "| [Equipment 2] | [Percentage] | [Percentage] | [Yes/No - When] |\n\n" +
                        "## Customer Delivery Performance\n\n" +
                        "- On-Time Delivery Rate: [Percentage]\n" +
                        "- Order Accuracy Rate: [Percentage]\n" +
                        "- Customer Complaints: [Number per month]\n" +
                        "- Average Resolution Time: [Time]\n\n" +
                        "## Quality Assessment\n\n" +
                        "- Defect Rate: [Percentage]\n" +
                        "- Return Rate: [Percentage]\n" +
                        "- Quality Control Process Effectiveness: [Assessment]\n\n" +
                        "## Technology Systems\n\n" +
                        "| System | Current State | Integration Level | Upgrade Needed? |\n" +
                        "|--------|---------------|-------------------|----------------|\n" +
                        "| [System 1] | [Assessment] | [Level] | [Yes/No - When] |\n" +
                        "| [System 2] | [Assessment] | [Level] | [Yes/No - When] |\n\n" +
                        "## Cost Analysis\n\n" +
                        "| Cost Category | Current Monthly | Industry Benchmark | Variance |\n" +
                        "|---------------|-----------------|---------------------|----------|\n" +
                        "| [Category 1] | $[Amount] | $[Amount] | [Percentage] |\n" +
                        "| [Category 2] | $[Amount] | $[Amount] | [Percentage] |\n\n" +
                        "## Improvement Recommendations\n\n" +
                        "| Recommendation | Impact | Implementation Cost | Time to Implement | ROI |\n" +
                        "|----------------|--------|---------------------|-------------------|----- |\n" +
                        "| [Recommendation 1] | [Impact] | $[Amount] | [Time] | [ROI] |\n" +
                        "| [Recommendation 2] | [Impact] | $[Amount] | [Time] | [ROI] |\n\n" +
                        "## Implementation Plan\n\n" +
                        "| Initiative | Priority | Owner | Start Date | End Date | Key Milestones |\n" +
                        "|------------|----------|-------|------------|----------|----------------|\n" +
                        "| [Initiative 1] | [H/M/L] | [Owner] | [Date] | [Date] | [Milestones] |\n" +
                        "| [Initiative 2] | [H/M/L] | [Owner] | [Date] | [Date] | [Milestones] |"
                  }
                }
              ]
            }
        }
      ];
      break;
      
    case USER_TYPES.GENERAL_ENTREPRENEUR:
    default:
      typeTemplates = [
        {
          name: "Lean Business Plan Template",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# Lean Business Plan\n\n" +
                        "## Business Concept\n\n" +
                        "### Problem\n" +
                        "[Describe the problem your business solves]\n\n" +
                        "### Solution\n" +
                        "[Describe your solution to the problem]\n\n" +
                        "### Unique Value Proposition\n" +
                        "[What makes your solution special or different?]\n\n" +
                        "## Target Market\n\n" +
                        "### Customer Segments\n" +
                        "- [Customer Segment 1]\n" +
                        "- [Customer Segment 2]\n\n" +
                        "### Market Size\n" +
                        "[Estimate your total addressable market]\n\n" +
                        "## Business Model\n\n" +
                        "### Revenue Streams\n" +
                        "- [Revenue Stream 1] - $[Price/Rate]\n" +
                        "- [Revenue Stream 2] - $[Price/Rate]\n\n" +
                        "### Cost Structure\n" +
                        "- [Fixed Cost 1] - $[Amount]\n" +
                        "- [Fixed Cost 2] - $[Amount]\n" +
                        "- [Variable Cost 1] - $[Rate]\n" +
                        "- [Variable Cost 2] - $[Rate]\n\n" +
                        "## Marketing Plan\n\n" +
                        "### Marketing Channels\n" +
                        "- [Channel 1]\n" +
                        "- [Channel 2]\n\n" +
                        "### Customer Relationships\n" +
                        "[How will you get, keep, and grow customers?]\n\n" +
                        "## Action Plan\n\n" +
                        "| Milestone | Date | Action Items |\n" +
                        "|-----------|------|-------------|\n" +
                        "| [Milestone 1] | [Date] | [Actions] |\n" +
                        "| [Milestone 2] | [Date] | [Actions] |\n\n" +
                        "## Financial Summary\n\n" +
                        "### Startup Costs\n" +
                        "- [Expense 1] - $[Amount]\n" +
                        "- [Expense 2] - $[Amount]\n" +
                        "- Total Startup Costs: $[Total]\n\n" +
                        "### Monthly Expenses\n" +
                        "- [Expense 1] - $[Amount]\n" +
                        "- [Expense 2] - $[Amount]\n" +
                        "- Total Monthly Expenses: $[Total]\n\n" +
                        "### Break-Even Analysis\n" +
                        "- Break-even point: [Number of sales or months]\n\n" +
                        "## Success Metrics\n\n" +
                        "- [Metric 1]: [Target]\n" +
                        "- [Metric 2]: [Target]\n" +
                        "- [Metric 3]: [Target]"
                  }
                }
              ]
            }
        },
        {
          name: "Market Research Workbook",
          content: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: "# Market Research Workbook\n\n" +
                        "## Target Market Definition\n\n" +
                        "### Primary Customer Profile\n" +
                        "- Age Range: [Range]\n" +
                        "- Gender: [Demographics]\n" +
                        "- Income Level: [Range]\n" +
                        "- Location: [Geographic areas]\n" +
                        "- Interests: [Relevant interests]\n" +
                        "- Pain Points: [Problems they face]\n\n" +
                        "### Secondary Customer Profile\n" +
                        "[Complete as above for secondary target]\n\n" +
                        "## Market Size Estimation\n\n" +
                        "### Total Addressable Market (TAM)\n" +
                        "- Total market size: $[Amount]\n" +
                        "- Calculation method: [How you calculated this]\n" +
                        "- Source of data: [References]\n\n" +
                        "### Serviceable Available Market (SAM)\n" +
                        "- Market you can realistically target: $[Amount]\n" +
                        "- Percentage of TAM: [Percentage]\n" +
                        "- Reasoning: [Why this percentage]\n\n" +
                        "### Serviceable Obtainable Market (SOM)\n" +
                        "- Realistic market share: $[Amount]\n" +
                        "- Percentage of SAM: [Percentage]\n" +
                        "- Reasoning: [Why this percentage]\n\n" +
                        "## Competitor Analysis\n\n" +
                        "| Competitor | Products/Services | Pricing | Strengths | Weaknesses |\n" +
                        "|------------|-------------------|---------|-----------|------------|\n" +
                        "| [Competitor 1] | [Offerings] | [Price range] | [Strengths] | [Weaknesses] |\n" +
                        "| [Competitor 2] | [Offerings] | [Price range] | [Strengths] | [Weaknesses] |\n\n" +
                        "## Customer Research\n\n" +
                        "### Interview Questions\n" +
                        "1. [Question 1]\n" +
                        "2. [Question 2]\n" +
                        "3. [Question 3]\n\n" +
                        "### Interview Results\n" +
                        "| Interviewee | Key Insights | Willingness to Pay | Next Steps |\n" +
                        "|-------------|--------------|---------------------|------------|\n" +
                        "| [Person 1] | [Insights] | [Amount] | [Follow-up] |\n" +
                        "| [Person 2] | [Insights] | [Amount] | [Follow-up] |\n\n" +
                        "## Pricing Research\n\n" +
                        "### Competitor Pricing\n" +
                        "| Competitor | Product/Service | Price | Pricing Model |\n" +
                        "|------------|-----------------|-------|---------------|\n" +
                        "| [Competitor 1] | [Item] | $[Price] | [Model] |\n" +
                        "| [Competitor 2] | [Item] | $[Price] | [Model] |\n\n" +
                        "### Pricing Strategy\n" +
                        "- Recommended price point: $[Amount]\n" +
                        "- Rationale: [Explanation]\n" +
                        "- Value-based justification: [Explanation]\n\n" +
                        "## Market Trends\n\n" +
                        "### Industry Trends\n" +
                        "- [Trend 1]: [Description and impact]\n" +
                        "- [Trend 2]: [Description and impact]\n\n" +
                        "### Regulatory Considerations\n" +
                        "- [Regulation 1]: [Requirements and impact]\n" +
                        "- [Regulation 2]: [Requirements and impact]\n\n" +
                        "## Research Conclusions\n\n" +
                        "### Key Findings\n" +
                        "1. [Finding 1]\n" +
                        "2. [Finding 2]\n" +
                        "3. [Finding 3]\n\n" +
                        "### Recommendations\n" +
                        "1. [Recommendation 1]\n" +
                        "2. [Recommendation 2]\n" +
                        "3. [Recommendation 3]\n\n" +
                        "### Next Steps\n" +
                        "1. [Action 1]\n" +
                        "2. [Action 2]\n" +
                        "3. [Action 3]"
                  }
                }
              ]
            }
        }
      ];
      break;
  }
  
  // Combine all templates
  return [...baseTemplates, ...typeTemplates];
}

/**
 * Determine if a user needs a follow-up form based on their profile
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @returns {boolean} - Whether a follow-up form is needed
 */
function needsFollowUpForm(userData, userType) {
  // VR clients always need a follow-up form for VR requirements
  if (userType === USER_TYPES.VR_CLIENT || userType === USER_TYPES.DEAF_ENTREPRENEUR) {
    return true;
  }
  
  // SBA clients need a follow-up form for loan requirements
  if (userType === USER_TYPES.SBA_CLIENT) {
    return true;
  }
  
  // Users in certain business stages need additional information
  if (userData.businessStage === 'Starting Up' || userData.businessStage === 'Already Operating') {
    return true;
  }
  
  // By default, no follow-up form is needed immediately
  return false;
}

/**
 * Create a follow-up form for additional user information
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @param {string} folderId - User's Google Drive folder ID
 * @returns {Promise<Object>} - The created form instructions or error
 */
async function createFollowUpForm(userData, userType, folderId) {
  try {
    // Create follow-up form instructions document
    const docResult = await googleWorkspace.createDocument(
      `${userData.name} - Additional Information Needed`,
      folderId
    );
    
    if (!docResult.success) {
      throw new Error(`Failed to create follow-up form: ${docResult.error}`);
    }
    
    // Create tracking spreadsheet for follow-up responses
    const sheetResult = await googleWorkspace.createSpreadsheet(
      `${userData.name} - Additional Information Responses`,
      folderId
    );
    
    if (!sheetResult.success) {
      throw new Error(`Failed to create follow-up tracking sheet: ${sheetResult.error}`);
    }
    
    // Get personalized follow-up questions based on user type
    const followUpContent = getFollowUpContent(userData, userType, sheetResult.url);
    
    // Add content to the document
    await googleWorkspace.writeToDocument(docResult.documentId, followUpContent);
    
    // Set up headers in tracking spreadsheet
    // Headers depend on the user type and questions asked
    let headers = [['Timestamp']];
    
    switch (userType) {
      case USER_TYPES.DEAF_ENTREPRENEUR:
      case USER_TYPES.VR_CLIENT:
        headers[0] = headers[0].concat([
          'VR Counselor Name', 
          'VR Office Location', 
          'VR Status', 
          'Accommodation Needs',
          'Prior Business Experience',
          'Funding Sources',
          'Business Timeline',
          'Support Network'
        ]);
        break;
        
      case USER_TYPES.SBA_CLIENT:
        headers[0] = headers[0].concat([
          'SBA Advisor Name',
          'SBA Program',
          'Loan Type Interested',
          'Collateral Available',
          'Credit Score Range',
          'Business Structure',
          'Current Business Stage',
          'Business Timeline'
        ]);
        break;
        
      case USER_TYPES.EXISTING_BUSINESS_OWNER:
        headers[0] = headers[0].concat([
          'Business Name',
          'Years in Operation',
          'Number of Employees',
          'Annual Revenue',
          'Current Challenges',
          'Growth Goals',
          'Funding Needs',
          'Expansion Timeline'
        ]);
        break;
        
      case USER_TYPES.GENERAL_ENTREPRENEUR:
      default:
        headers[0] = headers[0].concat([
          'Business Idea Description',
          'Target Customer',
          'Startup Budget',
          'Time Commitment',
          'Skills & Experience',
          'Unique Value Proposition',
          'Competitors',
          'Timeline to Launch'
        ]);
        break;
    }
    
    await googleWorkspace.updateSpreadsheetValues(
      sheetResult.spreadsheetId, 
      `Sheet1!A1:${String.fromCharCode(65 + headers[0].length - 1)}1`, 
      headers
    );
    
    return {
      success: true,
      formInstructions: {
        id: docResult.documentId,
        link: docResult.link
      },
      responseSheet: {
        id: sheetResult.spreadsheetId,
        url: sheetResult.url
      }
    };
  } catch (error) {
    console.error('Error creating follow-up form:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate follow-up form content based on user type
 * @param {Object} userData - User intake data
 * @param {string} userType - Determined user type
 * @param {string} spreadsheetUrl - URL of the tracking spreadsheet
 * @returns {Object} - Document content in Google Docs API format
 */
function getFollowUpContent(userData, userType, spreadsheetUrl) {
  // Base header
  let formText = `# Additional Information Needed - ${userData.name}\n\n`;
  
  // Personalized intro based on user type
  let intro = '';
  let formInstructions = '';
  let questions = '';
  
  switch (userType) {
    case USER_TYPES.DEAF_ENTREPRENEUR:
      intro = "Thank you for starting your profile with 360 Business Magician! To better serve your needs as a deaf entrepreneur, we need some additional information about your VR services and business goals.\n\n";
      formInstructions = "## Follow-Up Form Instructions\n\n" +
        "Please create a Google Form with the following questions and set it to collect responses in this spreadsheet:\n" +
        spreadsheetUrl + "\n\n";
      questions = "## Questions to Include\n\n" +
        "1. **VR Counselor Name** (Short Answer)\n" +
        "2. **VR Office Location** (Short Answer)\n" +
        "3. **Current VR Status** (Multiple Choice)\n" +
        "   - Just starting VR services\n" +
        "   - In process of developing business plan with VR\n" +
        "   - VR has approved my business plan\n" +
        "   - VR has funded my business\n" +
        "   - Other (please specify)\n" +
        "4. **Specific Accommodation Needs** (Paragraph)\n" +
        "   *Please describe any specific accommodations you need for your business operations*\n" +
        "5. **Prior Business Experience** (Multiple Choice)\n" +
        "   - No prior business experience\n" +
        "   - Worked in family business\n" +
        "   - Previously owned a business\n" +
        "   - Managed a business for someone else\n" +
        "   - Other (please specify)\n" +
        "6. **Potential Funding Sources** (Checkboxes - select all that apply)\n" +
        "   - VR funding\n" +
        "   - Personal savings\n" +
        "   - Family & friends\n" +
        "   - SBA loans\n" +
        "   - Grants\n" +
        "   - Angel investors\n" +
        "   - Other (please specify)\n" +
        "7. **Business Timeline** (Multiple Choice)\n" +
        "   - 0-3 months\n" +
        "   - 3-6 months\n" +
        "   - 6-12 months\n" +
        "   - 1-2 years\n" +
        "   - Longer than 2 years\n" +
        "8. **Support Network** (Paragraph)\n" +
        "   *Please describe any mentors, advisors, or support organizations currently helping you with your business*\n\n";
      break;
      
    case USER_TYPES.VR_CLIENT:
      intro = "Thank you for starting your profile with 360 Business Magician! To better align our services with your VR program, we need some additional information about your VR services and business goals.\n\n";
      formInstructions = "## Follow-Up Form Instructions\n\n" +
        "Please create a Google Form with the following questions and set it to collect responses in this spreadsheet:\n" +
        spreadsheetUrl + "\n\n";
      questions = "## Questions to Include\n\n" +
        "1. **VR Counselor Name** (Short Answer)\n" +
        "2. **VR Office Location** (Short Answer)\n" +
        "3. **Current VR Status** (Multiple Choice)\n" +
        "   - Just starting VR services\n" +
        "   - In process of developing business plan with VR\n" +
        "   - VR has approved my business plan\n" +
        "   - VR has funded my business\n" +
        "   - Other (please specify)\n" +
        "4. **Specific Accommodation Needs** (Paragraph)\n" +
        "   *Please describe any specific accommodations or accessibility needs*\n" +
        "5. **Prior Business Experience** (Multiple Choice)\n" +
        "   - No prior business experience\n" +
        "   - Worked in family business\n" +
        "   - Previously owned a business\n" +
        "   - Managed a business for someone else\n" +
        "   - Other (please specify)\n" +
        "6. **Potential Funding Sources** (Checkboxes - select all that apply)\n" +
        "   - VR funding\n" +
        "   - Personal savings\n" +
        "   - Family & friends\n" +
        "   - SBA loans\n" +
        "   - Grants\n" +
        "   - Other (please specify)\n" +
        "7. **Business Timeline** (Multiple Choice)\n" +
        "   - 0-3 months\n" +
        "   - 3-6 months\n" +
        "   - 6-12 months\n" +
        "   - 1-2 years\n" +
        "   - Longer than 2 years\n" +
        "8. **Support Network** (Paragraph)\n" +
        "   *Please describe any mentors, advisors, or support organizations currently helping you with your business*\n\n";
      break;
      
    case USER_TYPES.SBA_CLIENT:
      intro = "Thank you for starting your profile with 360 Business Magician! To better align our services with your SBA program, we need some additional information about your SBA services and business goals.\n\n";
      formInstructions = "## Follow-Up Form Instructions\n\n" +
        "Please create a Google Form with the following questions and set it to collect responses in this spreadsheet:\n" +
        spreadsheetUrl + "\n\n";
      questions = "## Questions to Include\n\n" +
        "1. **SBA Advisor Name** (Short Answer)\n" +
        "2. **SBA Program** (Multiple Choice)\n" +
        "   - 8(a) Business Development\n" +
        "   - 7(j) Management and Technical Assistance\n" +
        "   - Women's Business Center\n" +
        "   - Veterans Business Outreach Center\n" +
        "   - SCORE\n" +
        "   - Small Business Development Center\n" +
        "   - Other (please specify)\n" +
        "3. **Loan Type Interested In** (Multiple Choice)\n" +
        "   - SBA 7(a) Loan\n" +
        "   - SBA 504 Loan\n" +
        "   - SBA Microloan\n" +
        "   - SBA Express Loan\n" +
        "   - Not seeking SBA loan at this time\n" +
        "   - Other (please specify)\n" +
        "4. **Collateral Available** (Checkboxes - select all that apply)\n" +
        "   - Business assets\n" +
        "   - Real estate\n" +
        "   - Equipment\n" +
        "   - Personal assets\n" +
        "   - None\n" +
        "   - Other (please specify)\n" +
        "5. **Credit Score Range** (Multiple Choice)\n" +
        "   - Below 600\n" +
        "   - 600-649\n" +
        "   - 650-699\n" +
        "   - 700-749\n" +
        "   - 750 or above\n" +
        "   - I don't know\n" +
        "6. **Business Structure** (Multiple Choice)\n" +
        "   - Sole Proprietorship\n" +
        "   - LLC\n" +
        "   - S-Corporation\n" +
        "   - C-Corporation\n" +
        "   - Partnership\n" +
        "   - Not yet determined\n" +
        "7. **Current Business Stage** (Multiple Choice)\n" +
        "   - Concept stage\n" +
        "   - Business plan development\n" +
        "   - Pre-launch preparation\n" +
        "   - Recently launched\n" +
        "   - Established business seeking growth\n" +
        "8. **Business Timeline** (Multiple Choice)\n" +
        "   - Need to launch within 3 months\n" +
        "   - Planning to launch in 3-6 months\n" +
        "   - Planning to launch in 6-12 months\n" +
        "   - Planning to launch in 1+ year\n" +
        "   - Already operating\n\n";
      break;
      
    case USER_TYPES.EXISTING_BUSINESS_OWNER:
      intro = "Thank you for starting your profile with 360 Business Magician! To better understand your existing business and growth goals, we need some additional information.\n\n";
      formInstructions = "## Follow-Up Form Instructions\n\n" +
        "Please create a Google Form with the following questions and set it to collect responses in this spreadsheet:\n" +
        spreadsheetUrl + "\n\n";
      questions = "## Questions to Include\n\n" +
        "1. **Legal Business Name** (Short Answer)\n" +
        "2. **Years in Operation** (Multiple Choice)\n" +
        "   - Less than 1 year\n" +
        "   - 1-2 years\n" +
        "   - 3-5 years\n" +
        "   - 5-10 years\n" +
        "   - More than 10 years\n" +
        "3. **Number of Employees** (Multiple Choice)\n" +
        "   - Just me (solopreneur)\n" +
        "   - 2-5 employees\n" +
        "   - 6-10 employees\n" +
        "   - 11-25 employees\n" +
        "   - More than 25 employees\n" +
        "4. **Annual Revenue Range** (Multiple Choice)\n" +
        "   - Under $50,000\n" +
        "   - $50,000 - $100,000\n" +
        "   - $100,001 - $250,000\n" +
        "   - $250,001 - $500,000\n" +
        "   - $500,001 - $1 million\n" +
        "   - Over $1 million\n" +
        "   - Prefer not to say\n" +
        "5. **Current Business Challenges** (Checkboxes - select all that apply)\n" +
        "   - Increasing sales/revenue\n" +
        "   - Finding qualified employees\n" +
        "   - Improving operational efficiency\n" +
        "   - Accessing capital/funding\n" +
        "   - Marketing and customer acquisition\n" +
        "   - Product/service development\n" +
        "   - Technology implementation\n" +
        "   - Other (please specify)\n" +
        "6. **Growth Goals** (Multiple Choice)\n" +
        "   - Increase revenue within current model\n" +
        "   - Expand to new locations\n" +
        "   - Add new products/services\n" +
        "   - Enter new markets\n" +
        "   - Prepare for acquisition or sale\n" +
        "   - Other (please specify)\n" +
        "7. **Funding Needs for Growth** (Multiple Choice)\n" +
        "   - No funding needed at this time\n" +
        "   - Under $10,000\n" +
        "   - $10,000 - $50,000\n" +
        "   - $50,001 - $100,000\n" +
        "   - $100,001 - $250,000\n" +
        "   - $250,001 - $500,000\n" +
        "   - Over $500,000\n" +
        "8. **Expansion Timeline** (Multiple Choice)\n" +
        "   - Immediate (0-3 months)\n" +
        "   - Short-term (3-6 months)\n" +
        "   - Medium-term (6-12 months)\n" +
        "   - Long-term (1-2 years)\n" +
        "   - Strategic (2+ years)\n\n";
      break;
      
    case USER_TYPES.GENERAL_ENTREPRENEUR:
    default:
      intro = "Thank you for starting your profile with 360 Business Magician! To better tailor our resources to your specific business needs, we need some additional information about your plans.\n\n";
      formInstructions = "## Follow-Up Form Instructions\n\n" +
        "Please create a Google Form with the following questions and set it to collect responses in this spreadsheet:\n" +
        spreadsheetUrl + "\n\n";
      questions = "## Questions to Include\n\n" +
        "1. **Business Idea Description** (Paragraph)\n" +
        "   *Please describe your business idea in detail*\n" +
        "2. **Target Customer** (Paragraph)\n" +
        "   *Who is your ideal customer? Be as specific as possible.*\n" +
        "3. **Startup Budget** (Multiple Choice)\n" +
        "   - Under $1,000\n" +
        "   - $1,000 - $5,000\n" +
        "   - $5,001 - $10,000\n" +
        "   - $10,001 - $25,000\n" +
        "   - $25,001 - $50,000\n" +
        "   - $50,001 - $100,000\n" +
        "   - Over $100,000\n" +
        "   - Not sure yet\n" +
        "4. **Time Commitment** (Multiple Choice)\n" +
        "   - Side hustle (less than 20 hours/week)\n" +
        "   - Part-time business (20-30 hours/week)\n" +
        "   - Full-time business (40+ hours/week)\n" +
        "   - Not sure yet\n" +
        "5. **Skills & Experience** (Paragraph)\n" +
        "   *What skills, experience, and knowledge do you bring to this business?*\n" +
        "6. **Unique Value Proposition** (Paragraph)\n" +
        "   *What will make your business different from competitors?*\n" +
        "7. **Main Competitors** (Paragraph)\n" +
        "   *List any direct or indirect competitors you're aware of*\n" +
        "8. **Timeline to Launch** (Multiple Choice)\n" +
        "   - As soon as possible (1-3 months)\n" +
        "   - Short-term (3-6 months)\n" +
        "   - Medium-term (6-12 months)\n" +
        "   - Long-term (1+ year)\n" +
        "   - Already operating\n\n";
      break;
  }
  
  // Compose the full document content
  const fullContent = formText + intro + formInstructions + questions +
    "## Next Steps\n\n" +
    "1. Create the Google Form with the questions above\n" +
    "2. Set it to collect responses in the linked spreadsheet\n" +
    "3. Complete the form yourself to provide the additional information\n\n" +
    "Once you've submitted your responses, we'll update your personalized business resources and task list accordingly.\n\n" +
    "If you have any questions, please contact your 360 Business Magician advisor.";
  
  // Format for Google Docs API
  return {
    requests: [
      {
        insertText: {
          location: { index: 1 },
          text: fullContent
        }
      }
    ]
  };
}

export default {
  createIntakeForm,
  processUserIntake,
  USER_TYPES,
  ASL_PREFERENCE,
  EXPERIENCE_LEVELS
};