FROM node:20-alpine AS base

# Deps Stage
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
RUN npm install --omit=dev

# Builder Stage
FROM base AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package*.json ./
COPY packages ./packages
RUN npm install

COPY . .
RUN npm run build

# Runner Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=7860

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backend

COPY --from=deps --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/packages ./packages
COPY --from=builder --chown=backend:nodejs /app/package*.json ./

USER backend

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:7860/health || exit 1

CMD ["node", "dist/src/index.js"]