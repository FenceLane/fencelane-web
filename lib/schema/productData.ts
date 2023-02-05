import { z } from "zod";
import { PRODUCT_VARIANT } from "../types";
import { ProductOrderDataSchema } from "./productOrderData";

export const ProductDataSchema = z.object({
  categoryId: z.string().min(1),
  stock: z.number().min(0),
  variant: z.nativeEnum(PRODUCT_VARIANT),
  orders: z.array(ProductOrderDataSchema),
});

export const ProductDataCreateSchema = ProductDataSchema.omit({ orders: true });

export type ProductData = z.infer<typeof ProductDataSchema>;
export type ProductDataCreate = z.infer<typeof ProductDataCreateSchema>;
