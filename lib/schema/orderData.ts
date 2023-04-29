import { z } from "zod";
import { ORDER_STATUS } from "../types";
import { ProductOrderDataSchema } from "./productOrderData";

export const OrderDataSchema = z.object({
  clientId: z.string().min(1),
  destinationId: z.string().min(1),
  date: z.date().optional(),
  profit: z.number().optional(),
  status: z.nativeEnum(ORDER_STATUS).optional(),
  files: z.array(z.string()).optional(),
  products: z.array(ProductOrderDataSchema.omit({ orderId: true })),
});

export const OrderDataUpdateSchema = OrderDataSchema.omit({
  products: true,
}).partial();

export type OrderData = z.infer<typeof OrderDataSchema>;
