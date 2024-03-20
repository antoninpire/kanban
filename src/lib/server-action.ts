import type { Session } from "lucia";
import * as context from "next/headers";
import type { z } from "zod";

import { auth } from "@/lib/lucia";

type Result<TResult> =
  | {
      result: TResult;
      error?: never;
    }
  | {
      result?: never;
      error: string;
    };

export function serverAction<TInput, TOutput = void>(opts: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: z.ZodSchema<TInput, any, any>;
  output?: z.ZodSchema<TOutput>;
  handler: (args: { input: TInput; session: Session }) => Promise<TOutput>;
}): (formData: FormData) => Promise<Result<TOutput>> {
  return async (formData: FormData) => {
    const req: Record<string, unknown> = {};
    formData.forEach((v, k) => {
      req[k] = v;
    });

    // verify input
    const input = opts.input.safeParse(req);
    if (!input.success) {
      return {
        error: input.error.issues?.[0]?.message ?? "Invalid input",
      };
    }

    // verify session
    const authRequest = auth.handleRequest("POST", context);
    const session = await authRequest.validate();

    if (!session) {
      return {
        error: "You must be logged in to do that !",
      };
    }

    try {
      const result = await opts.handler({ input: input.data, session });
      return { result };
    } catch (e) {
      return { error: (e as Error).message };
    }
  };
}
