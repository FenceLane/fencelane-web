import { z } from "zod";
import { COMMODITY_TYPE } from "../types";

export const CommodityStockDataSchema = z.object({
  type: z.nativeEnum(COMMODITY_TYPE),
  singlePackageVolume: z.number(),
  packagesAmount: z.number(),
  packageSize: z.number(),
  commodityId: z.string().min(1),
  orderId: z.string().nullable(),
  storageId: z.string().nullable(),
});

export type CommodityStockData = z.infer<typeof CommodityStockDataSchema>;
