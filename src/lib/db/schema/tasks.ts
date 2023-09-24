/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations } from "drizzle-orm";
import {
  int,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { columns } from "./columns";
import { subTasks } from "./sub-tasks";
import { tags } from "./tags";

export const tasks = mysqlTable("tasks", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 75 }).notNull(),
  description: text("description"),
  order: smallint("order").notNull().default(0),
  columnId: int("columnId").notNull(),
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
