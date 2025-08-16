import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import type { User } from "@shared/schema";

// Extend the Request interface to include user
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateUser(emailOrPhone: string, password: string): Promise<User | null> {
  const user = await storage.getUserByEmailOrPhone(emailOrPhone);
  if (!user) {
    return null;
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return user;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth middleware - Session ID:', req.sessionID);
  console.log('Auth middleware - Session data:', JSON.stringify(req.session, null, 2));
  console.log('Auth middleware - User ID:', req.session?.userId);
  console.log('Auth middleware - All Cookies:', req.headers.cookie);
  
  // Check if session exists and has userId
  if (!req.session) {
    console.log('Authentication failed - no session object');
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (!req.session.userId) {
    console.log('Authentication failed - no userId in session');
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      console.log('Authentication failed - user not found in database for ID:', req.session.userId);
      req.session.userId = undefined;
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    console.log('Authentication successful for user:', user.id, user.username);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: "Authentication error" });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await storage.getUser(req.session.userId);
    if (user) {
      req.user = user;
    }
  }
  next();
};