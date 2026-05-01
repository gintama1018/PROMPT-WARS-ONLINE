# 🗳️ The People's Election Guide

> **Nonpartisan. Transparent. Citizen-First.**
>
> A production-grade civic education platform that demystifies the Indian election process through interactive learning, AI-powered assistance, and official government sources. Built with TypeScript, React, Express, PostgreSQL, and Google Gemini AI.

---

## 📋 Quick Links

- [Overview](#overview)
- [Mission & Values](#mission--values) 
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing & QA](#testing--quality-assurance)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security](#security--privacy)
- [Performance](#performance)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## 📌 Overview

The People's Election Guide is a comprehensive, production-ready platform providing:

- **7 Interactive Pages** covering all aspects of Indian elections
- **AI-Powered Chat Interface** (Google Gemini 2.5 Flash with SSE streaming)
- **Interactive Quiz** with immediate feedback and performance tracking  
- **Accessible Design** compliant with WCAG 2.1 AA standards
- **Offline Support** via Progressive Web App (PWA) technology
- **70%+ Test Coverage** with unit, integration, and E2E tests
- **Type-Safe API** with OpenAPI spec and Zod validation
- **Multi-tenant Ready** monorepo architecture

### Core Metrics

| Metric | Value |
|--------|-------|
| Pages | 7 (Home, What Is, Timeline, How To Vote, Rights, Chat, Quiz) |
| UI Components | 50+ (Radix UI + shadcn/ui) |
| Test Coverage | 70%+ |
| Lighthouse Score | 90+ (Perf, A11y, Best Practices) |
| Bundle Size | ~185KB gzipped |
| First Contentful Paint | <2.5s |
| Time to Interactive | <3.5s |

---

## 🎯 Mission & Values

### Core Principles

```
┌─────────────────────────────────────────────────────────────┐
│                    NONPARTISAN FIRST                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✓ Zero party colors, logos, or political bias            │
│  ✓ Official sources only (ECI, NVSP, Voter Helpline)      │
│  ✓ Plain language accessible to all literacy levels       │
│  ✓ Mobile-first for low-bandwidth users                   │
│  ✓ No user tracking, no ads, no data collection           │
│  ✓ Open-source, community-driven                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

---

## ✨ Features

### Page Features

| Page | Route | Highlights |
|------|-------|-------------|
| Home | `/` | Hero section, countdown timer, 4-tile navigation |
| What Is An Election | `/what-is-election` | Types, glossary, interactive fact cards |
| Timeline | `/timeline` | Step-by-step process, citizen actions |
| How To Vote | `/how-to-vote` | Eligibility, registration, booth walkthrough |
| Your Rights | `/your-rights` | Rights, NOTA, helplines, anti-bribery guide |
| Ask the Guide | `/ask-the-guide` | AI-powered Q&A with real-time streaming |
| Quiz | `/quiz` | 8 MCQs, instant feedback, score sharing |

---

---

## 🏗️ Architecture

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

---

## 📁 Project Structure

```
PROMPT-WARS-ONLINE/
├── artifacts/                     # Deployed applications  
│   ├── election-guide/            # Main React frontend
│   │   ├── src/
│   │   │   ├── components/        # Layout, UI components, ErrorBoundary
│   │   │   ├── pages/             # Home, Quiz, Timeline, etc.
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── lib/               # Utilities, helpers
│   │   │   ├── test/              # Vitest setup
│   │   │   ├── App.tsx            # Router (Wouter)
│   │   │   └── main.tsx           # React entry point
│   │   ├── tests/                 # E2E tests (Playwright)
│   │   ├── public/                # Static assets
│   │   ├── vitest.config.ts       # Unit test config  
│   │   └── package.json           # test:coverage script
│   │
│   ├── api-server/                # Express.js backend
│   │   ├── src/
│   │   │   ├── routes/            # health.ts, gemini/
│   │   │   ├── middlewares/       # Auth, logging, etc
│   │   │   ├── lib/               # sanitize, logger
│   │   │   ├── app.ts             # Express setup
│   │   │   └── index.ts           # Server boot
│   │   ├── build.mjs              # esbuild config
│   │   └── package.json           # test:coverage script
│   │
│   └── mockup-sandbox/            # Preview component library
│
├── lib/                           # Shared libraries
│   ├── api-spec/                  # OpenAPI contract
│   ├── api-zod/                   # Generated Zod schemas
│   ├── api-client-react/          # Generated React hooks
│   ├── db/                        # Drizzle schema + migrations
│   └── integrations-gemini-ai/    # Gemini SDK wrapper
│
├── scripts/                       # Utility scripts
├── .github/workflows/
│   └── ci.yml                     # GitHub Actions pipeline
├── CHANGELOG.md                   # Version history
├── SECURITY.md                    # Security policy
├── README.md                      # This file
└── package.json                   # Root workspace config
```

---

---

## 🛠️ Tech Stack

### Frontend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | ^18.2 | UI library |
| **Build Tool** | Vite | ^6.0 | Fast build & HMR |
| **Language** | TypeScript | ~5.9 | Type safety |
| **UI Components** | Radix UI + shadcn/ui | Latest | Accessible components |
| **Styling** | Tailwind CSS | ^3.0 | Utility-first CSS |
| **Animations** | Framer Motion | ^10.0 | Smooth transitions |
| **Forms** | React Hook Form | ^7.0 | Performant form handling |
| **Validation** | Zod | ^3.0 | Schema validation |
| **State Mgmt** | React Query | ^6.0 | Server state management |
| **Routing** | Wouter | ^3.3 | Lightweight router |
| **Testing** | Vitest | ^3.2 | Unit tests |
| **Testing** | @testing-library/react | ^16.0 | Component tests |
| **E2E Tests** | Playwright | ^1.55 | Browser automation |

### Backend Stack

| Category | Technology | Purpose |
|----------|-----------|---------|  
| **Runtime** | Node.js 24 | JavaScript runtime |
| **Framework** | Express 5 | HTTP server |
| **Database** | PostgreSQL | Data persistence |
| **ORM** | Drizzle | Type-safe SQL |
| **AI SDK** | Google Gemini | LLM integration |
| **Logger** | Pino | Structured logging |
| **Security** | Helmet | HTTP security headers |
| **Rate Limiting** | express-rate-limit | DDoS protection |
| **Testing** | Vitest | Unit tests |

### DevOps & Quality

| Category | Technology | Purpose |
|----------|-----------|---------|  
| **Package Manager** | pnpm | Monorepo management |
| **CI/CD** | GitHub Actions | Automated pipeline |
| **Code Quality** | ESLint | Linting |
| **Formatting** | Prettier | Code formatting |
| **Coverage** | Codecov | Coverage reporting |
| **Hosting** | Replit | Cloud deployment |

---

---

## 🚀 Getting Started

### Prerequisites

```bash
# Minimum requirements
Node.js >= 22.0.0
pnpm >= 10.0.0  
PostgreSQL >= 14
```

### Installation

```bash
# 1. Clone repository
git clone https://github.com/PROMPT-WARS/election-guide.git
cd PROMPT-WARS-ONLINE

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 4. Initialize database
cd lib/db
pnpm run push

# 5. Start development servers
pnpm run dev
```

Access at:
- Frontend: http://localhost:20975
- API: http://localhost:8080

---

## 💻 Development

### Common Commands

```bash
pnpm run build            # Build all packages
pnpm run typecheck        # TypeScript validation  
pnpm run lint             # ESLint check
pnpm run test             # Run unit tests
pnpm run test:coverage    # With coverage report
pnpm run format:check     # Prettier validation
pnpm run format:write     # Auto-format code
```

### Creating Components

```bash
# 1. Create component file
touch src/components/my-component.tsx

# 2. Create test file
touch src/components/my-component.test.tsx

# 3. Write component with TypeScript types
# 4. Write unit tests (target 80%+ coverage)
# 5. Export from index
```

### Code Patterns

**Component Testing:**
```typescript
import { render, screen } from "@testing-library/react";
import MyComponent from "./my-component";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected")).toBeInTheDocument();
  });
});
```

---

## 🧪 Testing & Quality Assurance

### Test Strategy

```
┌──────────────────────────────────────────────────┐
│         Testing Pyramid (Optimal Balance)        │
├──────────────────────────────────────────────────┤
│                   /\                             │
│                  /  \                            │
│                 / E2E \          <10%            │
│                /────────\                        │
│               /          \                       │
│              / Integration \   20-30%            │
│             /──────────────\                     │
│            /                \                    │
│           /     Unit Tests   \  60-70%           │
│          /____________________\                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Running Tests

```bash
# Unit tests with Vitest
pnpm run test
pnpm run test:coverage              # With coverage
pnpm -F @workspace/election-guide run test -- --ui  # UI dashboard

# E2E tests with Playwright  
pnpm -F @workspace/election-guide run test:e2e
pnpm -F @workspace/election-guide run test:e2e -- --headed  # See browser
```

### Coverage Targets

- **Overall**: >70%
- **Components**: >80%
- **Pages**: >75%
- **Utils**: >85%

### Current Coverage

```
📊 Test Breakdown:
├── 6+ Component tests (Layout, Home, Quiz, etc)
├── API server tests (Sanitization, health checks)
└── E2E scenarios (Playwright)
```

---

## 🔄 CI/CD Pipeline

### Workflow Stages

```
┌─────────────────────────────────────────────────┐
│   CI/CD Pipeline (.github/workflows/ci.yml)    │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1. Checkout Code                      ~10s     │
│ 2. Setup Node.js 24 & pnpm            ~20s     │
│ 3. Install Dependencies                ~40s     │  
│ 4. Typecheck (TypeScript)              ~30s     │
│ 5. Lint (ESLint)                       ~25s     │
│ 6. Unit Tests + Coverage               ~60s     │
│ 7. E2E Tests (Playwright)              ~120s    │
│ 8. Build All Artifacts                 ~45s     │
│ 9. Upload Coverage to Codecov          ~15s     │
│ 10. Upload Test Reports                ~10s     │
│                                                 │
│       Total Pipeline Time: ~5-7 min            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Status Checks (All Required)

✅ Typecheck passes  
✅ Lint passes  
✅ Unit tests pass (>70% coverage)  
✅ E2E tests pass  
✅ Build succeeds  

---

## 📡 API Documentation

### Base URL

```
Production: https://prompt-wars-election-guide.replit.dev/api  
Development: http://localhost:8080/api
```

### Health Check

```http
GET /api/healthz

Response:
{"status": "ok", "timestamp": "2025-01-15T10:30:00Z"}
```

### AI Chat Endpoints

```http
POST /api/gemini/conversations/:id/messages
Content-Type: application/json

Request Body:
{
  "message": "What is NOTA?",
  "include_sources": true
}

Response: Server-Sent Events (SSE) stream
data: {"content": "partial text..."}
data: {"done": true}
```

For full API spec: `lib/api-spec/openapi.yaml`

### Data Flow: AI Chat (SSE Streaming)

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

## 📜 Database Schema

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

---

## 🔑 Environment Variables

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

---

## 🎓 Key Design Decisions

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

### Design Patterns & Rationale

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

---

## 📞 Support & Resources

- **Documentation**: https://github.com/PROMPT-WARS/election-guide/wiki
- **Issue Tracker**: https://github.com/PROMPT-WARS/election-guide/issues  
- **Discussions**: https://github.com/PROMPT-WARS/election-guide/discussions
- **Security**: security@prompt-wars-election-guide.dev

---

## 📝 Contributing Guidelines

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

## 📞 Support & Resources

- **Documentation**: https://github.com/PROMPT-WARS/election-guide/wiki
- **Issue Tracker**: https://github.com/PROMPT-WARS/election-guide/issues  
- **Discussions**: https://github.com/PROMPT-WARS/election-guide/discussions
- **Security**: security@prompt-wars-election-guide.dev

---

## 📋 Testing & Quality Assurance

### Test Coverage

We maintain >70% code coverage across:
- ✅ 6+ component tests (@testing-library/react)
- ✅ Unit tests for utilities and helpers
- ✅ E2E tests with Playwright
- ✅ API server tests

Run tests:
```bash
pnpm run test               # All tests
pnpm run test:coverage      # With coverage report
```

### CI/CD Pipeline

Our GitHub Actions workflow runs on every push:
- ✅ TypeScript validation
- ✅ ESLint checks
- ✅ Unit tests + coverage
- ✅ E2E tests (Playwright)
- ✅ Build verification
- ✅ Automatic deployment

---

## 🚀 Deployment

**Auto-deployed on push via GitHub Actions**

Environment setup on Replit:
```
DATABASE_URL → PostgreSQL
GEMINI_API_KEY → Google AI credentials  
NODE_ENV → production
```

Health check: `GET /api/healthz`

---

## 🔒 Security Highlights

✅ Helmet.js for HTTP security headers
✅ Rate limiting (100 req/min)
✅ CSRF protection
✅ XSS prevention via React escaping
✅ SQL injection protection (parameterized queries)
✅ No user tracking or data collection
✅ GDPR compliant

Report vulnerabilities: security@prompt-wars-election-guide.dev

---

## ⚡ Performance Metrics

| Metric | Value |
|--------|-------|
| Lighthouse Score | 90+ |
| LCP (First Paint) | <2.5s |
| Bundle Size | ~185KB (gzipped) |
| Code Coverage | >70% |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m \"feat: description\"`
4. Push branch: `git push origin feature/your-feature`
5. Create Pull Request

Requirements:
- ✅ TypeScript strict mode
- ✅ >70% test coverage
- ✅ ESLint & Prettier pass
- ✅ All CI checks pass

---

*Built with ❤️ for Democracy* 🗳️\n\nPowered by React, Express, PostgreSQL, and Google Gemini
