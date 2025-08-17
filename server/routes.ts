import type { Express } from "express";
import express from "express";
import session from "express-session";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertShortsSchema, insertPhotoSchema, loginSchema, signupSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import { hashPassword, authenticateUser, requireAuth, optionalAuth } from "./auth";
import MemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { seedDatabase } from "./seed-data";

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
  
  // Setup session management with PostgreSQL store if available, otherwise use memory store
  const MemStoreConstructor = MemoryStore(session);
  
  let sessionStore;
  if (process.env.DATABASE_URL) {
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: 'sessions',
      ttl: 7 * 24 * 60 * 60, // 7 days in seconds
    });
    console.log("✓ Using PostgreSQL session store");
  } else {
    sessionStore = new MemStoreConstructor({
      checkPeriod: 86400000 // 24 hours
    });
    console.log("⚠ Using memory session store (data will not persist)");
  }

  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    store: sessionStore,
    name: 'connect.sid',
    cookie: {
      secure: false, // set to true in production with HTTPS
      httpOnly: false, // Allow JS access for debugging
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
      path: '/',
      domain: undefined
    }
  }));

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Determine if it's email or phone
      const isEmail = validatedData.emailOrPhone.includes('@');
      const email = isEmail ? validatedData.emailOrPhone : "";
      const phone = isEmail ? "" : validatedData.emailOrPhone;
      
      // Generate username from email/phone
      let username = isEmail 
        ? validatedData.emailOrPhone.split('@')[0] 
        : `user_${validatedData.emailOrPhone.slice(-4)}`;
      
      // Make username unique by adding random suffix if needed
      const existingByUsername = await storage.getUserByUsername(username);
      if (existingByUsername) {
        username = `${username}_${Math.floor(Math.random() * 1000)}`;
      }
      
      // Check if user exists
      if (isEmail) {
        const existingUserByEmail = await storage.getUserByEmail(email);
        if (existingUserByEmail) {
          return res.status(400).json({ error: "User with this email already exists" });
        }
      } else {
        const existingUserByPhone = await storage.getUserByPhone(phone);
        if (existingUserByPhone) {
          return res.status(400).json({ error: "User with this phone number already exists" });
        }
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        email,
        phone,
        username,
        password: hashedPassword,
        firstName: "",
        lastName: "",
      });

      // Create session and save it
      req.session.userId = user.id;
      
      // Save session before responding
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Session error" });
        }
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await authenticateUser(validatedData.emailOrPhone, validatedData.password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Regenerate session for security and ensure it's persisted
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).json({ error: "Session error" });
        }
        
        // Set userId in the new session
        req.session.userId = user.id;
        console.log('Login - Setting session userId:', user.id);
        console.log('Login - Session ID:', req.sessionID);
        
        // Save the session
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return res.status(500).json({ error: "Session save error" });
          }
          
          console.log('Login - Session saved successfully for user:', user.id);
          console.log('Login - Session after save:', JSON.stringify(req.session, null, 2));
          
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          res.json({ user: userWithoutPassword });
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.json({ user: null });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.userId = undefined;
        return res.json({ user: null });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Error in /api/auth/me:', error);
      res.json({ user: null });
    }
  });

  // Debug endpoint to check session
  app.get("/api/auth/session-debug", (req, res) => {
    res.json({
      sessionID: req.sessionID,
      sessionData: req.session,
      cookies: req.headers.cookie,
      hasUserId: !!req.session?.userId
    });
  });

  // Update user profile
  app.patch("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      
      // Don't allow updating password, id, or timestamps through this endpoint
      delete updates.password;
      delete updates.id;
      delete updates.createdAt;
      delete updates.updatedAt;
      
      const updatedUser = await storage.updateUser(req.user!.id, updates);
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Upload profile photo
  app.post("/api/auth/profile/photo", requireAuth, upload.single('profileImage'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      // Check if file is an image
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: "Only image files are allowed" });
      }

      const profileImageUrl = `/uploads/${req.file.filename}`;
      
      // Update user's profile image URL in database
      const updatedUser = await storage.updateUser(req.user!.id, {
        profileImageUrl: profileImageUrl
      });

      const { password, ...userWithoutPassword } = updatedUser;
      
      console.log(`Profile photo updated for user ${req.user!.id}: ${profileImageUrl}`);
      
      res.json({ 
        profileImageUrl: profileImageUrl,
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Profile photo upload error:", error);
      res.status(500).json({ error: "Failed to upload profile photo" });
    }
  });
  
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
      console.error("Error fetching content:", error);
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
  app.post("/api/videos", requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const duration = parseInt(req.body.duration) || 300; // Default 5 minutes
      
      const videoData = {
        userId: req.user!.id,
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
        console.error("Error creating video:", error);
        res.status(500).json({ error: "Failed to create video" });
      }
    }
  });

  // Upload and create shorts
  app.post("/api/shorts", requireAuth, upload.single('file'), async (req, res) => {
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
        userId: req.user!.id,
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
        console.error("Error creating shorts:", error);
        res.status(500).json({ error: "Failed to create shorts" });
      }
    }
  });

  // Upload and create photo
  app.post("/api/photos", requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      
      const photoData = {
        userId: req.user!.id,
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
        console.error("Error creating photo:", error);
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

  // Get all users (emails) for account overview
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Return users without passwords for security
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Follow/Unfollow user
  app.post("/api/users/:id/follow", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const followerId = req.user!.id;
      
      // Cannot follow yourself
      if (followerId === id) {
        return res.status(400).json({ error: "Cannot follow yourself" });
      }
      
      // Check if already following
      const isFollowing = await storage.isFollowing(followerId, id);
      if (isFollowing) {
        await storage.unfollowUser(followerId, id);
        res.json({ success: true, message: "Unfollowed successfully", following: false });
      } else {
        await storage.followUser(followerId, id);
        res.json({ success: true, message: "Followed successfully", following: true });
      }
    } catch (error) {
      console.error("Error following user:", error);
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

  // Get user earnings (protected route)
  app.get("/api/users/:id/earnings", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Users can only access their own earnings
      if (req.user!.id !== id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
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
        total: user.totalEarnings || 0,
        breakdown: {
          videos: videoEarnings,
          shorts: shortsEarnings,
          photos: photoEarnings,
        },
      });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      res.status(500).json({ error: "Failed to fetch earnings data" });
    }
  });

  // Seed database with sample data (development only)
  app.post("/api/seed", async (req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Seeding not allowed in production" });
      }
      
      await seedDatabase();
      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  // Placeholder image endpoint
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">${width}x${height}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Video streaming endpoint
  app.get("/api/video/:filename", (req, res) => {
    const { filename } = req.params;
    const videoPath = path.join(process.cwd(), 'uploads', filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: "Video not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
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

  // User preferences routes
  app.get("/api/users/:id/preferences", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Users can only access their own preferences
      if (req.user!.id !== id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      let preferences = await storage.getUserPreferences(id);
      
      // Create default preferences if none exist
      if (!preferences) {
        preferences = await storage.createUserPreferences({ userId: id });
      }
      
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });

  app.put("/api/users/:id/preferences", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Users can only update their own preferences
      if (req.user!.id !== id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      await storage.updateUserPreferences(id, req.body);
      res.json({ success: true, message: "Preferences updated successfully" });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ error: "Failed to update user preferences" });
    }
  });

  // Followers/Following routes
  app.get("/api/users/:id/followers", async (req, res) => {
    try {
      const { id } = req.params;
      const followers = await storage.getFollowers(id);
      res.json(followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ error: "Failed to fetch followers" });
    }
  });

  app.get("/api/users/:id/following", async (req, res) => {
    try {
      const { id } = req.params;
      const following = await storage.getFollowing(id);
      res.json(following);
    } catch (error) {
      console.error("Error fetching following:", error);
      res.status(500).json({ error: "Failed to fetch following" });
    }
  });

  app.get("/api/users/:id/is-following/:targetId", requireAuth, async (req, res) => {
    try {
      const { id, targetId } = req.params;
      const isFollowing = await storage.isFollowing(id, targetId);
      res.json({ isFollowing });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ error: "Failed to check follow status" });
    }
  });

  // Comments routes
  app.get("/api/content/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.query;
      
      if (!type || !['video', 'shorts', 'photo'].includes(type as string)) {
        return res.status(400).json({ error: "Valid content type required" });
      }
      
      const comments = await storage.getComments(id, type as string);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/content/:id/comments", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { comment, contentType, parentCommentId } = req.body;
      
      if (!comment || !contentType) {
        return res.status(400).json({ error: "Comment and content type are required" });
      }
      
      const newComment = await storage.createComment({
        userId: req.user!.id,
        contentId: id,
        contentType,
        comment,
        parentCommentId: parentCommentId || null
      });
      
      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Like content routes
  app.post("/api/content/:id/like", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { contentType } = req.body;
      const userId = req.user!.id;
      
      if (!contentType || !['video', 'shorts', 'photo'].includes(contentType)) {
        return res.status(400).json({ error: "Valid content type required" });
      }
      
      const isLiked = await storage.isContentLiked(userId, id, contentType);
      
      if (isLiked) {
        await storage.unlikeContent(userId, id, contentType);
        res.json({ success: true, message: "Content unliked", liked: false });
      } else {
        await storage.likeContent(userId, id, contentType);
        res.json({ success: true, message: "Content liked", liked: true });
      }
    } catch (error) {
      console.error("Error liking content:", error);
      res.status(500).json({ error: "Failed to like content" });
    }
  });

  // Watch history routes
  app.post("/api/watch-history", requireAuth, async (req, res) => {
    try {
      const { contentId, contentType, watchDuration, isCompleted } = req.body;
      const userId = req.user!.id;
      
      if (!contentId || !contentType || !['video', 'shorts'].includes(contentType)) {
        return res.status(400).json({ error: "Valid content ID and type required" });
      }
      
      const watchRecord = await storage.addToWatchHistory({
        userId,
        contentId,
        contentType,
        watchDuration: watchDuration || 0,
        isCompleted: isCompleted || false
      });
      
      res.status(201).json(watchRecord);
    } catch (error) {
      console.error("Error adding to watch history:", error);
      res.status(500).json({ error: "Failed to add to watch history" });
    }
  });

  app.get("/api/users/:id/watch-history", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Users can only access their own watch history
      if (req.user!.id !== id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const history = await storage.getWatchHistory(id);
      res.json(history);
    } catch (error) {
      console.error("Error fetching watch history:", error);
      res.status(500).json({ error: "Failed to fetch watch history" });
    }
  });

  // Earnings history routes
  app.get("/api/users/:id/earnings-history", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Users can only access their own earnings history
      if (req.user!.id !== id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const history = await storage.getUserEarningsHistory(id);
      res.json(history);
    } catch (error) {
      console.error("Error fetching earnings history:", error);
      res.status(500).json({ error: "Failed to fetch earnings history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
