import { z } from "zod";

export const OrderFileDataSchema = z.object({
  key: z.string().min(1),
  url: z.string().min(1),
  orderId: z.string().min(1),
});
