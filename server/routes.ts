import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertShortsSchema, insertPhotoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all content (mixed feed)
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get videos only
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get shorts only
  app.get("/api/shorts", async (req, res) => {
    try {
      const shorts = await storage.getShorts();
      res.json(shorts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shorts" });
    }
  });

  // Get photos only
  app.get("/api/photos", async (req, res) => {
    try {
      const photos = await storage.getPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  // Create video
  app.post("/api/videos", async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
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

  // Create shorts
  app.post("/api/shorts", async (req, res) => {
    try {
      const validatedData = insertShortsSchema.parse(req.body);
      if (validatedData.duration > 60) {
        return res.status(400).json({ error: "Shorts must be 60 seconds or less" });
      }
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

  // Create photo
  app.post("/api/photos", async (req, res) => {
    try {
      const validatedData = insertPhotoSchema.parse(req.body);
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

      const videoEarnings = videos.reduce((sum, video) => sum + video.earnings, 0);
      const shortsEarnings = shorts.reduce((sum, short) => sum + short.earnings, 0);
      const photoEarnings = photos.reduce((sum, photo) => sum + photo.earnings, 0);

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
