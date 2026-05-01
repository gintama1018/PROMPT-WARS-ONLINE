#!/bin/bash

# Render Build Script for PROMPT-WARS-ONLINE
# This script handles the complete build process for Render deployment

set -e  # Exit on error

echo "========================================="
echo "Building PROMPT-WARS-ONLINE for Render"
echo "========================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Step 2: Run TypeScript checks
echo "🔍 Running TypeScript checks..."
pnpm run typecheck

# Step 3: Run linter
echo "📋 Running ESLint..."
pnpm run lint

# Step 4: Run tests
echo "🧪 Running tests..."
pnpm run test

# Step 5: Build all packages
echo "🏗️ Building all packages..."
pnpm run build

# Step 6: Generate OpenAPI client (if needed)
echo "📡 Generating API client..."
pnpm --filter @workspace/api-spec run codegen || true

echo ""
echo "========================================="
echo "✅ Build completed successfully!"
echo "========================================="
