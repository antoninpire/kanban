/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";

export const authKeys = mysqlTable("auth_keys", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 25,
  }).notNull(),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});
