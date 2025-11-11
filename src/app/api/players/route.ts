import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allPlayers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
      })
      .from(user)
      .orderBy(desc(user.createdAt));

    return NextResponse.json(allPlayers);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
