import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, date } from "drizzle-orm/pg-core";
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

// Business Formation tables

// Formation Providers
export const formationProviders = pgTable("formation_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  website: text("website"),
  apiEndpoint: text("api_endpoint"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFormationProviderSchema = createInsertSchema(formationProviders).pick({
  name: true,
  displayName: true,
  description: true,
  logoUrl: true,
  website: true,
  apiEndpoint: true,
  isActive: true,
});

export type FormationProvider = typeof formationProviders.$inferSelect;
export type InsertFormationProvider = z.infer<typeof insertFormationProviderSchema>;

// Business Formation Records
export const businessFormations = pgTable("business_formations", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  userId: integer("user_id").notNull(),
  providerId: integer("provider_id").notNull(),
  providerOrderId: varchar("provider_order_id", { length: 100 }).notNull(),
  businessName: varchar("business_name", { length: 200 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // pending, processing, completed, failed
  submittedDate: timestamp("submitted_date").defaultNow(),
  estimatedCompletionDate: date("estimated_completion_date"),
  completedDate: timestamp("completed_date"),
  trackingUrl: text("tracking_url"),
  formationData: json("formation_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBusinessFormationSchema = createInsertSchema(businessFormations).pick({
  businessId: true,
  userId: true,
  providerId: true,
  providerOrderId: true,
  businessName: true,
  entityType: true,
  state: true,
  status: true,
  estimatedCompletionDate: true,
  trackingUrl: true,
  formationData: true,
});

export type BusinessFormation = typeof businessFormations.$inferSelect;
export type InsertBusinessFormation = z.infer<typeof insertBusinessFormationSchema>;

// Business Formation Documents
export const formationDocuments = pgTable("formation_documents", {
  id: serial("id").primaryKey(),
  formationId: integer("formation_id").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  documentUrl: text("document_url").notNull(),
  documentType: varchar("document_type", { length: 50 }), // articles, operating agreement, EIN, etc.
  dateIssued: date("date_issued"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFormationDocumentSchema = createInsertSchema(formationDocuments).pick({
  formationId: true,
  name: true,
  documentUrl: true,
  documentType: true,
  dateIssued: true,
});

export type FormationDocument = typeof formationDocuments.$inferSelect;
export type InsertFormationDocument = z.infer<typeof insertFormationDocumentSchema>;

// Formation Provider API Keys
export const providerApiKeys = pgTable("provider_api_keys", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  keyName: varchar("key_name", { length: 100 }).notNull(),
  keyValue: text("key_value").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProviderApiKeySchema = createInsertSchema(providerApiKeys).pick({
  providerId: true,
  keyName: true,
  keyValue: true,
  isActive: true,
});

export type ProviderApiKey = typeof providerApiKeys.$inferSelect;
export type InsertProviderApiKey = z.infer<typeof insertProviderApiKeySchema>;
