import { z } from "zod";
import { ProductCommissionDataSchema } from "./productCommissionData";

export const CommissionDataSchema = z.object({
  orderId: z.number().nullable().optional(),
  date: z.string().min(1).optional(),
  products: z.array(
    ProductCommissionDataSchema.omit({ commissionId: true }).extend({
      quantity: z.number().min(1),
    })
  ),
});

export const CommissionDataCreateSchema = CommissionDataSchema;

export const CommissionDataUpdateSchema = CommissionDataCreateSchema.omit({
  products: true,
}).partial();

export type CommissionData = z.infer<typeof CommissionDataSchema>;
