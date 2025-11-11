# 🏓 Ping Pong ELO Tracker - Development Milestones

## Overview

This document breaks down the development into feature-by-feature milestones. Each milestone is independently deliverable and testable.

---

## Milestone 1: Project Setup & Authentication

**Goal:** Establish foundation and user authentication system

### Tasks

- [x] Initialize Next.js with App Router and TypeScript _(Done)_
- [x] Install shadcn/ui components _(Done)_
- [ ] Configure blue/orange color theme
- [x] Set up PostgreSQL on Neon (free tier) _(Done)_
- [x] Install and configure Drizzle ORM _(Done)_
- [x] Design database schema _(Done - 8 tables created)_
- [x] Set up better-auth authentication _(Done)_
- [x] Create project folder structure _(Done)_
- [x] Push database schema to Neon _(Done)_
- [x] Implement session management _(Done - via better-auth)_
- [ ] Create simple login page
- [ ] Build player roster/list page

### Database Schema (Initial)

```sql
-- Users table
users (
  id: uuid PRIMARY KEY,
  name: string UNIQUE NOT NULL,
  email: string UNIQUE,
  created_at: timestamp,
  is_admin: boolean DEFAULT false
)

-- Ranks table (reference data)
ranks (
  id: serial PRIMARY KEY,
  name: string NOT NULL,  -- "Newbie", "Ball Chaser", etc.
  min_elo: integer NOT NULL,
  max_elo: integer,
  color: string,
  badge_icon: string
)
```

### Acceptance Criteria

- ⏳ Users can log in with simple authentication (auth configured, UI pending)
- ⏳ Player roster displays all users (pending)
- ✅ Database connection is stable
- ✅ Admin users can be identified (schema ready)
- ✅ Sessions persist across page refreshes (better-auth configured)

### Dependencies

- None (starting point)

---

## Milestone 2: Match Recording System

**Goal:** Enable players to create and record match results with opponent confirmation

### Tasks

- [ ] Create match creation page/form
- [ ] Implement player selection (dropdown/search)
- [ ] Build game-by-game score entry UI
- [ ] Add play mode selector (best-of-3, best-of-5, single game)
- [ ] Implement match backdating (date/time picker)
- [ ] Create match confirmation workflow
  - [ ] Send notification to opponent
  - [ ] Opponent approval/rejection interface
  - [ ] Handle pending matches state
- [ ] Auto-calculate match winner and score
- [ ] Create matches list/history page
- [ ] Build match detail view
- [ ] Add match filtering (by player, date, status)

### Database Schema Extension

```sql
-- Matches table
matches (
  id: uuid PRIMARY KEY,
  player1_id: uuid REFERENCES users(id),
  player2_id: uuid REFERENCES users(id),
  winner_id: uuid REFERENCES users(id),
  play_mode: enum('best_of_3', 'best_of_5', 'single'),
  status: enum('pending', 'confirmed', 'rejected'),
  match_score: string,  -- e.g., "2-1"
  played_at: timestamp,
  created_at: timestamp,
  created_by: uuid REFERENCES users(id),
  confirmed_by: uuid REFERENCES users(id),
  confirmed_at: timestamp
)

-- Games table (individual games within a match)
games (
  id: uuid PRIMARY KEY,
  match_id: uuid REFERENCES matches(id),
  game_number: integer,  -- 1, 2, 3, etc.
  player1_score: integer,
  player2_score: integer,
  winner_id: uuid REFERENCES users(id)
)
```

### UI Components Needed

- Match creation form
- Player selector component
- Game score entry component
- Match card component
- Match confirmation modal
- Pending matches notification badge

### Acceptance Criteria

- ✅ User can create a match in < 30 seconds
- ✅ Opponent receives notification for pending match
- ✅ Opponent can confirm/reject match
- ✅ Only confirmed matches affect ELO
- ✅ Matches can be backdated
- ✅ All play modes work correctly
- ✅ Match history displays chronologically
- ✅ Game scores are validated (11+ points, win by 2)

### Dependencies

- Milestone 1 (authentication, users)

---

## Milestone 3: ELO Calculation Engine

**Goal:** Implement fair, anti-grinding ELO rating system

### Tasks

- [ ] Implement core ELO algorithm
  - [ ] Expected score calculation
  - [ ] Rating adjustment formula
  - [ ] K-factor system (K=48 provisional, K=24 standard)
- [ ] Create provisional period logic (first 5 matches)
- [ ] Build diminishing returns system
  - [ ] Track matches played per day per player
  - [ ] Calculate daily match weight (100%, 80%, 60%, minimal)
  - [ ] Reset counter at midnight UTC
- [ ] Implement ELO update trigger (on match confirmation)
- [ ] Create ELO history tracking
- [ ] Build ELO recalculation function (for admin resets)
- [ ] Add ELO change preview (before confirmation)

### ELO Algorithm Specifications

**Standard ELO Formula:**

```
Expected Score (E_A) = 1 / (1 + 10^((R_B - R_A) / 400))
New Rating (R_A') = R_A + K * (Actual - Expected)
```

**K-Factor Rules:**

- Provisional (first 5 matches): K = 48
- Standard (after 5 matches): K = 24

**Diminishing Returns (Daily):**

- Match 1 of day: 100% ELO change
- Match 2 of day: 80% ELO change
- Match 3 of day: 60% ELO change
- Match 4 of day: 40% ELO change
- Match 5+ of day: 20% ELO change

### Database Schema Extension

```sql
-- ELO History table
elo_history (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  match_id: uuid REFERENCES matches(id),
  elo_before: integer,
  elo_after: integer,
  elo_change: integer,
  k_factor: integer,
  diminishing_factor: decimal,  -- 1.0, 0.8, 0.6, etc.
  is_provisional: boolean,
  created_at: timestamp
)

-- User stats (denormalized for performance)
user_stats (
  user_id: uuid PRIMARY KEY REFERENCES users(id),
  current_elo: integer DEFAULT 1000,
  matches_played: integer DEFAULT 0,
  matches_won: integer DEFAULT 0,
  matches_lost: integer DEFAULT 0,
  is_provisional: boolean DEFAULT true,
  current_streak: integer DEFAULT 0,  -- positive = win streak, negative = loss streak
  best_win_streak: integer DEFAULT 0,
  worst_loss_streak: integer DEFAULT 0,
  last_match_date: timestamp,
  updated_at: timestamp
)
```

### Acceptance Criteria

- ✅ New players start at 1000 ELO
- ✅ First 5 matches use K=48
- ✅ After 5 matches, K=24 is used
- ✅ Diminishing returns apply correctly per day
- ✅ ELO updates happen only on match confirmation
- ✅ ELO history is logged for every match
- ✅ Higher ELO players gain fewer points from lower ELO wins
- ✅ System prevents ELO manipulation through grinding

### Dependencies

- Milestone 2 (match system must be working)

---

## Milestone 4: Ranks & Progression

**Goal:** Visual rank system with progression tracking

### Tasks

- [ ] Define rank tier thresholds
- [ ] Design rank badge icons/graphics
- [ ] Create rank component (displays badge + name)
- [ ] Build rank progress bar component
- [ ] Implement rank calculation logic
- [ ] Add rank up/down notifications
- [ ] Create rank distribution chart
- [ ] Seed ranks table with initial data

### Rank Tiers

```
Newbie          - 0-1099 ELO      (Bronze badge)
Ball Chaser     - 1100-1299 ELO   (Silver badge)
Spin Doctor     - 1300-1499 ELO   (Gold badge)
Smash Master    - 1500-1699 ELO   (Platinum badge)
Table Legend    - 1700+ ELO       (Diamond badge)
```

### UI Components Needed

- Rank badge component
- Rank progress bar
- Rank up animation/notification
- Rank distribution chart (for admin/stats)

### Acceptance Criteria

- ✅ Players see current rank and ELO
- ✅ Progress to next rank is clearly shown
- ✅ Rank badges are visually distinct
- ✅ Rank updates automatically after matches
- ✅ Rank distribution is visible on leaderboard

### Dependencies

- Milestone 3 (ELO must be calculated)

---

## Milestone 5: Statistics & Analytics

**Goal:** Comprehensive player statistics and performance tracking

### Tasks

- [ ] Build player profile page
- [ ] Display core stats (W/L, win %, ELO, rank)
- [ ] Show match history per player
- [ ] Implement head-to-head records
  - [ ] Query for specific opponent matchups
  - [ ] Display win/loss record vs opponent
  - [ ] Show recent matches vs opponent
- [ ] Create streak tracking (current + best/worst)
- [ ] Build recent form visualization (last 10 matches)
- [ ] Implement advanced stats:
  - [ ] Giant Killer badge (beat higher ELO)
  - [ ] Comeback King (won from behind)
  - [ ] Most common scoreline
  - [ ] Best/worst day of week performance
  - [ ] Most active player metric
  - [ ] Upset victories count
- [ ] Create nemesis/favorite opponent stats
- [ ] Build personal stats dashboard ("My Stats" page)

### Advanced Stats Definitions

- **Giant Killer:** Won against opponent with +200 ELO difference
- **Comeback King:** Won a match after losing first game(s)
- **Upset Victory:** Won when expected probability was < 30%
- **Nemesis:** Opponent with worst win rate against (min 3 matches)
- **Favorite Opponent:** Opponent played most frequently

### Database Queries Needed

```sql
-- Head-to-head record
SELECT winner_id, COUNT(*) as wins
FROM matches
WHERE (player1_id = $userId AND player2_id = $opponentId)
   OR (player1_id = $opponentId AND player2_id = $userId)
GROUP BY winner_id;

-- Recent form (last 10)
SELECT * FROM matches
WHERE player1_id = $userId OR player2_id = $userId
ORDER BY played_at DESC
LIMIT 10;

-- Giant Killer achievements
SELECT m.*,
       ABS(e1.elo_before - e2.elo_before) as elo_diff
FROM matches m
JOIN elo_history e1 ON m.winner_id = e1.user_id AND m.id = e1.match_id
JOIN elo_history e2 ON m.id = e2.match_id AND e2.user_id != m.winner_id
WHERE ABS(e1.elo_before - e2.elo_before) >= 200
  AND e1.elo_before < e2.elo_before;
```

### UI Components Needed

- Player profile card
- Stats grid component
- Head-to-head comparison widget
- Form chart (W/L visualization)
- Achievement badges
- Recent matches timeline

### Acceptance Criteria

- ✅ Player profiles show comprehensive stats
- ✅ Head-to-head records are accurate
- ✅ Streaks update in real-time
- ✅ Advanced stats are interesting and accurate
- ✅ Recent form is visually clear
- ✅ Stats load quickly (< 1 second)

### Dependencies

- Milestone 2 (match data)
- Milestone 3 (ELO history)

---

## Milestone 6: Leaderboard

**Goal:** Dynamic, competitive leaderboard display

### Tasks

- [ ] Create leaderboard page
- [ ] Implement ranking algorithm (sorted by ELO)
- [ ] Display rank change indicators (↑↓)
- [ ] Add player search/filter functionality
- [ ] Show rank distribution stats
- [ ] Highlight current user on leaderboard
- [ ] Add pagination for large player lists
- [ ] Create mini-leaderboard widget (top 5)
- [ ] Implement rank change tracking (daily/weekly)

### Leaderboard Features

- Display: Rank, Name, ELO, W/L, Recent Form, Rank Badge
- Sorting: By ELO (default), Win Rate, Matches Played
- Filtering: By rank tier, provisional status
- Rank change: Compare to previous day's position

### Database Schema Extension

```sql
-- Leaderboard snapshots (for tracking rank changes)
leaderboard_snapshots (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  elo: integer,
  rank_position: integer,
  snapshot_date: date,
  created_at: timestamp
)
```

### UI Components Needed

- Leaderboard table component
- Rank change indicator (arrows)
- Search/filter bar
- Pagination controls
- Mini leaderboard widget (for dashboard)

### Acceptance Criteria

- ✅ Leaderboard updates after every match confirmation
- ✅ Rank changes are accurately tracked
- ✅ Current user is highlighted
- ✅ Search finds players quickly
- ✅ Mobile-responsive table layout
- ✅ Shows provisional players distinctly

### Dependencies

- Milestone 3 (ELO system)
- Milestone 4 (ranks)

---

## Milestone 7: Admin Panel

**Goal:** Admin tools for system management

### Tasks

- [ ] Create admin dashboard page
- [ ] Build player management interface
  - [ ] Create new players
  - [ ] Edit player details
  - [ ] Reset player ELO
  - [ ] View player audit logs
- [ ] Build match management interface
  - [ ] View all matches (pending + confirmed)
  - [ ] Edit match details
  - [ ] Delete matches (with ELO recalculation)
  - [ ] Force confirm pending matches
- [ ] Implement system controls
  - [ ] Adjust rank tier thresholds
  - [ ] View system-wide stats
  - [ ] Export data (CSV)
  - [ ] Database health checks
- [ ] Create audit log system
- [ ] Add admin activity tracking

### Admin Features

- Player creation/management
- Match editing/deletion (with cascading ELO recalc)
- Rank threshold adjustments
- System statistics dashboard
- Audit logs (who did what, when)
- Data export functionality

### Database Schema Extension

```sql
-- Admin audit logs
admin_logs (
  id: uuid PRIMARY KEY,
  admin_id: uuid REFERENCES users(id),
  action_type: string,  -- 'create_player', 'delete_match', etc.
  target_id: uuid,  -- ID of affected entity
  details: jsonb,
  created_at: timestamp
)
```

### Security Requirements

- ✅ Only users with is_admin=true can access
- ✅ All admin actions are logged
- ✅ Sensitive operations require confirmation
- ✅ No manual ELO adjustments (system-driven only)

### Acceptance Criteria

- ✅ Admin can create new players
- ✅ Admin can edit/delete matches
- ✅ Match deletion triggers ELO recalculation
- ✅ Admin actions are audited
- ✅ Admin panel is not accessible to regular users
- ✅ System stats are accurate

### Dependencies

- All previous milestones (touches all systems)

---

## Milestone 8: Polish & Deployment

**Goal:** Production-ready application

### Tasks

- [ ] Mobile UX optimization
  - [ ] Test match entry flow on mobile (< 30 sec target)
  - [ ] Optimize touch targets
  - [ ] Improve mobile navigation
  - [ ] Test on various screen sizes
- [ ] Performance optimization
  - [ ] Database query optimization
  - [ ] Add proper indexes
  - [ ] Implement caching strategy
  - [ ] Lazy load components
- [ ] Testing
  - [ ] Test ELO calculations thoroughly
  - [ ] Test diminishing returns with multiple daily matches
  - [ ] Validate provisional period mechanics
  - [ ] Test match confirmation workflow
  - [ ] Security audit (auth, admin access, input validation)
- [ ] Error handling
  - [ ] Add error boundaries
  - [ ] Implement proper error messages
  - [ ] Handle network failures gracefully
- [ ] Deployment
  - [ ] Set up Vercel project
  - [ ] Configure production environment variables
  - [ ] Set up production database (Neon)
  - [ ] Configure domain (if applicable)
  - [ ] Set up monitoring/logging
- [ ] Documentation
  - [ ] User guide (how to use the app)
  - [ ] Admin guide
  - [ ] Update README

### Performance Targets

- Page load: < 2 seconds
- Match creation: < 30 seconds (user action time)
- Leaderboard load: < 1 second
- Database queries: < 100ms average

### Database Indexes Needed

```sql
CREATE INDEX idx_matches_players ON matches(player1_id, player2_id);
CREATE INDEX idx_matches_played_at ON matches(played_at DESC);
CREATE INDEX idx_elo_history_user ON elo_history(user_id, created_at DESC);
CREATE INDEX idx_user_stats_elo ON user_stats(current_elo DESC);
```

### Security Checklist

- ✅ SQL injection prevention (use parameterized queries)
- ✅ XSS prevention (sanitize inputs)
- ✅ CSRF protection (enabled by better-auth)
- ✅ Rate limiting on API routes
- ✅ Input validation on all forms
- ✅ Admin routes properly protected
- ✅ Environment variables secured
- ✅ Database credentials not exposed

### Acceptance Criteria

- ✅ App is fully responsive (mobile + desktop)
- ✅ All core features work in production
- ✅ Performance targets are met
- ✅ Security audit passes
- ✅ No critical bugs in production
- ✅ Documentation is complete
- ✅ App is accessible 24/7

### Dependencies

- All previous milestones

---

## Development Order Recommendation

**Phase 1: Foundation (Week 1-2)**

- Milestone 1: Setup & Auth
- Start Milestone 2: Match system basics

**Phase 2: Core Features (Week 3-4)**

- Complete Milestone 2: Match recording
- Milestone 3: ELO engine
- Milestone 4: Ranks

**Phase 3: User Experience (Week 5-6)**

- Milestone 5: Statistics
- Milestone 6: Leaderboard
- Start Milestone 8: Mobile optimization

**Phase 4: Admin & Launch (Week 7-8)**

- Milestone 7: Admin panel
- Complete Milestone 8: Polish & deploy

---

## Success Metrics

After launch, track these KPIs:

- Average time to record a match (target: < 30 seconds)
- Daily active users
- Matches recorded per day
- User retention (7-day, 30-day)
- Mobile vs desktop usage
- ELO distribution (should be bell curve around 1000)
- Feature usage (which stats are viewed most)

---

## Future Enhancements (Post-MVP)

- Doubles matches support
- Challenge system
- Tournament brackets
- Achievement badges
- Social features (comments, reactions)
- Push notifications
- Match photos
- Export stats to PDF
- Mobile app (React Native)
- Multi-community support
