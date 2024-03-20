/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const authSessions = sqliteTable("auth_sessions", {
  id: text("id", {
    length: 128,
  }).primaryKey(),
  userId: text("user_id", {
    length: 25,
  }).notNull(),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
  email: text("email", { length: 128 }),
});
