import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/env.mjs";
import * as schema from "@/lib/db/schema";

export const tursoClient = createClient({
  url: env.TURSO_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(tursoClient, { schema });
