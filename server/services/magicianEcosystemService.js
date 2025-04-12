/**
 * 360 Magicians Ecosystem Integration Service
 * 
 * This service provides the integration layer for all 360 Magicians modules:
 * - 360 Business Magician
 * - 360 Job Magician
 * - VR4Deaf integration
 * 
 * The platform is designed to evolve from specialized business and job services
 * into a comprehensive VR4Deaf solution while maintaining modular architecture.
 */

import googleWorkspace from './googleWorkspaceService.js';
import userProfiling from './userProfilingService.js';
import { getData, saveData, listData } from './cloudStorageService.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Main modules in the ecosystem
const ECOSYSTEM_MODULES = {
  BUSINESS_MAGICIAN: 'business_magician',
  JOB_MAGICIAN: 'job_magician',
  VR4DEAF: 'vr4deaf',
  LEARNING_CENTER: 'learning_center'
};

// User Journey Stages
const USER_JOURNEY = {
  INTAKE: 'intake',
  ASSESSMENT: 'assessment',
  SERVICE_SELECTION: 'service_selection',
  ACTIVE_SERVICE: 'active_service',
  OUTCOMES_TRACKING: 'outcomes_tracking',
  ALUMNI: 'alumni'
};

// Service Types
const SERVICE_TYPES = {
  SELF_SERVICE: 'self_service',
  GUIDED: 'guided',
  FULL_SERVICE: 'full_service'
};

/**
 * Create a unified intake form across all modules
 * @returns {Promise<Object>} The created intake form or error
 */
export async function createUnifiedIntakeForm() {
  try {
    // Create folder for unified intake
    const folderResult = await googleWorkspace.createFolder("360 Magicians - Unified Intake");
    if (!folderResult.success) {
      throw new Error(`Failed to create unified intake folder: ${folderResult.error}`);
    }
    
    // Create instructions document
    const docResult = await googleWorkspace.createDocument("360 Magicians Intake Instructions", folderResult.folderId);
    if (!docResult.success) {
      throw new Error(`Failed to create intake instructions: ${docResult.error}`);
    }
    
    // Create intake tracking spreadsheet
    const sheetResult = await googleWorkspace.createSpreadsheet("360 Magicians - Intake Responses", folderResult.folderId);
    if (!sheetResult.success) {
      throw new Error(`Failed to create intake responses sheet: ${sheetResult.error}`);
    }
    
    // Set up the content for the instructions
    const content = {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: "# 360 Magicians - Unified Intake Form Instructions\n\n"
          }
        },
        {
          insertText: {
            location: { index: 50 },
            text: "## Welcome to the 360 Magicians Ecosystem!\n\n" +
                  "Our unified intake process will determine the best path for you across our business, job, and VR services.\n\n"
          }
        },
        {
          insertText: {
            location: { index: 200 },
            text: "### Create a Google Form with the following questions:\n\n" +
                  "1. **Full Name** (Short Answer)\n" +
                  "2. **Email Address** (Short Answer)\n" +
                  "3. **Phone Number** (Short Answer)\n" +
                  "4. **Are you deaf or hard of hearing?** (Multiple Choice: Yes, No, Prefer not to say)\n" +
                  "5. **Do you prefer ASL communication?** (Multiple Choice: Yes - required, Yes - preferred, No)\n" +
                  "6. **Are you a Vocational Rehabilitation (VR) client?** (Multiple Choice: Yes, No, Not Sure)\n" +
                  "   - If Yes: **VR Counselor's Name** (Short Answer)\n" +
                  "   - If Yes: **VR Office Location** (Short Answer)\n" +
                  "7. **Which services are you primarily interested in?** (Multiple Choice)\n" +
                  "   - Business development (starting/growing a business)\n" +
                  "   - Job placement (finding employment)\n" +
                  "   - Both business and job services\n" +
                  "   - Not sure yet - need guidance\n" +
                  "8. **Current employment status** (Multiple Choice)\n" +
                  "   - Unemployed and seeking work\n" +
                  "   - Employed but seeking better opportunities\n" +
                  "   - Self-employed/business owner seeking growth\n" +
                  "   - Student\n" +
                  "   - Other (please specify)\n" +
                  "9. **Education level** (Multiple Choice)\n" +
                  "   - High school or GED\n" +
                  "   - Some college\n" +
                  "   - Associate's degree\n" +
                  "   - Bachelor's degree\n" +
                  "   - Master's degree or higher\n" +
                  "   - Trade/vocational training\n" +
                  "   - Other (please specify)\n" +
                  "10. **Experience with self-employment or business ownership** (Multiple Choice)\n" +
                  "    - No experience but interested\n" +
                  "    - Previously owned a business\n" +
                  "    - Currently own a business\n" +
                  "    - Family business experience\n" +
                  "    - Not interested in business ownership\n" +
                  "11. **Primary career interests/skills** (Paragraph)\n" +
                  "12. **Do you have specific accessibility needs?** (Paragraph)\n" +
                  "13. **What are your main goals for working with us?** (Paragraph)\n" +
                  "14. **Preferred service delivery method** (Multiple Choice)\n" +
                  "    - Self-service (access to tools and resources)\n" +
                  "    - Guided service (regular check-ins with advisor)\n" +
                  "    - Full service (comprehensive support)\n" +
                  "15. **How did you hear about us?** (Short Answer)\n\n" +
                  "Configure the form to collect responses in this spreadsheet: " + sheetResult.url + "\n\n"
          }
        },
        {
          insertText: {
            location: { index: 2000 },
            text: "## After Collecting Responses\n\n" +
                  "Once a user completes the intake form, our system will:\n\n" +
                  "1. Analyze their needs and create a personalized service recommendation\n" +
                  "2. Generate a customized Google Drive folder with appropriate resources\n" +
                  "3. Connect them with the appropriate service module (Business Magician, Job Magician, or VR4Deaf)\n" +
                  "4. Schedule an initial consultation if they selected guided or full service\n\n" +
                  "## Processing Workflow\n\n" +
                  "1. User completes intake form\n" +
                  "2. System analyzes responses to determine primary needs\n" +
                  "3. User is assigned to appropriate service track\n" +
                  "4. Personalized resources are generated\n" +
                  "5. User receives confirmation email with next steps\n" +
                  "6. Service delivery begins based on selected method\n\n" +
                  "The unified intake ensures that users can seamlessly move between services as their needs evolve."
          }
        }
      ]
    };
    
    // Add content to the instructions document
    await googleWorkspace.writeToDocument(docResult.documentId, content);
    
    // Set up the tracking spreadsheet headers
    const headers = [
      [
        'Timestamp', 'Name', 'Email', 'Phone', 'Deaf/HoH', 'ASL Preference',
        'VR Client', 'VR Counselor', 'VR Office', 'Primary Interest', 
        'Employment Status', 'Education Level', 'Business Experience',
        'Career Interests', 'Accessibility Needs', 'Goals', 
        'Service Method', 'Referral Source', 'Assigned Module',
        'Service Track', 'User Journey Stage', 'Profile Folder'
      ]
    ];
    
    await googleWorkspace.updateSpreadsheetValues(sheetResult.spreadsheetId, 'Sheet1!A1:V1', headers);
    
    // Create journey mapping document
    const journeyDocResult = await googleWorkspace.createDocument(
      "360 Magicians - User Journey Mapping", 
      folderResult.folderId
    );
    
    if (journeyDocResult.success) {
      const journeyContent = {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: "# 360 Magicians - User Journey Mapping\n\n" +
                    "## Journey Stages\n\n" +
                    "1. **Intake** - Initial contact and needs assessment\n" +
                    "2. **Assessment** - Detailed evaluation of skills, goals, and barriers\n" +
                    "3. **Service Selection** - Determination of appropriate service track\n" +
                    "4. **Active Service** - Delivery of selected services\n" +
                    "5. **Outcomes Tracking** - Measurement of results and impact\n" +
                    "6. **Alumni** - Ongoing support and community involvement\n\n" +
                    "## Service Tracks\n\n" +
                    "### Business Magician Track\n" +
                    "- **For:** Aspiring and current business owners\n" +
                    "- **Services:** Business planning, formation, funding, growth\n" +
                    "- **Delivery Methods:** Self-service, guided, full-service\n\n" +
                    "### Job Magician Track\n" +
                    "- **For:** Job seekers at all levels\n" +
                    "- **Services:** Career assessment, job matching, interview prep, placement\n" +
                    "- **Delivery Methods:** Self-service, guided, full-service\n\n" +
                    "### VR4Deaf Integration\n" +
                    "- **For:** VR clients requiring comprehensive services\n" +
                    "- **Services:** Coordinated VR services, business AND job support\n" +
                    "- **Delivery Methods:** Primarily guided and full-service\n\n" +
                    "## Decision Matrix for Service Assignment\n\n" +
                    "| Primary Interest | VR Client | ASL Needs | Recommended Track |\n" +
                    "|-----------------|-----------|-----------|--------------------|\n" +
                    "| Business | Yes | Required/Preferred | VR4Deaf - Business Focus |\n" +
                    "| Business | No | Any | Business Magician |\n" +
                    "| Job | Yes | Required/Preferred | VR4Deaf - Employment Focus |\n" +
                    "| Job | No | Any | Job Magician |\n" +
                    "| Both | Yes | Any | VR4Deaf - Comprehensive |\n" +
                    "| Both | No | Any | Dual Track (Business + Job) |\n" +
                    "| Unsure | Any | Any | Assessment Track |\n\n" +
                    "## Resource Allocation\n\n" +
                    "Resources will be allocated based on track assignment, service level, and specific needs indicated in the intake form."
            }
          }
        ]
      };
      
      await googleWorkspace.writeToDocument(journeyDocResult.documentId, journeyContent);
    }
    
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
      },
      journeyDoc: journeyDocResult.success ? {
        id: journeyDocResult.documentId,
        link: journeyDocResult.link
      } : null
    };
  } catch (error) {
    console.error('Error creating unified intake form:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Process intake data and assign to appropriate module
 * @param {Object} userData - User intake data
 * @returns {Promise<Object>} - Module assignment and next steps
 */
export async function processUnifiedIntake(userData) {
  try {
    // Generate a unique user ID
    const userId = crypto.randomBytes(8).toString('hex');
    
    // Determine primary module assignment
    const moduleAssignment = determineModuleAssignment(userData);
    
    // Create user profile folder
    const userFolder = await googleWorkspace.createFolder(`${userData.name} - 360 Magicians Profile`);
    if (!userFolder.success) {
      throw new Error(`Failed to create user folder: ${userFolder.error}`);
    }
    
    // Create service roadmap document
    const roadmapDoc = await createServiceRoadmap(userData, moduleAssignment, userFolder.folderId);
    if (!roadmapDoc.success) {
      throw new Error(`Failed to create service roadmap: ${roadmapDoc.error}`);
    }
    
    // Create module-specific resources
    let moduleResources = null;
    
    if (moduleAssignment.primaryModule === ECOSYSTEM_MODULES.BUSINESS_MAGICIAN) {
      // Convert to business module user type
      const businessUserType = convertToBusinessUserType(userData);
      moduleResources = await createBusinessModuleResources(userData, businessUserType, userFolder.folderId);
    } 
    else if (moduleAssignment.primaryModule === ECOSYSTEM_MODULES.JOB_MAGICIAN) {
      moduleResources = await createJobModuleResources(userData, userFolder.folderId);
    }
    else if (moduleAssignment.primaryModule === ECOSYSTEM_MODULES.VR4DEAF) {
      moduleResources = await createVR4DeafResources(userData, moduleAssignment.serviceTrack, userFolder.folderId);
    }
    
    // Create resource directory
    const directoryDoc = await createResourceDirectory(
      userData, 
      moduleAssignment, 
      userFolder.folderId,
      roadmapDoc.documentId,
      moduleResources
    );
    
    // Save profile to cloud storage
    const profile = {
      userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      isDeaf: userData.isDeaf === 'Yes',
      aslPreference: userData.aslPreference,
      vrClient: userData.vrClient === 'Yes',
      vrCounselor: userData.vrCounselor,
      vrOffice: userData.vrOffice,
      primaryInterest: userData.primaryInterest,
      moduleAssignment: moduleAssignment,
      userJourneyStage: USER_JOURNEY.INTAKE,
      serviceDeliveryMethod: userData.serviceMethod,
      profileCreated: new Date().toISOString(),
      driveFolder: {
        id: userFolder.folderId,
        link: userFolder.link
      },
      roadmap: {
        id: roadmapDoc.documentId,
        link: roadmapDoc.link
      }
    };
    
    // Save to Cloud Storage if available
    let storageResult = { success: false };
    try {
      if (typeof saveData === 'function') {
        storageResult = await saveData(`users/${userId}/profile.json`, profile);
      }
    } catch (error) {
      console.warn('Cloud Storage not available for profile storage:', error.message);
    }
    
    return {
      success: true,
      userId,
      name: userData.name,
      moduleAssignment,
      userFolder: {
        id: userFolder.folderId,
        link: userFolder.link
      },
      roadmap: {
        id: roadmapDoc.documentId,
        link: roadmapDoc.link
      },
      moduleResources: moduleResources,
      profileStorage: storageResult
    };
  } catch (error) {
    console.error('Error processing unified intake:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Determine which module the user should be assigned to
 * @param {Object} userData - User intake data
 * @returns {Object} - Module assignment information
 */
function determineModuleAssignment(userData) {
  // Extract key decision factors
  const isVRClient = userData.vrClient === 'Yes';
  const isDeaf = userData.isDeaf === 'Yes';
  const aslPreference = userData.aslPreference.includes('Yes');
  const primaryInterest = userData.primaryInterest;
  const serviceMethod = userData.serviceMethod;
  
  // Initialize result
  let primaryModule = null;
  let secondaryModule = null;
  let serviceTrack = null;
  
  // VR clients with ASL needs generally should go through VR4Deaf
  if (isVRClient && (isDeaf || aslPreference)) {
    primaryModule = ECOSYSTEM_MODULES.VR4DEAF;
    
    // Determine service track based on interest
    if (primaryInterest.includes('Business')) {
      serviceTrack = 'business_focus';
      secondaryModule = ECOSYSTEM_MODULES.BUSINESS_MAGICIAN;
    } 
    else if (primaryInterest.includes('Job')) {
      serviceTrack = 'employment_focus';
      secondaryModule = ECOSYSTEM_MODULES.JOB_MAGICIAN;
    }
    else if (primaryInterest.includes('Both')) {
      serviceTrack = 'comprehensive';
      secondaryModule = null; // Handled comprehensively within VR4Deaf
    }
    else {
      // Unsure - assessment needed
      serviceTrack = 'assessment';
      secondaryModule = ECOSYSTEM_MODULES.LEARNING_CENTER;
    }
  } 
  // Non-VR business interests
  else if (primaryInterest.includes('Business') && !primaryInterest.includes('Job')) {
    primaryModule = ECOSYSTEM_MODULES.BUSINESS_MAGICIAN;
    serviceTrack = 'business_development';
    
    // If deaf/HoH, may still need some VR4Deaf resources
    if (isDeaf || aslPreference) {
      secondaryModule = ECOSYSTEM_MODULES.VR4DEAF;
    }
  }
  // Non-VR job interests
  else if (primaryInterest.includes('Job') && !primaryInterest.includes('Business')) {
    primaryModule = ECOSYSTEM_MODULES.JOB_MAGICIAN;
    serviceTrack = 'job_placement';
    
    // If deaf/HoH, may still need some VR4Deaf resources
    if (isDeaf || aslPreference) {
      secondaryModule = ECOSYSTEM_MODULES.VR4DEAF;
    }
  }
  // Both business and job interests
  else if (primaryInterest.includes('Both')) {
    // Determine primary based on business experience and employment status
    const hasBusinessExperience = userData.businessExperience.includes('Currently') || 
                                 userData.businessExperience.includes('Previously');
    const isUnemployed = userData.employmentStatus.includes('Unemployed');
    
    if (hasBusinessExperience || !isUnemployed) {
      primaryModule = ECOSYSTEM_MODULES.BUSINESS_MAGICIAN;
      secondaryModule = ECOSYSTEM_MODULES.JOB_MAGICIAN;
      serviceTrack = 'dual_focus_business_primary';
    } else {
      primaryModule = ECOSYSTEM_MODULES.JOB_MAGICIAN;
      secondaryModule = ECOSYSTEM_MODULES.BUSINESS_MAGICIAN;
      serviceTrack = 'dual_focus_job_primary';
    }
    
    // If deaf/HoH, may need VR4Deaf as tertiary
    if (isDeaf || aslPreference) {
      // Tertiary module would be VR4Deaf
    }
  }
  // Unsure or needs assessment
  else {
    primaryModule = isDeaf || aslPreference ? 
      ECOSYSTEM_MODULES.VR4DEAF : 
      ECOSYSTEM_MODULES.LEARNING_CENTER;
    serviceTrack = 'assessment';
  }
  
  // Determine service delivery method if not explicitly specified
  let serviceDeliveryMethod = serviceMethod;
  if (!serviceDeliveryMethod) {
    if (primaryModule === ECOSYSTEM_MODULES.VR4DEAF) {
      serviceDeliveryMethod = SERVICE_TYPES.GUIDED;
    } else if (isDeaf || aslPreference) {
      serviceDeliveryMethod = SERVICE_TYPES.GUIDED;
    } else {
      serviceDeliveryMethod = SERVICE_TYPES.SELF_SERVICE;
    }
  }
  
  return {
    primaryModule,
    secondaryModule,
    serviceTrack,
    serviceDeliveryMethod,
    isVRClient,
    needsASL: isDeaf || aslPreference
  };
}

/**
 * Convert from unified intake data to business module user type
 * @param {Object} userData - User intake data
 * @returns {string} - Business module user type
 */
function convertToBusinessUserType(userData) {
  if (userData.vrClient === 'Yes' && userData.isDeaf === 'Yes') {
    return userProfiling.USER_TYPES.DEAF_ENTREPRENEUR;
  } else if (userData.vrClient === 'Yes') {
    return userProfiling.USER_TYPES.VR_CLIENT;
  } else if (userData.businessExperience.includes('Currently')) {
    return userProfiling.USER_TYPES.EXISTING_BUSINESS_OWNER;
  } else {
    return userProfiling.USER_TYPES.GENERAL_ENTREPRENEUR;
  }
}

/**
 * Create a service roadmap document
 * @param {Object} userData - User intake data
 * @param {Object} moduleAssignment - Module assignment information
 * @param {string} folderId - User's profile folder ID
 * @returns {Promise<Object>} - The created document or error
 */
async function createServiceRoadmap(userData, moduleAssignment, folderId) {
  try {
    // Create roadmap document
    const docResult = await googleWorkspace.createDocument(
      `${userData.name} - 360 Magicians Service Roadmap`,
      folderId
    );
    
    if (!docResult.success) {
      throw new Error(`Failed to create roadmap document: ${docResult.error}`);
    }
    
    // Get content based on module assignment
    const roadmapContent = getRoadmapContent(userData, moduleAssignment);
    
    // Add content to the document
    await googleWorkspace.writeToDocument(docResult.documentId, roadmapContent);
    
    return {
      success: true,
      documentId: docResult.documentId,
      link: docResult.link
    };
  } catch (error) {
    console.error('Error creating service roadmap:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate roadmap content based on module assignment
 * @param {Object} userData - User intake data
 * @param {Object} moduleAssignment - Module assignment information
 * @returns {Object} - Document content in Google Docs API format
 */
function getRoadmapContent(userData, moduleAssignment) {
  // Base header
  let roadmapText = `# 360 Magicians Service Roadmap - ${userData.name}\n\n`;
  
  // Module assignment info
  let moduleInfo = '';
  switch (moduleAssignment.primaryModule) {
    case ECOSYSTEM_MODULES.BUSINESS_MAGICIAN:
      moduleInfo = "## Your Primary Service: Business Magician\n\n" +
        "You've been enrolled in our **Business Magician** program, which focuses on helping you develop, launch, and grow your business.\n\n";
      break;
      
    case ECOSYSTEM_MODULES.JOB_MAGICIAN:
      moduleInfo = "## Your Primary Service: Job Magician\n\n" +
        "You've been enrolled in our **Job Magician** program, which focuses on helping you find and secure employment that matches your skills and goals.\n\n";
      break;
      
    case ECOSYSTEM_MODULES.VR4DEAF:
      moduleInfo = "## Your Primary Service: VR4Deaf\n\n" +
        "You've been enrolled in our **VR4Deaf** program, which provides comprehensive services for deaf and hard of hearing clients in partnership with Vocational Rehabilitation.\n\n";
      break;
      
    case ECOSYSTEM_MODULES.LEARNING_CENTER:
      moduleInfo = "## Your Primary Service: Learning Center\n\n" +
        "You've been enrolled in our **Learning Center** for assessment and career exploration before determining your final service track.\n\n";
      break;
  }
  
  // Secondary service info if applicable
  if (moduleAssignment.secondaryModule) {
    moduleInfo += "### Secondary Service\n\n";
    
    switch (moduleAssignment.secondaryModule) {
      case ECOSYSTEM_MODULES.BUSINESS_MAGICIAN:
        moduleInfo += "You'll also have access to our **Business Magician** resources to support your entrepreneurship goals.\n\n";
        break;
        
      case ECOSYSTEM_MODULES.JOB_MAGICIAN:
        moduleInfo += "You'll also have access to our **Job Magician** resources to support your employment goals.\n\n";
        break;
        
      case ECOSYSTEM_MODULES.VR4DEAF:
        moduleInfo += "You'll also be connected with our **VR4Deaf** resources to ensure accessibility and support for your specific needs.\n\n";
        break;
        
      case ECOSYSTEM_MODULES.LEARNING_CENTER:
        moduleInfo += "You'll also have access to our **Learning Center** for ongoing skill development and education.\n\n";
        break;
    }
  }
  
  // Service delivery method
  let serviceInfo = "## Service Delivery Method\n\n";
  
  switch (moduleAssignment.serviceDeliveryMethod) {
    case SERVICE_TYPES.SELF_SERVICE:
      serviceInfo += "You've selected our **Self-Service** option, which provides access to all relevant tools and resources for you to use at your own pace.\n\n";
      break;
      
    case SERVICE_TYPES.GUIDED:
      serviceInfo += "You've selected our **Guided Service** option, which includes regular check-ins with an advisor in addition to all self-service resources.\n\n";
      break;
      
    case SERVICE_TYPES.FULL_SERVICE:
      serviceInfo += "You've selected our **Full-Service** option, which provides comprehensive support with a dedicated advisor guiding you through each step of the process.\n\n";
      break;
  }
  
  // Roadmap stages - customized based on primary module
  let roadmapStages = "## Your Service Roadmap\n\n";
  
  switch (moduleAssignment.primaryModule) {
    case ECOSYSTEM_MODULES.BUSINESS_MAGICIAN:
      roadmapStages += "### Phase 1: Business Assessment & Planning\n" +
        "- Complete detailed business assessment\n" +
        "- Develop initial business concept\n" +
        "- Research market viability\n" +
        "- Create preliminary business plan\n\n" +
        
        "### Phase 2: Business Formation\n" +
        "- Select business structure\n" +
        "- Register your business\n" +
        "- Obtain necessary licenses and permits\n" +
        "- Set up business banking\n\n" +
        
        "### Phase 3: Launch Preparation\n" +
        "- Develop marketing strategy\n" +
        "- Create minimum viable product/service\n" +
        "- Establish pricing strategy\n" +
        "- Set up operational systems\n\n" +
        
        "### Phase 4: Launch & Initial Growth\n" +
        "- Execute marketing plan\n" +
        "- Acquire first customers\n" +
        "- Establish service delivery process\n" +
        "- Monitor and adjust based on feedback\n\n" +
        
        "### Phase 5: Stabilization & Expansion\n" +
        "- Optimize business operations\n" +
        "- Expand customer base\n" +
        "- Consider additional products/services\n" +
        "- Develop growth strategy\n\n";
      break;
      
    case ECOSYSTEM_MODULES.JOB_MAGICIAN:
      roadmapStages += "### Phase 1: Career Assessment\n" +
        "- Complete skills and interests assessment\n" +
        "- Identify target job types and industries\n" +
        "- Evaluate current qualifications vs. requirements\n" +
        "- Develop career path strategy\n\n" +
        
        "### Phase 2: Preparation\n" +
        "- Create/update resume and cover letter\n" +
        "- Develop professional online presence\n" +
        "- Identify references\n" +
        "- Practice interview skills\n\n" +
        
        "### Phase 3: Job Search\n" +
        "- Identify potential employers\n" +
        "- Apply for positions matching your profile\n" +
        "- Network with industry professionals\n" +
        "- Track application status\n\n" +
        
        "### Phase 4: Interview & Selection\n" +
        "- Prepare for specific interviews\n" +
        "- Arrange accommodations if needed\n" +
        "- Follow up after interviews\n" +
        "- Evaluate job offers\n\n" +
        
        "### Phase 5: Employment Success\n" +
        "- Prepare for first day/week\n" +
        "- Establish workplace accommodations\n" +
        "- Set performance goals\n" +
        "- Plan for career advancement\n\n";
      break;
      
    case ECOSYSTEM_MODULES.VR4DEAF:
      roadmapStages += "### Phase 1: VR Intake & Assessment\n" +
        "- Connect VR counselor with 360 Magicians team\n" +
        "- Complete comprehensive needs assessment\n" +
        "- Identify accommodations and accessibility needs\n" +
        "- Develop Individualized Plan for Employment (IPE)\n\n" +
        
        "### Phase 2: Service Coordination\n" +
        "- Align VR services with 360 Magicians resources\n" +
        "- Secure necessary accommodations\n" +
        "- Coordinate funding and supports\n" +
        "- Schedule regular progress meetings\n\n";
        
      // Add service-specific phases based on track
      if (moduleAssignment.serviceTrack === 'business_focus') {
        roadmapStages += "### Phase 3-5: Business Development\n" +
          "- Follow Business Magician roadmap with VR integration\n" +
          "- Ensure all business development activities align with VR requirements\n" +
          "- Document progress for VR reporting\n" +
          "- Leverage VR resources for business support\n\n";
      } 
      else if (moduleAssignment.serviceTrack === 'employment_focus') {
        roadmapStages += "### Phase 3-5: Employment Pathway\n" +
          "- Follow Job Magician roadmap with VR integration\n" +
          "- Ensure all job search activities align with VR requirements\n" +
          "- Document progress for VR reporting\n" +
          "- Leverage VR resources for employment support\n\n";
      }
      else if (moduleAssignment.serviceTrack === 'comprehensive') {
        roadmapStages += "### Phase 3: Exploration & Direction\n" +
          "- Explore both employment and self-employment options\n" +
          "- Compare potential outcomes and requirements\n" +
          "- Select primary direction (employment or business)\n" +
          "- Develop comprehensive plan with VR counselor\n\n" +
          
          "### Phase 4-5: Implementation\n" +
          "- Follow selected pathway (Business or Job) with VR integration\n" +
          "- Maintain flexibility to adjust between pathways as needed\n" +
          "- Document progress for VR reporting\n" +
          "- Leverage VR resources for comprehensive support\n\n";
      }
      
      roadmapStages += "### Ongoing: VR Coordination\n" +
        "- Regular updates to VR counselor\n" +
        "- Documentation for VR requirements\n" +
        "- Accommodation assessment and implementation\n" +
        "- Progress evaluation and plan adjustments\n\n";
      break;
      
    case ECOSYSTEM_MODULES.LEARNING_CENTER:
      roadmapStages += "### Phase 1: Comprehensive Assessment\n" +
        "- Complete career and skills assessment\n" +
        "- Explore business and employment options\n" +
        "- Evaluate readiness for various paths\n" +
        "- Identify knowledge and skill gaps\n\n" +
        
        "### Phase 2: Exploration\n" +
        "- Learn about different career and business opportunities\n" +
        "- Connect with mentors in areas of interest\n" +
        "- Participate in workshops and training\n" +
        "- Develop core skills\n\n" +
        
        "### Phase 3: Direction Setting\n" +
        "- Choose primary path (business, employment, or hybrid)\n" +
        "- Set specific goals and timeline\n" +
        "- Create skill development plan\n" +
        "- Transition to appropriate service track\n\n" +
        
        "### Phase 4-5: Implementation\n" +
        "- Follow selected service track roadmap\n" +
        "- Continue relevant training and education\n" +
        "- Regular progress reviews and adjustments\n" +
        "- Transition to Business or Job Magician as appropriate\n\n";
      break;
  }
  
  // ASL/accessibility notes if needed
  let accessibilityInfo = '';
  if (userData.isDeaf === 'Yes' || userData.aslPreference.includes('Yes')) {
    accessibilityInfo = "## Accessibility & ASL Resources\n\n" +
      "Based on your preferences, we'll provide:\n\n" +
      "- ASL videos for key content\n" +
      "- ASL interpreters for meetings (when requested)\n" +
      "- Visual and text-based materials\n" +
      "- Captioned video content\n" +
      "- Additional accommodations as needed\n\n" +
      
      "Please let us know if you have specific accessibility requests at any point during your journey.\n\n";
  }
  
  // Next steps
  let nextSteps = "## Immediate Next Steps\n\n";
  
  switch (moduleAssignment.serviceDeliveryMethod) {
    case SERVICE_TYPES.SELF_SERVICE:
      nextSteps += "1. Explore your personalized resource folder\n" +
        "2. Complete the initial assessment in your primary service area\n" +
        "3. Begin working through the recommended tasks\n" +
        "4. Check the learning center for tutorials on using the platform\n" +
        "5. Reach out via chat if you have questions\n\n";
      break;
      
    case SERVICE_TYPES.GUIDED:
      nextSteps += "1. Schedule your first advisor meeting (link in welcome email)\n" +
        "2. Complete the initial assessment before your meeting\n" +
        "3. Review your personalized resource folder\n" +
        "4. Prepare questions for your advisor\n" +
        "5. Begin working on preliminary tasks\n\n";
      break;
      
    case SERVICE_TYPES.FULL_SERVICE:
      nextSteps += "1. Your advisor will contact you within 1 business day\n" +
        "2. Complete the initial assessment sent to your email\n" +
        "3. Schedule your comprehensive intake session\n" +
        "4. Review your personalized resource folder\n" +
        "5. Prepare any questions or documentation for your intake session\n\n";
      break;
  }
  
  // Final contact information
  let contactInfo = "## Contact & Support\n\n" +
    "If you have any questions or need assistance, please contact us:\n\n" +
    "- Email: support@360magicians.com\n" +
    "- Text/Call: 555-123-4567\n" +
    "- Chat: Available in your account dashboard\n" +
    "- Video Call (ASL): Schedule through your account dashboard\n\n" +
    
    "We're excited to be part of your journey!\n\n" +
    "The 360 Magicians Team";
  
  // Compose the full document content
  const fullContent = roadmapText + moduleInfo + serviceInfo + roadmapStages + accessibilityInfo + nextSteps + contactInfo;
  
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
 * Create business module resources
 * @param {Object} userData - User intake data
 * @param {string} businessUserType - Business user type
 * @param {string} parentFolderId - Parent folder ID
 * @returns {Promise<Object>} - Created resources or error
 */
async function createBusinessModuleResources(userData, businessUserType, parentFolderId) {
  try {
    // Create business module folder
    const folderResult = await googleWorkspace.createFolder(
      `${userData.name} - Business Resources`,
      parentFolderId
    );
    
    if (!folderResult.success) {
      throw new Error(`Failed to create business folder: ${folderResult.error}`);
    }
    
    // Create business profile template
    const businessData = {
      name: `${userData.name}'s Business`,
      userId: 1, // Placeholder
      description: "Your business description will go here",
      businessType: null,
      formationState: null,
      formationStatus: "Planning"
    };
    
    // Generate the main business resources using user profiling service
    const businessPlan = await googleWorkspace.generateBusinessPlan(businessData);
    
    // Create task list for business development
    const sheetResult = await googleWorkspace.createSpreadsheet(
      `${userData.name} - Business Tasks`,
      folderResult.folderId
    );
    
    if (sheetResult.success) {
      // Headers for the task list
      const headers = [
        ['Task', 'Phase', 'Due Date', 'Priority', 'Status', 'Notes', 'Resources']
      ];
      
      // Add business tasks based on user type
      const tasks = getBusinessTasks(businessUserType);
      
      await googleWorkspace.updateSpreadsheetValues(
        sheetResult.spreadsheetId,
        'Sheet1!A1:G1',
        headers
      );
      
      await googleWorkspace.updateSpreadsheetValues(
        sheetResult.spreadsheetId,
        `Sheet1!A2:G${tasks.length + 1}`,
        tasks
      );
    }
    
    return {
      success: true,
      businessFolder: {
        id: folderResult.folderId,
        link: folderResult.link
      },
      businessPlan: businessPlan.success ? {
        folder: businessPlan.folderId,
        documentId: businessPlan.businessPlan?.documentId,
        link: businessPlan.businessPlan?.link
      } : null,
      businessTasks: sheetResult.success ? {
        id: sheetResult.spreadsheetId,
        url: sheetResult.url
      } : null
    };
  } catch (error) {
    console.error('Error creating business module resources:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get business tasks based on user type
 * @param {string} businessUserType - Business user type
 * @returns {Array} - Array of task rows for spreadsheet
 */
function getBusinessTasks(businessUserType) {
  // Common business tasks for all users
  const commonTasks = [
    ['Define your business concept', 'Ideation', '', 'High', 'Not Started', '', ''],
    ['Conduct initial market research', 'Ideation', '', 'High', 'Not Started', '', ''],
    ['Create business plan', 'Planning', '', 'High', 'Not Started', '', '']
  ];
  
  // Type-specific tasks
  let typeTasks = [];
  
  switch (businessUserType) {
    case userProfiling.USER_TYPES.DEAF_ENTREPRENEUR:
      typeTasks = [
        ['Connect with VR counselor about business plan', 'Planning', '', 'High', 'Not Started', '', ''],
        ['Research VR self-employment funding', 'Funding', '', 'High', 'Not Started', '', ''],
        ['Create accessibility plan for your business', 'Planning', '', 'Medium', 'Not Started', '', ''],
        ['Connect with deaf business mentor', 'Support', '', 'Medium', 'Not Started', '', '']
      ];
      break;
      
    case userProfiling.USER_TYPES.VR_CLIENT:
      typeTasks = [
        ['Submit business concept to VR counselor', 'Approval', '', 'High', 'Not Started', '', ''],
        ['Complete VR business assessment', 'Assessment', '', 'High', 'Not Started', '', ''],
        ['Create VR funding request', 'Funding', '', 'High', 'Not Started', '', ''],
        ['Schedule monthly VR progress meetings', 'Support', '', 'Medium', 'Not Started', '', '']
      ];
      break;
      
    case userProfiling.USER_TYPES.EXISTING_BUSINESS_OWNER:
      typeTasks = [
        ['Complete business assessment', 'Assessment', '', 'High', 'Not Started', '', ''],
        ['Create growth strategy document', 'Planning', '', 'High', 'Not Started', '', ''],
        ['Review current financials', 'Assessment', '', 'High', 'Not Started', '', ''],
        ['Identify business optimization opportunities', 'Optimization', '', 'Medium', 'Not Started', '', '']
      ];
      break;
      
    case userProfiling.USER_TYPES.GENERAL_ENTREPRENEUR:
    default:
      typeTasks = [
        ['Validate business idea with potential customers', 'Validation', '', 'High', 'Not Started', '', ''],
        ['Research business structure options', 'Formation', '', 'Medium', 'Not Started', '', ''],
        ['Create startup budget', 'Planning', '', 'High', 'Not Started', '', ''],
        ['Identify initial funding sources', 'Funding', '', 'Medium', 'Not Started', '', '']
      ];
      break;
  }
  
  // Formation tasks for all new businesses
  const formationTasks = [
    ['Choose business name', 'Formation', '', 'High', 'Not Started', '', ''],
    ['Register business entity', 'Formation', '', 'High', 'Not Started', '', ''],
    ['Obtain EIN', 'Formation', '', 'High', 'Not Started', '', ''],
    ['Open business bank account', 'Formation', '', 'Medium', 'Not Started', '', '']
  ];
  
  // Only add formation tasks for new businesses
  if (businessUserType !== userProfiling.USER_TYPES.EXISTING_BUSINESS_OWNER) {
    return [...commonTasks, ...typeTasks, ...formationTasks];
  } else {
    return [...commonTasks, ...typeTasks];
  }
}

/**
 * Create job module resources
 * @param {Object} userData - User intake data
 * @param {string} parentFolderId - Parent folder ID
 * @returns {Promise<Object>} - Created resources or error
 */
async function createJobModuleResources(userData, parentFolderId) {
  try {
    // Create job module folder
    const folderResult = await googleWorkspace.createFolder(
      `${userData.name} - Job Search Resources`,
      parentFolderId
    );
    
    if (!folderResult.success) {
      throw new Error(`Failed to create job search folder: ${folderResult.error}`);
    }
    
    // Create resume document
    const resumeResult = await googleWorkspace.createDocument(
      `${userData.name} - Resume Template`,
      folderResult.folderId
    );
    
    let resumeDocId = null;
    let resumeLink = null;
    
    if (resumeResult.success) {
      resumeDocId = resumeResult.documentId;
      resumeLink = resumeResult.link;
      
      // Add basic resume template
      const resumeContent = {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: `# ${userData.name} - Professional Resume\n\n` +
                    "## Contact Information\n\n" +
                    `Name: ${userData.name}\n` +
                    `Email: ${userData.email}\n` +
                    `Phone: ${userData.phone}\n\n` +
                    "## Professional Summary\n\n" +
                    "[Insert a brief 2-3 sentence summary highlighting your key skills, experience, and what makes you valuable to employers.]\n\n" +
                    "## Skills\n\n" +
                    "- [Skill 1]\n" +
                    "- [Skill 2]\n" +
                    "- [Skill 3]\n" +
                    "- [Skill 4]\n" +
                    "- [Skill 5]\n\n" +
                    "## Experience\n\n" +
                    "### [Company Name]\n" +
                    "[Job Title] | [Start Date] - [End Date]\n\n" +
                    "- [Accomplishment 1]\n" +
                    "- [Accomplishment 2]\n" +
                    "- [Accomplishment 3]\n\n" +
                    "### [Previous Company Name]\n" +
                    "[Job Title] | [Start Date] - [End Date]\n\n" +
                    "- [Accomplishment 1]\n" +
                    "- [Accomplishment 2]\n" +
                    "- [Accomplishment 3]\n\n" +
                    "## Education\n\n" +
                    "[Degree/Certificate] | [Institution]\n" +
                    "[Graduation Date]\n\n" +
                    "## References\n\n" +
                    "Available upon request"
            }
          }
        ]
      };
      
      await googleWorkspace.writeToDocument(resumeDocId, resumeContent);
    }
    
    // Create job search tracker
    const trackerResult = await googleWorkspace.createSpreadsheet(
      `${userData.name} - Job Search Tracker`,
      folderResult.folderId
    );
    
    let trackerId = null;
    let trackerUrl = null;
    
    if (trackerResult.success) {
      trackerId = trackerResult.spreadsheetId;
      trackerUrl = trackerResult.url;
      
      // Set up the headers for the job tracker
      const headers = [
        ['Company', 'Position', 'Location', 'Date Applied', 'Application Method', 'Contact Person', 'Status', 'Follow-up Date', 'Notes', 'Interview Date', 'Offer Details']
      ];
      
      await googleWorkspace.updateSpreadsheetValues(
        trackerId,
        'Sheet1!A1:K1',
        headers
      );
    }
    
    // Create interview prep document
    const interviewPrepResult = await googleWorkspace.createDocument(
      `${userData.name} - Interview Preparation`,
      folderResult.folderId
    );
    
    let interviewPrepId = null;
    let interviewPrepLink = null;
    
    if (interviewPrepResult.success) {
      interviewPrepId = interviewPrepResult.documentId;
      interviewPrepLink = interviewPrepResult.link;
      
      // Add interview preparation content
      const interviewContent = {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: "# Interview Preparation Guide\n\n" +
                    "## Common Interview Questions\n\n" +
                    "### Tell me about yourself\n" +
                    "[Prepare a 30-60 second professional summary]\n\n" +
                    "### What are your strengths?\n" +
                    "[List 3-5 strengths with specific examples]\n\n" +
                    "### What are your weaknesses?\n" +
                    "[Choose 1-2 genuine areas for improvement, with steps you're taking to address them]\n\n" +
                    "### Why do you want to work here?\n" +
                    "[Research the company and prepare specific reasons]\n\n" +
                    "### Tell me about a challenge you faced and how you overcame it\n" +
                    "[Prepare a STAR method story: Situation, Task, Action, Result]\n\n" +
                    "## Interview Checklist\n\n" +
                    "### Before the Interview\n" +
                    "- [ ] Research the company thoroughly\n" +
                    "- [ ] Practice answers to common questions\n" +
                    "- [ ] Prepare questions to ask the interviewer\n" +
                    "- [ ] Plan your professional outfit\n" +
                    "- [ ] Test technology if virtual interview\n" +
                    "- [ ] Request accommodations if needed\n\n" +
                    "### Day of Interview\n" +
                    "- [ ] Arrive 15 minutes early (or log in 5-10 minutes early for virtual)\n" +
                    "- [ ] Bring extra copies of resume\n" +
                    "- [ ] Bring notepad and pen\n" +
                    "- [ ] Turn off phone\n\n" +
                    "### After the Interview\n" +
                    "- [ ] Send thank you email within 24 hours\n" +
                    "- [ ] Follow up if no response after one week\n" +
                    "- [ ] Update job search tracker\n\n" +
                    "## Accommodation Requests\n\n" +
                    "[If needed, prepare specific accommodation requests for interviews]"
            }
          }
        ]
      };
      
      await googleWorkspace.writeToDocument(interviewPrepId, interviewContent);
    }
    
    // Create job search task list
    const taskListResult = await googleWorkspace.createSpreadsheet(
      `${userData.name} - Job Search Tasks`,
      folderResult.folderId
    );
    
    let taskListId = null;
    let taskListUrl = null;
    
    if (taskListResult.success) {
      taskListId = taskListResult.spreadsheetId;
      taskListUrl = taskListResult.url;
      
      // Headers for the task list
      const headers = [
        ['Task', 'Category', 'Due Date', 'Priority', 'Status', 'Notes', 'Resources']
      ];
      
      // Job search tasks
      const tasks = [
        ['Update resume', 'Preparation', '', 'High', 'Not Started', '', resumeLink || ''],
        ['Create LinkedIn profile', 'Preparation', '', 'Medium', 'Not Started', '', ''],
        ['Research target companies', 'Research', '', 'Medium', 'Not Started', '', ''],
        ['Set up job alerts on job boards', 'Search', '', 'Medium', 'Not Started', '', ''],
        ['Practice interview questions', 'Preparation', '', 'Medium', 'Not Started', '', interviewPrepLink || ''],
        ['Contact 3 potential references', 'Preparation', '', 'Medium', 'Not Started', '', ''],
        ['Apply to 5 jobs this week', 'Application', '', 'High', 'Not Started', '', trackerUrl || ''],
        ['Connect with 3 industry professionals', 'Networking', '', 'Medium', 'Not Started', '', ''],
        ['Schedule mock interview', 'Preparation', '', 'Medium', 'Not Started', '', ''],
        ['Prepare interview outfit', 'Preparation', '', 'Low', 'Not Started', '', '']
      ];
      
      // Add ASL-specific tasks if needed
      if (userData.isDeaf === 'Yes' || userData.aslPreference.includes('Yes')) {
        tasks.push(
          ['Prepare accommodation request template', 'Accessibility', '', 'High', 'Not Started', '', ''],
          ['Research ASL-friendly employers', 'Research', '', 'Medium', 'Not Started', '', ''],
          ['Prepare communication preference explanation', 'Preparation', '', 'Medium', 'Not Started', '', '']
        );
      }
      
      await googleWorkspace.updateSpreadsheetValues(
        taskListId,
        'Sheet1!A1:G1',
        headers
      );
      
      await googleWorkspace.updateSpreadsheetValues(
        taskListId,
        `Sheet1!A2:G${tasks.length + 1}`,
        tasks
      );
    }
    
    return {
      success: true,
      jobFolder: {
        id: folderResult.folderId,
        link: folderResult.link
      },
      resumeDocument: resumeResult.success ? {
        id: resumeDocId,
        link: resumeLink
      } : null,
      jobTracker: trackerResult.success ? {
        id: trackerId,
        url: trackerUrl
      } : null,
      interviewPrep: interviewPrepResult.success ? {
        id: interviewPrepId,
        link: interviewPrepLink
      } : null,
      jobTasks: taskListResult.success ? {
        id: taskListId,
        url: taskListUrl
      } : null
    };
  } catch (error) {
    console.error('Error creating job module resources:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create VR4Deaf resources
 * @param {Object} userData - User intake data
 * @param {string} serviceTrack - VR service track
 * @param {string} parentFolderId - Parent folder ID
 * @returns {Promise<Object>} - Created resources or error
 */
async function createVR4DeafResources(userData, serviceTrack, parentFolderId) {
  try {
    // Create VR module folder
    const folderResult = await googleWorkspace.createFolder(
      `${userData.name} - VR Coordination`,
      parentFolderId
    );
    
    if (!folderResult.success) {
      throw new Error(`Failed to create VR folder: ${folderResult.error}`);
    }
    
    // Create VR coordination document
    const vrDocResult = await googleWorkspace.createDocument(
      `${userData.name} - VR Coordination Plan`,
      folderResult.folderId
    );
    
    let vrDocId = null;
    let vrDocLink = null;
    
    if (vrDocResult.success) {
      vrDocId = vrDocResult.documentId;
      vrDocLink = vrDocResult.link;
      
      // Add VR coordination content
      const vrContent = {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: `# VR Coordination Plan - ${userData.name}\n\n` +
                    "## VR Contact Information\n\n" +
                    `VR Counselor: ${userData.vrCounselor || '[Counselor name]'}\n` +
                    `VR Office: ${userData.vrOffice || '[Office location]'}\n\n` +
                    "## Service Integration\n\n" +
                    "This document outlines how 360 Magicians services will coordinate with your VR services.\n\n" +
                    "### Primary Focus\n\n" +
                    serviceTrack === 'business_focus' ? 
                      "Your VR services will focus on business development and self-employment.\n\n" :
                    serviceTrack === 'employment_focus' ?
                      "Your VR services will focus on employment placement and support.\n\n" :
                    serviceTrack === 'comprehensive' ?
                      "Your VR services will include both employment and self-employment pathways.\n\n" :
                      "Your VR services will begin with assessment to determine your optimal pathway.\n\n" +
                    
                    "## Documentation for VR\n\n" +
                    "The following documents will be shared with your VR counselor:\n\n" +
                    "- Monthly progress reports\n" +
                    "- Service outcome documentation\n" +
                    "- Assessment results\n" +
                    "- Accommodation requests and implementations\n\n" +
                    
                    "## VR Funding Coordination\n\n" +
                    "- VR potentially can fund: [List specific items VR may fund]\n" +
                    "- Documentation needed for funding requests\n" +
                    "- Timeline for funding request submissions\n\n" +
                    
                    "## Accessibility Accommodations\n\n" +
                    "### Communication Preferences\n" +
                    "- ASL interpreters for meetings (as needed)\n" +
                    "- Video call options with ASL support\n" +
                    "- Written communication follow-up for all meetings\n\n" +
                    
                    "### Resource Formats\n" +
                    "- ASL video versions of key content\n" +
                    "- Visual aids and infographics\n" +
                    "- Text-based alternatives to audio content\n\n" +
                    
                    "## Progress Tracking for VR\n\n" +
                    "We will track the following metrics for VR reporting:\n\n" +
                    "- Service engagement (attendance, participation)\n" +
                    "- Task completion and milestone achievement\n" +
                    "- Skill development progress\n" +
                    "- Movement toward employment or business goals\n\n" +
                    
                    "## Coordination Meeting Schedule\n\n" +
                    "- Initial coordination meeting: [Date to be scheduled]\n" +
                    "- Regular progress updates: [Frequency to be determined]\n" +
                    "- Milestone review meetings: After completion of each phase\n\n" +
                    
                    "## Additional VR Resources\n\n" +
                    "- Equipment and assistive technology assessment\n" +
                    "- Additional training opportunities through VR\n" +
                    "- Benefit counseling and work incentives planning\n" +
                    "- Self-employment specific resources (if applicable)"
            }
          }
        ]
      };
      
      await googleWorkspace.writeToDocument(vrDocId, vrContent);
    }
    
    // Create VR progress tracking sheet
    const progressSheetResult = await googleWorkspace.createSpreadsheet(
      `${userData.name} - VR Progress Tracking`,
      folderResult.folderId
    );
    
    let progressSheetId = null;
    let progressSheetUrl = null;
    
    if (progressSheetResult.success) {
      progressSheetId = progressSheetResult.spreadsheetId;
      progressSheetUrl = progressSheetResult.url;
      
      // Headers for the progress tracking
      const headers = [
        ['Date', 'Service Activity', 'Duration', 'Progress Made', 'Challenges', 'Next Steps', 'VR Reportable', 'Documentation Link']
      ];
      
      await googleWorkspace.updateSpreadsheetValues(
        progressSheetId,
        'Sheet1!A1:H1',
        headers
      );
    }
    
    // Create accommodation plan document
    const accommodationResult = await googleWorkspace.createDocument(
      `${userData.name} - Accommodation Plan`,
      folderResult.folderId
    );
    
    let accommodationId = null;
    let accommodationLink = null;
    
    if (accommodationResult.success) {
      accommodationId = accommodationResult.documentId;
      accommodationLink = accommodationResult.link;
      
      // Add accommodation plan content
      const accommodationContent = {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: `# Accommodation Plan - ${userData.name}\n\n` +
                    "## Communication Needs\n\n" +
                    "- Preferred communication method: ASL\n" +
                    "- Interpreter services: [To be arranged as needed]\n" +
                    "- Video platform preferences: [Specify platforms]\n\n" +
                    
                    "## Workspace Accommodations\n\n" +
                    "### Physical Environment\n" +
                    "- Visual alerting devices\n" +
                    "- Proper lighting for signing\n" +
                    "- Seating arrangement considerations\n\n" +
                    
                    "### Technology\n" +
                    "- Video calling capability\n" +
                    "- Text-based communication options\n" +
                    "- Visual notification systems\n\n" +
                    
                    "## Employment/Business Setting\n\n" +
                    "### For Employment\n" +
                    "- Interview accommodation requests\n" +
                    "- Workplace communication plan\n" +
                    "- Training accessibility needs\n\n" +
                    
                    "### For Business\n" +
                    "- Customer communication strategies\n" +
                    "- Supplier/vendor communication plan\n" +
                    "- Business meeting accommodations\n\n" +
                    
                    "## Service Delivery Accommodations\n\n" +
                    "- ASL versions of key materials\n" +
                    "- Interpreter scheduling procedure\n" +
                    "- Written summaries of verbal content\n" +
                    "- Extended time for document review when needed\n\n" +
                    
                    "## Emergency Procedures\n\n" +
                    "- Visual emergency notification system\n" +
                    "- Emergency communication plan\n" +
                    "- Safe meeting protocols\n\n" +
                    
                    "## Accommodation Request Process\n\n" +
                    "1. Submit request via email or video\n" +
                    "2. Confirmation within 1 business day\n" +
                    "3. Implementation within 3-5 business days\n" +
                    "4. Follow-up on effectiveness\n\n" +
                    
                    "## VR Accommodation Funding\n\n" +
                    "- Items potentially fundable through VR\n" +
                    "- Documentation requirements\n" +
                    "- Request submission process\n" +
                    "- Timeline for approvals"
            }
          }
        ]
      };
      
      await googleWorkspace.writeToDocument(accommodationId, accommodationContent);
    }
    
    // Create additional track-specific resources
    let trackSpecificResources = null;
    
    if (serviceTrack === 'business_focus') {
      // For business focus, create simpler business resources
      const businessUserType = userData.isDeaf === 'Yes' ? 
        userProfiling.USER_TYPES.DEAF_ENTREPRENEUR : 
        userProfiling.USER_TYPES.VR_CLIENT;
      
      trackSpecificResources = await createBusinessModuleResources(
        userData, 
        businessUserType, 
        folderResult.folderId
      );
    } 
    else if (serviceTrack === 'employment_focus') {
      // For employment focus, create job resources
      trackSpecificResources = await createJobModuleResources(
        userData,
        folderResult.folderId
      );
    }
    
    return {
      success: true,
      vrFolder: {
        id: folderResult.folderId,
        link: folderResult.link
      },
      vrCoordinationPlan: vrDocResult.success ? {
        id: vrDocId,
        link: vrDocLink
      } : null,
      vrProgressTracking: progressSheetResult.success ? {
        id: progressSheetId,
        url: progressSheetUrl
      } : null,
      accommodationPlan: accommodationResult.success ? {
        id: accommodationId,
        link: accommodationLink
      } : null,
      trackSpecificResources: trackSpecificResources
    };
  } catch (error) {
    console.error('Error creating VR4Deaf resources:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create a resource directory document
 * @param {Object} userData - User intake data
 * @param {Object} moduleAssignment - Module assignment information
 * @param {string} folderId - User's profile folder ID
 * @param {string} roadmapDocId - Service roadmap document ID
 * @param {Object} moduleResources - Module-specific resources
 * @returns {Promise<Object>} - The created document or error
 */
async function createResourceDirectory(userData, moduleAssignment, folderId, roadmapDocId, moduleResources) {
  try {
    // Create directory document
    const docResult = await googleWorkspace.createDocument(
      `${userData.name} - Resource Directory`,
      folderId
    );
    
    if (!docResult.success) {
      throw new Error(`Failed to create resource directory: ${docResult.error}`);
    }
    
    // Prepare document content
    let resourceText = `# 360 Magicians Resource Directory - ${userData.name}\n\n` +
      "This document provides links to all your personalized resources.\n\n" +
      
      "## Your Service Roadmap\n\n" +
      `[Open your service roadmap](${roadmapDocId})\n\n` +
      "Review this document first to understand your service path and next steps.\n\n";
    
    // Add module-specific resources
    if (moduleAssignment.primaryModule === ECOSYSTEM_MODULES.BUSINESS_MAGICIAN && moduleResources) {
      resourceText += "## Business Development Resources\n\n" +
        `[Open your business folder](${moduleResources.businessFolder?.link})\n\n` +
        
        "### Business Planning\n\n" +
        `- [Business Plan](${moduleResources.businessPlan?.link})\n` +
        
        "### Business Tasks\n\n" +
        `- [Business Task List](${moduleResources.businessTasks?.url})\n\n`;
    }
    else if (moduleAssignment.primaryModule === ECOSYSTEM_MODULES.JOB_MAGICIAN && moduleResources) {
      resourceText += "## Job Search Resources\n\n" +
        `[Open your job search folder](${moduleResources.jobFolder?.link})\n\n` +
        
        "### Essential Documents\n\n" +
        `- [Resume Template](${moduleResources.resumeDocument?.link})\n` +
        `- [Interview Preparation](${moduleResources.interviewPrep?.link})\n\n` +
        
        "### Job Search Tools\n\n" +
        `- [Job Search Tracker](${moduleResources.jobTracker?.url})\n` +
        `- [Job Search Tasks](${moduleResources.jobTasks?.url})\n\n`;
    }
    else if (moduleAssignment.primaryModule === ECOSYSTEM_MODULES.VR4DEAF && moduleResources) {
      resourceText += "## VR Coordination Resources\n\n" +
        `[Open your VR coordination folder](${moduleResources.vrFolder?.link})\n\n` +
        
        "### VR Documentation\n\n" +
        `- [VR Coordination Plan](${moduleResources.vrCoordinationPlan?.link})\n` +
        `- [VR Progress Tracking](${moduleResources.vrProgressTracking?.url})\n` +
        `- [Accommodation Plan](${moduleResources.accommodationPlan?.link})\n\n`;
      
      // Add track-specific resources
      if (moduleResources.trackSpecificResources) {
        if (moduleAssignment.serviceTrack === 'business_focus') {
          resourceText += "### Business Development\n\n" +
            `- [Business Plan](${moduleResources.trackSpecificResources.businessPlan?.link})\n` +
            `- [Business Tasks](${moduleResources.trackSpecificResources.businessTasks?.url})\n\n`;
        }
        else if (moduleAssignment.serviceTrack === 'employment_focus') {
          resourceText += "### Employment Resources\n\n" +
            `- [Resume Template](${moduleResources.trackSpecificResources.resumeDocument?.link})\n` +
            `- [Job Search Tracker](${moduleResources.trackSpecificResources.jobTracker?.url})\n` +
            `- [Interview Preparation](${moduleResources.trackSpecificResources.interviewPrep?.link})\n\n`;
        }
      }
    }
    
    // Add ASL resources if needed
    if (userData.isDeaf === 'Yes' || userData.aslPreference.includes('Yes')) {
      resourceText += "## ASL Resources\n\n" +
        "- [ASL Video Library](https://360magicians.com/asl-library)\n" +
        "- [Interpreter Request Form](https://360magicians.com/interpreter-request)\n" +
        "- [ASL Business Glossary](https://360magicians.com/asl-business-terms)\n\n";
    }
    
    // Add general resources
    resourceText += "## General Resources\n\n" +
      "- [Learning Center](https://360magicians.com/learning-center)\n" +
      "- [Support Contact Information](https://360magicians.com/support)\n" +
      "- [Frequently Asked Questions](https://360magicians.com/faq)\n\n" +
      
      "## How to Access Your Resources\n\n" +
      "1. Click on any link above to open the specific resource\n" +
      "2. All resources are also available in your Google Drive folder\n" +
      "3. New resources will be added to your folder as you progress\n" +
      "4. Contact your advisor if you need help accessing any resources\n\n" +
      
      "## Need Additional Resources?\n\n" +
      "If you need additional resources not listed here, please contact your 360 Magicians advisor.";
    
    // Format for Google Docs API
    const content = {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: resourceText
          }
        }
      ]
    };
    
    // Add content to the document
    await googleWorkspace.writeToDocument(docResult.documentId, content);
    
    return {
      success: true,
      documentId: docResult.documentId,
      link: docResult.link
    };
  } catch (error) {
    console.error('Error creating resource directory:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  createUnifiedIntakeForm,
  processUnifiedIntake,
  ECOSYSTEM_MODULES,
  USER_JOURNEY,
  SERVICE_TYPES
};