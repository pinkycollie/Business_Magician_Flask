import { 
  users, type User, type InsertUser,
  lifecyclePhases, type LifecyclePhase, type InsertLifecyclePhase,
  tasks, type Task, type InsertTask,
  subtasks, type Subtask, type InsertSubtask,
  tools, type Tool, type InsertTool,
  aslVideos, type ASLVideo, type InsertASLVideo,
  userProgress, type UserProgress, type InsertUserProgress,
  businesses, type Business, type InsertBusiness,
  vrCounselors, type VRCounselor, type InsertVRCounselor,
  userCounselors, type UserCounselor, type InsertUserCounselor
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lifecycle phases
  getLifecyclePhases(): Promise<LifecyclePhase[]>;
  getLifecyclePhase(id: number): Promise<LifecyclePhase | undefined>;
  getLifecyclePhaseBySlug(slug: string): Promise<LifecyclePhase | undefined>;
  createLifecyclePhase(phase: InsertLifecyclePhase): Promise<LifecyclePhase>;
  
  // Tasks
  getTasks(phaseId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  
  // Subtasks
  getSubtasks(taskId: number): Promise<Subtask[]>;
  getSubtask(id: number): Promise<Subtask | undefined>;
  createSubtask(subtask: InsertSubtask): Promise<Subtask>;
  
  // Tools
  getTools(phaseId: number): Promise<Tool[]>;
  getTool(id: number): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  
  // ASL Videos
  getASLVideos(params: { phaseId?: number; taskId?: number }): Promise<ASLVideo[]>;
  getASLVideo(id: number): Promise<ASLVideo | undefined>;
  createASLVideo(video: InsertASLVideo): Promise<ASLVideo>;
  
  // User Progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getTaskProgress(userId: number, taskId: number): Promise<UserProgress[]>;
  updateSubtaskProgress(userId: number, subtaskId: number, completed: boolean): Promise<UserProgress>;
  
  // Business Records
  createBusiness(business: InsertBusiness): Promise<Business>;
  getBusinesses(userId: number): Promise<Business[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  updateBusiness(id: number, data: Partial<InsertBusiness>): Promise<Business>;
  
  // VR Counseling
  getVRCounselors(): Promise<VRCounselor[]>;
  getVRCounselor(id: number): Promise<VRCounselor | undefined>;
  createVRCounselor(counselor: InsertVRCounselor): Promise<VRCounselor>;
  
  // User-Counselor relationships
  getUserCounselors(userId: number): Promise<(UserCounselor & { counselor: VRCounselor })[]>;
  createUserCounselor(relation: InsertUserCounselor): Promise<UserCounselor>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private lifecyclePhases: Map<number, LifecyclePhase>;
  private tasks: Map<number, Task>;
  private subtasks: Map<number, Subtask>;
  private tools: Map<number, Tool>;
  private aslVideos: Map<number, ASLVideo>;
  private userProgress: Map<number, UserProgress>;
  private businesses: Map<number, Business>;
  private vrCounselors: Map<number, VRCounselor>;
  private userCounselors: Map<number, UserCounselor>;
  
  private userIdCounter: number;
  private phaseIdCounter: number;
  private taskIdCounter: number;
  private subtaskIdCounter: number;
  private toolIdCounter: number;
  private videoIdCounter: number;
  private progressIdCounter: number;
  private businessIdCounter: number;
  private counselorIdCounter: number;
  private userCounselorIdCounter: number;

  constructor() {
    this.users = new Map();
    this.lifecyclePhases = new Map();
    this.tasks = new Map();
    this.subtasks = new Map();
    this.tools = new Map();
    this.aslVideos = new Map();
    this.userProgress = new Map();
    this.businesses = new Map();
    this.vrCounselors = new Map();
    this.userCounselors = new Map();
    
    this.userIdCounter = 1;
    this.phaseIdCounter = 1;
    this.taskIdCounter = 1;
    this.subtaskIdCounter = 1;
    this.toolIdCounter = 1;
    this.videoIdCounter = 1;
    this.progressIdCounter = 1;
    this.businessIdCounter = 1;
    this.counselorIdCounter = 1;
    this.userCounselorIdCounter = 1;
    
    // Initialize with seed data
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Lifecycle phase methods
  async getLifecyclePhases(): Promise<LifecyclePhase[]> {
    return Array.from(this.lifecyclePhases.values())
      .sort((a, b) => a.order - b.order);
  }

  async getLifecyclePhase(id: number): Promise<LifecyclePhase | undefined> {
    return this.lifecyclePhases.get(id);
  }

  async getLifecyclePhaseBySlug(slug: string): Promise<LifecyclePhase | undefined> {
    return Array.from(this.lifecyclePhases.values()).find(
      (phase) => phase.slug === slug,
    );
  }

  async createLifecyclePhase(insertPhase: InsertLifecyclePhase): Promise<LifecyclePhase> {
    const id = this.phaseIdCounter++;
    const phase: LifecyclePhase = { ...insertPhase, id };
    this.lifecyclePhases.set(id, phase);
    return phase;
  }

  // Task methods
  async getTasks(phaseId: number): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.phaseId === phaseId)
      .sort((a, b) => a.order - b.order);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  // Subtask methods
  async getSubtasks(taskId: number): Promise<Subtask[]> {
    return Array.from(this.subtasks.values())
      .filter(subtask => subtask.taskId === taskId)
      .sort((a, b) => a.order - b.order);
  }

  async getSubtask(id: number): Promise<Subtask | undefined> {
    return this.subtasks.get(id);
  }

  async createSubtask(insertSubtask: InsertSubtask): Promise<Subtask> {
    const id = this.subtaskIdCounter++;
    const subtask: Subtask = { ...insertSubtask, id };
    this.subtasks.set(id, subtask);
    return subtask;
  }

  // Tools methods
  async getTools(phaseId: number): Promise<Tool[]> {
    return Array.from(this.tools.values())
      .filter(tool => tool.phaseId === phaseId);
  }

  async getTool(id: number): Promise<Tool | undefined> {
    return this.tools.get(id);
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = this.toolIdCounter++;
    const tool: Tool = { ...insertTool, id };
    this.tools.set(id, tool);
    return tool;
  }

  // ASL Videos methods
  async getASLVideos(params: { phaseId?: number; taskId?: number } = {}): Promise<ASLVideo[]> {
    return Array.from(this.aslVideos.values())
      .filter(video => {
        if (params.phaseId !== undefined && params.taskId !== undefined) {
          return video.phaseId === params.phaseId && video.taskId === params.taskId;
        } else if (params.phaseId !== undefined) {
          return video.phaseId === params.phaseId;
        } else if (params.taskId !== undefined) {
          return video.taskId === params.taskId;
        }
        return true;
      });
  }

  async getASLVideo(id: number): Promise<ASLVideo | undefined> {
    return this.aslVideos.get(id);
  }

  async createASLVideo(insertVideo: InsertASLVideo): Promise<ASLVideo> {
    const id = this.videoIdCounter++;
    const video: ASLVideo = { ...insertVideo, id };
    this.aslVideos.set(id, video);
    return video;
  }

  // User Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
  }

  async getTaskProgress(userId: number, taskId: number): Promise<UserProgress[]> {
    const subtasksForTask = Array.from(this.subtasks.values())
      .filter(subtask => subtask.taskId === taskId)
      .map(subtask => subtask.id);
    
    return Array.from(this.userProgress.values())
      .filter(progress => 
        progress.userId === userId && 
        subtasksForTask.includes(progress.subtaskId)
      );
  }

  async updateSubtaskProgress(userId: number, subtaskId: number, completed: boolean): Promise<UserProgress> {
    // Check if progress record exists
    const existingProgress = Array.from(this.userProgress.values())
      .find(p => p.userId === userId && p.subtaskId === subtaskId);
    
    if (existingProgress) {
      const updatedProgress: UserProgress = {
        ...existingProgress,
        completed,
        completedAt: completed ? new Date() : null,
      };
      this.userProgress.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      // Create new progress record
      const id = this.progressIdCounter++;
      const progress: UserProgress = {
        id,
        userId,
        subtaskId,
        completed,
        completedAt: completed ? new Date() : null,
      };
      this.userProgress.set(id, progress);
      return progress;
    }
  }

  // Business Records methods
  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = this.businessIdCounter++;
    const business: Business = { ...insertBusiness, id, createdAt: new Date() };
    this.businesses.set(id, business);
    return business;
  }

  async getBusinesses(userId: number): Promise<Business[]> {
    return Array.from(this.businesses.values())
      .filter(business => business.userId === userId);
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async updateBusiness(id: number, data: Partial<InsertBusiness>): Promise<Business> {
    const business = this.businesses.get(id);
    if (!business) {
      throw new Error(`Business with id ${id} not found`);
    }
    
    const updatedBusiness: Business = { ...business, ...data };
    this.businesses.set(id, updatedBusiness);
    return updatedBusiness;
  }

  // VR Counseling methods
  async getVRCounselors(): Promise<VRCounselor[]> {
    return Array.from(this.vrCounselors.values());
  }

  async getVRCounselor(id: number): Promise<VRCounselor | undefined> {
    return this.vrCounselors.get(id);
  }

  async createVRCounselor(insertCounselor: InsertVRCounselor): Promise<VRCounselor> {
    const id = this.counselorIdCounter++;
    const counselor: VRCounselor = { ...insertCounselor, id };
    this.vrCounselors.set(id, counselor);
    return counselor;
  }

  // User-Counselor relationships
  async getUserCounselors(userId: number): Promise<(UserCounselor & { counselor: VRCounselor })[]> {
    const userCounselorRelations = Array.from(this.userCounselors.values())
      .filter(rel => rel.userId === userId);
    
    return userCounselorRelations.map(relation => {
      const counselor = this.vrCounselors.get(relation.counselorId);
      if (!counselor) {
        throw new Error(`Counselor with id ${relation.counselorId} not found`);
      }
      return { ...relation, counselor };
    });
  }

  async createUserCounselor(insertRelation: InsertUserCounselor): Promise<UserCounselor> {
    const id = this.userCounselorIdCounter++;
    const relation: UserCounselor = { 
      ...insertRelation, 
      id, 
      startDate: new Date() 
    };
    this.userCounselors.set(id, relation);
    return relation;
  }

  // Seed initial data for development
  private seedData() {
    // Lifecycle Phases
    const phases = [
      { name: "Idea", slug: "idea", description: "Generate and validate business ideas", order: 1 },
      { name: "Build", slug: "build", description: "Develop your business foundation", order: 2 },
      { name: "Grow", slug: "grow", description: "Expand your business reach", order: 3 },
      { name: "Manage", slug: "manage", description: "Optimize and maintain your business", order: 4 }
    ];
    
    phases.forEach(phase => {
      const id = this.phaseIdCounter++;
      this.lifecyclePhases.set(id, { ...phase, id });
    });
    
    // Idea phase tasks
    const ideaPhase = Array.from(this.lifecyclePhases.values()).find(p => p.slug === "idea");
    if (ideaPhase) {
      const ideaTasks = [
        { 
          name: "Idea Generation", 
          description: "Generate and evaluate potential business ideas through brainstorming, market research, and customer surveys",
          order: 1,
          hasASLVideo: true,
          aslVideoUrl: "/api/asl-videos/idea-generation.mp4"
        },
        { 
          name: "Market Research", 
          description: "Identify your target market, analyze competition, and understand customer needs using tools like Statista",
          order: 2,
          hasASLVideo: true,
          aslVideoUrl: "/api/asl-videos/market-research.mp4"
        },
        { 
          name: "Idea Validation", 
          description: "Validate your business idea by creating an MVP, gathering feedback, and making necessary adjustments",
          order: 3,
          hasASLVideo: true,
          aslVideoUrl: "/api/asl-videos/idea-validation.mp4"
        },
        { 
          name: "Business Planning", 
          description: "Develop a comprehensive business plan outlining your vision, mission, goals, and strategies",
          order: 4,
          hasASLVideo: true,
          aslVideoUrl: "/api/asl-videos/business-planning.mp4"
        },
        { 
          name: "Business Structure", 
          description: "Choose the appropriate legal structure for your business (sole proprietorship, LLC, corporation, etc.)",
          order: 5,
          hasASLVideo: true,
          aslVideoUrl: "/api/asl-videos/business-structure.mp4"
        }
      ];
      
      ideaTasks.forEach(task => {
        const taskId = this.taskIdCounter++;
        this.tasks.set(taskId, { ...task, id: taskId, phaseId: ideaPhase.id });
        
        // Add subtasks for Idea Generation
        if (task.name === "Idea Generation") {
          const subtasks = [
            { name: "Brainstorming session", order: 1 },
            { name: "Survey potential customers", order: 2 },
            { name: "Competitor analysis", order: 3 },
            { name: "Market trend analysis", order: 4 }
          ];
          
          subtasks.forEach(subtask => {
            const subtaskId = this.subtaskIdCounter++;
            this.subtasks.set(subtaskId, { ...subtask, id: subtaskId, taskId });
          });
        }
        
        // Add subtasks for Market Research
        if (task.name === "Market Research") {
          const subtasks = [
            { name: "Identify target market", order: 1 },
            { name: "Understand customer needs", order: 2 },
            { name: "Analyze competition", order: 3 },
            { name: "SWOT analysis", order: 4 }
          ];
          
          subtasks.forEach(subtask => {
            const subtaskId = this.subtaskIdCounter++;
            this.subtasks.set(subtaskId, { ...subtask, id: subtaskId, taskId });
          });
        }
        
        // Add subtasks for Idea Validation
        if (task.name === "Idea Validation") {
          const subtasks = [
            { name: "Create a minimum viable product (MVP)", order: 1 },
            { name: "Get feedback from initial users", order: 2 },
            { name: "Adjust the product based on feedback", order: 3 }
          ];
          
          subtasks.forEach(subtask => {
            const subtaskId = this.subtaskIdCounter++;
            this.subtasks.set(subtaskId, { ...subtask, id: subtaskId, taskId });
          });
        }
      });
      
      // Add tools for idea phase
      const ideaTools = [
        {
          name: "AI Business Idea Generator",
          description: "Generate innovative business ideas based on market trends and your interests",
          toolType: "AI",
          actionText: "Generate Ideas",
          actionUrl: "/api/tools/generate-ideas"
        },
        {
          name: "Market Research Assistant",
          description: "Access industry reports, market size data, and competitor analysis",
          toolType: "Statista API",
          actionText: "Explore Market Data",
          actionUrl: "/api/tools/market-data"
        },
        {
          name: "MVP Validation Platform",
          description: "Create and test your MVP with real users and gather actionable feedback",
          toolType: "Venturus.ai",
          actionText: "Validate Your Idea",
          actionUrl: "/api/tools/validate-idea"
        }
      ];
      
      ideaTools.forEach(tool => {
        const id = this.toolIdCounter++;
        this.tools.set(id, { ...tool, id, phaseId: ideaPhase.id });
      });
      
      // Add ASL Videos for Idea phase
      const aslVideos = [
        {
          title: "Business Ideation Techniques",
          description: "ASL guide to effective business ideation and brainstorming methods",
          videoUrl: "/api/asl-videos/business-ideation.mp4",
          phaseId: ideaPhase.id,
          thumbnail: ""
        },
        {
          title: "Market Research Fundamentals",
          description: "Learn how to conduct effective market research in ASL",
          videoUrl: "/api/asl-videos/market-research.mp4",
          phaseId: ideaPhase.id,
          thumbnail: ""
        },
        {
          title: "MVP Development Strategy",
          description: "Step-by-step ASL guide to building your first minimum viable product",
          videoUrl: "/api/asl-videos/mvp-development.mp4",
          phaseId: ideaPhase.id,
          thumbnail: ""
        }
      ];
      
      aslVideos.forEach(video => {
        const id = this.videoIdCounter++;
        this.aslVideos.set(id, { ...video, id });
      });
    }
    
    // VR Counselors
    const counselors = [
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@vr-services.org",
        phone: "555-123-4567",
        organization: "National VR Services"
      },
      {
        name: "Michael Chen",
        email: "michael.chen@deafbiz.org",
        phone: "555-987-6543",
        organization: "Deaf Business Association"
      },
      {
        name: "Lisa Rodriguez",
        email: "lisa.rodriguez@vr-counseling.com",
        phone: "555-456-7890",
        organization: "State Rehabilitation Commission"
      }
    ];
    
    counselors.forEach(counselor => {
      const id = this.counselorIdCounter++;
      this.vrCounselors.set(id, { ...counselor, id });
    });
  }
}

export const storage = new MemStorage();
