import { z } from "zod";
import { ProductDataCreateSchema, ProductDataSchema } from "./productData";

export const ProductCategoryDataBaseSchema = z.object({
  name: z.string().min(1),
  dimensions: z.string().min(1),
});

export const ProductCategoryDataSchema = ProductCategoryDataBaseSchema.extend({
  products: z.array(ProductDataSchema),
});

export const ProductCategoryDataCreateSchema =
  ProductCategoryDataBaseSchema.extend({
    products: z.array(ProductDataCreateSchema.omit({ categoryId: true })),
  }).partial({ products: true });

export const ProductCategoryDataUpdateSchema = ProductCategoryDataSchema.omit({
  products: true,
}).partial();

export type ProductCategoryData = z.infer<typeof ProductCategoryDataSchema>;
