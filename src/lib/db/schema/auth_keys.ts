/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const authKeys = sqliteTable("auth_keys", {
  id: text("id", {
    length: 255,
  }).primaryKey(),
  userId: text("user_id", {
    length: 25,
  }).notNull(),
  hashedPassword: text("hashed_password", {
    length: 255,
  }),
});
