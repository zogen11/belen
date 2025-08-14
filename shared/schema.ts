import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  totalEarnings: integer("total_earnings").default(0), // in cents
  createdAt: timestamp("created_at").defaultNow(),
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

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  totalEarnings: true,
  followers: true,
  following: true,
});

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

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Shorts = typeof shorts.$inferSelect;
export type InsertShorts = z.infer<typeof insertShortsSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
