import { z } from "zod";

export const EventDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  orderId: z.number(),
});

export const EventUpdateDataSchema = EventDataSchema.partial();
