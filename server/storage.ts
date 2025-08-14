import { 
  type User, 
  type InsertUser, 
  type Video, 
  type InsertVideo, 
  type Shorts, 
  type InsertShorts, 
  type Photo, 
  type InsertPhoto 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private videos: Map<string, Video>;
  private shorts: Map<string, Shorts>;
  private photos: Map<string, Photo>;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.shorts = new Map();
    this.photos = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      followers: 0, 
      following: 0, 
      totalEarnings: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserEarnings(userId: string, earnings: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.totalEarnings += earnings;
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
      createdAt: new Date()
    };
    this.videos.set(id, video);
    return video;
  }

  async incrementVideoViews(id: string): Promise<void> {
    const video = this.videos.get(id);
    if (video && video.isMonetized) {
      video.views += 1;
      video.earnings += 0.1; // $0.001 per view in cents
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
      createdAt: new Date()
    };
    this.shorts.set(id, shorts);
    return shorts;
  }

  async incrementShortsViews(id: string): Promise<void> {
    const shorts = this.shorts.get(id);
    if (shorts && shorts.isMonetized) {
      shorts.views += 1;
      shorts.earnings += 0.1; // $0.001 per view in cents
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
      createdAt: new Date()
    };
    this.photos.set(id, photo);
    return photo;
  }

  async incrementPhotoLikes(id: string): Promise<void> {
    const photo = this.photos.get(id);
    if (photo && photo.isMonetized) {
      photo.likes += 1;
      photo.earnings += 0.5; // $0.005 per like in cents
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
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 5);
  }
}

export const storage = new MemStorage();
