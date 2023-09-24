/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { columns } from "./columns";
import { tags } from "./tags";
import { workspaces } from "./workspaces";

export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 28 })
    .primaryKey()
    .$defaultFn(() => `prj_${createId()}`),
  name: varchar("name", { length: 75 }).notNull(),
  workspaceId: varchar("workspaceId", { length: 28 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const projectsRelations = relations(projects, ({ many, one }) => ({
  columns: many(columns),
  tags: many(tags),
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
}));
