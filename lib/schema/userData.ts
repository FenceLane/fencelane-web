import { z } from "zod";
import { USER_ROLE } from "../types";

export const UserDataSchema = z.object({
  email: z.string().min(1),
  name: z.string().min(1),
  role: z.nativeEnum(USER_ROLE),
  phone: z.string().min(1),
});

export const UserDataUpdateSchema = UserDataSchema.partial();
