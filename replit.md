# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Anthropic Claude (via Replit AI Integrations)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Project: The People's Election Guide

A nonpartisan civic education web app that helps Indian citizens understand the election process.

### Artifacts
- `artifacts/election-guide` — React + Vite frontend (served at `/`)
- `artifacts/api-server` — Express 5 API server (served at `/api`)

### Pages
- `/` — Home with countdown
- `/what-is-election` — Election explainer + glossary
- `/timeline` — Interactive election timeline
- `/how-to-vote` — Step-by-step voting guide
- `/your-rights` — Voter rights
- `/ask-the-guide` — AI chat assistant (Claude, SSE streaming)
- `/quiz` — 8-question election knowledge quiz

### Backend Routes
- `GET/POST /api/anthropic/conversations` — manage chat conversations
- `GET/DELETE /api/anthropic/conversations/:id` — single conversation
- `GET/POST /api/anthropic/conversations/:id/messages` — messages (POST streams SSE)

### Database Tables
- `conversations` — chat conversation sessions
- `messages` — individual chat messages
