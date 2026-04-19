# 🎮 GameLog

A full-stack Letterboxd-inspired web app for tracking, rating, and reviewing video games.

**Built with:** Next.js 14 · Prisma · PostgreSQL · NextAuth · Tailwind CSS

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech) / [Supabase](https://supabase.com) for free cloud)
- npm or pnpm

### 1. Install dependencies

```bash
cd gamelog
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gamelog"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
# Push the Prisma schema to your database
npm run db:push

# Seed with sample games, users, and reviews
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live!

### Demo Accounts

After seeding, three accounts are ready to use:

| Email | Password | Profile |
|-------|----------|---------|
| `playerone@gamelog.dev` | `password123` | Souls-like fan |
| `questmaster@gamelog.dev` | `password123` | RPG completionist |
| `indiegem@gamelog.dev` | `password123` | Indie game lover |

---

## Project Structure

```
gamelog/
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Sample data (12 games, reviews, users)
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & Register pages
│   │   ├── games/             # Game browser & detail pages
│   │   │   └── [id]/
│   │   ├── users/[username]/  # User profiles
│   │   ├── lists/             # Game lists (browse, create, detail)
│   │   ├── diary/             # Personal game diary
│   │   ├── search/            # Search page
│   │   ├── profile/           # Profile settings
│   │   └── api/               # All API routes
│   │       ├── auth/
│   │       ├── games/
│   │       ├── reviews/
│   │       ├── lists/
│   │       ├── users/
│   │       ├── feed/
│   │       └── diary/
│   ├── components/
│   │   ├── layout/            # Navbar, SessionProvider
│   │   ├── ui/                # Avatar, StarRating, Modal
│   │   ├── game/              # GameCard, GameGrid, AddToListButton, DiaryButton
│   │   ├── review/            # ReviewCard, ReviewForm
│   │   ├── list/              # ListCard, RemoveFromListButton
│   │   ├── feed/              # ActivityFeed
│   │   ├── user/              # FollowButton
│   │   └── search/            # SearchInput
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # NextAuth config + helpers
│   │   └── utils.ts           # Shared utilities
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── hooks/
│   │   └── useDebounce.ts
│   └── middleware.ts          # Route protection
```

---

## Features

### ✅ Implemented

- **Auth** — Sign up, login, logout (credentials-based with bcrypt)
- **Games** — Browse with genre/tag filters, detailed game pages
- **Reviews** — Write, edit, delete reviews with 1–5 star ratings (spoiler toggle)
- **Rating system** — Per-game average rating (auto-recalculated)
- **Likes** — Like/unlike reviews
- **Game Diary** — Log play sessions with dates, hours, completion status
- **Lists** — Create curated lists, add/remove games, public/private
- **Social** — Follow/unfollow users
- **Activity Feed** — See friends' recent reviews on the home page
- **User Profiles** — Stats, reviews, lists
- **Search** — Full-text search across games and users
- **Notifications** — Basic notifications for follows and review likes
- **Dark theme** — Sleek dark UI throughout
- **Responsive** — Mobile-first design

---

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel settings
4. Set `DATABASE_URL` to a production PostgreSQL URL (e.g., [Neon](https://neon.tech))
5. Run `npm run db:push && npm run db:seed` once against production DB

---

## Scaling Considerations

### Performance
- Add Redis caching for game pages and leaderboards (`upstash/redis`)
- Use `next/image` with a CDN (Cloudinary) for game covers
- Add cursor-based pagination for feeds and reviews
- Database connection pooling with PgBouncer (critical for serverless)

### Features to Add
- **RAWG API integration** — Pull real game data (50K+ games)
- **Cloudinary uploads** — Direct avatar image uploads
- **Real-time notifications** — Pusher or Server-Sent Events
- **Comment threads** — Nested comments on reviews
- **Game recommendations** — Based on rated games
- **Import from Steam** — Auto-populate diary from Steam play history
- **Year in Review** — Annual recap of your gaming year
- **Global leaderboard** — Top reviewers, top-rated games by genre

---

## Monetization Ideas

| Strategy | Implementation |
|----------|---------------|
| **GameLog Pro** | Private lists, advanced stats, custom themes |
| **Affiliate links** — | Link to Steam/GOG/PSN for game purchases |
| **API access** — | Rate-limited free tier, paid tiers for developers |
| **Sponsored lists** — | "Staff picks" promoted by publishers |
| **Merchandise** — | "Based on my GameLog" community store |

---

## Tech Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js App Router | Server Components reduce JS bundle, RSC for data fetching |
| Prisma ORM | Type-safe queries, great migration tooling |
| JWT sessions | Stateless auth works well with edge/serverless |
| Tailwind CSS | Zero-runtime CSS, consistent design tokens |
| bcryptjs | Industry standard password hashing |

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Sync schema to DB (no migration files)
npm run db:migrate   # Create migration files (production)
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio GUI
npm run db:generate  # Regenerate Prisma client
```
