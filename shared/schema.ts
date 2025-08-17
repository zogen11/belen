import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  phone: text("phone").unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  description: text("description"),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  isPrivate: boolean("is_private").default(false),
  allowComments: boolean("allow_comments").default(true),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  totalEarnings: integer("total_earnings").default(0), // in cents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  duration: integer("duration").notNull(), // in seconds
  views: integer("views").default(0),
  earnings: integer("earnings").default(0), // in cents
  tags: text("tags").array(),
  isMonetized: boolean("is_monetized").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shorts = pgTable("shorts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  duration: integer("duration").notNull(), // in seconds (max 60)
  views: integer("views").default(0),
  earnings: integer("earnings").default(0), // in cents
  tags: text("tags").array(),
  isMonetized: boolean("is_monetized").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  likes: integer("likes").default(0),
  earnings: integer("earnings").default(0), // in cents
  tags: text("tags").array(),
  isMonetized: boolean("is_monetized").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences and settings - persisted data
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  theme: text("theme").default("light"), // light, dark
  language: text("language").default("en"),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  autoPlay: boolean("auto_play").default(true),
  dataUsage: text("data_usage").default("auto"), // auto, wifi_only, always
  privacyLevel: text("privacy_level").default("public"), // public, friends, private
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Followers/Following relationships - permanent storage
export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull().references(() => users.id),
  followingId: varchar("following_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments on content - permanent storage
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  contentId: varchar("content_id").notNull(), // video, shorts, or photo ID
  contentType: text("content_type").notNull(), // "video", "shorts", "photo"
  comment: text("comment").notNull(),
  parentCommentId: varchar("parent_comment_id"), // for replies
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Likes on content - permanent storage
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  contentId: varchar("content_id").notNull(), // video, shorts, or photo ID
  contentType: text("content_type").notNull(), // "video", "shorts", "photo"
  createdAt: timestamp("created_at").defaultNow(),
});

// Watch history - permanent storage
export const watchHistory = pgTable("watch_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  contentId: varchar("content_id").notNull(), // video or shorts ID
  contentType: text("content_type").notNull(), // "video", "shorts"
  watchedAt: timestamp("watched_at").defaultNow(),
  watchDuration: integer("watch_duration"), // seconds watched
  isCompleted: boolean("is_completed").default(false),
});

// Live streams - permanent storage
export const liveStreams = pgTable("live_streams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  streamKey: text("stream_key").notNull(),
  status: text("status").notNull().default("setup"), // setup, live, ended
  viewers: integer("viewers").default(0),
  maxViewers: integer("max_viewers").default(0),
  chatEnabled: boolean("chat_enabled").default(true),
  donationsEnabled: boolean("donations_enabled").default(true),
  isMonetized: boolean("is_monetized").default(false),
  earnings: integer("earnings").default(0), // in cents
  tags: text("tags").array(),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stream chat messages - permanent storage
export const streamChats = pgTable("stream_chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  streamId: varchar("stream_id").notNull().references(() => liveStreams.id),
  userId: varchar("user_id").references(() => users.id),
  username: text("username").notNull(),
  message: text("message").notNull(),
  isSystemMessage: boolean("is_system_message").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stream viewers tracking - permanent storage
export const streamViewers = pgTable("stream_viewers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  streamId: varchar("stream_id").notNull().references(() => liveStreams.id),
  userId: varchar("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
});

// Earnings history - permanent storage
export const earningsHistory = pgTable("earnings_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  contentId: varchar("content_id").notNull(),
  contentType: text("content_type").notNull(), // "video", "shorts", "photo", "live_stream"
  amount: integer("amount").notNull(), // in cents
  source: text("source").notNull(), // "view", "like", "share", "ad_revenue", "donation"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalEarnings: true,
  followers: true,
  following: true,
  isEmailVerified: true,
  isPhoneVerified: true,
});

// Auth schemas
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Auth types
export type LoginData = typeof loginSchema._type;
export type SignupData = typeof signupSchema._type;

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  views: true,
  earnings: true,
});

export const insertShortsSchema = createInsertSchema(shorts).omit({
  id: true,
  createdAt: true,
  views: true,
  earnings: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
  likes: true,
  earnings: true,
});

// Additional insert schemas for new tables
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  likes: true,
});

export const insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  createdAt: true,
});

export const insertWatchHistorySchema = createInsertSchema(watchHistory).omit({
  id: true,
  watchedAt: true,
});

export const insertEarningsHistorySchema = createInsertSchema(earningsHistory).omit({
  id: true,
  createdAt: true,
});

// Live streaming schemas
export const insertLiveStreamSchema = createInsertSchema(liveStreams).omit({
  id: true,
  userId: true, // Will be set from authenticated user
  streamKey: true,
  status: true,
  viewers: true,
  maxViewers: true,
  earnings: true,
  startedAt: true,
  endedAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  thumbnailUrl: z.string().optional(),
  description: z.string().optional(),
  isMonetized: z.boolean().optional(),
});

export const insertStreamChatSchema = createInsertSchema(streamChats).omit({
  id: true,
  createdAt: true,
});

export const insertStreamViewerSchema = createInsertSchema(streamViewers).omit({
  id: true,
  joinedAt: true,
});

// Live streaming types
export type LiveStream = typeof liveStreams.$inferSelect;
export type StreamChat = typeof streamChats.$inferSelect;
export type StreamViewer = typeof streamViewers.$inferSelect;
export type InsertLiveStream = typeof insertLiveStreamSchema._type;
export type InsertStreamChat = typeof insertStreamChatSchema._type;
export type InsertStreamViewer = typeof insertStreamViewerSchema._type;

// Export all types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Shorts = typeof shorts.$inferSelect;
export type InsertShorts = z.infer<typeof insertShortsSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type WatchHistory = typeof watchHistory.$inferSelect;
export type InsertWatchHistory = z.infer<typeof insertWatchHistorySchema>;
export type EarningsHistory = typeof earningsHistory.$inferSelect;
export type InsertEarningsHistory = z.infer<typeof insertEarningsHistorySchema>;
