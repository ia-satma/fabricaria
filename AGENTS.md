# AGENTS.md - GENOME & CONSTITUTION

> **SYSTEM PROMPT / CONTEXT INJECTION**
> This document is the SINGLE SOURCE OF TRUTH for all AI Agents (Replit Ghostwriter, Gemini, etc.) working on this repository. 
> DO NOT DEVIATE from the constraints defined herein.

## @Context (Business & Domain)
**Goal**: Build a high-performance, strictly typed Micro-SaaS Starter Kit ("Fabricaria") that serves as the foundation for future autonomous software factories.
**Vibe**: "Linear-quality". Dark mode default. Minimalist. Fast.
**User Journey**:
1. User lands on a high-converting Landing Page.
2. User authenticates (Auth).
3. User accesses a Dashboard with "Production-Ready" UI components.
4. User subscribes to a plan (Billing).

## @TechStack (Golden Stack - NON-NEGOTIABLE)
- **Framework**: Next.js 14+ (App Router, Server Components).
- **Language**: TypeScript (Strict Mode). NO `any` allowed.
- **Styling**: Tailwind CSS + Shadcn/UI (Radix Primitives).
- **Icons**: Lucide React.
- **Database**: Drizzle ORM + Neon (Serverless Postgres).
- **State**: Server State (TanStack Query) or URL State (Nuqs). Avoid global client stores (Zustand/Redux) unless absolutely necessary.
- **Validation**: Zod for all API inputs and env vars.

## @Rules (governance & Style)
### 1. File Structure (FSD Lite)
- `app/`: Routing layer ONLY. No complex logic.
- `features/`: Domain logic grouped by feature (e.g., `features/auth`, `features/billing`).
- `components/ui/`: Atomic visual primitives (Buttons, Inputs). UNTOUCHABLE implementation details.
- `db/`: Schema and Drizzle client.

### 2. Coding Standards
- **No Barrel Files**: Do not use `index.ts` to re-export modules. Import directly to avoid circular deps and context bloat.
- **Naming**: `kebab-case` for files/folders. `PascalCase` for Components. `camelCase` for functions.
- **Safety**: 
  - NEVER hardcode secrets. Use `process.env`.
  - ALWAYS validate external data with Zod.
- **Components**:
  - Make `className` overridable via `cn()` utility.
  - Use `forwardRef` for atomic components.

## @Flow (Architecture Handover)
### Current State: PHASE 1 (Genesis)
- [x] Scaffolding (Next.js 14 + Tailwind).
- [x] Database Connection (Drizzle + Neon).
- [x] UI Primitives (Shadcn Base).
- [ ] Authentication (NextAuth / Clerk).
- [ ] Billing Integration (Stripe).

### Next Actions for Agent
1. **Explore**: Read `db/schema.ts` to understand the data model.
2. **Build**: Implement features in strictly isolated `features/` folders.
3. **Verify**: Ensure generic components in `components/ui` remain unpolluted by business logic.

---
**END OF GENOME**
