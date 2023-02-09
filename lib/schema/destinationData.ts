import { z } from "zod";
import { OrderDataSchema } from "./orderData";

export const DestinationDataSchema = z.object({
  country: z.string().min(1),
  address: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  orders: z.array(OrderDataSchema),
});

export type DestinationData = z.infer<typeof DestinationDataSchema>;
