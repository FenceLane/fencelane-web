import { z } from "zod";
import { EVENT_VISIBILITY } from "../types";

export const EventDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  orderId: z.number().optional(),
  visibility: z.nativeEnum(EVENT_VISIBILITY).optional(),
});

export type EventDataCreate = z.infer<typeof EventDataSchema>;
export const EventDataUpdateSchema = EventDataSchema.partial();
