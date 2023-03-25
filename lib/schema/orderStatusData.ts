import { z } from "zod";
import { ORDER_STATUS } from "../types";

export const OrderStatusDataSchema = z.object({
  date: z.date().optional(),
  status: z.nativeEnum(ORDER_STATUS),
});

export type OrderStatusData = z.infer<typeof OrderStatusDataSchema>;
