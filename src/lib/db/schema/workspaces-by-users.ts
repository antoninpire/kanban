/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const workspacesByUsers = sqliteTable(
  "workspaces-by-users",
  {
    userId: text("userId", { length: 25 }).notNull(),
    workspaceId: text("workspaceId", { length: 28 }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    role: text("role", { enum: ["OWNER", "MEMBER"] }).default("MEMBER"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.workspaceId],
    }),
  })
);

export const workspacesByUsersRelations = relations(
  workspacesByUsers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspacesByUsers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspacesByUsers.userId],
      references: [users.id],
    }),
  })
);
