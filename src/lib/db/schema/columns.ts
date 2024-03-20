/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations, sql, type InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { tasks } from "./tasks";

export const columns = sqliteTable(
  "columns",
  {
    id: text("id", { length: 30 })
      .primaryKey()
      .$defaultFn(() => `col_${createId()}`),
    name: text("name", { length: 75 }).notNull(),
    projectId: text("projectId", { length: 28 }).notNull(),
    order: integer("order").notNull().default(0),
    color: text("color", { length: 7 }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    projectIdx: index("columns_project_idx").on(table.projectId),
  })
);

export const columnsRelations = relations(columns, ({ one, many }) => ({
  project: one(projects, {
    fields: [columns.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export type Column = InferSelectModel<typeof columns>;
