# Claude AI Assistant Guide - Uto Pong

Quick reference guide for AI assistants working on this Ping Pong ELO Tracker project.

---

## Project Overview

**Uto Pong** - A Ping Pong ELO rating tracker for a local community.

**Tech Stack:**
- Next.js 16 (App Router)
- TypeScript
- Drizzle ORM + PostgreSQL (Neon)
- better-auth for authentication
- shadcn/ui + Tailwind CSS
- TanStack Query (client state)
- pnpm (package manager)

**Key Features:**
- Match recording with opponent confirmation
- ELO rating system (K=48 provisional, K=24 standard)
- Anti-grinding diminishing returns
- Rank tiers (Newbie → Table Legend)
- Leaderboard & player statistics
- Admin panel

---

## Project Structure

Following [webdevcody's structure](https://github.com/webdevcody/strudel-cookbook/tree/main/src):

```
/
├── drizzle/               # Database migrations (generated)
├── drizzle.config.ts      # Drizzle configuration
├── docs/                  # Project documentation
│   ├── CLAUDE.md         # This file
│   ├── SETUP.md          # Setup guide
│   └── milestones.md     # Development milestones
│
└── src/
    ├── app/              # Next.js App Router
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── api/
    │       └── auth/[...all]/route.ts
    │
    ├── components/       # React UI components
    │   ├── ui/          # shadcn/ui primitives
    │   ├── layout/      # Header, Footer, Nav
    │   ├── matches/     # Match components
    │   ├── players/     # Player components
    │   └── leaderboard/ # Leaderboard components
    │
    ├── db/              # Database layer
    │   ├── index.ts     # DB connection
    │   └── schema/      # Drizzle schemas
    │       ├── index.ts
    │       ├── auth.ts       # better-auth tables
    │       ├── users.ts      # User accounts
    │       ├── matches.ts    # Match records
    │       ├── games.ts      # Game scores
    │       ├── elo.ts        # ELO history + stats
    │       ├── ranks.ts      # Rank tiers
    │       ├── leaderboard.ts # Leaderboard snapshots
    │       └── admin.ts      # Audit logs
    │
    ├── data-access/     # Database queries (LOW LEVEL)
    │   ├── users.ts     # getUserById, createUser, etc.
    │   ├── matches.ts   # getMatchById, createMatch, etc.
    │   ├── games.ts     # Game CRUD operations
    │   └── elo.ts       # ELO queries
    │
    ├── use-cases/       # Business logic (HIGH LEVEL)
    │   ├── matches.ts   # recordMatch, confirmMatch, etc.
    │   ├── players.ts   # createPlayer, updatePlayerStats
    │   └── elo.ts       # calculateEloChange, updateRatings
    │
    ├── queries/         # TanStack Query definitions
    │   ├── matches.ts   # Match query keys + fetchers
    │   ├── players.ts   # Player query keys + fetchers
    │   └── leaderboard.ts
    │
    ├── hooks/           # Custom React hooks
    │   ├── useMatches.ts
    │   ├── usePlayers.ts
    │   ├── useLeaderboard.ts
    │   └── useSession.ts
    │
    ├── fn/              # Server utilities
    │   ├── guards.ts         # Auth guards
    │   ├── middleware.ts     # Request middleware
    │   └── elo-calculator.ts # ELO math
    │
    ├── lib/             # Core utilities
    │   ├── utils.ts          # shadcn cn() helper
    │   ├── auth.ts           # better-auth server
    │   └── auth-client.ts    # better-auth client
    │
    └── utils/           # Helper functions
        ├── date.ts           # Date formatting
        ├── validation.ts     # Zod schemas
        └── constants.ts      # App constants
```

---

## Architectural Patterns

### Data Flow (3-Tier Architecture)

```
Components → Hooks → Queries → Use Cases → Data Access → Database
     ↓         ↓        ↓           ↓            ↓
    UI      React   TanStack   Business      Raw SQL
  Layer     Hooks    Query      Logic       Queries
```

### Layer Responsibilities

**1. data-access/** (Database Layer)
- Direct Drizzle ORM queries
- No business logic
- Returns raw database results
- One file per entity

**2. use-cases/** (Business Logic Layer)
- Orchestrates multiple data-access calls
- Implements business rules
- Transaction management
- Domain workflows

**3. queries/** (Client State Layer)
- TanStack Query definitions
- Caching strategies
- Query keys and fetchers
- Optimistic updates

**4. hooks/** (React Layer)
- Custom React hooks
- Uses queries from queries/
- Component-specific state logic

**5. components/** (Presentation Layer)
- UI components
- No business logic
- Uses hooks for data

---

## Common Tasks

### Adding a New Database Table

1. Create schema in `src/db/schema/[entity].ts`
2. Export from `src/db/schema/index.ts`
3. Run `pnpm db:push` to push to database
4. Create `src/data-access/[entity].ts` for queries
5. Create `src/use-cases/[entity].ts` for business logic (if needed)
6. Create `src/queries/[entity].ts` for TanStack Query
7. Create `src/hooks/use[Entity].ts` for React hook

### Adding a New Feature

1. **Database First:** Add schema if needed
2. **Data Access:** Create raw queries in `data-access/`
3. **Business Logic:** Create use-case functions in `use-cases/`
4. **Client State:** Define queries in `queries/`
5. **React Hook:** Create hook in `hooks/`
6. **UI:** Build components in `components/`
7. **Route:** Add page in `app/[feature]/page.tsx`

### Adding a New API Endpoint

1. Create route in `app/api/[endpoint]/route.ts`
2. Import use-cases (not data-access directly)
3. Add auth guards if needed
4. Return JSON responses
5. Handle errors properly

---

## Code Standards

### Package Manager
- **ALWAYS use pnpm** (not npm or yarn)
- Install: `pnpm add [package]`
- Dev install: `pnpm add -D [package]`

### File Naming
- Components: `PascalCase.tsx` (e.g., `MatchCard.tsx`)
- Utilities: `kebab-case.ts` (e.g., `elo-calculator.ts`)
- Hooks: `useCamelCase.ts` (e.g., `useMatches.ts`)
- One file per entity in data-access/, queries/, etc.

### Import Patterns
```typescript
// Good: Use path aliases
import { db } from "@/db";
import { getUserById } from "@/data-access/users";
import { cn } from "@/lib/utils";

// Bad: Relative imports
import { db } from "../../../db";
```

### Database Queries
```typescript
// data-access/users.ts (LOW LEVEL)
export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id)
  });
}

// use-cases/players.ts (HIGH LEVEL)
export async function getUserWithStats(userId: string) {
  const user = await getUserById(userId);
  const matches = await getUserMatches(userId);
  return { user, stats: calculateStats(matches) };
}
```

### Component Structure
```typescript
// Use shadcn cn() for className merging
import { cn } from "@/lib/utils";

export function MatchCard({ className, ...props }: MatchCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      {/* content */}
    </div>
  );
}
```

---

## Important File Locations

### Database
- Connection: `src/db/index.ts`
- Schemas: `src/db/schema/*`
- Config: `drizzle.config.ts`

### Authentication
- Server: `src/lib/auth.ts`
- Client: `src/lib/auth-client.ts`
- API Route: `src/app/api/auth/[...all]/route.ts`

### Environment
- `.env` - Local environment variables
- `.env.example` - Template

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript config
- `next.config.ts` - Next.js config
- `tailwind.config.ts` - Tailwind config

---

## ELO System Configuration

### K-Factors
- **Provisional (first 5 matches):** K = 48
- **Standard (after 5 matches):** K = 24
- **Starting ELO:** 1000

### Diminishing Returns (per day)
- Match 1: 100% ELO change
- Match 2: 80% ELO change
- Match 3: 60% ELO change
- Match 4: 40% ELO change
- Match 5+: 20% ELO change

Resets at midnight UTC.

### Rank Tiers
```typescript
Newbie       → 0-1099 ELO
Ball Chaser  → 1100-1299 ELO
Spin Doctor  → 1300-1499 ELO
Smash Master → 1500-1699 ELO
Table Legend → 1700+ ELO
```

### ELO Formula
```typescript
Expected Score: E_A = 1 / (1 + 10^((R_B - R_A) / 400))
New Rating: R_A' = R_A + K * Diminishing * (Actual - Expected)
```

---

## Database Schema Key Points

### Match Workflow
1. User creates match → status: `pending`
2. Opponent confirms → status: `confirmed`
3. ELO calculation runs → `elo_history` updated
4. Player stats updated → `user_stats` updated

### Important Tables
- `users` - Player accounts (id, name, email, isAdmin)
- `matches` - Match records with confirmation workflow
- `games` - Individual game scores (e.g., 11-9, 11-7)
- `elo_history` - Every ELO change logged
- `user_stats` - Denormalized player stats (performance)
- `ranks` - Rank tier definitions

### Relations
- Match has 2 players (player1_id, player2_id)
- Match has many games
- Each game has winner_id
- ELO history links to user + match

---

## pnpm Commands Reference

### Development
```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Database
```bash
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema (faster for dev)
pnpm db:studio        # Open Drizzle Studio
```

### Package Management
```bash
pnpm install          # Install dependencies
pnpm add [package]    # Add dependency
pnpm add -D [package] # Add dev dependency
pnpm remove [package] # Remove dependency
```

---

## Authentication Flow

### better-auth Integration
- **Server:** `src/lib/auth.ts` (betterAuth config)
- **Client:** `src/lib/auth-client.ts` (createAuthClient)
- **API:** `src/app/api/auth/[...all]/route.ts` (catch-all route)

### Session Management
```typescript
// Client-side
import { useSession } from "@/lib/auth-client";

function Component() {
  const { data: session } = useSession();
  if (!session) return <LoginForm />;
  return <Dashboard user={session.user} />;
}
```

### Protected Routes
Use guards in `src/fn/guards.ts`:
```typescript
export async function requireAuth() {
  const session = await auth.api.getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (!session.user.isAdmin) throw new Error("Forbidden");
  return session;
}
```

---

## Design System

### Colors (Blue/Orange Theme)
- Primary: Blue shades
- Accent: Orange shades
- Base: shadcn/ui default palette

### Components
- Built with shadcn/ui + Radix UI primitives
- Located in `src/components/ui/`
- Install new components: `npx shadcn@latest add [component]`

---

## Key Principles

1. **Separation of Concerns:** Each layer has one responsibility
2. **Type Safety:** Full TypeScript inference throughout
3. **Testability:** Each layer can be tested independently
4. **Performance:** Denormalized stats, optimized queries
5. **Security:** Auth guards, input validation, SQL injection prevention
6. **Maintainability:** Clear structure, consistent naming

---

## Quick Troubleshooting

### Database Connection Issues
- Check `.env` → `DATABASE_URL` is set
- Verify Neon database is running
- Test connection: `pnpm db:studio`

### Type Errors
- Run `pnpm build` to see all type errors
- Ensure schemas are exported in `src/db/schema/index.ts`
- Check import paths use `@/` alias

### Auth Issues
- Verify `BETTER_AUTH_SECRET` is set
- Check API route is at `app/api/auth/[...all]/route.ts`
- Test session: `GET /api/auth/session`

---

## Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [better-auth](https://www.better-auth.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [webdevcody structure](https://github.com/webdevcody/strudel-cookbook/tree/main/src)

---

## Status

**Current Phase:** Milestone 1 - Project Setup & Authentication

See `docs/milestones.md` for complete development roadmap.
