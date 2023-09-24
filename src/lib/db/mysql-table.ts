import { mysqlTableCreator } from "drizzle-orm/mysql-core";

export const mysqlTable = mysqlTableCreator((name) => `kanban_${name}`);
