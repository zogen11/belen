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
- ✅ **SETTINGS PAGE REDESIGN**: Completely redesigned settings page (August 16, 2025)
  - Removed Account Settings form (username, email, first name, last name fields)
  - Added new settings menu with modern clean interface
  - Added Caption settings for subtitle preferences
  - Added Accessibility options for screen readers
  - Added Live Chat Watch on TV for TV viewing configuration
  - Added Purchase and Membership for subscription management
  - Added Billing and Payment for payment method management
  - Added Your Data in BeLen for data management and downloads
  - Added General settings for app preferences
  - Added BeLen Terms of Service for policies and guidelines
  - Maintained existing Account Management section with logout/delete options
  - All menu items functional with toast notifications
- ✅ **PROJECT MIGRATION RE-COMPLETED**: Successfully re-migrated from Replit Agent to standard Replit environment (August 16, 2025)
  - Database connection established with PostgreSQL environment variables
  - All dependencies properly installed and configured
  - PostgreSQL database tables created and migrated via drizzle-kit push
  - Application server running successfully on port 5000
  - Frontend routing and authentication system verified
  - Client-server separation maintained with security best practices
  - Database seeded with sample content (4 users, 4 videos, 4 shorts, 4 photos)
  - **HISTORY PAGE CRASH FIX**: Created missing /history route and HistoryPage component
    - Fixed crash when clicking "View all" button in profile history section
    - Added proper empty state message: "No recent history found" 
    - Implemented protected route for history functionality
    - All navigation links now work without crashes
  - **CLEAN DATABASE**: Removed all demo content per user request
    - Deleted all sample videos, shorts, and photos from database
    - Reset all user statistics (earnings, followers, following) to 0
    - Kept user accounts but cleaned all content for fresh start
  - Migration completed August 16, 2025 - all systems fully operational
- ✅ **SETTINGS PAGE REDESIGN**: Completely redesigned settings page (August 16, 2025)
  - Removed Account Settings form (username, email, first name, last name fields)
  - Added new settings menu with modern clean interface
  - Added Caption settings for subtitle preferences
  - Added Accessibility options for screen readers
  - Added Live Chat Watch on TV for TV viewing configuration
  - Added Purchase and Membership for subscription management
  - Added Billing and Payment for payment method management
  - Added Your Data in BeLen for data management and downloads
  - Added General settings for app preferences
  - Added BeLen Terms of Service for policies and guidelines
  - Maintained existing Account Management section with logout/delete options
  - All menu items functional with toast notifications
- ✅ **BELEN BRANDING UPDATES**: Completed platform rebranding from YouTube to BeLen (August 16, 2025)
  - Updated profile display text from "@subscribers • videos" to "{followers} followers • {following} following"
  - Changed description placeholder from "LET'S SING TOGETHER..." to "Describe here"
  - Replaced "YouTube" references with "BeLen" in disclaimer text and throughout platform
  - Implemented consistent social media terminology instead of video platform terminology
- ✅ **ACCOUNT MANAGEMENT FEATURES**: Added complete account management section (August 16, 2025)
  - Added logout account option with proper session clearing and navigation
  - Added delete account button (placeholder functionality for future implementation)  
  - Enhanced profile edit form with Save Changes button and proper feedback
  - Implemented proper mutation handling with loading states and error handling
- ✅ **REAL DATA INTEGRATION**: All features now working with authentic database content
  - Sample content created: 4 users, 4 videos, 4 shorts, 4 photos with realistic data
  - Home page displaying real videos, shorts, and photos from database
  - Profile pages showing authentic user statistics and content
  - Explore page filtering by real content categories
  - All earnings, views, and likes data coming from PostgreSQL
  - Content upload system fully functional with file storage
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