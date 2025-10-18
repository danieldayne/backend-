#!/bin/sh

# Dentist Appointment System - Deployment Script
echo "================================"
echo "Dentist Appointment Deployment"
echo "================================"

# Set error handling
set -e

# Navigate to backend directory
cd backend

# Set up environment variables for production
if [ -f ".env.production" ] && [ ! -f ".env" ]; then
    echo "Setting up production environment..."
    cp .env.production .env
fi

# Ensure public directory exists
mkdir -p public

# Copy frontend build files if they exist
if [ -d "../frontend/dist" ]; then
    echo "Setting up frontend files..."
    cp -r ../frontend/dist/* public/ 2>/dev/null || echo "No frontend files to copy"
fi

# Set PORT environment variable if not set
export PORT=${PORT:-3000}
export NODE_ENV=${NODE_ENV:-production}

echo "Starting backend server on port $PORT..."

# Start the application
exec npm start
