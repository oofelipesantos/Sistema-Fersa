import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function keys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return child && typeof child === "object" && !Array.isArray(child)
        ? keys(child, path)
        : [path];
    }
  );
}

function messages(locale: string) {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), "messages", `${locale}.json`), "utf8")
  ) as unknown;
}

describe("localized UI messages", () => {
  it("keeps pt-BR, es and en keys synchronized", () => {
    const portuguese = keys(messages("pt-BR")).sort();
    expect(keys(messages("es")).sort()).toEqual(portuguese);
    expect(keys(messages("en")).sort()).toEqual(portuguese);
  });
});
