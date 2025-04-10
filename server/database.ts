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
  userCounselors, type UserCounselor, type InsertUserCounselor,
  resources, type Resource, type InsertResource
} from "@shared/schema";
import { db } from "./db";
import { IStorage } from "./storage";
import { and, eq, isNull, or, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        isDeaf: insertUser.isDeaf || null,
        preferASL: insertUser.preferASL || null,
        createdAt: new Date()
      })
      .returning();
    return user;
  }
  
  // Lifecycle phases
  async getLifecyclePhases(): Promise<LifecyclePhase[]> {
    return db.select().from(lifecyclePhases).orderBy(lifecyclePhases.order);
  }

  async getLifecyclePhase(id: number): Promise<LifecyclePhase | undefined> {
    const [phase] = await db.select().from(lifecyclePhases).where(eq(lifecyclePhases.id, id));
    return phase || undefined;
  }

  async getLifecyclePhaseBySlug(slug: string): Promise<LifecyclePhase | undefined> {
    const [phase] = await db.select().from(lifecyclePhases).where(eq(lifecyclePhases.slug, slug));
    return phase || undefined;
  }

  async createLifecyclePhase(insertPhase: InsertLifecyclePhase): Promise<LifecyclePhase> {
    const [phase] = await db
      .insert(lifecyclePhases)
      .values({
        ...insertPhase,
        hasASLVideo: insertPhase.hasASLVideo || null,
        aslVideoUrl: insertPhase.aslVideoUrl || null
      })
      .returning();
    return phase;
  }
  
  // Tasks
  async getTasks(phaseId: number): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.phaseId, phaseId))
      .orderBy(tasks.order);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...insertTask,
        hasASLVideo: insertTask.hasASLVideo || null,
        aslVideoUrl: insertTask.aslVideoUrl || null
      })
      .returning();
    return task;
  }
  
  // Subtasks
  async getSubtasks(taskId: number): Promise<Subtask[]> {
    return db
      .select()
      .from(subtasks)
      .where(eq(subtasks.taskId, taskId))
      .orderBy(subtasks.order);
  }

  async getSubtask(id: number): Promise<Subtask | undefined> {
    const [subtask] = await db.select().from(subtasks).where(eq(subtasks.id, id));
    return subtask || undefined;
  }

  async createSubtask(insertSubtask: InsertSubtask): Promise<Subtask> {
    const [subtask] = await db
      .insert(subtasks)
      .values(insertSubtask)
      .returning();
    return subtask;
  }
  
  // Tools
  async getTools(phaseId: number): Promise<Tool[]> {
    return db
      .select()
      .from(tools)
      .where(eq(tools.phaseId, phaseId));
  }

  async getTool(id: number): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.id, id));
    return tool || undefined;
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const [tool] = await db
      .insert(tools)
      .values(insertTool)
      .returning();
    return tool;
  }
  
  // ASL Videos
  async getASLVideos(params: { phaseId?: number; taskId?: number } = {}): Promise<ASLVideo[]> {
    const { phaseId, taskId } = params;
    let query = db.select().from(aslVideos);
    
    if (phaseId !== undefined) {
      query = query.where(eq(aslVideos.phaseId, phaseId));
    }
    
    if (taskId !== undefined) {
      query = query.where(eq(aslVideos.taskId, taskId));
    }
    
    return query;
  }

  async getASLVideo(id: number): Promise<ASLVideo | undefined> {
    const [video] = await db.select().from(aslVideos).where(eq(aslVideos.id, id));
    return video || undefined;
  }

  async createASLVideo(insertVideo: InsertASLVideo): Promise<ASLVideo> {
    const [video] = await db
      .insert(aslVideos)
      .values({
        ...insertVideo, 
        phaseId: insertVideo.phaseId || null,
        taskId: insertVideo.taskId || null,
        thumbnail: insertVideo.thumbnail || null
      })
      .returning();
    return video;
  }
  
  // User Progress
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async getTaskProgress(userId: number, taskId: number): Promise<UserProgress[]> {
    // Get progress for all subtasks of this task
    return db
      .select()
      .from(userProgress)
      .innerJoin(subtasks, eq(userProgress.subtaskId, subtasks.id))
      .where(and(
        eq(userProgress.userId, userId),
        eq(subtasks.taskId, taskId)
      ));
  }

  async updateSubtaskProgress(userId: number, subtaskId: number, completed: boolean): Promise<UserProgress> {
    // Check if progress record exists
    const [existingProgress] = await db
      .select()
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.subtaskId, subtaskId)
      ));
    
    if (existingProgress) {
      // Update existing record
      const [updatedProgress] = await db
        .update(userProgress)
        .set({
          completed,
          updatedAt: new Date()
        })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      
      return updatedProgress;
    } else {
      // Create new progress record
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          subtaskId,
          completed,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return newProgress;
    }
  }
  
  // Business Records
  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const [business] = await db
      .insert(businesses)
      .values({
        ...insertBusiness,
        createdAt: new Date(),
        description: insertBusiness.description || null,
        businessType: insertBusiness.businessType || null,
        formationState: insertBusiness.formationState || null,
        formationStatus: insertBusiness.formationStatus || null,
        apiData: insertBusiness.apiData || null
      })
      .returning();
    return business;
  }

  async getBusinesses(userId: number): Promise<Business[]> {
    return db
      .select()
      .from(businesses)
      .where(eq(businesses.userId, userId));
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business || undefined;
  }

  async updateBusiness(id: number, data: Partial<InsertBusiness>): Promise<Business> {
    const [business] = await db
      .update(businesses)
      .set(data)
      .where(eq(businesses.id, id))
      .returning();
    return business;
  }
  
  // VR Counseling
  async getVRCounselors(): Promise<VRCounselor[]> {
    return db.select().from(vrCounselors);
  }

  async getVRCounselor(id: number): Promise<VRCounselor | undefined> {
    const [counselor] = await db.select().from(vrCounselors).where(eq(vrCounselors.id, id));
    return counselor || undefined;
  }

  async createVRCounselor(insertCounselor: InsertVRCounselor): Promise<VRCounselor> {
    const [counselor] = await db
      .insert(vrCounselors)
      .values({
        ...insertCounselor,
        phone: insertCounselor.phone || null
      })
      .returning();
    return counselor;
  }
  
  // User-Counselor relationships
  async getUserCounselors(userId: number): Promise<(UserCounselor & { counselor: VRCounselor })[]> {
    const results = await db
      .select({
        userCounselor: userCounselors,
        counselor: vrCounselors
      })
      .from(userCounselors)
      .innerJoin(vrCounselors, eq(userCounselors.counselorId, vrCounselors.id))
      .where(eq(userCounselors.userId, userId));
    
    return results.map(r => ({ ...r.userCounselor, counselor: r.counselor }));
  }

  async createUserCounselor(insertRelation: InsertUserCounselor): Promise<UserCounselor> {
    const [relation] = await db
      .insert(userCounselors)
      .values({
        ...insertRelation,
        status: insertRelation.status || null,
        startDate: new Date(),
        endDate: insertRelation.endDate || null,
      })
      .returning();
    return relation;
  }
  
  // Resource Library
  async getResources(params?: { 
    category?: string; 
    sbaRelated?: boolean;
    tags?: string[];
  }): Promise<Resource[]> {
    let query = db.select().from(resources);
    
    if (params?.category) {
      query = query.where(eq(resources.category, params.category));
    }
    
    if (params?.sbaRelated !== undefined) {
      query = query.where(eq(resources.sbaRelated, params.sbaRelated));
    }
    
    // Due to array filtering limitations, we'll fetch and filter in memory for tags
    const result = await query;
    
    if (params?.tags && params.tags.length > 0) {
      return result.filter(resource => {
        if (!resource.tags) return false;
        return params.tags!.some(tag => resource.tags?.includes(tag));
      });
    }
    
    return result;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const now = new Date();
    const [newResource] = await db
      .insert(resources)
      .values({
        ...resource,
        createdAt: now,
        updatedAt: now,
        subcategory: resource.subcategory || null,
        url: resource.url || null,
        fileUrl: resource.fileUrl || null,
        thumbnailUrl: resource.thumbnailUrl || null,
        tags: resource.tags || null,
        sbaRelated: resource.sbaRelated || false
      })
      .returning();
    return newResource;
  }

  async updateResource(id: number, data: Partial<InsertResource>): Promise<Resource> {
    const [updatedResource] = await db
      .update(resources)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }

  async deleteResource(id: number): Promise<void> {
    await db
      .delete(resources)
      .where(eq(resources.id, id));
  }
}