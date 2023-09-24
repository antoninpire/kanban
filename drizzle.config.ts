import "dotenv/config";
import { type Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  tablesFilter: ["kanban_*"],
} satisfies Config;
