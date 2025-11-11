import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/fn/guards";
import { recordMatch } from "@/use-cases/matches";
import { getMatches } from "@/data-access/matches";

/**
 * GET /api/matches
 * Get all matches, optionally filtered by status or userId
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as "pending" | "confirmed" | "rejected" | null;
    const userId = searchParams.get("userId");

    const matches = await getMatches({
      status: status || undefined,
      userId: userId || undefined,
    });

    return NextResponse.json({ matches });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/matches
 * Create a new match
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const { player1Id, player2Id, playMode, gameScores, playedAt } = body;

    // Validate required fields
    if (!player1Id || !player2Id || !playMode || !gameScores) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the match
    const match = await recordMatch({
      player1Id,
      player2Id,
      playMode,
      gameScores,
      playedAt: playedAt ? new Date(playedAt) : new Date(),
      createdBy: session.user.id,
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}
