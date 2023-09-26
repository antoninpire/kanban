/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations, type InferSelectModel } from "drizzle-orm";
import { smallint, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { columns } from "./columns";
import { subTasks } from "./sub-tasks";
import { tags } from "./tags";

export const tasks = mysqlTable("tasks", {
  id: varchar("id", { length: 30 })
    .primaryKey()
    .$defaultFn(() => `tsk_${createId()}`),
  title: varchar("title", { length: 75 }).notNull(),
  description: text("description"),
  order: smallint("order").notNull().default(0),
  columnId: varchar("columnId", { length: 30 }).notNull(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
  subTasks: many(subTasks),
  tags: many(tags),
}));

export type Task = InferSelectModel<typeof tasks>;
