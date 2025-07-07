# syntax=docker/dockerfile:1

FROM node:18-slim AS base

# Set working directory
WORKDIR /app

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# Install dependencies only once (using turbo cache for monorepo)
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

# Install all dependencies (for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Copy environment variables
COPY apps/web/.env ./apps/web/.env

# Build the web app only
RUN pnpm --filter "./apps/web..." build

# --- Production image ---
FROM node:18-slim AS prod
WORKDIR /app

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# todo: should only copy build files, too time consuming to figure out
COPY --from=base . .

EXPOSE 4173

CMD ["pnpm", "--filter=web", "preview", "--host"]
