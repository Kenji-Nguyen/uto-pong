import { pgTable, uuid, integer, date, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

// Leaderboard Snapshots - for tracking rank changes over time
export const leaderboardSnapshots = pgTable("leaderboard_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  elo: integer("elo").notNull(),
  rankPosition: integer("rank_position").notNull(),
  snapshotDate: date("snapshot_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
