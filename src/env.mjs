import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    TURSO_URL: z.string().min(1),
    TURSO_AUTH_TOKEN: z.string().min(1),
  },
});
