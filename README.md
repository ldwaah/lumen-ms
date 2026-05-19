# Lumen — Navigate MS with clarity

A hybrid MS coaching platform for people navigating multiple sclerosis: AI coach, symptom & wellness tracker, MS education programs, human coach sessions, and care-team sharing.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Prisma 6** + **SQLite** (local dev; swap `DATABASE_URL` for Postgres in production)
- **NextAuth (Auth.js v5)** — email/password credentials
- **Vercel AI SDK** + OpenAI (optional; mock coach without API key)
- **Recharts** — wellness trends
- **pdf-lib** — care-team PDF export

## Quick start

```bash
cd ~/Projects/lumen
npm install
npm run db:setup    # prisma db push + seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo account

- **Email:** `alex@lumenlearn.app`
- **Password:** `learn123`

Or create a new account via **Sign up** (routes to onboarding).

## Features (MVP)

- **Onboarding** — MS type, diagnosis date, DMT, goals, accessibility prefs
- **Today** (`/today`) — daily check-in, continue program, AI coach prompts
- **AI Coach** (`/coach`) — chat with safety pipeline (crisis, emergency, medication guardrails)
- **Tracker** (`/track`) — check-ins, symptoms, medications, relapses + trends chart
- **Programs** (`/programs`) — First 90 Days, Fatigue Management (nugget engine)
- **Care team** (`/care-team`) — members list + 30-day PDF export
- **Sessions** (`/sessions`) — coach directory + Cal.com stubs (Phase 2)
- **Community** (`/community`) — Phase 2 stub

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:setup` | Migrate DB + seed content |
| `npm run typecheck` | TypeScript check |

## Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` — default `file:./dev.db`
- `AUTH_SECRET` — random string for session signing
- `NEXTAUTH_URL` — `http://localhost:3000` in dev
- `OPENAI_API_KEY` — optional; enables live AI coach

## License

MIT — not affiliated with any MS charity or pharma company. Not medical advice.
