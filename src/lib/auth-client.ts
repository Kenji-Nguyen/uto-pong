"use client";

import { createAuthClient } from "better-auth/react";

/**
 * better-auth client for React components
 *
 * This provides hooks and methods for client-side authentication:
 * - useSession() - Access current session
 * - signIn.email() - Email/password login
 * - signUp.email() - Email/password registration
 * - signOut() - Logout user
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

/**
 * Convenience exports for common hooks
 */
export const { useSession, signIn, signOut, signUp } = authClient;
