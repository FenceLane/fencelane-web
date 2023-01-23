import { z } from "zod";
import { ORDER_STATUS } from "../types";
import { CommodityStockOrderDataSchema } from "./commodityStockData";

export const OrderDataSchema = z.object({
  clientId: z.string().min(1),
  destinationId: z.string().min(1),
  date: z.date(),
  status: z.nativeEnum(ORDER_STATUS),
  files: z.array(z.string()),
  paidTransport: z.boolean(),
  paidOrder: z.boolean(),
  price: z.number(),
  stocks: z.array(CommodityStockOrderDataSchema),
});

export const OrderUpdateSchema = z.object({
  clientId: z.string().min(1),
  destinationId: z.string().min(1),
  date: z.date(),
  status: z.nativeEnum(ORDER_STATUS),
  files: z.array(z.string()),
  paidTransport: z.boolean(),
  paidOrder: z.boolean(),
  price: z.number(),
  // we don't want to allow consumer to update order's stocks using this endpoint
  // use PUT: /api/orders/[orderId]/stocks to modify
  // use POST: /api/orders/[orderId]/stocks to add
  // use DELETE: /api/orders/[orderId]/stocks to remove
  // stocks: z.array(CommodityStockOrderDataSchema),
});

export const OrderCreateSchema = OrderDataSchema.extend({
  //id of the storage we want to get stocks from
  storageId: z.string().min(1),
});

export type OrderData = z.infer<typeof OrderDataSchema>;
