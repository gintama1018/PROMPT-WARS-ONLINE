# The People's Election Guide

> **Nonpartisan. Transparent. Citizen-first.**
> A civic education platform that demystifies the Indian election process — powered by Google Gemini, built for every citizen.

---

## Table of Contents

- [Mission](#mission)
- [Live Features](#live-features)
- [Architecture Overview](#architecture-overview)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Data Flow: AI Chat (SSE Streaming)](#data-flow-ai-chat-sse-streaming)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Frontend Routing](#frontend-routing)
- [Code Generation Pipeline](#code-generation-pipeline)
- [Environment Variables](#environment-variables)
- [Development Setup](#development-setup)
- [Key Design Decisions](#key-design-decisions)
- [Contributing Guidelines](#contributing-guidelines)

---

## Mission

This tool is built as a **public service**, not a product. It has:

- Zero party colors, logos, or political bias
- Plain language accessible to any literacy level
- Mobile-first responsive design
- No user accounts, no data tracking, no ads
- Official sources only: ECI, nvsp.in, Voter Helpline 1950

---

## Live Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, mission statement, countdown to next election |
| What Is An Election | `/what-is-election` | Types, glossary, Did You Know fact cards |
| Election Timeline | `/timeline` | Interactive step-by-step journey with citizen actions |
| How To Vote | `/how-to-vote` | Eligibility, registration, booth process, VVPAT |
| Your Rights | `/your-rights` | Ballot rights, NOTA, MCC, helplines, bribery guidance |
| Ask The Guide | `/ask-the-guide` | AI chat powered by Google Gemini (SSE streaming) |
| Quiz | `/quiz` | 8 MCQs, instant feedback, shareable score card |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          User's Browser                                  │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │              React + Vite Frontend  (Port 20975)                │   │
│   │                                                                  │   │
│   │   /           /what-is-election   /timeline   /how-to-vote     │   │
│   │   /your-rights    /ask-the-guide (Gemini AI)  /quiz            │   │
│   │                                                                  │   │
│   │   React Query ──► @workspace/api-client-react (generated hooks) │   │
│   │   SSE Streams ──► fetch() + ReadableStream (chat endpoint)      │   │
│   └──────────────────────────┬──────────────────────────────────────┘   │
└─────────────────────────────-│──────────────────────────────────────────┘
                               │  HTTP / SSE  (path-based proxy)
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Replit Reverse Proxy  :80                            │
│                                                                          │
│     /          ──────────────────────────► Election Guide Frontend       │
│     /api/*     ──────────────────────────► API Server  :8080             │
│     /__mockup  ──────────────────────────► Mockup Sandbox  :8081         │
└──────────────────────────────────────────────────────────────────────────┘
                               │
                 /api/*        │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│              Express 5 API Server  (Port 8080)                           │
│                                                                          │
│   ┌─────────────────┐   ┌──────────────────────────────────────────┐   │
│   │   /api/healthz  │   │   /api/gemini/conversations/*            │   │
│   │                 │   │                                          │   │
│   │   Health check  │   │   POST /conversations        ─────────► │   │
│   │   returns       │   │   GET  /conversations        ─────────► │   │
│   │   { status }    │   │   GET  /conversations/:id    ─────────► │──┐ │
│   └─────────────────┘   │   DELETE /conversations/:id  ─────────► │  │ │
│                          │   GET  /conversations/:id/messages ───► │  │ │
│                          │   POST /conversations/:id/messages ───► │  │ │
│                          │        └── SSE stream (Gemini)          │  │ │
│                          └──────────────────────────────────────────┘  │ │
└──────────────────────────────────────────────────────────────────────── ─│─┘
           │  Drizzle ORM                                              │
           ▼                                                           ▼
┌────────────────────┐                                   ┌────────────────────────┐
│   PostgreSQL DB    │                                   │  Google Gemini API     │
│                    │                                   │  (via Replit AI        │
│  conversations     │                                   │   Integrations proxy)  │
│  messages          │                                   │                        │
│                    │                                   │  Model: gemini-2.5-    │
│                    │                                   │  flash (streaming)     │
└────────────────────┘                                   └────────────────────────┘
```

---

## Monorepo Structure

```
workspace/
├── artifacts/
│   ├── election-guide/          # React + Vite frontend
│   │   ├── src/
│   │   │   ├── pages/           # 7 page components
│   │   │   ├── components/      # shadcn/ui + layout
│   │   │   ├── App.tsx          # Router (wouter)
│   │   │   └── main.tsx         # React entry point
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── api-server/              # Express 5 backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── gemini/      # AI chat endpoints
│       │   │   └── health/      # /api/healthz
│       │   ├── lib/
│       │   │   └── logger.ts    # pino structured logging
│       │   ├── app.ts           # Express setup, middleware
│       │   └── index.ts         # Server boot
│       ├── build.mjs            # esbuild bundler config
│       └── package.json
│
├── lib/
│   ├── api-spec/                # Single source of truth: OpenAPI YAML
│   │   ├── openapi.yaml         # Contract definition
│   │   └── orval.config.ts      # Codegen configuration
│   │
│   ├── api-client-react/        # GENERATED: React Query hooks
│   │   └── src/generated/api.ts
│   │
│   ├── api-zod/                 # GENERATED: Zod validation schemas
│   │   └── src/generated/api.ts
│   │
│   ├── db/                      # Drizzle ORM schema + client
│   │   └── src/schema/
│   │       ├── conversations.ts
│   │       └── messages.ts
│   │
│   └── integrations-gemini-ai/  # Gemini SDK wrapper
│       └── src/
│           ├── client.ts        # GoogleGenAI client (env-validated)
│           ├── batch/           # Rate-limited batch utilities
│           └── image/           # Image generation helper
│
├── pnpm-workspace.yaml          # Workspace + catalog pins
├── tsconfig.base.json           # Shared TS strict config
└── tsconfig.json                # Solution file for composite libs
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite 7 | UI framework |
| **Routing** | wouter | Lightweight client-side routing |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Components** | shadcn/ui | Accessible component library |
| **Animations** | Framer Motion | Page transitions + chat animations |
| **Data Fetching** | TanStack React Query v5 | Server state + caching |
| **API Layer** | Express 5 | HTTP server (async error auto-forward) |
| **AI** | Google Gemini 2.5 Flash | Chat completions with SSE streaming |
| **Database** | PostgreSQL + Drizzle ORM | Typed queries, schema migrations |
| **Validation** | Zod (via Orval codegen) | Request/response validation |
| **Logging** | pino + pino-http | Structured JSON logging, request correlation |
| **Bundler** | esbuild | Fast server bundle |
| **Monorepo** | pnpm workspaces | Shared libs, catalog version pins |
| **Type Safety** | TypeScript 5.9 (strict) | End-to-end type checking |
| **Codegen** | Orval | OpenAPI → React Query hooks + Zod schemas |

---

## Data Flow: AI Chat (SSE Streaming)

```
User types message and presses Send
             │
             ▼
┌────────────────────────────────────────────────────────────────────┐
│  AskTheGuide Page (React)                                         │
│                                                                    │
│  1. Optimistic UI update:                                         │
│     queryClient.setQueryData(...)  ──► User message appears       │
│                                         immediately in UI         │
│                                                                    │
│  2. SSE fetch (NOT React Query — streaming endpoint):             │
│     fetch(`/api/gemini/conversations/${id}/messages`, {           │
│       method: "POST",                                             │
│       body: JSON.stringify({ content: userMessage })              │
│     })                                                            │
└────────────────────────────────────────────────────────────────────┘
             │
             │  POST /api/gemini/conversations/:id/messages
             ▼
┌────────────────────────────────────────────────────────────────────┐
│  API Server — POST /gemini/conversations/:id/messages             │
│                                                                    │
│  1. Validate params (Zod: SendGeminiMessageParams)                │
│  2. Validate body   (Zod: SendGeminiMessageBody)                  │
│  3. Save user message → DB (messages table)                       │
│  4. Load full conversation history from DB                        │
│  5. Map roles: "assistant" → "model"  (Gemini requirement)       │
│  6. Set SSE response headers:                                     │
│       Content-Type: text/event-stream                             │
│       Cache-Control: no-cache                                     │
│       Connection: keep-alive                                      │
│  7. Call ai.models.generateContentStream(...)                     │
└────────────────────────────────────────────────────────────────────┘
             │
             │  Streaming request
             ▼
┌────────────────────────────────────────────────────────────────────┐
│  Google Gemini 2.5 Flash (via Replit AI Integrations proxy)       │
│                                                                    │
│  System instruction: Nonpartisan civic assistant (EN)             │
│  Max output tokens: 8192                                          │
└────────────────────────────────────────────────────────────────────┘
             │
             │  Streamed text chunks
             ▼
┌────────────────────────────────────────────────────────────────────┐
│  API Server — streaming loop                                      │
│                                                                    │
│  for await (chunk of stream) {                                    │
│    fullResponse += chunk.text                                     │
│    res.write(`data: {"content": "..."}\n\n`)  ──► Browser        │
│  }                                                                │
│                                                                    │
│  After loop:                                                      │
│  → Save complete assistant message to DB                          │
│  → res.write(`data: {"done": true}\n\n`)                          │
│  → res.end()                                                      │
└────────────────────────────────────────────────────────────────────┘
             │
             │  SSE chunks arrive in real time
             ▼
┌────────────────────────────────────────────────────────────────────┐
│  React Frontend — ReadableStream reader                           │
│                                                                    │
│  reader = response.body.getReader()                               │
│                                                                    │
│  while (true) {                                                   │
│    const { done, value } = await reader.read()                    │
│    parse chunk → JSON → if (parsed.content) setStreamContent(...) │
│  }                                                                │
│                                                                    │
│  Typing indicator shows until first chunk arrives.                │
│  Text streams in character-by-character in the UI.               │
│  On { done: true } → invalidate React Query cache                │
│                       (refetches full conversation from DB)       │
└────────────────────────────────────────────────────────────────────┘
```

---

## API Reference

Base URL: `/api`

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/healthz` | Server health check |

### Gemini Chat

| Method | Path | Body / Params | Response |
|--------|------|---------------|----------|
| `GET` | `/gemini/conversations` | — | `GeminiConversation[]` |
| `POST` | `/gemini/conversations` | `{ title: string }` | `GeminiConversation` (201) |
| `GET` | `/gemini/conversations/:id` | — | `GeminiConversationWithMessages` |
| `DELETE` | `/gemini/conversations/:id` | — | 204 No Content |
| `GET` | `/gemini/conversations/:id/messages` | — | `GeminiMessage[]` |
| `POST` | `/gemini/conversations/:id/messages` | `{ content: string }` | `text/event-stream` SSE |

### SSE Event Format

```
data: {"content": "partial text chunk"}   ← repeated for each token
data: {"content": "..."}
data: {"done": true}                      ← stream complete, save to DB
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────┐
│  conversations                                       │
│─────────────────────────────────────────────────────│
│  id         SERIAL PRIMARY KEY                       │
│  title      TEXT NOT NULL                            │
│  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL       │
└─────────────────────────────────┬───────────────────┘
                                  │ 1
                                  │
                                  │ N (ON DELETE CASCADE)
                                  ▼
┌─────────────────────────────────────────────────────┐
│  messages                                            │
│─────────────────────────────────────────────────────│
│  id              SERIAL PRIMARY KEY                  │
│  conversation_id INTEGER NOT NULL → conversations.id │
│  role            TEXT NOT NULL  ("user" | "assistant")│
│  content         TEXT NOT NULL                       │
│  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL  │
└─────────────────────────────────────────────────────┘
```

Each conversation is a continuous chat session. Messages are stored in order and replayed as history to Gemini on each new message, so the AI has full context of the conversation.

---

## Frontend Routing

```
App.tsx (wouter Router)
│
├── /                      → Home.tsx
│   ├── Hero section
│   ├── Election countdown
│   └── 4 quick-access tiles
│
├── /what-is-election      → WhatIsElection.tsx
│   ├── Election types accordion
│   ├── Glossary (EVM, NOTA, Constituency...)
│   └── Did You Know fact cards
│
├── /timeline              → Timeline.tsx
│   ├── Step selector (left panel)
│   └── Step detail (right panel)
│       Steps: Announced → Voter List → Nomination →
│              Campaigning → Silence Period →
│              Voting Day → Counting → Results
│
├── /how-to-vote           → HowToVote.tsx
│   ├── Eligibility checker
│   ├── Step-by-step voting guide
│   ├── What to bring / Booth process
│   └── VVPAT explanation
│
├── /your-rights           → YourRights.tsx
│   ├── Right cards (secret ballot, NOTA, MCC...)
│   ├── Helpline numbers
│   └── Bribery guidance
│
├── /ask-the-guide         → AskTheGuide.tsx
│   ├── Conversation list + New Chat button
│   ├── Quick-reply chips
│   └── ChatInterface (SSE streaming)
│
├── /quiz                  → Quiz.tsx
│   ├── 8 MCQs (shuffled on replay)
│   ├── Instant per-question feedback
│   └── Score card with share text
│
└── *                      → NotFound.tsx
```

---

## Code Generation Pipeline

The entire API contract flows from a single source of truth:

```
lib/api-spec/openapi.yaml
         │
         │  pnpm --filter @workspace/api-spec run codegen
         │  (Orval v8)
         │
         ├──────────────────────────────────────────────────────┐
         ▼                                                      ▼
lib/api-client-react/                               lib/api-zod/
src/generated/api.ts                                src/generated/api.ts
         │                                                      │
         │  React Query hooks                                   │  Zod schemas
         │  useListGeminiConversations()                        │  SendGeminiMessageBody
         │  useCreateGeminiConversation()                       │  GetGeminiConversationParams
         │  useGetGeminiConversation(id)                        │  ListGeminiMessagesResponse
         │  useDeleteGeminiConversation()                       │  ...
         │  useListGeminiMessages(id)                           │
         ▼                                                      ▼
   artifacts/election-guide                       artifacts/api-server
   (imported as @workspace/api-client-react)      (imported as @workspace/api-zod)
```

**Rule:** Never hand-write types or hooks that codegen already produces. Always edit `openapi.yaml` first, then regenerate.

---

## Environment Variables

| Variable | Set By | Used In | Purpose |
|----------|--------|---------|---------|
| `DATABASE_URL` | Replit PostgreSQL | `lib/db` | Primary DB connection string |
| `PGHOST` | Replit PostgreSQL | Drizzle | DB host |
| `PGPORT` | Replit PostgreSQL | Drizzle | DB port |
| `PGUSER` | Replit PostgreSQL | Drizzle | DB user |
| `PGPASSWORD` | Replit PostgreSQL | Drizzle | DB password |
| `PGDATABASE` | Replit PostgreSQL | Drizzle | DB name |
| `AI_INTEGRATIONS_GEMINI_BASE_URL` | Replit AI Integrations | `integrations-gemini-ai` | Gemini proxy URL |
| `AI_INTEGRATIONS_GEMINI_API_KEY` | Replit AI Integrations | `integrations-gemini-ai` | Proxy auth key (auto-provisioned) |
| `SESSION_SECRET` | Manually set | (reserved) | Session signing |
| `PORT` | Replit Workflow | API Server / Frontend | Service port (auto-assigned) |
| `NODE_ENV` | Workflow command | Logger | `development` uses pino-pretty |

No secrets are ever hardcoded. All env vars are provisioned by Replit and injected at runtime.

---

## Development Setup

### Prerequisites

- Node.js 24+
- pnpm 10+
- PostgreSQL (provisioned via Replit, or a local instance with `DATABASE_URL` set)

### Steps

```bash
# 1. Install all workspace dependencies
pnpm install --no-frozen-lockfile

# 2. Push DB schema (creates conversations and messages tables)
pnpm --filter @workspace/db run push

# 3. Start the API server (dev mode with auto-rebuild)
#    Runs on the port defined by the PORT env var (default: 8080)
pnpm --filter @workspace/api-server run dev

# 4. Start the frontend (separate terminal)
#    Runs on the port defined by PORT (default: 20975)
pnpm --filter @workspace/election-guide run dev

# 5. (Optional) Regenerate API hooks after changing openapi.yaml
pnpm --filter @workspace/api-spec run codegen

# 6. Full typecheck across all packages
pnpm run typecheck
```

### Adding a New API Endpoint

1. Add path + schema to `lib/api-spec/openapi.yaml`
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. Implement the route in `artifacts/api-server/src/routes/`
4. Mount the router in `artifacts/api-server/src/routes/index.ts`
5. Use the generated hook in the frontend (`@workspace/api-client-react`)

---

## Key Design Decisions

### 1. Contract-First API Design
The OpenAPI spec in `lib/api-spec/openapi.yaml` is the single source of truth. All types, hooks, and validation schemas are generated from it via Orval. This eliminates drift between frontend expectations and backend contracts.

### 2. SSE over WebSockets for Streaming
The Gemini chat uses Server-Sent Events (SSE) over a standard HTTP POST. SSE is simpler than WebSockets for unidirectional server-to-client streaming, works through standard HTTP/2 proxies, and doesn't require connection upgrade negotiation. The tradeoff: `EventSource` only supports GET, so streaming is handled manually with `fetch` + `ReadableStream`.

### 3. Optimistic UI Updates
When a user sends a chat message, their message appears in the UI immediately (before the server confirms it) via `queryClient.setQueryData`. This removes the perception of latency. Once the SSE stream completes, the cache is invalidated and the canonical DB-backed data is fetched.

### 4. Nonpartisan System Prompt — Locked at the Server
The Gemini system instruction is defined only in the API server and never exposed to the client. This prevents any client-side manipulation of the AI's political stance. The AI is hardcoded to redirect all party/candidate questions to `eci.gov.in`.

### 5. Message History as Context
Every request to Gemini includes the full conversation history from the database, not just the latest message. This gives the AI contextual awareness across turns without requiring stateful server connections.

### 6. Pino Structured Logging
All server logs use pino with request correlation IDs. In development, `pino-pretty` formats them for readability. In production, raw JSON is emitted for log aggregation tools. `console.log` is banned from server code.

### 7. Zero User Data Storage
The app stores only chat messages (by session choice). There are no user accounts, no login, no cookies beyond session scope. Citizens can use the guide anonymously.

---

## Contributing Guidelines

- **Edit the spec first.** Any new endpoint starts in `openapi.yaml`, not in a route file.
- **No `console.log` in server code.** Use `req.log` inside handlers, `logger` outside.
- **No hand-written types for generated schemas.** Run codegen, use what it exports.
- **Keep routes thin.** Validate → query → respond. Business logic goes in `src/lib/`.
- **Mobile-first CSS.** Every new component must work at 375px wide before scaling up.
- **Strictly nonpartisan.** Any content changes to the AI system prompt must be reviewed.

---

## License

This project is built as a public civic resource. Use, fork, and adapt freely to serve democratic education in your community.

---

*Built for the Google AI competition. Powered by Google Gemini.*
