import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const playModeEnum = pgEnum("play_mode", ["best_of_3", "best_of_5", "single"]);
export const matchStatusEnum = pgEnum("match_status", ["pending", "confirmed", "rejected"]);

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  player1Id: uuid("player1_id")
    .notNull()
    .references(() => users.id),
  player2Id: uuid("player2_id")
    .notNull()
    .references(() => users.id),
  winnerId: uuid("winner_id").references(() => users.id),
  playMode: playModeEnum("play_mode").notNull().default("best_of_3"),
  status: matchStatusEnum("status").notNull().default("pending"),
  matchScore: text("match_score"), // e.g., "2-1"
  playedAt: timestamp("played_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  confirmedBy: uuid("confirmed_by").references(() => users.id),
  confirmedAt: timestamp("confirmed_at"),
});
