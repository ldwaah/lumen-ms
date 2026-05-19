# Lumen — Learn brighter

An adaptive learning platform inspired by modern micro-learning UX: bite-sized **nuggets**, instant quiz feedback, streaks, XP, and progress analytics.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Prisma 6** + **SQLite** (local dev; swap `DATABASE_URL` for Postgres in production)
- **NextAuth (Auth.js v5)** — email/password credentials
- **Framer Motion** — lesson & quiz transitions
- **Recharts** — learning activity chart

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

Or create a new account via **Sign up**.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:setup` | Migrate DB + seed content |
| `npm run db:seed` | Re-seed only |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

> **pnpm:** If you prefer pnpm, run `pnpm install` then `pnpm dev` — scripts are identical.

## What's included

- **Auth** — login & signup (Century-inspired cream card on dark pattern)
- **My Path** (`/learn`) — greeting, continue learning, recommendations, streak/XP
- **Courses** (`/courses`) — Maths & Biology → courses → nuggets (9 seed nuggets)
- **Nugget player** — content + multiple-choice quiz with instant feedback
- **Progress** (`/progress`) — activity chart, subject mastery, active-day calendar
- **Profile** — account summary & sign out

## Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` — default `file:./dev.db`
- `AUTH_SECRET` — random string for session signing
- `NEXTAUTH_URL` — `http://localhost:3000` in dev

## License

MIT — original content & branding only; not affiliated with CENTURY Tech.
