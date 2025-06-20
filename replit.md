# Replit Project Documentation

## Overview

FitTime is a comprehensive fitness application built as a full-stack web application using Express.js for the backend and React for the frontend. The application is designed to help users create workout plans, track exercise sessions, and monitor their fitness progress with detailed statistics and history tracking.

## System Architecture

### Full-Stack Monorepo Structure
- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Development Environment**: Replit with hot-reload support

### Directory Structure
```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-based page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions and configurations
├── server/                 # Express.js backend
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database abstraction layer
│   └── vite.ts             # Development server setup
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and validation
└── migrations/             # Database migration files
```

## Key Components

### Database Schema
The application uses three main entities:
- **Exercises**: Exercise definitions with categories, difficulty levels, and default parameters
- **Workout Plans**: Collections of exercises with specific sets, reps, and duration
- **Workout Sessions**: Actual workout execution tracking with completion status and performance data

### Frontend Architecture
- **Router**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom color scheme

### Backend Architecture
- **API Layer**: RESTful API with Express.js
- **Data Layer**: Drizzle ORM with PostgreSQL
- **Storage Abstraction**: Interface-based storage layer supporting both memory and database implementations
- **Validation**: Zod schemas for request/response validation

## Data Flow

### Exercise Management
1. Users can browse exercises from the library, filtered by category
2. Custom exercises can be created and stored
3. Exercises include metadata like difficulty, default sets/reps, and categories

### Workout Planning
1. Users create workout plans by selecting exercises
2. Each exercise in a plan has customizable sets, reps, duration, and rest time
3. Plans are saved with estimated duration and category

### Workout Execution
1. Users start workout sessions from saved plans
2. Real-time timer tracks workout duration
3. Progress is tracked per exercise with completion status
4. Sessions are saved with actual performance data

### Statistics and History
1. Weekly statistics aggregate workout data
2. Charts display workout frequency and duration trends
3. Complete workout history with detailed session information

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **wouter**: Lightweight React router

### UI Libraries
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **recharts**: Chart components for statistics

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: Vite builds frontend, esbuild bundles backend
- **Port Configuration**: Server runs on port 5000, exposed as port 80

### Build Process
1. Frontend: Vite builds React application to `dist/public`
2. Backend: esbuild bundles Express server to `dist/index.js`
3. Database: Drizzle manages schema migrations

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

## Changelog
- June 20, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.