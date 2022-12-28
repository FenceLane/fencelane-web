import { z } from "zod";

export const PasswordResetFormPasswordDataSchema = z.object({
  password: z.string().min(1),
  token: z.string().min(1),
});

export type PasswordResetFormPasswordData = z.infer<
  typeof PasswordResetFormPasswordDataSchema
>;
