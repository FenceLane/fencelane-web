import { z } from "zod";
import { CommodityStockDataSchema } from "./commodityStockData";

export const CommodityDataSchema = z.object({
  name: z.string().min(1),
  dimensions: z.string().min(1),
  stocks: z.array(CommodityStockDataSchema),
});

export type CommodityData = z.infer<typeof CommodityDataSchema>;
