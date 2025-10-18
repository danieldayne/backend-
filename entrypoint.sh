#!/bin/sh

# Entrypoint script for Docker container
echo "Starting Dentist Appointment System..."

# Set environment variables
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Current directory: $(pwd)"
    ls -la
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Error: node_modules not found. Running npm install..."
    npm install --production
fi

# Start the application
echo "Starting server on port $PORT..."
exec npm start
