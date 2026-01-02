# AGENTS.md - Protocolo Génesis

## 1. The Vibe (Aesthetics & Philosophy)
This project is an **Opinionated Micro-SaaS Starter Kit**. It aims for the quality of **Linear**, **Raycast**, or **Stripe**.
- **Minimalist & Dark**: Default to dark mode. Use refined grays (Slate), strict typography, and subtle gradients.
- **Fast & Responsive**: Speed is a feature. optimistic UI updates, server components where possible.
- **Strictly Typed**: No `any`. TypeScript strict mode is non-negotiable.

## 2. The Golden Stack (Architecture)
- **Framework**: Next.js 14+ (App Router). `app/` is for routing only.
- **Design System**: Shadcn/UI (Radix Primitives) + Tailwind CSS.
- **Iconography**: Lucide React.
- **Data Layer**: Drizzle ORM + Neon Postgres (Serverless).
- **Structure**: FSD Lite (Feature-Sliced Design).
  - `@/features/*`: Domain logic (e.g., `auth`, `billing`).
  - `@/components/ui/*`: "Dumb" visual atoms.
  - `@/db/*`: Schema and database connection.
  - `@/lib/*`: Utilities (`cn`, `permissions`).

## 3. Rules of Engagement
- **No Barrel Files**: Do not use `index.ts` to re-export modules. Import directly.
- **Environment**: Use `process.env` for secrets. Never hardcode keys.
- **Replit Native**: Respect `replit.nix` and `.replit` configurations.

## 4. Current State
- **Phase**: Genesis (Scaffolding).
- **Focus**: Setting up the "Golden Stack".
