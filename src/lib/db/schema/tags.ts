/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations, type InferSelectModel } from "drizzle-orm";
import { int, timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { projects } from "./projects";
import { tasks } from "./tasks";

export const tags = mysqlTable("tags", {
  id: int("id").primaryKey().autoincrement(),
  label: varchar("label", { length: 15 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  projectId: varchar("projectId", { length: 28 }).notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
  project: one(projects, {
    fields: [tags.projectId],
    references: [projects.id],
  }),
  tasksByTag: many(tasks),
}));

export type Tag = InferSelectModel<typeof tags>;
