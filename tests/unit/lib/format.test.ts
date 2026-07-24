import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/lib/format";

describe("formatCurrency", () => {
  it("formats small values normally", () => {
    expect(formatCurrency(500)).toBe("₱5.00");
  });

  it("abbreviates thousands with K", () => {
    expect(formatCurrency(1284300)).toBe("₱12.8K");
    expect(formatCurrency(100000)).toBe("₱1.0K");
  });

  it("abbreviates millions with M", () => {
    expect(formatCurrency(128430000)).toBe("₱1.28M");
    expect(formatCurrency(123456789)).toBe("₱1.23M");
    expect(formatCurrency(100000000)).toBe("₱1.00M");
  });
});
