import { z } from "zod";
import { CommodityStockDataSchema } from "./commodityStockData";

export const StorageDataSchema = z.object({
  stocks: z.array(CommodityStockDataSchema),
});

export type StorageData = z.infer<typeof StorageDataSchema>;
