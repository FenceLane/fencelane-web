import { z } from "zod";

export const LoginFormDataSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginFormData = z.infer<typeof LoginFormDataSchema>;
