import { z } from "zod";
import { OrderDataSchema } from "./orderData";

export const ClientDataSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  orders: z.array(OrderDataSchema),
});

export type ClientData = z.infer<typeof ClientDataSchema>;
