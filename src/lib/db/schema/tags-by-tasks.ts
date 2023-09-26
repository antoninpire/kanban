/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations, type InferSelectModel } from "drizzle-orm";
import { int, primaryKey, timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { tags } from "./tags";
import { tasks } from "./tasks";

export const tagsByTasks = mysqlTable(
  "tags-by-tasks",
  {
    tagId: int("tagId").notNull(),
    taskId: varchar("taskId", { length: 30 }).notNull(),
    createdAt: timestamp("createdAt")
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    pk: primaryKey(table.tagId, table.taskId),
  })
);

export const tagsByTasksRelations = relations(tagsByTasks, ({ one }) => ({
  tag: one(tags, {
    fields: [tagsByTasks.tagId],
    references: [tags.id],
  }),
  task: one(tasks, {
    fields: [tagsByTasks.taskId],
    references: [tasks.id],
  }),
}));

export type TagByTask = InferSelectModel<typeof tagsByTasks>;
