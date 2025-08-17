import { 
  type User, 
  type InsertUser, 
  type Video, 
  type InsertVideo, 
  type Shorts, 
  type InsertShorts, 
  type Photo, 
  type InsertPhoto,
  type UserPreferences,
  type InsertUserPreferences,
  type Follow,
  type InsertFollow,
  type Comment,
  type InsertComment,
  type Like,
  type InsertLike,
  type WatchHistory,
  type InsertWatchHistory,
  type EarningsHistory,
  type InsertEarningsHistory,
  type LiveStream,
  type InsertLiveStream,
  type StreamChat,
  type InsertStreamChat,
  type StreamViewer,
  type InsertStreamViewer,
  users,
  videos,
  shorts,
  photos,
  userPreferences,
  follows,
  comments,
  likes,
  watchHistory,
  earningsHistory,
  liveStreams,
  streamChats,
  streamViewers
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByEmailOrPhone(emailOrPhone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<InsertUser>): Promise<User>;
  updateUserEarnings(userId: string, earnings: number): Promise<void>;

  // Video methods
  getVideos(): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  getVideosByUser(userId: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  incrementVideoViews(id: string): Promise<void>;

  // Shorts methods
  getShorts(): Promise<Shorts[]>;
  getShortsItem(id: string): Promise<Shorts | undefined>;
  getShortsByUser(userId: string): Promise<Shorts[]>;
  createShorts(shorts: InsertShorts): Promise<Shorts>;
  incrementShortsViews(id: string): Promise<void>;

  // Photo methods
  getPhotos(): Promise<Photo[]>;
  getPhoto(id: string): Promise<Photo | undefined>;
  getPhotosByUser(userId: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  incrementPhotoLikes(id: string): Promise<void>;

  // Content methods
  getAllContent(): Promise<(Video | Shorts | Photo)[]>;
  getTrendingCreators(): Promise<User[]>;
  
  // User preferences methods
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<void>;
  
  // Follow methods
  followUser(followerId: string, followingId: string): Promise<Follow>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  
  // Comment methods
  getComments(contentId: string, contentType: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  likeComment(commentId: string): Promise<void>;
  
  // Like methods
  likeContent(userId: string, contentId: string, contentType: string): Promise<Like>;
  unlikeContent(userId: string, contentId: string, contentType: string): Promise<void>;
  isContentLiked(userId: string, contentId: string, contentType: string): Promise<boolean>;
  
  // Watch history methods
  addToWatchHistory(history: InsertWatchHistory): Promise<WatchHistory>;
  getWatchHistory(userId: string): Promise<WatchHistory[]>;
  
  // Earnings methods
  addEarnings(earnings: InsertEarningsHistory): Promise<EarningsHistory>;
  getUserEarningsHistory(userId: string): Promise<EarningsHistory[]>;

  // Live streaming methods
  createLiveStream(data: InsertLiveStream & { userId: string }): Promise<LiveStream>;
  getLiveStream(id: string): Promise<LiveStream | undefined>;
  getUserLiveStreams(userId: string): Promise<LiveStream[]>;
  getActiveLiveStreams(): Promise<LiveStream[]>;
  updateLiveStreamStatus(id: string, status: string, extraData?: Record<string, any>): Promise<LiveStream>;
  updateStreamViewers(id: string, viewers: number): Promise<void>;
  addStreamChat(data: InsertStreamChat): Promise<StreamChat>;
  getStreamChats(streamId: string, limit?: number): Promise<StreamChat[]>;
  addStreamViewer(data: InsertStreamViewer): Promise<StreamViewer>;
  removeStreamViewer(streamId: string, sessionId: string): Promise<void>;
  getActiveStreamViewers(streamId: string): Promise<StreamViewer[]>;
}

export class DatabaseStorage implements IStorage {
  private database: NonNullable<typeof db>;

  constructor() {
    if (!db) {
      throw new Error("Database not initialized. Cannot use DatabaseStorage without DATABASE_URL.");
    }
    this.database = db;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.database.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.database.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.database.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.database.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await this.database.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async getUserByEmailOrPhone(emailOrPhone: string): Promise<User | undefined> {
    const userResults = await this.database.select().from(users).where(
      eq(users.email, emailOrPhone)
    );
    
    if (userResults.length > 0) {
      return userResults[0];
    }
    
    const phoneResults = await this.database.select().from(users).where(
      eq(users.phone, emailOrPhone)
    );
    
    return phoneResults[0] || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.database
      .insert(users)
      .values({
        ...insertUser,
        phone: insertUser.phone || null,
        firstName: insertUser.firstName || null,
        lastName: insertUser.lastName || null,
      })
      .returning();
    return user;
  }

  async updateUser(userId: string, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await this.database
      .update(users)
      .set({ 
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserEarnings(userId: string, earnings: number): Promise<void> {
    await this.database
      .update(users)
      .set({ 
        totalEarnings: earnings,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Video methods
  async getVideos(): Promise<Video[]> {
    return await this.database.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await this.database.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async getVideosByUser(userId: string): Promise<Video[]> {
    return await this.database.select().from(videos).where(eq(videos.userId, userId)).orderBy(desc(videos.createdAt));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await this.database
      .insert(videos)
      .values(insertVideo)
      .returning();
    return video;
  }

  async incrementVideoViews(id: string): Promise<void> {
    await this.database
      .update(videos)
      .set({ 
        views: sql`${videos.views} + 1`
      })
      .where(eq(videos.id, id));
  }

  // Shorts methods
  async getShorts(): Promise<Shorts[]> {
    return await this.database.select().from(shorts).orderBy(desc(shorts.createdAt));
  }

  async getShortsItem(id: string): Promise<Shorts | undefined> {
    const [shortsItem] = await this.database.select().from(shorts).where(eq(shorts.id, id));
    return shortsItem || undefined;
  }

  async getShortsByUser(userId: string): Promise<Shorts[]> {
    return await this.database.select().from(shorts).where(eq(shorts.userId, userId)).orderBy(desc(shorts.createdAt));
  }

  async createShorts(insertShorts: InsertShorts): Promise<Shorts> {
    const [shortsItem] = await this.database
      .insert(shorts)
      .values(insertShorts)
      .returning();
    return shortsItem;
  }

  async incrementShortsViews(id: string): Promise<void> {
    await this.database
      .update(shorts)
      .set({ 
        views: sql`${shorts.views} + 1`
      })
      .where(eq(shorts.id, id));
  }

  // Photo methods
  async getPhotos(): Promise<Photo[]> {
    return await this.database.select().from(photos).orderBy(desc(photos.createdAt));
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    const [photo] = await this.database.select().from(photos).where(eq(photos.id, id));
    return photo || undefined;
  }

  async getPhotosByUser(userId: string): Promise<Photo[]> {
    return await this.database.select().from(photos).where(eq(photos.userId, userId)).orderBy(desc(photos.createdAt));
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const [photo] = await this.database
      .insert(photos)
      .values(insertPhoto)
      .returning();
    return photo;
  }

  async incrementPhotoLikes(id: string): Promise<void> {
    await this.database
      .update(photos)
      .set({ 
        likes: sql`${photos.likes} + 1`
      })
      .where(eq(photos.id, id));
  }

  // Content methods
  async getAllContent(): Promise<(Video | Shorts | Photo)[]> {
    const [videoResults, shortsResults, photoResults] = await Promise.all([
      this.getVideos(),
      this.getShorts(),
      this.getPhotos()
    ]);

    const allContent = [
      ...videoResults.map(v => ({ ...v, type: 'video' as const })),
      ...shortsResults.map(s => ({ ...s, type: 'shorts' as const })),
      ...photoResults.map(p => ({ ...p, type: 'photo' as const }))
    ];

    // Sort by creation date, newest first
    return allContent.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getTrendingCreators(): Promise<User[]> {
    return await this.database.select().from(users).orderBy(desc(users.totalEarnings)).limit(10);
  }

  // User preferences methods
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await this.database.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences || undefined;
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [newPreferences] = await db
      .insert(userPreferences)
      .values(preferences)
      .returning();
    return newPreferences;
  }

  async updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<void> {
    await db
      .update(userPreferences)
      .set({ 
        ...preferences,
        updatedAt: new Date()
      })
      .where(eq(userPreferences.userId, userId));
  }

  // Follow methods
  async followUser(followerId: string, followingId: string): Promise<Follow> {
    const [follow] = await db
      .insert(follows)
      .values({ followerId, followingId })
      .returning();
      
    // Update follower counts
    await Promise.all([
      this.database.update(users).set({ following: sql`${users.following} + 1` }).where(eq(users.id, followerId)),
      this.database.update(users).set({ followers: sql`${users.followers} + 1` }).where(eq(users.id, followingId))
    ]);
    
    return follow;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await this.database.delete(follows).where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      )
    );
    
    // Update follower counts
    await Promise.all([
      this.database.update(users).set({ following: sql`${users.following} - 1` }).where(eq(users.id, followerId)),
      this.database.update(users).set({ followers: sql`${users.followers} - 1` }).where(eq(users.id, followingId))
    ]);
  }

  async getFollowers(userId: string): Promise<User[]> {
    const result = await db
      .select({ user: users })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId));
    
    return result.map(row => row.user);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const result = await db
      .select({ user: users })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId));
    
    return result.map(row => row.user);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );
    
    return result.length > 0;
  }

  // Comment methods
  async getComments(contentId: string, contentType: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.contentId, contentId),
          eq(comments.contentType, contentType)
        )
      )
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }

  async likeComment(commentId: string): Promise<void> {
    await db
      .update(comments)
      .set({ likes: sql`${comments.likes} + 1` })
      .where(eq(comments.id, commentId));
  }

  // Like methods
  async likeContent(userId: string, contentId: string, contentType: string): Promise<Like> {
    const [like] = await db
      .insert(likes)
      .values({ userId, contentId, contentType })
      .returning();
    
    // Update like count on content
    if (contentType === 'photo') {
      await this.database.update(photos).set({ likes: sql`${photos.likes} + 1` }).where(eq(photos.id, contentId));
    }
    
    return like;
  }

  async unlikeContent(userId: string, contentId: string, contentType: string): Promise<void> {
    await this.database.delete(likes).where(
      and(
        eq(likes.userId, userId),
        eq(likes.contentId, contentId),
        eq(likes.contentType, contentType)
      )
    );
    
    // Update like count on content
    if (contentType === 'photo') {
      await this.database.update(photos).set({ likes: sql`${photos.likes} - 1` }).where(eq(photos.id, contentId));
    }
  }

  async isContentLiked(userId: string, contentId: string, contentType: string): Promise<boolean> {
    const result = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.userId, userId),
          eq(likes.contentId, contentId),
          eq(likes.contentType, contentType)
        )
      );
    
    return result.length > 0;
  }

  // Watch history methods
  async addToWatchHistory(history: InsertWatchHistory): Promise<WatchHistory> {
    const [watchRecord] = await db
      .insert(watchHistory)
      .values(history)
      .returning();
    return watchRecord;
  }

  async getWatchHistory(userId: string): Promise<WatchHistory[]> {
    return await db
      .select()
      .from(watchHistory)
      .where(eq(watchHistory.userId, userId))
      .orderBy(desc(watchHistory.watchedAt));
  }

  // Earnings methods
  async addEarnings(earnings: InsertEarningsHistory): Promise<EarningsHistory> {
    const [earningsRecord] = await db
      .insert(earningsHistory)
      .values(earnings)
      .returning();
    
    // Update user's total earnings
    await db
      .update(users)
      .set({ totalEarnings: sql`${users.totalEarnings} + ${earnings.amount}` })
      .where(eq(users.id, earnings.userId));
    
    return earningsRecord;
  }

  async getUserEarningsHistory(userId: string): Promise<EarningsHistory[]> {
    return await this.database
      .select()
      .from(earningsHistory)
      .where(eq(earningsHistory.userId, userId))
      .orderBy(desc(earningsHistory.createdAt));
  }

  // Live Streaming methods
  async createLiveStream(data: InsertLiveStream & { userId: string }): Promise<LiveStream> {
    const streamKey = `sk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const [stream] = await this.database.insert(liveStreams).values({
      ...data,
      streamKey,
    }).returning();
    
    return stream;
  }

  async getLiveStream(id: string): Promise<LiveStream | undefined> {
    const [stream] = await this.database
      .select()
      .from(liveStreams)
      .where(eq(liveStreams.id, id));
    
    return stream || undefined;
  }

  async getUserLiveStreams(userId: string): Promise<LiveStream[]> {
    return await this.database
      .select()
      .from(liveStreams)
      .where(eq(liveStreams.userId, userId))
      .orderBy(desc(liveStreams.createdAt));
  }

  async getActiveLiveStreams(): Promise<LiveStream[]> {
    return await this.database
      .select()
      .from(liveStreams)
      .where(eq(liveStreams.status, "live"))
      .orderBy(desc(liveStreams.viewers));
  }

  async updateLiveStreamStatus(id: string, status: string, extraData?: Record<string, any>): Promise<LiveStream> {
    const updateData: any = { status, updatedAt: new Date() };
    
    if (status === "live" && !extraData?.startedAt) {
      updateData.startedAt = new Date();
    } else if (status === "ended" && !extraData?.endedAt) {
      updateData.endedAt = new Date();
    }
    
    if (extraData) {
      Object.assign(updateData, extraData);
    }

    const [stream] = await this.database
      .update(liveStreams)
      .set(updateData)
      .where(eq(liveStreams.id, id))
      .returning();
    
    return stream;
  }

  async updateStreamViewers(id: string, viewers: number): Promise<void> {
    await this.database
      .update(liveStreams)
      .set({ 
        viewers,
        maxViewers: sql`GREATEST(${liveStreams.maxViewers}, ${viewers})`,
        updatedAt: new Date()
      })
      .where(eq(liveStreams.id, id));
  }

  async addStreamChat(data: InsertStreamChat): Promise<StreamChat> {
    const [chat] = await this.database.insert(streamChats).values(data).returning();
    return chat;
  }

  async getStreamChats(streamId: string, limit: number = 50): Promise<StreamChat[]> {
    return await this.database
      .select()
      .from(streamChats)
      .where(eq(streamChats.streamId, streamId))
      .orderBy(desc(streamChats.createdAt))
      .limit(limit);
  }

  async addStreamViewer(data: InsertStreamViewer): Promise<StreamViewer> {
    const [viewer] = await this.database.insert(streamViewers).values(data).returning();
    return viewer;
  }

  async removeStreamViewer(streamId: string, sessionId: string): Promise<void> {
    await this.database
      .update(streamViewers)
      .set({ leftAt: new Date() })
      .where(
        and(
          eq(streamViewers.streamId, streamId),
          eq(streamViewers.sessionId, sessionId),
          isNull(streamViewers.leftAt)
        )
      );
  }

  async getActiveStreamViewers(streamId: string): Promise<StreamViewer[]> {
    return await this.database
      .select()
      .from(streamViewers)
      .where(
        and(
          eq(streamViewers.streamId, streamId),
          isNull(streamViewers.leftAt)
        )
      );
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private videos: Map<string, Video>;
  private shorts: Map<string, Shorts>;
  private photos: Map<string, Photo>;
  private liveStreams: Map<string, LiveStream>;
  private streamChats: Map<string, StreamChat>;
  private streamViewers: Map<string, StreamViewer>;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.shorts = new Map();
    this.photos = new Map();
    this.liveStreams = new Map();
    this.streamChats = new Map();
    this.streamViewers = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Storage initialized with empty collections - ready for user content
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phone === phone,
    );
  }

  async getUserByEmailOrPhone(emailOrPhone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === emailOrPhone || user.phone === emailOrPhone,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      phone: insertUser.phone || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      description: insertUser.description || null,
      profileImageUrl: null,
      isEmailVerified: false,
      isPhoneVerified: false,
      isPrivate: insertUser.isPrivate || false,
      allowComments: insertUser.allowComments || true,
      followers: 0, 
      following: 0, 
      totalEarnings: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(userId: string, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserEarnings(userId: string, earnings: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.totalEarnings = (user.totalEarnings || 0) + earnings;
      this.users.set(userId, user);
    }
  }

  // Video methods
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByUser(userId: string): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.userId === userId);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { 
      ...insertVideo, 
      id, 
      views: 0, 
      earnings: 0,
      createdAt: new Date(),
      description: insertVideo.description || null,
      tags: insertVideo.tags || null,
      isMonetized: insertVideo.isMonetized ?? true
    };
    this.videos.set(id, video);
    return video;
  }

  async incrementVideoViews(id: string): Promise<void> {
    const video = this.videos.get(id);
    if (video && video.isMonetized) {
      video.views = (video.views || 0) + 1;
      video.earnings = (video.earnings || 0) + 0.1; // $0.001 per view in cents
      this.videos.set(id, video);
      await this.updateUserEarnings(video.userId, 0.1);
    }
  }

  // Shorts methods
  async getShorts(): Promise<Shorts[]> {
    return Array.from(this.shorts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getShortsItem(id: string): Promise<Shorts | undefined> {
    return this.shorts.get(id);
  }

  async getShortsByUser(userId: string): Promise<Shorts[]> {
    return Array.from(this.shorts.values()).filter(shorts => shorts.userId === userId);
  }

  async createShorts(insertShorts: InsertShorts): Promise<Shorts> {
    const id = randomUUID();
    const shorts: Shorts = { 
      ...insertShorts, 
      id, 
      views: 0, 
      earnings: 0,
      createdAt: new Date(),
      description: insertShorts.description || null,
      tags: insertShorts.tags || null,
      isMonetized: insertShorts.isMonetized ?? true
    };
    this.shorts.set(id, shorts);
    return shorts;
  }

  async incrementShortsViews(id: string): Promise<void> {
    const shorts = this.shorts.get(id);
    if (shorts && shorts.isMonetized) {
      shorts.views = (shorts.views || 0) + 1;
      shorts.earnings = (shorts.earnings || 0) + 0.1; // $0.001 per view in cents
      this.shorts.set(id, shorts);
      await this.updateUserEarnings(shorts.userId, 0.1);
    }
  }

  // Photo methods
  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async getPhotosByUser(userId: string): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(photo => photo.userId === userId);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = { 
      ...insertPhoto, 
      id, 
      likes: 0, 
      earnings: 0,
      createdAt: new Date(),
      description: insertPhoto.description || null,
      tags: insertPhoto.tags || null,
      isMonetized: insertPhoto.isMonetized ?? true
    };
    this.photos.set(id, photo);
    return photo;
  }

  async incrementPhotoLikes(id: string): Promise<void> {
    const photo = this.photos.get(id);
    if (photo && photo.isMonetized) {
      photo.likes = (photo.likes || 0) + 1;
      photo.earnings = (photo.earnings || 0) + 0.5; // $0.005 per like in cents
      this.photos.set(id, photo);
      await this.updateUserEarnings(photo.userId, 0.5);
    }
  }

  // Content methods
  async getAllContent(): Promise<(Video | Shorts | Photo)[]> {
    const videos = await this.getVideos();
    const shorts = await this.getShorts();
    const photos = await this.getPhotos();
    
    const allContent = [...videos, ...shorts, ...photos];
    return allContent.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getTrendingCreators(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.followers || 0) - (a.followers || 0))
      .slice(0, 5);
  }

  // User preferences methods (stub implementations for interface compliance)
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return undefined; // Not implemented in memory storage
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    throw new Error("User preferences not implemented in memory storage");
  }

  async updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<void> {
    // Not implemented in memory storage
  }

  // Follow methods (stub implementations)
  async followUser(followerId: string, followingId: string): Promise<Follow> {
    throw new Error("Follow functionality not implemented in memory storage");
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    // Not implemented in memory storage
  }

  async getFollowers(userId: string): Promise<User[]> {
    return [];
  }

  async getFollowing(userId: string): Promise<User[]> {
    return [];
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return false;
  }

  // Comment methods (stub implementations)
  async getComments(contentId: string, contentType: string): Promise<Comment[]> {
    return [];
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    throw new Error("Comments not implemented in memory storage");
  }

  async likeComment(commentId: string): Promise<void> {
    // Not implemented in memory storage
  }

  // Like methods (stub implementations)
  async likeContent(userId: string, contentId: string, contentType: string): Promise<Like> {
    throw new Error("Likes not implemented in memory storage");
  }

  async unlikeContent(userId: string, contentId: string, contentType: string): Promise<void> {
    // Not implemented in memory storage
  }

  async isContentLiked(userId: string, contentId: string, contentType: string): Promise<boolean> {
    return false;
  }

  // Watch history methods (stub implementations)
  async addToWatchHistory(history: InsertWatchHistory): Promise<WatchHistory> {
    throw new Error("Watch history not implemented in memory storage");
  }

  async getWatchHistory(userId: string): Promise<WatchHistory[]> {
    return [];
  }

  // Earnings methods (stub implementations)
  async addEarnings(earnings: InsertEarningsHistory): Promise<EarningsHistory> {
    throw new Error("Earnings history not implemented in memory storage");
  }

  async getUserEarningsHistory(userId: string): Promise<EarningsHistory[]> {
    return [];
  }

  // Live streaming methods 
  async createLiveStream(data: InsertLiveStream & { userId: string }): Promise<LiveStream> {
    const streamKey = `sk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const stream: LiveStream = {
      id: randomUUID(),
      ...data,
      streamKey,
      status: "setup",
      viewers: 0,
      maxViewers: 0,
      earnings: 0,
      startedAt: null,
      endedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.liveStreams.set(stream.id, stream);
    return stream;
  }

  async getLiveStream(id: string): Promise<LiveStream | undefined> {
    return this.liveStreams.get(id);
  }

  async getUserLiveStreams(userId: string): Promise<LiveStream[]> {
    return Array.from(this.liveStreams.values()).filter(stream => stream.userId === userId);
  }

  async getActiveLiveStreams(): Promise<LiveStream[]> {
    return Array.from(this.liveStreams.values()).filter(stream => stream.status === "live");
  }

  async updateLiveStreamStatus(id: string, status: string, extraData?: Record<string, any>): Promise<LiveStream> {
    const stream = this.liveStreams.get(id);
    if (!stream) {
      throw new Error("Stream not found");
    }
    
    stream.status = status;
    stream.updatedAt = new Date();
    
    if (status === "live" && !stream.startedAt) {
      stream.startedAt = new Date();
    } else if (status === "ended" && !stream.endedAt) {
      stream.endedAt = new Date();
    }
    
    if (extraData) {
      Object.assign(stream, extraData);
    }
    
    this.liveStreams.set(id, stream);
    return stream;
  }

  async updateStreamViewers(id: string, viewers: number): Promise<void> {
    const stream = this.liveStreams.get(id);
    if (stream) {
      stream.viewers = viewers;
      if (viewers > stream.maxViewers) {
        stream.maxViewers = viewers;
      }
      stream.updatedAt = new Date();
      this.liveStreams.set(id, stream);
    }
  }

  async addStreamChat(data: InsertStreamChat): Promise<StreamChat> {
    const chat: StreamChat = {
      id: randomUUID(),
      ...data,
      isSystemMessage: data.isSystemMessage || false,
      createdAt: new Date(),
    };
    this.streamChats.set(chat.id, chat);
    return chat;
  }

  async getStreamChats(streamId: string, limit?: number): Promise<StreamChat[]> {
    const chats = Array.from(this.streamChats.values())
      .filter(chat => chat.streamId === streamId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    return limit ? chats.slice(-limit) : chats;
  }

  async addStreamViewer(data: InsertStreamViewer): Promise<StreamViewer> {
    const viewer: StreamViewer = {
      id: randomUUID(),
      ...data,
      joinedAt: new Date(),
      leftAt: null,
    };
    this.streamViewers.set(viewer.id, viewer);
    return viewer;
  }

  async removeStreamViewer(streamId: string, sessionId: string): Promise<void> {
    // Not implemented in memory storage
  }

  async getActiveStreamViewers(streamId: string): Promise<StreamViewer[]> {
    return [];
  }
}

// Use database storage if available, otherwise fallback to memory storage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
