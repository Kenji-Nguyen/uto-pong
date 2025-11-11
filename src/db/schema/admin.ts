import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

// Admin Audit Logs - track all admin actions
export const adminLogs = pgTable("admin_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => users.id),
  actionType: text("action_type").notNull(), // 'create_player', 'delete_match', 'reset_elo', etc.
  targetId: uuid("target_id"), // ID of affected entity (user, match, etc.)
  details: jsonb("details"), // Additional context about the action
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
