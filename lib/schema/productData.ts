import { z } from "zod";
import { ProductOrderDataSchema } from "./productOrderData";

export const ProductDataSchema = z.object({
  name: z.string().min(1),
  dimensions: z.string().min(1),
  stock: z.number().min(0),
  orders: z.array(ProductOrderDataSchema),
});

export const ProductDataCreateSchema = ProductDataSchema.omit({ orders: true });

export type ProductData = z.infer<typeof ProductDataSchema>;
export type ProductDataCreate = z.infer<typeof ProductDataCreateSchema>;
