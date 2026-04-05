# ─────────────────────────────────────────────
# Stage 1 – Build the React frontend
# ─────────────────────────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

# Copy source first, then install – ensures node_modules is always built in Linux
COPY frontend/ ./
RUN npm install && npm run build

# ─────────────────────────────────────────────
# Stage 2 – Production image (backend + static)
# ─────────────────────────────────────────────
FROM node:20-slim AS production

# Puppeteer / Chromium system dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-freefont-ttf \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    wget \
    ca-certificates \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use the system Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app/backend

# Copy source first, then install – native modules (better-sqlite3) compile for Linux here
COPY backend/ ./
RUN npm install --omit=dev

# Copy built frontend into backend/public so Express serves it
COPY --from=frontend-builder /app/frontend/dist ./public

# Ensure runtime directories exist
RUN mkdir -p uploads outputs assets data

EXPOSE 3001

CMD ["node", "server.js"]
