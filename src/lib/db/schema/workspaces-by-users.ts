/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations } from "drizzle-orm";
import {
  mysqlEnum,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const workspacesByUsers = mysqlTable(
  "workspaces-by-users",
  {
    userId: varchar("userId", { length: 25 }).notNull(),
    workspaceId: varchar("workspaceId", { length: 28 }).notNull(),
    createdAt: timestamp("createdAt")
      .notNull()
      .$defaultFn(() => new Date()),
    role: mysqlEnum("role", ["OWNER", "MEMBER"]).default("MEMBER"),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.workspaceId),
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
