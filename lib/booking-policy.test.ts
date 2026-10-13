import { describe, expect, it } from "vitest";
import { bookingPolicy } from "./booking-policy";

describe("confirmed booking policy", () => {
  it("keeps the villa and hotel rooms as separate inventory", () => {
    expect(bookingPolicy.inventory).toBe("separate");
  });

  it("collects a 30 percent advance and treats prices as GST-inclusive", () => {
    expect(bookingPolicy.advancePercent).toBe(30);
    expect(bookingPolicy.pricesIncludeGst).toBe(true);
  });

  it("treats Friday and Saturday nights as the weekend", () => {
    expect(bookingPolicy.weekendNights).toEqual([5, 6]);
  });
});