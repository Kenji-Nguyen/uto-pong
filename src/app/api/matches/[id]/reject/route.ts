import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/fn/guards";
import { rejectMatch } from "@/use-cases/matches";

/**
 * PATCH /api/matches/[id]/reject
 * Reject a pending match
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const match = await rejectMatch(id, session.user.id);

    return NextResponse.json({ match });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error rejecting match:", error);
    return NextResponse.json(
      { error: "Failed to reject match" },
      { status: 500 }
    );
  }
}
