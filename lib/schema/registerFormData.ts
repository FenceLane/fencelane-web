import { z } from "zod";

export const RegisterFormDataSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
});

export type RegisterFormData = z.infer<typeof RegisterFormDataSchema>;
