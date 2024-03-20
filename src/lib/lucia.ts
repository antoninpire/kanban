import { env } from "@/env.mjs";
import { tursoClient } from "@/lib/db";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { github } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";

export const auth = lucia({
  adapter: libsql(tursoClient, {
    key: "auth_keys",
    session: "auth_sessions",
    user: "users",
  }),
  env: process.env.NODE_ENV !== "production" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: (data) => {
    return {
      email: data.email,
    };
  },
});

export const githubAuth = github(auth, {
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  scope: ["user:email"],
});

export type Auth = typeof auth;
