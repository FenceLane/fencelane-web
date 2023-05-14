import { z } from "zod";
import { PRODUCT_EXPANSE } from "../types";

export const ProductOrderExpanseDataSchema = z.object({
  price: z.string().min(1),
  currency: z.string().min(1),
  type: z.nativeEnum(PRODUCT_EXPANSE),
  productOrderId: z.string().min(1),
});

export const ProductOrderExpanseDataUpdateSchema =
  ProductOrderExpanseDataSchema.omit({ productOrderId: true }).partial();
