import { z } from "zod";

export const ProductCommissionDataSchema = z.object({
  commissionId: z.number(),
  productId: z.string().min(1),
  quantity: z.number().min(0),
});

export const ProductCommissionDataFillSchema = z.object({
  productCommissionId: z.string().min(1),
  filledQuantity: z.number().min(0),
});
