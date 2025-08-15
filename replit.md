# BeLen - Content Creator Platform

## Overview

BeLen is a full-stack content creator platform that allows users to upload and monetize videos, shorts, and photos. The application provides content creators with tools to track their earnings, manage uploads, and build their audience through a social media-style interface. Built with modern web technologies, it features a React frontend with shadcn/ui components, Express.js backend, and PostgreSQL database with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot module replacement with Vite middleware integration
- **File Structure**: Modular route organization with separate storage layer

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting (ACTIVE)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Interface**: DatabaseStorage implementation connected to PostgreSQL
- **Session Storage**: PostgreSQL session store using connect-pg-simple
- **Database Models**: Users, videos, shorts, and photos with foreign key relationships

### Content Management System
- **Content Types**: Three distinct content types (videos, shorts, photos) with shared characteristics
- **Monetization**: Built-in earnings tracking per content item and user
- **Engagement Metrics**: View counting for videos/shorts, like counting for photos
- **File Uploads**: Placeholder system for file upload handling (requires external storage service integration)

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User System**: Email/phone and username authentication with bcrypt password hashing
- **Protected Routes**: All upload endpoints and user-specific data require authentication
- **User Profiles**: Creator profiles with follower/following counts and earnings tracking
- **Real User System**: Migrated from demo data to actual user authentication system

## External Dependencies

### UI and Styling
- **shadcn/ui**: Complete component library with accessibility features
- **Radix UI**: Headless UI primitives for complex interactions
- **Tailwind CSS**: Utility-first CSS framework with custom color palette
- **Lucide React**: Icon library for consistent iconography

### Database and ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe ORM with schema validation
- **Drizzle Zod**: Schema validation integration

### Development Tools
- **Vite**: Build tool with React plugin and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins for Replit platform

### State Management and API
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with validation
- **Zod**: Runtime type validation for API contracts

### File Handling
- **File Upload System**: Local file storage with multer for development
- **Protected Uploads**: All content uploads require user authentication
- **Media Processing**: Local file URLs, ready for external storage service integration

## Recent Changes (August 2025)
- ✅ **PROJECT MIGRATION COMPLETED**: Successfully migrated from Replit Agent to standard Replit environment
  - Database connection established with environment variables
  - All dependencies properly installed and configured
  - PostgreSQL database tables created and migrated
  - Application server running successfully on port 5000
  - Frontend routing and authentication system verified
  - Client-server separation maintained with security best practices
- ✅ Migrated from demo data to real PostgreSQL database
- ✅ Implemented email/phone authentication system with bcrypt
- ✅ Added protected routes for all upload endpoints
- ✅ Configured PostgreSQL session storage
- ✅ Connected all storage operations to database via DatabaseStorage class
- ✅ Fixed login flow to properly redirect authenticated users to main app
- ✅ **PERSISTENT MEMORY SYSTEM**: Added comprehensive data persistence
  - User preferences (theme, notifications, privacy settings)
  - Follow/unfollow relationships with real-time counts
  - Comments and replies system for all content types
  - Like/unlike functionality for photos, videos, and shorts
  - Watch history tracking with completion status
  - Earnings history with detailed transaction logging
  - All user interactions permanently saved to PostgreSQL
- ✅ **PROFILE UPDATE SYSTEM**: Added permanent profile data persistence
  - Profile editing with real-time database updates via PATCH /api/auth/profile
  - Photo upload system with automatic profile image URL updates
  - All profile changes (username, firstName, lastName, profileImageUrl) permanently saved
  - User data never lost during system upgrades - everything stored in PostgreSQL
  - Profile page displays authentic user data from database, not mock data