import { z } from "zod";

export const TransportCostDataSchema = z.object({
  price: z.string().min(1),
  currency: z.string().min(1),
  orderId: z.number().min(0),
});

export const TransportCostDataCreateSchema = TransportCostDataSchema.omit({
  orderId: true,
});

export const TransportCostDataUpdateSchema =
  TransportCostDataCreateSchema.partial();

export type TransportCostData = z.infer<typeof TransportCostDataSchema>;
