import { z } from "zod";

export const ProductOrderDataSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().min(0),
  price: z.number().min(0),
});
