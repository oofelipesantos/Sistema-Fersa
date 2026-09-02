import { describe, expect, it } from "vitest";
import { positiveIntegerField, ticketSchema } from "./ticket-schema";

describe("positiveIntegerField", () => {
  it.each(["*", "abc", "1.5", "1,5", "-2", "0", "  "])(
    "rejects invalid non-empty integer input %j when required by the scenario",
    (value) => {
      const result = positiveIntegerField.safeParse(value);
      if (value.trim() === "") expect(result.success).toBe(true);
      else expect(result.success).toBe(false);
    }
  );

  it.each(["1", "25", "0003"])("accepts positive integer %s", (value) => {
    expect(positiveIntegerField.safeParse(value).success).toBe(true);
  });
});

describe("ticketSchema", () => {
  const validTicket = {
    productId: "product-f400009",
    categoryId: "vibration",
    description: "The bearing vibrates after the vehicle starts moving.",
    equipment: "Truck",
    serialNumber: "ABC-123",
    lot: "L-10",
    hours: "12",
    quantity: "1",
    country: "Brasil",
    state: "Paraná",
    city: "Curitiba",
    confirmed: true
  };

  it("accepts a valid ticket", () => {
    const result = ticketSchema.safeParse(validTicket);
    expect(
      result.success,
      result.error?.issues.map((issue) => issue.message).join(", ")
    ).toBe(true);
  });

  it("rejects an asterisk in an integer field", () => {
    expect(
      ticketSchema.safeParse({ ...validTicket, quantity: "*" }).success
    ).toBe(false);
  });

  it("rejects submission without explicit confirmation", () => {
    expect(
      ticketSchema.safeParse({ ...validTicket, confirmed: false }).success
    ).toBe(false);
  });
});
