import { db } from "@/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

/**
 * Get all games for a specific match
 */
export async function getGamesByMatchId(matchId: string) {
  return await db.query.games.findMany({
    where: eq(games.matchId, matchId),
    orderBy: (games, { asc }) => [asc(games.gameNumber)],
  });
}

/**
 * Create a single game
 */
export async function createGame(data: NewGame) {
  const [game] = await db.insert(games).values(data).returning();
  return game;
}

/**
 * Create multiple games at once
 */
export async function createGames(data: NewGame[]) {
  return await db.insert(games).values(data).returning();
}

/**
 * Delete all games for a match
 */
export async function deleteGamesByMatchId(matchId: string) {
  await db.delete(games).where(eq(games.matchId, matchId));
}
