/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations, sql, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tasks } from "./tasks";

export const subTasks = sqliteTable("sub_tasks", {
  id: text("id", { length: 30 })
    .primaryKey()
    .$defaultFn(() => `stsk_${createId()}`),
  title: text("title", { length: 128 }).notNull(),
  order: integer("order").notNull().default(0),
  achieved: integer("achieved", { mode: "boolean" }).notNull().default(false),
  taskId: text("taskId", {
    length: 30,
  }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const subTasksRelations = relations(subTasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subTasks.taskId],
    references: [tasks.id],
  }),
}));

export type SubTask = InferSelectModel<typeof subTasks>;
