import { createMatch, updateMatchStatus, getMatchById } from "@/data-access/matches";
import { createGames } from "@/data-access/games";

export type GameScore = {
  player1Score: number;
  player2Score: number;
};

export type CreateMatchInput = {
  player1Id: string;
  player2Id: string;
  playMode: "best_of_3" | "best_of_5" | "single";
  gameScores: GameScore[];
  playedAt: Date;
  createdBy: string;
};

/**
 * Validate a single game score
 */
function validateGameScore(score: GameScore): string | null {
  const { player1Score, player2Score } = score;

  // Both scores must be non-negative
  if (player1Score < 0 || player2Score < 0) {
    return "Scores cannot be negative";
  }

  // Winner must have at least 11 points
  const maxScore = Math.max(player1Score, player2Score);
  if (maxScore < 11) {
    return "Winner must score at least 11 points";
  }

  // Winner must win by at least 2 points
  const scoreDiff = Math.abs(player1Score - player2Score);
  if (scoreDiff < 2) {
    return "Winner must win by at least 2 points";
  }

  // If the score is 11-X, the difference can be anything >= 2
  // If the score goes above 11 (deuce), winner must win by exactly 2
  if (maxScore > 11 && scoreDiff !== 2) {
    return "In deuce situations (>11), winner must win by exactly 2 points";
  }

  return null; // Valid
}

/**
 * Calculate match winner and score from game scores
 */
function calculateMatchResult(
  gameScores: GameScore[],
  player1Id: string,
  player2Id: string
) {
  let player1Wins = 0;
  let player2Wins = 0;

  for (const score of gameScores) {
    if (score.player1Score > score.player2Score) {
      player1Wins++;
    } else {
      player2Wins++;
    }
  }

  const winnerId = player1Wins > player2Wins ? player1Id : player2Id;
  const matchScore = `${player1Wins}-${player2Wins}`;

  return { winnerId, matchScore };
}

/**
 * Validate play mode matches game count
 */
function validatePlayMode(
  playMode: "best_of_3" | "best_of_5" | "single",
  gameCount: number
): string | null {
  if (playMode === "single") {
    if (gameCount !== 1) {
      return "Single game mode must have exactly 1 game";
    }
  } else if (playMode === "best_of_3") {
    if (gameCount < 2 || gameCount > 3) {
      return "Best of 3 must have 2-3 games";
    }
  } else if (playMode === "best_of_5") {
    if (gameCount < 3 || gameCount > 5) {
      return "Best of 5 must have 3-5 games";
    }
  }
  return null;
}

/**
 * Record a new match with game scores
 */
export async function recordMatch(input: CreateMatchInput) {
  const { player1Id, player2Id, playMode, gameScores, playedAt, createdBy } = input;

  // Validation: Players must be different
  if (player1Id === player2Id) {
    throw new Error("Cannot create a match with the same player");
  }

  // Validation: Must have at least one game
  if (gameScores.length === 0) {
    throw new Error("Match must have at least one game");
  }

  // Validation: Play mode must match game count
  const playModeError = validatePlayMode(playMode, gameScores.length);
  if (playModeError) {
    throw new Error(playModeError);
  }

  // Validation: All game scores must be valid
  for (let i = 0; i < gameScores.length; i++) {
    const error = validateGameScore(gameScores[i]);
    if (error) {
      throw new Error(`Game ${i + 1}: ${error}`);
    }
  }

  // Calculate match winner and score
  const { winnerId, matchScore } = calculateMatchResult(gameScores, player1Id, player2Id);

  // Create the match
  const match = await createMatch({
    player1Id,
    player2Id,
    winnerId,
    playMode,
    status: "pending",
    matchScore,
    playedAt,
    createdBy,
  });

  // Create all games
  const gamesData = gameScores.map((score, index) => ({
    matchId: match.id,
    gameNumber: index + 1,
    player1Score: score.player1Score,
    player2Score: score.player2Score,
    winnerId: score.player1Score > score.player2Score ? player1Id : player2Id,
  }));

  await createGames(gamesData);

  // Return the created match
  return await getMatchById(match.id);
}

/**
 * Confirm a match (opponent approval)
 */
export async function confirmMatch(matchId: string, userId: string) {
  const match = await getMatchById(matchId);

  if (!match) {
    throw new Error("Match not found");
  }

  if (match.status !== "pending") {
    throw new Error("Match is not pending");
  }

  // Only the opponent can confirm (not the creator)
  if (match.createdBy === userId) {
    throw new Error("You cannot confirm your own match");
  }

  // User must be a player in the match
  if (match.player1Id !== userId && match.player2Id !== userId) {
    throw new Error("You are not a player in this match");
  }

  return await updateMatchStatus(matchId, "confirmed", userId);
}

/**
 * Reject a match (opponent rejection)
 */
export async function rejectMatch(matchId: string, userId: string) {
  const match = await getMatchById(matchId);

  if (!match) {
    throw new Error("Match not found");
  }

  if (match.status !== "pending") {
    throw new Error("Match is not pending");
  }

  // Only the opponent can reject (not the creator)
  if (match.createdBy === userId) {
    throw new Error("You cannot reject your own match");
  }

  // User must be a player in the match
  if (match.player1Id !== userId && match.player2Id !== userId) {
    throw new Error("You are not a player in this match");
  }

  return await updateMatchStatus(matchId, "rejected", userId);
}
