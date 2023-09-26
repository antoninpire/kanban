/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations, type InferSelectModel } from "drizzle-orm";
import { boolean, smallint, timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { tasks } from "./tasks";

export const subTasks = mysqlTable("sub_tasks", {
  id: varchar("id", { length: 30 })
    .primaryKey()
    .$defaultFn(() => `stsk_${createId()}`),
  title: varchar("title", { length: 75 }).notNull(),
  order: smallint("order").notNull().default(0),
  achieved: boolean("achieved").notNull().default(false),
  taskId: varchar("taskId", {
    length: 30,
  }).notNull(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$defaultFn(() => new Date()),
  createdAt: timestamp("createdAt")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const subTasksRelations = relations(subTasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subTasks.taskId],
    references: [tasks.id],
  }),
}));

export type SubTask = InferSelectModel<typeof subTasks>;
