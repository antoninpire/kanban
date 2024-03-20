/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations, sql, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { tasks } from "./tasks";

export const tags = sqliteTable("tags", {
  id: text("id", { length: 30 })
    .primaryKey()
    .$defaultFn(() => `tag_${createId()}`),
  label: text("label", { length: 15 }).notNull(),
  color: text("color", { length: 7 }).notNull(),
  projectId: text("projectId", { length: 28 }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
  project: one(projects, {
    fields: [tags.projectId],
    references: [projects.id],
  }),
  tasksByTag: many(tasks),
}));

export type Tag = InferSelectModel<typeof tags>;
