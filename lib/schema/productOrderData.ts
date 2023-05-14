import { z } from "zod";

export const ProductOrderDataSchema = z.object({
  orderId: z.number(),
  productId: z.string().min(1),
  quantity: z.number().min(0),
  price: z.string().min(1),
  currency: z.string().min(1),
});

export const ProductOrderDataUpdateSchema = ProductOrderDataSchema.omit({
  orderId: true,
  productId: true,
})
  .partial()
  .extend({ productOrderId: z.string().min(1) });
