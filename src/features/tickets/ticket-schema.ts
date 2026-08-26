import { z } from "zod";

export const positiveIntegerField = z
  .string()
  .trim()
  .max(9)
  .refine((value) => value === "" || /^\d+$/.test(value), {
    message: "INTEGER_ONLY"
  })
  .refine((value) => value === "" || Number(value) > 0, {
    message: "POSITIVE_INTEGER_REQUIRED"
  });

const attachmentsSchema = z
  .custom<FileList | undefined>(
    (value) =>
      value === undefined ||
      (typeof value === "object" && value !== null && "length" in value)
  )
  .optional()
  .refine((files) => !files || files.length <= 5, {
    message: "TOO_MANY_FILES"
  })
  .refine(
    (files) =>
      !files ||
      Array.from(files).every((file) => file.size <= 10 * 1024 * 1024),
    { message: "FILE_TOO_LARGE" }
  );

export const ticketSchema = z.object({
  productId: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().min(10).max(2000),
  equipment: z.string().max(120).optional(),
  serialNumber: z.string().max(120).optional(),
  lot: z.string().max(120).optional(),
  hours: positiveIntegerField,
  quantity: positiveIntegerField,
  attachments: attachmentsSchema,
  country: z.string().trim().min(2).max(80),
  state: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  confirmed: z.boolean().refine(Boolean, { message: "CONFIRMATION_REQUIRED" })
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
