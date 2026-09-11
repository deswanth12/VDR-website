# Base image with required libc compatibility
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NEXT_TELEMETRY_DISABLED=1

# Stage 1: Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create persistent data and upload directories with correct ownership
RUN mkdir -p /app/data /app/data/snapshots /app/public/uploads && \
    chown -R nextjs:nodejs /app/data /app/public/uploads

# Copy public static files
COPY --from=builder /app/public ./public

# Copy standalone output, static assets, and startup scripts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
RUN chmod +x ./scripts/docker-entrypoint.sh

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Volume declarations for persistence
VOLUME ["/app/data", "/app/public/uploads"]

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
CMD ["node", "server.js"]
