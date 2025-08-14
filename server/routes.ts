import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertShortsSchema, insertPhotoSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve uploaded files statically
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use('/uploads', express.static(uploadDir));
  
  // Get all content (mixed feed) with proper caching
  app.get("/api/content", async (req, res) => {
    try {
      res.header('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get videos only
  app.get("/api/videos", async (req, res) => {
    try {
      res.header('Cache-Control', 'public, max-age=30');
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get shorts only
  app.get("/api/shorts", async (req, res) => {
    try {
      res.header('Cache-Control', 'public, max-age=30');
      const shorts = await storage.getShorts();
      res.json(shorts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shorts" });
    }
  });

  // Get individual short
  app.get("/api/shorts/:id", async (req, res) => {
    try {
      const short = await storage.getShortsItem(req.params.id);
      if (!short) {
        return res.status(404).json({ error: "Short not found" });
      }
      res.json(short);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch short" });
    }
  });

  // Get photos only
  app.get("/api/photos", async (req, res) => {
    try {
      res.header('Cache-Control', 'public, max-age=30');
      const photos = await storage.getPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  // Upload and create video
  app.post("/api/videos", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const duration = parseInt(req.body.duration) || 300; // Default 5 minutes
      
      const videoData = {
        userId: req.body.userId || "default-user", // TODO: Get from auth
        title: req.body.title,
        description: req.body.description || "",
        thumbnailUrl: fileUrl, // Use same file as thumbnail for now
        videoUrl: fileUrl,
        duration,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        isMonetized: req.body.isMonetized === 'true'
      };

      const validatedData = insertVideoSchema.parse(videoData);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid video data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create video" });
      }
    }
  });

  // Upload and create shorts
  app.post("/api/shorts", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const duration = parseInt(req.body.duration) || 45; // Default 45 seconds
      
      if (duration > 60) {
        return res.status(400).json({ error: "Shorts must be 60 seconds or less" });
      }

      const shortsData = {
        userId: req.body.userId || "default-user", // TODO: Get from auth
        title: req.body.title,
        description: req.body.description || "",
        thumbnailUrl: fileUrl, // Use same file as thumbnail for now
        videoUrl: fileUrl,
        duration,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        isMonetized: req.body.isMonetized === 'true'
      };

      const validatedData = insertShortsSchema.parse(shortsData);
      const shorts = await storage.createShorts(validatedData);
      res.status(201).json(shorts);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid shorts data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create shorts" });
      }
    }
  });

  // Upload and create photo
  app.post("/api/photos", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      
      const photoData = {
        userId: req.body.userId || "default-user", // TODO: Get from auth
        title: req.body.title,
        description: req.body.description || "",
        imageUrl: fileUrl,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        isMonetized: req.body.isMonetized === 'true'
      };

      const validatedData = insertPhotoSchema.parse(photoData);
      const photo = await storage.createPhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid photo data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create photo" });
      }
    }
  });

  // Increment video views
  app.post("/api/videos/:id/view", async (req, res) => {
    try {
      await storage.incrementVideoViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment video views" });
    }
  });

  // Increment shorts views
  app.post("/api/shorts/:id/view", async (req, res) => {
    try {
      await storage.incrementShortsViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment shorts views" });
    }
  });

  // Increment photo likes
  app.post("/api/photos/:id/like", async (req, res) => {
    try {
      await storage.incrementPhotoLikes(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment photo likes" });
    }
  });

  // Like/Unlike shorts
  app.post("/api/shorts/:id/like", async (req, res) => {
    try {
      await storage.incrementShortsViews(req.params.id); // For now, treat likes as views
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to like shorts" });
    }
  });

  // Follow/Unfollow user
  app.post("/api/users/:id/follow", async (req, res) => {
    try {
      // For now, just return success - would implement proper follow logic
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to follow user" });
    }
  });

  // Get user content
  app.get("/api/users/:id/content", async (req, res) => {
    try {
      const { id } = req.params;
      const videos = await storage.getVideosByUser(id);
      const shorts = await storage.getShortsByUser(id);
      const photos = await storage.getPhotosByUser(id);
      
      res.json({
        videos,
        shorts,
        photos,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user content" });
    }
  });

  // Get user earnings
  app.get("/api/users/:id/earnings", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const videos = await storage.getVideosByUser(id);
      const shorts = await storage.getShortsByUser(id);
      const photos = await storage.getPhotosByUser(id);

      const videoEarnings = videos.reduce((sum, video) => sum + (video.earnings || 0), 0);
      const shortsEarnings = shorts.reduce((sum, short) => sum + (short.earnings || 0), 0);
      const photoEarnings = photos.reduce((sum, photo) => sum + (photo.earnings || 0), 0);

      res.json({
        total: user.totalEarnings,
        breakdown: {
          videos: videoEarnings,
          shorts: shortsEarnings,
          photos: photoEarnings,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch earnings data" });
    }
  });

  // Get trending creators
  app.get("/api/trending-creators", async (req, res) => {
    try {
      const creators = await storage.getTrendingCreators();
      res.json(creators);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending creators" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
