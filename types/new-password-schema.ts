import { z } from "zod";

export const newPasswordSchema = z.object({
  password: z.string().min(8, "Password must be 8 characters long"),
  token: z.string().nullable().optional(),
});
