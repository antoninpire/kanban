import type { z } from "zod";

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
  handler: (args: { input: TInput }) => Promise<TOutput>;
}): (formData: FormData) => Promise<Result<TOutput>> {
  return async (formData: FormData) => {
    const req: Record<string, unknown> = {};
    formData.forEach((v, k) => {
      req[k] = v;
    });

    const input = opts.input.safeParse(req);
    if (!input.success) {
      return {
        error: input.error.issues?.[0]?.message ?? "Invalid input",
      };
    }

    try {
      const result = await opts.handler({ input: input.data });
      return { result };
    } catch (e) {
      return { error: (e as Error).message };
    }
  };
}
