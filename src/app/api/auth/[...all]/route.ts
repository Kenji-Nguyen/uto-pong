import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * better-auth API route handler for Next.js App Router
 *
 * This catch-all route handles all authentication endpoints:
 * - POST /api/auth/sign-in/email - Email/password login
 * - POST /api/auth/sign-up/email - Email/password registration
 * - POST /api/auth/sign-out - Logout
 * - GET /api/auth/session - Get current session
 * - And all other better-auth endpoints
 */
export const { GET, POST } = toNextJsHandler(auth);
