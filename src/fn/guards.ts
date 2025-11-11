import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

/**
 * Require authentication for an API route
 * Throws an error if user is not authenticated
 */
export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

/**
 * Require admin access
 * Throws an error if user is not an admin
 */
export async function requireAdmin() {
  const session = await requireAuth();

  // Fetch user from database to get isAdmin field
  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!dbUser || !dbUser.isAdmin) {
    throw new Error("Forbidden: Admin access required");
  }

  return session;
}
