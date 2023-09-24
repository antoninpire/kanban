/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { bigint, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";

export const session = mysqlTable("user_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 25,
  }).notNull(),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
  email: varchar("email", { length: 128 }),
});
