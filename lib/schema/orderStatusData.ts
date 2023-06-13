import { z } from "zod";
import { ORDER_STATUS } from "../types";

export const OrderStatusDataSchema = z.object({
  date: z.string().min(1).optional(),
  status: z.nativeEnum(ORDER_STATUS),
});

export type OrderStatusData = z.infer<typeof OrderStatusDataSchema>;
