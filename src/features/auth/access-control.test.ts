import { describe, expect, it } from "vitest";
import { getSafeReturnPath } from "./access-control";

describe("getSafeReturnPath", () => {
  it.each([
    "https://evil.example/steal",
    "//evil.example/steal",
    "javascript:alert(1)",
    "data:text/html,bad"
  ])("rejects external or manipulated return URL %s", (value) => {
    expect(getSafeReturnPath(value)).toBe("/");
  });

  it("keeps a local return URL", () => {
    expect(getSafeReturnPath("/tickets/new?product=F400009")).toBe(
      "/tickets/new?product=F400009"
    );
  });
});
