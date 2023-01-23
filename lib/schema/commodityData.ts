import { z } from "zod";
import {
  CommodityStockOrderDataSchema,
  CommodityStockStorageDataSchema,
} from "./commodityStockData";

export const CommodityDataBaseSchema = z.object({
  name: z.string().min(1),
  dimensions: z.string().min(1),
});

export const CommodityDataSchema = CommodityDataBaseSchema.extend({
  stocks: z.array(
    z.union([CommodityStockOrderDataSchema, CommodityStockStorageDataSchema])
  ),
});

export const CommodityUpdateSchema = z.object({
  name: z.string().min(1),
  dimensions: z.string().min(1),
  stocks: z.array(
    z.union([CommodityStockOrderDataSchema, CommodityStockStorageDataSchema])
  ),
});

export type CommodityData = z.infer<typeof CommodityDataSchema>;
