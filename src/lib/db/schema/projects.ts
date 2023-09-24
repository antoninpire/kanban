/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { relations } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { columns } from "./columns";
import { projectsByUsers } from "./projects-by-users";
import { tags } from "./tags";

export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  usersByProject: many(projectsByUsers),
  columns: many(columns),
  tags: many(tags),
}));
