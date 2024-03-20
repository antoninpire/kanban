/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { workspacesByUsers } from "./workspaces-by-users";

export const users = sqliteTable("users", {
  id: text("id", {
    length: 25,
  }).primaryKey(),
  email: text("email", { length: 128 }).unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  workspacesByUser: many(workspacesByUsers),
}));
