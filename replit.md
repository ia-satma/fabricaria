# Fabricaria

## Overview
Fabricaria is a high-performance SaaS infrastructure platform for autonomous factories, built with Next.js 14 and the "Golden Stack" architecture.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Styling**: Tailwind CSS with custom design system
- **Payments**: Stripe integration
- **AI**: Google Generative AI (Gemini)
- **Visual Testing**: Puppeteer

## Project Structure
```
app/                    # Next.js App Router pages
  api/                  # API routes
    billing/            # Stripe billing endpoints
  dashboard/            # Dashboard page
  playground/           # Playground page
components/ui/          # Reusable UI components
db/                     # Database schema and migrations
features/               # Feature modules
  auth/                 # Authentication
  billing/              # Billing/pricing
  chat/                 # AI chat functionality
  dashboard/            # Dashboard components
  memory/               # Agent memory system
lib/                    # Shared utilities
  ai/                   # Gemini AI client
  billing/              # Stripe utilities
  visual/               # Visual snapshot utilities
```

## Development
- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Start**: `npm run start`

## Database
The project uses PostgreSQL with the following tables:
- `tenants` - Multi-tenant organizations
- `users` - User accounts
- `subscriptions` - Stripe subscription data
- `agent_memories` - AI agent memory storage

## Environment Variables
Required secrets:
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `STRIPE_SECRET_KEY` - Stripe API key (for billing)
- `GOOGLE_AI_API_KEY` - Google Gemini API key (for AI features)

## Recent Changes
- 2026-01-02: Initial Replit setup - configured for port 5000, fixed CSS and component issues
