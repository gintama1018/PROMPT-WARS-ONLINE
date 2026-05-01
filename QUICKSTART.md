# Quick Setup Guide

Get the Election Guide running locally in 5 minutes.

## Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL 14+ (or use Docker)

## Option 1: Local Development (Recommended)

### 1. Clone & Install

```bash
git clone https://github.com/gintama1018/PROMPT-WARS-ONLINE.git
cd PROMPT-WARS-ONLINE
pnpm install
```

### 2. Setup Database

**Option A: Local PostgreSQL**
```bash
# Create database and user
createdb -U postgres election_guide
psql -U postgres -c "CREATE USER election_guide_user WITH PASSWORD 'postgres';"
psql -U postgres -c "ALTER USER election_guide_user CREATEDB;"

# Set environment variable
export DATABASE_URL="postgresql://election_guide_user:postgres@localhost:5432/election_guide"

# Run migrations
cd lib/db && pnpm run push
```

**Option B: Docker PostgreSQL** (easier)
```bash
docker run -d \
  -e POSTGRES_USER=election_guide_user \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=election_guide \
  -p 5432:5432 \
  postgres:16-alpine
```

### 3. Setup Environment

```bash
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL (from step 2)
# - GEMINI_API_KEY (get from Google Cloud)
# - SESSION_SECRET (generate random string)
```

### 4. Start Development Servers

```bash
# Terminal 1: API Server
pnpm --filter @workspace/api-server run dev

# Terminal 2: Frontend
pnpm --filter @workspace/election-guide run dev
```

Access:
- Frontend: http://localhost:20975
- API: http://localhost:8080

## Option 2: Docker Compose (Even Easier)

```bash
# Copy environment template
cp .env.example .env

# Start everything with one command
docker-compose up
```

Access:
- Frontend: http://localhost:5173
- API: http://localhost:8080
- Database: localhost:5432

## Verify Installation

```bash
# Test API
curl http://localhost:8080/api/healthz
# Expected: {"status": "ok"}

# Run tests
pnpm run test

# Check coverage
pnpm run test:coverage
```

## Common Commands

```bash
# Development
pnpm run dev              # Start all services
pnpm run build            # Build all packages
pnpm run typecheck        # Check TypeScript
pnpm run lint             # Run ESLint

# Testing
pnpm run test             # Run unit tests
pnpm run test:coverage    # With coverage report

# Docker
pnpm run docker:build     # Build Docker image
pnpm run docker:up        # Start Docker Compose
pnpm run docker:down      # Stop Docker Compose

# Code Quality
pnpm run format:check     # Check formatting
pnpm run format:write     # Auto-format code
```

## Troubleshooting

### Port Already in Use

```bash
# Find process on port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready -h localhost

# Verify DATABASE_URL
echo $DATABASE_URL

# Reset database
dropdb election_guide
createdb election_guide
cd lib/db && pnpm run push
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install

# Regenerate API client
cd lib && pnpm run generate
```

### Tests Failing

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Run with verbose output
pnpm test -- --reporter=verbose
```

## Next Steps

1. **Read Documentation**
   - See [README.md](./README.md) for architecture overview
   - See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines

2. **Deploy**
   - For Render: See [RENDER.md](./RENDER.md)
   - For Docker: See [docker-compose.yml](./docker-compose.yml)

3. **Learn the Codebase**
   - Explore `artifacts/election-guide/src/` for frontend code
   - Explore `artifacts/api-server/src/` for backend code
   - Check `lib/` for shared libraries

4. **Start Contributing**
   - Create a feature branch
   - Make your changes
   - Write tests
   - Submit a pull request

## Support

- **Issues**: https://github.com/gintama1018/PROMPT-WARS-ONLINE/issues
- **Discussions**: https://github.com/gintama1018/PROMPT-WARS-ONLINE/discussions
- **Security**: security@prompt-wars-election-guide.dev

---

Happy coding! 🚀
