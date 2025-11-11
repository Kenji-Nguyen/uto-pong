import { pgTable, uuid, integer } from "drizzle-orm/pg-core";
import { matches } from "./matches";
import { users } from "./users";

export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  matchId: uuid("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  gameNumber: integer("game_number").notNull(), // 1, 2, 3, etc.
  player1Score: integer("player1_score").notNull(),
  player2Score: integer("player2_score").notNull(),
  winnerId: uuid("winner_id")
    .notNull()
    .references(() => users.id),
});
