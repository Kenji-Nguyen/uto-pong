import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const ranks = pgTable("ranks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Newbie", "Ball Chaser", etc.
  minElo: integer("min_elo").notNull(),
  maxElo: integer("max_elo"), // null for highest rank
  color: text("color"), // hex color code for UI
  badgeIcon: text("badge_icon"), // icon name or SVG path
});
