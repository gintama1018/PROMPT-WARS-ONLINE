# Multi-stage build for PROMPT-WARS-ONLINE
# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./

# Copy package.json files
COPY package.json ./
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/election-guide/package.json ./artifacts/election-guide/
COPY lib/*/package.json ./lib/

# Create directory structure
RUN mkdir -p artifacts/api-server artifacts/election-guide lib/{api-spec,api-zod,api-client-react,db,integrations-gemini-ai}

# Copy source files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build everything
RUN pnpm run typecheck
RUN pnpm run build

# Stage 2: API Runtime
FROM node:22-alpine AS api

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/artifacts/api-server ./artifacts/api-server
COPY --from=builder /app/lib ./lib

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/api/healthz', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start API server
EXPOSE 8080
CMD ["pnpm", "--filter", "@workspace/api-server", "run", "start"]

# Stage 3: Frontend Runtime  
FROM node:22-alpine AS frontend

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/artifacts/election-guide ./artifacts/election-guide
COPY --from=builder /app/lib ./lib

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Expose port
EXPOSE 4173
CMD ["pnpm", "--filter", "@workspace/election-guide", "run", "serve"]
