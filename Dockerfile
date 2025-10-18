# Use Node.js 18 LTS as base image
FROM node:18.19.0-alpine3.19

# Set working directory
WORKDIR /app

# Copy package files for both frontend and backend
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend files to backend public directory
RUN mkdir -p public
RUN cp -r ../frontend/dist/* public/ 2>/dev/null || echo "Frontend files copied"

# Set working directory back to backend
WORKDIR /app/backend

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
