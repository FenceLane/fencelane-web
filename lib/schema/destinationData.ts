import { z } from "zod";

export const DestinationDataSchema = z.object({
  country: z.string().min(1),
  address: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
});

export const DestinationDataCreateSchema = DestinationDataSchema;
export const DestinationDataUpdateSchema =
  DestinationDataCreateSchema.partial();

export type DestinationData = z.infer<typeof DestinationDataSchema>;
