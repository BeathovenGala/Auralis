# Geostorm Alerting System

## Overview

The Geostorm Alerting System is a mission-critical space weather monitoring and alerting platform designed for 24/7 operations. It provides dual-tier alerts (strategic and imminent) with ML-driven forecasting to support operational decision-making across multiple domains including power grid operations, satellite management, aviation routing, and human spaceflight safety.

The system features a comprehensive dashboard with real-time space weather monitoring, interactive 3D globe visualization using CesiumJS, time-series charting of space weather parameters, and specialized operational interfaces for different user personas (grid operators, satellite operators, aviation planners, and spaceflight crews).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**: React-based single page application using TypeScript and Vite for development tooling. The UI is built with shadcn/ui components following a dark-mode-first design approach optimized for control room environments. Navigation uses Wouter for client-side routing with dedicated pages for each operational domain.

**Component Design System**: Implements Material Design principles with a space weather-specific color palette featuring operational blue (#2563eb), status colors (green/yellow/orange/red for normal/elevated/high/severe states), and system-appropriate typography using Inter and JetBrains Mono fonts. Components are designed for rapid information processing with clear visual hierarchy.

**State Management**: Uses TanStack Query for server state management and caching, with React Context for theme management. The architecture supports real-time data updates and efficient caching of space weather data streams.

**Data Visualization**: Integrates CesiumJS for 3D globe visualization of satellites, flight paths, and space weather overlays. Time-series charts support synchronized cursors and export capabilities for space weather parameters (Bz, solar wind, Dst, Kp indices).

**Responsive Design**: Mobile-responsive design with collapsible navigation and adaptive layouts. Supports both desktop control room environments and mobile field operations.

**Authentication & Authorization**: Role-based access control with user management supporting Viewer, Operator, Analyst, and Admin roles. Includes session management and secure credential handling.

**Backend Architecture**: Express.js server with TypeScript providing RESTful API endpoints. Uses a modular storage interface pattern that abstracts database operations, currently implemented with in-memory storage but designed for easy migration to PostgreSQL.

**Database Design**: Configured for PostgreSQL using Drizzle ORM with schema definitions in shared TypeScript files. Includes user management tables and prepared for space weather data ingestion tables.

## External Dependencies

**Database**: Neon PostgreSQL serverless database with connection pooling and WebSocket support for real-time features.

**UI Components**: Radix UI primitives for accessible, unstyled components; Tailwind CSS for utility-first styling; Lucide React for consistent iconography.

**Data Visualization**: CesiumJS for 3D globe rendering and geospatial visualizations; Recharts for time-series charting and data visualization.

**Communication**: SendGrid for email notifications and alert distribution to operational teams.

**Development Tools**: Vite for fast development builds and hot module replacement; ESBuild for production bundling; TypeScript for type safety across the full stack.

**Date/Time Handling**: date-fns for timestamp formatting and time zone management, critical for coordinating space weather events across global operations.

**Form Management**: React Hook Form with Zod validation for operational forms including alert acknowledgment, playbook execution, and system configuration.

**Deployment**: Configured for Node.js production deployment with environment-based configuration management.