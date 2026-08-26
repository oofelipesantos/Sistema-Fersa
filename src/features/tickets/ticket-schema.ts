import { z } from "zod";

export const ticketSchema = z.object({
  productId: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().min(10).max(2000),
  equipment: z.string().max(120).optional(),
  serialNumber: z.string().max(120).optional(),
  lot: z.string().max(120).optional(),
  hours: z.number().nonnegative().optional(),
  quantity: z.number().positive().optional(),
  country: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
