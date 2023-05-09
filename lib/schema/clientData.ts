import { z } from "zod";
import { DestinationDataSchema } from "./destinationData";

export const ClientDataSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  destinations: z.array(DestinationDataSchema),
});

export const ClientDataCreateSchema = ClientDataSchema.omit({
  destinations: true,
});
export const ClientDataUpdateSchema = ClientDataCreateSchema.partial();

export type ClientData = z.infer<typeof ClientDataSchema>;
