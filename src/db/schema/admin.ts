import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Admin Audit Logs - track all admin actions
export const adminLogs = pgTable("admin_logs", {
  id: text("id").$default(() => crypto.randomUUID()).primaryKey(),
  adminId: text("admin_id")
    .notNull()
    .references(() => user.id),
  actionType: text("action_type").notNull(), // 'create_player', 'delete_match', 'reset_elo', etc.
  targetId: text("target_id"), // ID of affected entity (user, match, etc.)
  details: jsonb("details"), // Additional context about the action
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
