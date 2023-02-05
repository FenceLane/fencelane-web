import { z } from "zod";
import { ProductDataSchema } from "./productData";

export const ProductCategoryDataSchema = z.object({
  name: z.string().min(1),
  dimensions: z.string().min(1),
  products: z.array(ProductDataSchema),
});

export const ProductCategoryDataCreateSchema = ProductCategoryDataSchema.omit({
  products: true,
});
export type ProductCategoryData = z.infer<typeof ProductCategoryDataSchema>;
