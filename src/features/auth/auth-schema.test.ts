import { describe, expect, it } from "vitest";
import { isValidCnpj, loginSchema, registrationSchema } from "./auth-schema";

const validRegistration = {
  fullName: "Maria de Souza",
  email: "maria@example.com",
  phone: "+55 11 99999-9999",
  password: "Fersa123!",
  confirmPassword: "Fersa123!",
  organizationName: "Oficina Central",
  organizationType: "WORKSHOP" as const,
  taxDocument: "11.222.333/0001-81",
  country: "Brasil",
  acceptedTerms: true
};

describe("registrationSchema", () => {
  it("accepts a complete valid registration", () => {
    expect(registrationSchema.safeParse(validRegistration).success).toBe(true);
    expect(isValidCnpj(validRegistration.taxDocument)).toBe(true);
  });

  it.each([
    ["invalid email", { email: "maria" }],
    ["incomplete phone", { phone: "1234" }],
    ["weak password", { password: "password", confirmPassword: "password" }],
    ["different passwords", { confirmPassword: "Other123!" }],
    ["short tax document", { taxDocument: "123" }],
    ["invalid CNPJ", { taxDocument: "11.111.111/1111-11" }],
    ["terms not accepted", { acceptedTerms: false }],
    ["empty required field", { fullName: "" }]
  ])("rejects %s", (_label, change) => {
    expect(
      registrationSchema.safeParse({ ...validRegistration, ...change }).success
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("rejects an invalid email and an empty password", () => {
    expect(loginSchema.safeParse({ email: "*", password: "" }).success).toBe(
      false
    );
  });
});
