import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { matches } from "./matches";
import { user } from "./auth";

export const games = pgTable("games", {
  id: text("id").$default(() => crypto.randomUUID()).primaryKey(),
  matchId: text("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  gameNumber: integer("game_number").notNull(), // 1, 2, 3, etc.
  player1Score: integer("player1_score").notNull(),
  player2Score: integer("player2_score").notNull(),
  winnerId: text("winner_id")
    .notNull()
    .references(() => user.id),
});
