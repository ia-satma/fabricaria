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

## Design System: Cyber-Industrial
- **Theme**: Dark mode with Slate/Zinc base tones
- **Accent**: Neon Cyan (#00f0ff) for primary actions and highlights
- **Borders**: Brutalist style (border-radius: 0) for industrial look
- **Typography**: JetBrains Mono for headers/data, Inter for body text
- **Cards**: Semi-transparent with glowing cyan borders on hover
- **Buttons**: Uppercase, monospace, with neon glow effects

### CSS Variables (globals.css)
- `--primary`: Neon Cyan accent
- `--background`: Dark slate
- `--neon-glow`: Glow shadow for hover states
- `--radius: 0rem`: Brutalist corners

### Utility Classes
- `.cyber-card`: Card with glowing border
- `.neon-text`: Text with cyan glow
- `.neon-border`: Element with glowing border
- `.cyber-grid`: Background grid pattern

## Recent Changes
- 2026-01-03: Analytics Dashboard added (/analytics) with Recharts visualizations
- 2026-01-03: Create Agent form implemented with Zod validation and Server Actions
- 2026-01-03: Database seeded with 5 test agents, E2E flow verified
- 2026-01-03: Cyber-Industrial theme applied - dark palette, neon cyan accents, brutalist corners
- 2026-01-03: Centralized Agent types in features/agents/types.ts
- 2026-01-02: Initial Replit setup - configured for port 5000, fixed CSS and component issues
