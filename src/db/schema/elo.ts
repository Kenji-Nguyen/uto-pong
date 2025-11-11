import { pgTable, text, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { matches } from "./matches";

// ELO History - tracks every ELO change
export const eloHistory = pgTable("elo_history", {
  id: text("id").$default(() => crypto.randomUUID()).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  matchId: text("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  eloBefore: integer("elo_before").notNull(),
  eloAfter: integer("elo_after").notNull(),
  eloChange: integer("elo_change").notNull(),
  kFactor: integer("k_factor").notNull(), // 48 for provisional, 24 for standard
  diminishingFactor: decimal("diminishing_factor", { precision: 3, scale: 2 }).notNull(), // 1.0, 0.8, 0.6, etc.
  isProvisional: boolean("is_provisional").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Stats - denormalized for performance
export const userStats = pgTable("user_stats", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id),
  currentElo: integer("current_elo").default(1000).notNull(),
  matchesPlayed: integer("matches_played").default(0).notNull(),
  matchesWon: integer("matches_won").default(0).notNull(),
  matchesLost: integer("matches_lost").default(0).notNull(),
  isProvisional: boolean("is_provisional").default(true).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(), // positive = win streak, negative = loss streak
  bestWinStreak: integer("best_win_streak").default(0).notNull(),
  worstLossStreak: integer("worst_loss_streak").default(0).notNull(),
  lastMatchDate: timestamp("last_match_date"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
