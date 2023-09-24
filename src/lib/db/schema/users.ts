/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations } from "drizzle-orm";
import { varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { projectsByUsers } from "./projects-by-users";

export const users = mysqlTable("auth_user", {
  id: varchar("id", {
    length: 25,
  }).primaryKey(),
  email: varchar("email", { length: 128 }).unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projectsByUser: many(projectsByUsers),
}));
