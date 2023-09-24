/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "../mysql-table";
import { projects } from "./projects";
import { workspacesByUsers } from "./workspaces-by-users";

export const workspaces = mysqlTable("workspaces", {
  id: varchar("id", { length: 28 })
    .primaryKey()
    .$defaultFn(() => `ws_${createId()}`),
  name: varchar("name", { length: 75 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  projects: many(projects),
  usersByWorkspace: many(workspacesByUsers),
}));
