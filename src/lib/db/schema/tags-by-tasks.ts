/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations, sql, type InferSelectModel } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { tags } from "./tags";
import { tasks } from "./tasks";

export const tagsByTasks = sqliteTable(
  "tags-by-tasks",
  {
    tagId: text("tagId", { length: 30 }).notNull(),
    taskId: text("taskId", { length: 30 }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.tagId, table.taskId],
    }),
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
