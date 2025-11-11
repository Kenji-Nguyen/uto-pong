# Uto Pong - Setup Documentation

This document tracks what has been set up and how to work with the project.

---

## Current Status

**Phase:** Milestone 1 - Project Setup & Authentication (In Progress)

**Completed:**
- ✅ Next.js 16 project initialized
- ✅ All dependencies installed via pnpm
- ✅ Database schema designed and created
- ✅ Drizzle ORM configured
- ✅ Environment variables configured
- ✅ Project structure defined
- ✅ Documentation created
- ✅ better-auth integration set up
- ✅ Complete folder structure created
- ✅ Database schema pushed to Neon (all tables created)

**Next Steps:**
- ⏳ Build authentication UI (login/signup pages)
- ⏳ Seed initial data (rank tiers)
- ⏳ Create basic layout components
- ⏳ Start Milestone 2 - Match Recording System

---

## Dependencies Installed

All packages installed using **pnpm** (not npm):

### Core Framework
```json
{
  "next": "16.0.1",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "typescript": "^5"
}
```

### Database
```json
{
  "drizzle-orm": "^0.44.7",
  "drizzle-kit": "^0.31.6",
  "@neondatabase/serverless": "^1.0.2",
  "postgres": "^3.4.7"
}
```

### Authentication
```json
{
  "better-auth": "^1.3.34"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "lucide-react": "^0.553.0",
  "@radix-ui/react-slot": "^1.2.4"
}
```

### Utilities
```json
{
  "zod": "^4.1.12",
  "date-fns": "^4.1.0"
}
```

---

## Environment Variables

File: `.env` (already configured)

```bash
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_FxivrKy7owR2@ep-rapid-night-agmwgo6y-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Better Auth
BETTER_AUTH_SECRET="KoJsryqIKPvl3iamk7qmnc5cndNCemYG"
BETTER_AUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Admin Configuration
ADMIN_EMAIL="kenji@maji.studio"
ADMIN_PASSWORD="changeme"

# ELO System (optional overrides)
# ELO_PROVISIONAL_K_FACTOR=48
# ELO_STANDARD_K_FACTOR=24
# ELO_STARTING_RATING=1000
# ELO_PROVISIONAL_MATCHES=5
```

---

## Database Schema

### Tables Created

All schemas are in `src/db/schema/`:

**1. users.ts** - Player accounts
```typescript
{
  id: uuid (PK),
  name: text (unique),
  email: text (unique),
  createdAt: timestamp,
  isAdmin: boolean
}
```

**2. ranks.ts** - Rank tier definitions
```typescript
{
  id: serial (PK),
  name: text,           // "Newbie", "Ball Chaser", etc.
  minElo: integer,
  maxElo: integer,
  color: text,
  badgeIcon: text
}
```

**3. matches.ts** - Match records
```typescript
{
  id: uuid (PK),
  player1Id: uuid (FK → users),
  player2Id: uuid (FK → users),
  winnerId: uuid (FK → users),
  playMode: enum('best_of_3', 'best_of_5', 'single'),
  status: enum('pending', 'confirmed', 'rejected'),
  matchScore: text,     // "2-1"
  playedAt: timestamp,
  createdAt: timestamp,
  createdBy: uuid (FK → users),
  confirmedBy: uuid (FK → users),
  confirmedAt: timestamp
}
```

**4. games.ts** - Individual game scores
```typescript
{
  id: uuid (PK),
  matchId: uuid (FK → matches, cascade delete),
  gameNumber: integer,
  player1Score: integer,
  player2Score: integer,
  winnerId: uuid (FK → users)
}
```

**5. elo.ts** - ELO tracking
```typescript
// elo_history table
{
  id: uuid (PK),
  userId: uuid (FK → users),
  matchId: uuid (FK → matches, cascade delete),
  eloBefore: integer,
  eloAfter: integer,
  eloChange: integer,
  kFactor: integer,          // 48 or 24
  diminishingFactor: decimal, // 1.0, 0.8, 0.6, etc.
  isProvisional: boolean,
  createdAt: timestamp
}

// user_stats table (denormalized)
{
  userId: uuid (PK, FK → users),
  currentElo: integer (default: 1000),
  matchesPlayed: integer,
  matchesWon: integer,
  matchesLost: integer,
  isProvisional: boolean,
  currentStreak: integer,
  bestWinStreak: integer,
  worstLossStreak: integer,
  lastMatchDate: timestamp,
  updatedAt: timestamp
}
```

**6. leaderboard.ts** - Leaderboard snapshots
```typescript
{
  id: uuid (PK),
  userId: uuid (FK → users),
  elo: integer,
  rankPosition: integer,
  snapshotDate: date,
  createdAt: timestamp
}
```

**7. admin.ts** - Audit logs
```typescript
{
  id: uuid (PK),
  adminId: uuid (FK → users),
  actionType: text,
  targetId: uuid,
  details: jsonb,
  createdAt: timestamp
}
```

---

## Project Structure

Follows [webdevcody's architecture](https://github.com/webdevcody/strudel-cookbook/tree/main/src):

```
/
├── drizzle/               # Generated migrations
├── drizzle.config.ts      # Drizzle configuration
├── docs/                  # Documentation
├── .env                   # Environment variables
├── .env.example           # Template
│
└── src/
    ├── app/              # Next.js App Router (✓ Created)
    │   └── api/auth/[...all]/route.ts  # Auth API endpoint
    ├── components/       # UI components (✓ Created)
    │   ├── ui/          # shadcn components
    │   ├── layout/      # Layout components
    │   ├── matches/     # Match components
    │   ├── players/     # Player components
    │   └── leaderboard/ # Leaderboard components
    ├── db/               # Database (✓ Created)
    │   ├── index.ts     # DB connection
    │   └── schema/      # Drizzle schemas (8 files)
    ├── data-access/     # DB queries (✓ Created)
    ├── use-cases/       # Business logic (✓ Created)
    ├── queries/         # TanStack Query (✓ Created)
    ├── hooks/           # React hooks (✓ Created)
    ├── fn/              # Server utilities (✓ Created)
    ├── lib/             # Core utilities (✓ Created)
    │   ├── auth.ts           # better-auth server
    │   ├── auth-client.ts    # better-auth client
    │   └── utils.ts          # shadcn cn() helper
    └── utils/           # Helpers (✓ Created)
```

**Key Files Created:**
- `src/db/index.ts` - Database connection (with schema import)
- `src/db/schema/*.ts` - 8 schema files (auth, users, ranks, matches, games, elo, leaderboard, admin)
- `src/lib/auth.ts` - better-auth server configuration
- `src/lib/auth-client.ts` - better-auth client hooks
- `src/lib/utils.ts` - shadcn cn() helper
- `src/app/api/auth/[...all]/route.ts` - Auth API route handler
- `drizzle.config.ts` - Drizzle config

---

## pnpm Commands

### Development
```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Database
```bash
pnpm db:generate      # Generate migrations from schema
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema directly (faster for dev)
pnpm db:studio        # Open Drizzle Studio GUI
```

### Package Management
```bash
pnpm install          # Install all dependencies
pnpm add [package]    # Add dependency
pnpm add -D [pkg]     # Add dev dependency
pnpm remove [pkg]     # Remove dependency
```

**IMPORTANT:** Always use `pnpm`, not `npm` or `yarn`.

---

## Configuration Files

### drizzle.config.ts
```typescript
{
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
  verbose: true,
  strict: true
}
```

### src/db/index.ts
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
```

### src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Key Decisions Made

### ELO System Configuration
- **Provisional K-factor:** 48 (first 5 matches)
- **Standard K-factor:** 24 (after 5 matches)
- **Starting ELO:** 1000
- **Diminishing returns:** Daily (100%, 80%, 60%, 40%, 20%)

### Match Workflow
- **Confirmation required:** Opponent must confirm matches
- **Status flow:** pending → confirmed → ELO calculated
- **Play modes:** best-of-3, best-of-5, single game

### Design
- **Theme:** Blue/orange color scheme
- **UI Library:** shadcn/ui with Radix UI primitives
- **Mobile-first:** Responsive design priority

### Architecture
- **Pattern:** 3-tier (data-access → use-cases → queries)
- **Database:** PostgreSQL on Neon (free tier)
- **Auth:** better-auth (not NextAuth)
- **State:** TanStack Query (to be installed)

---

## Next Implementation Steps

### ✅ Completed Setup Steps

1. **Better Auth Setup** ✅
   - Created `src/lib/auth.ts` (server config with Drizzle adapter)
   - Created `src/lib/auth-client.ts` (client hooks)
   - Created `src/app/api/auth/[...all]/route.ts` (API handler)
   - Created `src/db/schema/auth.ts` (auth tables)

2. **Folder Structure** ✅
   - All core folders created (components, data-access, use-cases, queries, hooks, fn, utils)
   - Component sub-folders created (ui, layout, matches, players, leaderboard)

3. **Database Schema** ✅
   - Pushed all tables to Neon successfully
   - All foreign keys and constraints created

### 🚀 Ready to Start Building

1. **Build Authentication UI**
   - Create login page (`src/app/login/page.tsx`)
   - Create signup page (`src/app/signup/page.tsx`)
   - Build auth form components

2. **Install Additional Dependencies**
   ```bash
   pnpm add @tanstack/react-query
   pnpm add react-hook-form @hookform/resolvers
   ```

3. **Seed Initial Data**
   - Create seed script for rank tiers
   - Optionally seed test users

4. **Start Milestone 2: Match Recording**
   See `docs/milestones.md` for feature roadmap.

---

## Database Migration

When schema changes:
```bash
# Option 1: Push directly (dev)
pnpm db:push

# Option 2: Generate migration (production)
pnpm db:generate
pnpm db:migrate
```

---

## Troubleshooting

### Database Connection
```bash
# Test connection
pnpm db:studio

# If fails, check:
# 1. DATABASE_URL in .env is correct
# 2. Neon database is running
# 3. Network connection
```

### Type Errors
```bash
# Check all type errors
pnpm build

# Common fixes:
# - Ensure schemas exported in src/db/schema/index.ts
# - Restart TypeScript server in IDE
```

### Package Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Resources

- **Milestone Roadmap:** `docs/milestones.md`
- **AI Quick Reference:** `docs/CLAUDE.md`
- **better-auth Docs:** https://www.better-auth.com/docs/installation
- **Drizzle Docs:** https://orm.drizzle.team/docs/overview
- **webdevcody Structure:** https://github.com/webdevcody/strudel-cookbook/tree/main/src

---

## Project Timeline

**Week 1-2:** Setup + Auth + Match Recording
**Week 3-4:** ELO System + Ranks + Stats
**Week 5-6:** Leaderboard + Polish
**Week 7-8:** Admin Panel + Deployment

Current focus: **Milestone 1 - Setup & Authentication**

---

Last Updated: 2025-11-11
