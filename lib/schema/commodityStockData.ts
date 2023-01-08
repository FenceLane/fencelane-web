import { z } from "zod";
import { COMMODITY_TYPE } from "../types";

export const CommodityStockDataSchema = z.object({
  type: z.nativeEnum(COMMODITY_TYPE),
  singlePackageVolume: z.number(),
  packagesAmount: z.number(),
  packageSize: z.number(),
  commodityId: z.string().min(1),
});

export const CommodityStockStorageDataSchema = z.object({
  type: z.nativeEnum(COMMODITY_TYPE),
  singlePackageVolume: z.number(),
  packagesAmount: z.number(),
  packageSize: z.number(),
  commodityId: z.string().min(1),
  storageId: z.string().min(1),
  orderId: z.null().optional(),
});

export const CommodityStockOrderDataSchema = z.object({
  type: z.nativeEnum(COMMODITY_TYPE),
  singlePackageVolume: z.number(),
  packagesAmount: z.number(),
  packageSize: z.number(),
  commodityId: z.string().min(1),
  orderId: z.string().min(1),
  storageId: z.null().optional(),
});

export type CommodityStockData = z.infer<typeof CommodityStockDataSchema>;
export type CommodityStockStorageData = z.infer<
  typeof CommodityStockStorageDataSchema
>;
export type CommodityStockOrderData = z.infer<
  typeof CommodityStockOrderDataSchema
>;
