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

export type OrderData = z.infer<typeof OrderDataSchema>;
