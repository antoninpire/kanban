/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { columns } from "./columns";
import { tags } from "./tags";
import { workspaces } from "./workspaces";

export const projects = sqliteTable("projects", {
  id: text("id", { length: 28 })
    .primaryKey()
    .$defaultFn(() => `prj_${createId()}`),
  name: text("name", { length: 75 }).notNull(),
  workspaceId: text("workspaceId", { length: 28 }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const projectsRelations = relations(projects, ({ many, one }) => ({
  columns: many(columns),
  tags: many(tags),
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
}));
