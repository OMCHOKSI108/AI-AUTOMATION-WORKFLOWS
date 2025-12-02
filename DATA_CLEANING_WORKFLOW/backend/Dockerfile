# Backend Dockerfile
FROM node:18-alpine

# Install Python, Chromium and dependencies for data analysis and PDF generation
# Added curl for healthcheck, chromium for puppeteer
RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base \
    python3-dev \
    curl \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && python3 -m venv /opt/venv \
    && . /opt/venv/bin/activate \
    && pip install --no-cache-dir pandas numpy matplotlib seaborn scikit-learn openpyxl

# Tell Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Add virtual environment to PATH
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3001}/api/health || exit 1

# Start the application
CMD ["npm", "start"]