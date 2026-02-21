# Use Debian-based Node image for sharp/libvips compatibility (glibc)
FROM node:24-bookworm-slim

# Use Yarn 1 (classic) to match project's yarn.lock format
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Install libvips for sharp native bindings
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files (service has its own yarn.lock)
COPY package.json yarn.lock .yarnrc* ./

# Install dependencies
RUN yarn install --ignore-engines

# Copy source
COPY . .

# Build Strapi admin
RUN yarn build

# Production run
ENV NODE_ENV=production
EXPOSE 1337

CMD ["yarn", "start"]
