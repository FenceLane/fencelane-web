import { z } from "zod";
import { CommodityStockStorageDataSchema } from "./commodityStockData";

export const StorageDataSchema = z.object({
  stocks: z.array(CommodityStockStorageDataSchema),
});

export type StorageData = z.infer<typeof StorageDataSchema>;
