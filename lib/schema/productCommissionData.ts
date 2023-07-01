import { z } from "zod";

export const ProductCommissionDataSchema = z.object({
  commissionId: z.number(),
  productId: z.string().min(1),
  quantity: z.number().min(0),
});

export const ProductCommissionDataUpdateSchema =
  ProductCommissionDataSchema.omit({
    commissionId: true,
    productId: true,
  })
    .partial()
    .extend({ productCommissionId: z.string().min(1) });
