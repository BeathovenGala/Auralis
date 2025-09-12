#!/bin/bash

# Production deployment script for Auralis

set -e

echo "🚀 Starting Auralis deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

if [ ! -d "client/dist" ]; then
    echo "❌ Build failed - client/dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Check environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL not set"
fi

if [ -z "$NODE_ENV" ]; then
    echo "⚠️  Setting NODE_ENV to production"
    export NODE_ENV=production
fi

# Run database migrations if needed
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "🗄️  Running database migrations..."
    npm run db:migrate
fi

echo "✅ Auralis is ready for production!"
echo "🌟 Start with: npm start"
echo "🔗 Health check: http://localhost:5000/api/health"
