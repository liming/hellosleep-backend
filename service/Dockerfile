# Use Debian-based Node image for sharp/libvips compatibility (glibc)
FROM node:24-bookworm-slim

# Use Yarn 1 (classic) to match project's yarn.lock format
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Install libvips42 (provides libvips-cpp.so.42) for sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Build context is repo root (railway.json dockerfilePath)
COPY service/package.json service/yarn.lock service/.yarnrc* ./

# Install dependencies
RUN yarn install --ignore-engines

# Copy rest of service source
COPY service/ .

# Build Strapi admin
RUN yarn build

# Production run
ENV NODE_ENV=production
EXPOSE 1337

CMD ["yarn", "start"]
