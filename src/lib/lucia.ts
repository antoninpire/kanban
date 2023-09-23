import { connection } from "@/lib/db";
import { planetscale } from "@lucia-auth/adapter-mysql";
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";

export const auth = lucia({
  adapter: planetscale(connection, {
    key: "kanban_user_key",
    session: "kanban_user_session",
    user: "kanban_auth_user",
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

export type Auth = typeof auth;
