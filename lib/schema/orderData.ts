import { z } from "zod";
import { ORDER_STATUS } from "../types";
import { ProductOrderDataSchema } from "./productOrderData";
import { OrderFileDataSchema } from "./orderFileData";

export const OrderDataSchema = z.object({
  destinationId: z.string().min(1),
  date: z.date().optional(),
  profit: z.number().nullable().optional(),
  status: z.nativeEnum(ORDER_STATUS).optional(),
  files: z.array(OrderFileDataSchema),
  products: z.array(
    ProductOrderDataSchema.omit({ orderId: true }).extend({
      quantity: z.number().min(1),
    })
  ),
});

export const OrderDataCreateSchema = OrderDataSchema.omit({
  files: true,
});

export const OrderDataUpdateSchema = OrderDataCreateSchema.omit({
  products: true,
}).partial();

export type OrderData = z.infer<typeof OrderDataSchema>;
