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

### 3. Safety & Governance (Protocolo AEGIS)
- **Multi-Tenant Isolation**: Every database query MUST include a filter for `tenant_id`. 
- **RLS (Row Level Security)**: All sensitive tables (Memories, Billing) must have RLS enabled at the DB level.
- **Embeddings**: Only use vector search within the context of a specific `tenant_id` to prevent data leakage.
- **Validation**: Strict use of Zod for all API route protection.
- **Audit**: All destructive actions (DB wipes, configuration changes) must be logged in `@metadata`.

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
---

## 🧠 PROTOCOLO MNEMOSYNE (Memoria a Largo Plazo)
El sistema posee un hipocampo vectorial persistente.
1. **ANTES** de responder a una consulta compleja del usuario, DEBES verificar si existe contexto relevante en la memoria.
2. Utiliza `recallMemories(query)` para buscar información histórica.
3. Si el usuario proporciona información crítica (reglas de negocio, preferencias), utiliza `saveMemory(content)` para persistirla.
4. **IMPORTANTE:** La memoria es segura por diseño (RLS). No necesitas filtrar por tenant_id manualmente; el sistema lo maneja.

**END OF GENOME**
