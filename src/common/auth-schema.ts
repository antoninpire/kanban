import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be at most 255 characters long"),
});
