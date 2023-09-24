/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { tasks } from "./tasks";

export const subTasks = mysqlTable("subTasks", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 75 }).notNull(),
  order: smallint("order").notNull().default(0),
  achieved: boolean("achieved").notNull().default(false),
  taskId: int("taskId").notNull(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const subTasksRelations = relations(subTasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subTasks.taskId],
    references: [tasks.id],
  }),
}));
