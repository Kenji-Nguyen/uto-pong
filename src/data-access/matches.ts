import { db } from "@/db";
import { matches, games } from "@/db/schema";
import { eq, or, and, desc } from "drizzle-orm";

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

/**
 * Get a match by ID with its games
 */
export async function getMatchById(matchId: string) {
  const match = await db.query.matches.findFirst({
    where: eq(matches.id, matchId),
    with: {
      games: true,
    },
  });
  return match;
}

/**
 * Get all matches, optionally filtered by status
 */
export async function getMatches(filters?: {
  status?: "pending" | "confirmed" | "rejected";
  userId?: string;
}) {
  let query = db.query.matches.findMany({
    orderBy: [desc(matches.playedAt)],
    with: {
      games: true,
    },
  });

  if (filters?.status || filters?.userId) {
    const conditions = [];

    if (filters.status) {
      conditions.push(eq(matches.status, filters.status));
    }

    if (filters.userId) {
      conditions.push(
        or(
          eq(matches.player1Id, filters.userId),
          eq(matches.player2Id, filters.userId)
        )
      );
    }

    query = db.query.matches.findMany({
      where: conditions.length > 1 ? and(...conditions) : conditions[0],
      orderBy: [desc(matches.playedAt)],
      with: {
        games: true,
      },
    });
  }

  return await query;
}

/**
 * Get pending matches for a specific user
 */
export async function getPendingMatchesForUser(userId: string) {
  return await db.query.matches.findMany({
    where: and(
      eq(matches.status, "pending"),
      or(
        eq(matches.player1Id, userId),
        eq(matches.player2Id, userId)
      )
    ),
    orderBy: [desc(matches.createdAt)],
    with: {
      games: true,
    },
  });
}

/**
 * Create a new match
 */
export async function createMatch(data: NewMatch) {
  const [match] = await db.insert(matches).values(data).returning();
  return match;
}

/**
 * Update match status (confirm or reject)
 */
export async function updateMatchStatus(
  matchId: string,
  status: "confirmed" | "rejected",
  confirmedBy: string
) {
  const [match] = await db
    .update(matches)
    .set({
      status,
      confirmedBy,
      confirmedAt: new Date(),
    })
    .where(eq(matches.id, matchId))
    .returning();
  return match;
}

/**
 * Delete a match
 */
export async function deleteMatch(matchId: string) {
  await db.delete(matches).where(eq(matches.id, matchId));
}
