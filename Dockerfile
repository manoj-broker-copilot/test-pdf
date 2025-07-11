FROM node:20-slim

WORKDIR /app

# Install Chromium and other dependencies for Puppeteer
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
    fonts-freefont-ttf \
    ca-certificates \
    fonts-dejavu \
    bash \
    curl \
    wget \
    dumb-init \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    openssh-server \
    --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Setup SSH password (for root)
RUN echo "root:Docker!" | chpasswd

# Copy SSH config for Azure App Service (must match MS requirements)
COPY sshd_config /etc/ssh/sshd_config

# Puppeteer env var: use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy package files and install all dependencies (prod + dev, so build works)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Only copy built output and node_modules for runtime (optional micro-optimize)
# (or just use as is for simplicity; removing devDeps post-build is advanced)

EXPOSE 3000 2222

ENTRYPOINT ["/entrypoint.sh"]
