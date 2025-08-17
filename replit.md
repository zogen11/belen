# BeLen - Content Creator Platform

## Overview
BeLen is a full-stack content creator platform designed for users to upload and monetize videos, shorts, and photos. It offers tools for creators to track earnings, manage uploads, and build their audience through a social media-style interface. The platform aims to be a comprehensive solution for content monetization and audience engagement, incorporating advanced features like AI-powered content generation, live streaming, and detailed analytics.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Backend
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging and centralized error handling
- **Development**: Hot module replacement with Vite integration
- **File Structure**: Modular route organization

### Data Storage
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe operations
- **Schema Management**: Drizzle Kit for migrations
- **Session Storage**: PostgreSQL session store using `connect-pg-simple`
- **Models**: Users, videos, shorts, and photos with relationships
- **Data Persistence**: Comprehensive persistence for user preferences, follow relationships, comments, likes, watch history, and earnings.

### Content Management
- **Content Types**: Videos, shorts, photos with shared characteristics.
- **Monetization**: Built-in earnings tracking per content item and user.
- **Engagement Metrics**: View counting for videos/shorts, like counting for photos.
- **File Uploads**: Placeholder system for file upload handling (requires external storage service integration).

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL store.
- **User System**: Email/phone and username authentication with bcrypt hashing.
- **Protected Routes**: All upload endpoints and user-specific data require authentication.
- **User Profiles**: Creator profiles with follower/following counts and earnings tracking.

### UI/UX Decisions
- **Design System**: shadcn/ui and Radix UI for a consistent and accessible interface.
- **Branding**: "BeLen" branding consistently applied throughout the platform.
- **Account Management**: YouTube-style account switcher with multi-account support and infinite scrollable Gmail accounts.
- **Settings**: Redesigned settings page with categories for general, caption, accessibility, live chat, purchases, billing, data management, and terms of service.
- **Help & Feedback**: Comprehensive, searchable help center with community support and feedback submission.
- **AI Features**: Dedicated AI Studio with advanced capabilities like Neural Content Generation, AI Video Synthesis, Deep Voice Cloning, Predictive Analytics, and AI Music Composer, accessible via an organized dropdown.

## External Dependencies

### UI and Styling
- **shadcn/ui**: Component library.
- **Radix UI**: Headless UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.

### Database and ORM
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe ORM.
- **Drizzle Zod**: Schema validation integration.

### Development Tools
- **Vite**: Build tool.
- **TypeScript**: Type safety.
- **ESBuild**: Fast JavaScript bundler.

### State Management and API
- **TanStack Query**: Server state management.
- **React Hook Form**: Form library.
- **Zod**: Runtime type validation.

### File Handling
- **Multer**: For local file storage during development.