import { z } from "zod";
import { PRODUCT_VARIANT } from "../types";
import { ProductOrderDataSchema } from "./productOrderData";

export const ProductDataSchema = z.object({
  name: z.string().min(1),
  dimensions: z.string().min(1),
  stock: z.number().min(0),
  variant: z.nativeEnum(PRODUCT_VARIANT),
  itemsPerPackage: z.number().min(1),
  volumePerPackage: z.number().min(0),
  orders: z.array(ProductOrderDataSchema),
});

export const ProductDataCreateSchema = ProductDataSchema.omit({ orders: true });

export const ProductDataUpdateSchema = ProductDataCreateSchema.partial();

export type ProductData = z.infer<typeof ProductDataSchema>;
export type ProductDataCreate = z.infer<typeof ProductDataCreateSchema>;
export type ProductDataUpdate = z.infer<typeof ProductDataUpdateSchema>;
