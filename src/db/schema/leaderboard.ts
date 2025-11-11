import { pgTable, text, integer, date, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Leaderboard Snapshots - for tracking rank changes over time
export const leaderboardSnapshots = pgTable("leaderboard_snapshots", {
  id: text("id").$default(() => crypto.randomUUID()).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  elo: integer("elo").notNull(),
  rankPosition: integer("rank_position").notNull(),
  snapshotDate: date("snapshot_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
