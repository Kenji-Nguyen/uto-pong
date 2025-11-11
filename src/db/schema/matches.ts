import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const playModeEnum = pgEnum("play_mode", ["best_of_3", "best_of_5", "single"]);
export const matchStatusEnum = pgEnum("match_status", ["pending", "confirmed", "rejected"]);

export const matches = pgTable("matches", {
  id: text("id").$default(() => crypto.randomUUID()).primaryKey(),
  player1Id: text("player1_id")
    .notNull()
    .references(() => user.id),
  player2Id: text("player2_id")
    .notNull()
    .references(() => user.id),
  winnerId: text("winner_id").references(() => user.id),
  playMode: playModeEnum("play_mode").notNull().default("best_of_3"),
  status: matchStatusEnum("status").notNull().default("pending"),
  matchScore: text("match_score"), // e.g., "2-1"
  playedAt: timestamp("played_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  confirmedBy: text("confirmed_by").references(() => user.id),
  confirmedAt: timestamp("confirmed_at"),
});
