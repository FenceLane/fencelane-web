import { z } from "zod";
import { ProductDataCreateSchema, ProductDataSchema } from "./productData";

export const ProductCategoryDataSchema = z.object({
  name: z.string().min(1),
  dimensions: z.string().min(1),
  products: z.array(ProductDataSchema),
});

export const ProductCategoryDataCreateSchema = ProductCategoryDataSchema.extend(
  { products: ProductDataCreateSchema.omit({ categoryId: true }) }
).partial({ products: true });

export const ProductCategoryDataUpdateSchema = ProductCategoryDataSchema.omit({
  products: true,
}).partial();

export type ProductCategoryData = z.infer<typeof ProductCategoryDataSchema>;
