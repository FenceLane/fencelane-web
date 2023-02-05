import { z } from "zod";
import { ORDER_STATUS } from "../types";
import { ProductOrderDataSchema } from "./productOrderData";

export const OrderDataSchema = z.object({
  clientId: z.string().min(1),
  destinationId: z.string().min(1),
  date: z.date(),
  status: z.nativeEnum(ORDER_STATUS),
  files: z.array(z.string()),
  price: z.number(),
  orders: z.array(ProductOrderDataSchema),
});

export type OrderData = z.infer<typeof OrderDataSchema>;
