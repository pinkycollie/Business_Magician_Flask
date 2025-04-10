import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isDeaf: boolean("is_deaf").default(false),
  preferASL: boolean("prefer_asl").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isDeaf: true,
  preferASL: true,
});

// Business Lifecycle Phase
export const lifecyclePhases = pgTable("lifecycle_phases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
});

export const insertLifecyclePhaseSchema = createInsertSchema(lifecyclePhases).pick({
  name: true,
  slug: true,
  description: true,
  order: true,
});

// Tasks in each phase
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  phaseId: integer("phase_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  hasASLVideo: boolean("has_asl_video").default(false),
  aslVideoUrl: text("asl_video_url"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  phaseId: true,
  name: true,
  description: true,
  order: true,
  hasASLVideo: true,
  aslVideoUrl: true,
});

// Subtasks
export const subtasks = pgTable("subtasks", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
});

export const insertSubtaskSchema = createInsertSchema(subtasks).pick({
  taskId: true,
  name: true,
  order: true,
});

// Business Tools
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  phaseId: integer("phase_id").notNull(),
  toolType: text("tool_type").notNull(), // AI, API, etc.
  actionText: text("action_text").notNull(),
  actionUrl: text("action_url").notNull(),
});

export const insertToolSchema = createInsertSchema(tools).pick({
  name: true,
  description: true,
  phaseId: true,
  toolType: true,
  actionText: true,
  actionUrl: true,
});

// ASL Videos
export const aslVideos = pgTable("asl_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  phaseId: integer("phase_id"),
  taskId: integer("task_id"),
  thumbnail: text("thumbnail"),
});

export const insertASLVideoSchema = createInsertSchema(aslVideos).pick({
  title: true,
  description: true,
  videoUrl: true,
  phaseId: true,
  taskId: true,
  thumbnail: true,
});

// User Progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subtaskId: integer("subtask_id").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  subtaskId: true,
  completed: true,
  completedAt: true,
});

// Business Records
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  businessType: text("business_type"),
  formationState: text("formation_state"),
  formationStatus: text("formation_status"),
  createdAt: timestamp("created_at").defaultNow(),
  apiData: json("api_data"),
});

export const insertBusinessSchema = createInsertSchema(businesses).pick({
  userId: true,
  name: true,
  description: true,
  businessType: true,
  formationState: true,
  formationStatus: true,
  apiData: true,
});

// VR Counselor Integration
export const vrCounselors = pgTable("vr_counselors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  organization: text("organization").notNull(),
});

export const insertVRCounselorSchema = createInsertSchema(vrCounselors).pick({
  name: true,
  email: true,
  phone: true,
  organization: true,
});

// User-Counselor Relationship
export const userCounselors = pgTable("user_counselors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  counselorId: integer("counselor_id").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  status: text("status").default("active"),
});

export const insertUserCounselorSchema = createInsertSchema(userCounselors).pick({
  userId: true,
  counselorId: true,
  endDate: true,
  status: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type LifecyclePhase = typeof lifecyclePhases.$inferSelect;
export type InsertLifecyclePhase = z.infer<typeof insertLifecyclePhaseSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Subtask = typeof subtasks.$inferSelect;
export type InsertSubtask = z.infer<typeof insertSubtaskSchema>;

export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;

export type ASLVideo = typeof aslVideos.$inferSelect;
export type InsertASLVideo = z.infer<typeof insertASLVideoSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

export type VRCounselor = typeof vrCounselors.$inferSelect;
export type InsertVRCounselor = z.infer<typeof insertVRCounselorSchema>;

export type UserCounselor = typeof userCounselors.$inferSelect;
export type InsertUserCounselor = z.infer<typeof insertUserCounselorSchema>;

// Resource Library
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  source: text("source").notNull(),
  url: text("url"),
  fileUrl: text("file_url"),
  thumbnailUrl: text("thumbnail_url"),
  tags: text("tags").array(),
  sbaRelated: boolean("sba_related").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  category: true,
  subcategory: true,
  source: true,
  url: true,
  fileUrl: true,
  thumbnailUrl: true,
  tags: true,
  sbaRelated: true,
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
