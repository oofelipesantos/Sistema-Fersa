import { z } from "zod";

export const partNumberSchema = z.object({
  partNumber: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/)
});

export type PartNumberValues = z.infer<typeof partNumberSchema>;
