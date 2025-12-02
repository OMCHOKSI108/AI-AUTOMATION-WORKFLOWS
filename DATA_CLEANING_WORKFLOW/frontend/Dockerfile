# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Install serve for production
RUN npm install -g serve

# Expose port
EXPOSE 5173

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]