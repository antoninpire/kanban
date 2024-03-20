/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations, sql, type InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { columns } from "./columns";
import { subTasks } from "./sub-tasks";
import { tagsByTasks } from "./tags-by-tasks";

export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id", { length: 30 })
      .primaryKey()
      .$defaultFn(() => `tsk_${createId()}`),
    title: text("title", { length: 75 }).notNull(),
    description: text("description"),
    order: integer("order").notNull().default(0),
    priority: text("priority", { enum: ["low", "medium", "high"] }),
    columnId: text("columnId", { length: 30 }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),

    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    columnIdx: index("column_idx").on(table.columnId),
  })
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
  subTasks: many(subTasks),
  tagsByTask: many(tagsByTasks),
}));

export type Task = InferSelectModel<typeof tasks>;
