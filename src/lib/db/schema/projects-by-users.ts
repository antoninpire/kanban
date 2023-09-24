/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations } from "drizzle-orm";
import {
  mysqlEnum,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { projects } from "./projects";
import { users } from "./users";

export const projectsByUsers = mysqlTable(
  "projects-by-users",
  {
    userId: varchar("userId", { length: 64 }).notNull(),
    projectId: varchar("projectId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    role: mysqlEnum("role", ["OWNER", "MEMBER"]).default("MEMBER"),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.projectId),
  })
);

export const projectsByUsersRelations = relations(
  projectsByUsers,
  ({ one }) => ({
    user: one(users, {
      fields: [projectsByUsers.userId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [projectsByUsers.projectId],
      references: [projects.id],
    }),
  })
);
