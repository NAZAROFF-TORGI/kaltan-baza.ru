# Industrial Property Landing Page

## Overview

This is a specialized landing page built to sell an industrial property located in Kemerovo region, Russia. The application follows a high-conversion landing page architecture designed to generate qualified leads through targeted advertising campaigns. The project implements a full-stack TypeScript solution with a React frontend and Express backend, optimized for industrial real estate marketing.

The landing page showcases a 1,300 m² industrial facility with autonomous utilities (private well and heating system) on a 2,600 m² plot, targeting businesses looking for production, warehouse, or garage facilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **UI Components**: Radix UI primitives with custom styling for accessibility and polish

### Backend Architecture
- **Runtime**: Node.js with Express framework for RESTful API
- **Language**: TypeScript throughout for consistency and type safety
- **Data Layer**: In-memory storage with planned PostgreSQL integration via Drizzle ORM
- **API Design**: RESTful endpoints for lead capture and analytics tracking
- **Validation**: Zod schemas shared between frontend and backend for consistent data validation

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe queries
- **Schema**: Three main entities:
  - `users`: Authentication (future feature)
  - `leads`: Customer inquiries with contact info and quiz responses
  - `analytics`: Event tracking for user behavior analysis
- **Migration Strategy**: Drizzle Kit for schema migrations and database management

### Lead Generation Strategy
- **Multi-tier Conversion**: Primary CTA for planning documents, secondary CTAs for direct contact
- **Lead Qualification**: Interactive quiz system to segment prospects by business type and needs
- **Contact Channels**: Multiple touch points including phone, WhatsApp, Telegram, and email
- **Analytics Tracking**: Comprehensive event tracking for conversion optimization

### Content Architecture
- **Hero Section**: Video background with compelling value proposition
- **Key Metrics**: Scannable facility specifications (area, power, height, equipment)
- **Visual Proof**: Professional photography gallery with lightbox functionality
- **Location Strategy**: Interactive map highlighting business ecosystem and transport access
- **Technical Specs**: Detailed facility information for informed decision-making
- **Trust Building**: Document downloads and credibility indicators

### Performance Optimizations
- **Image Optimization**: Unsplash URLs with responsive sizing parameters
- **Code Splitting**: Vite-based build system with automatic chunk splitting
- **Development Experience**: Hot module replacement and error overlay for rapid iteration

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL via Neon serverless platform
- **Image CDN**: Unsplash for high-quality industrial photography
- **Maps**: Yandex Maps API for location visualization (placeholder implemented)

### Development Tooling
- **Build System**: Vite for fast development and optimized production builds
- **Deployment**: Replit platform with integrated development environment
- **Package Management**: npm with lock file for dependency consistency

### UI/UX Libraries
- **Component System**: Radix UI for accessible, unstyled components
- **Icons**: Font Awesome via CDN for industrial-themed iconography
- **Typography**: Google Fonts (Inter) for modern, readable text

### Form and Validation
- **Form Management**: React Hook Form for performant form handling
- **Schema Validation**: Zod for runtime type checking and form validation
- **Error Handling**: Custom toast notifications for user feedback

### Analytics and Tracking
- **Event Tracking**: Custom analytics system capturing user interactions
- **Lead Management**: Structured data collection for sales funnel optimization
- **Contact Integration**: Direct phone/messaging app links for immediate engagement

### Responsive Design
- **Mobile Optimization**: Tailwind's responsive utilities for all screen sizes
- **Touch Interactions**: Mobile-friendly navigation and contact methods
- **Progressive Enhancement**: Core functionality works without JavaScript