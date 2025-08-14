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
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Interface**: Abstract storage interface with in-memory implementation for development
- **Database Models**: Users, videos, shorts, and photos with foreign key relationships

### Content Management System
- **Content Types**: Three distinct content types (videos, shorts, photos) with shared characteristics
- **Monetization**: Built-in earnings tracking per content item and user
- **Engagement Metrics**: View counting for videos/shorts, like counting for photos
- **File Uploads**: Placeholder system for file upload handling (requires external storage service integration)

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User System**: Username/password authentication with encrypted password storage
- **User Profiles**: Creator profiles with follower/following counts and earnings tracking

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
- **File Upload System**: Placeholder implementation requiring external storage service (AWS S3, Cloudinary, etc.)
- **Media Processing**: Mock URLs for development, needs integration with media processing service