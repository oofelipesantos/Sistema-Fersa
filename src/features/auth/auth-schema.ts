import { z } from "zod";

const emailSchema = z.string().trim().email().max(254);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128)
});

export const resetPasswordSchema = z.object({ email: emailSchema });

export const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[a-z]/)
  .regex(/[A-Z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);

export function isValidCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;
  const calculateDigit = (base: string, weights: number[]) => {
    const sum = base
      .split("")
      .reduce(
        (total, digit, index) => total + Number(digit) * weights[index],
        0
      );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const first = calculateDigit(
    digits.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  const second = calculateDigit(
    digits.slice(0, 12) + first,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  return digits.endsWith(`${first}${second}`);
}

export const registrationSchema = z
  .object({
    fullName: z.string().trim().min(3).max(120),
    email: emailSchema,
    phone: z
      .string()
      .trim()
      .min(1)
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 15;
      }),
    password: passwordSchema,
    confirmPassword: z.string().min(1).max(128),
    organizationName: z.string().trim().min(2).max(160),
    organizationType: z.enum(["DISTRIBUTOR", "WORKSHOP", "CUSTOMER"]),
    taxDocument: z
      .string()
      .trim()
      .min(8)
      .max(30)
      .regex(/^[\p{L}\p{N}./\-\s]+$/u),
    country: z.string().trim().min(2).max(80),
    acceptedTerms: z.boolean().refine(Boolean)
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "PASSWORDS_DO_NOT_MATCH"
      });
    }
    if (
      ["brasil", "brazil"].includes(values.country.trim().toLowerCase()) &&
      !isValidCnpj(values.taxDocument)
    ) {
      context.addIssue({
        code: "custom",
        path: ["taxDocument"],
        message: "INVALID_TAX_DOCUMENT"
      });
    }
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type RegistrationValues = z.infer<typeof registrationSchema>;

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1).max(128)
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "PASSWORDS_DO_NOT_MATCH"
  });

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
