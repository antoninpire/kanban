/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations, type InferSelectModel } from "drizzle-orm";
import { int, smallint, timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { projects } from "./projects";
import { tasks } from "./tasks";

export const columns = mysqlTable("columns", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 75 }).notNull(),
  projectId: varchar("projectId", { length: 28 }).notNull(),
  order: smallint("order").notNull().default(0),
  color: varchar("color", { length: 7 }).notNull(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const columnsRelations = relations(columns, ({ one, many }) => ({
  project: one(projects, {
    fields: [columns.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export type Column = InferSelectModel<typeof columns>;
