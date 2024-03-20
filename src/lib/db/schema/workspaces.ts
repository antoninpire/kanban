/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { workspacesByUsers } from "./workspaces-by-users";

export const workspaces = sqliteTable("workspaces", {
  id: text("id", { length: 28 })
    .primaryKey()
    .$defaultFn(() => `ws_${createId()}`),
  name: text("name", { length: 75 }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  projects: many(projects),
  usersByWorkspace: many(workspacesByUsers),
}));
