import { describe, expect, it } from "vitest";
import { calculateBill, gstFromInclusive } from "../lib/billing/totals";

describe("inclusive GST bill totals", () => {
  it("backs 5% GST out of a ₹105 price into even CGST and SGST", () => {
    const split = gstFromInclusive(10_500, 500);
    expect(split).toEqual({ taxablePaise: 10_000, gstPaise: 500, cgstPaise: 250, sgstPaise: 250 });
  });

  it("gives the odd paisa to SGST", () => {
    const split = gstFromInclusive(105, 500);
    expect(split.gstPaise).toBe(5);
    expect(split.cgstPaise).toBe(2);
    expect(split.sgstPaise).toBe(3);
    expect(split.taxablePaise + split.cgstPaise + split.sgstPaise).toBe(105);
  });

  it("keeps the payable total equal to taxable value plus both taxes after a mixed-rate discount", () => {
    const totals = calculateBill(
      [
        { unitPricePaise: 10_500, quantity: 1, gstBps: 500 },
        { unitPricePaise: 11_800, quantity: 1, gstBps: 1800 },
      ],
      2230,
    );
    expect(totals.subtotalPaise).toBe(22_300);
    expect(totals.totalPaise).toBe(20_070);
    expect(totals.taxablePaise).toBe(18_000);
    expect(totals.cgstPaise + totals.sgstPaise).toBe(2070);
    expect(totals.taxablePaise + totals.cgstPaise + totals.sgstPaise).toBe(totals.totalPaise);
  });

  it("rejects a discount larger than the bill and a fractional amount", () => {
    expect(() => calculateBill([{ unitPricePaise: 1000, quantity: 1, gstBps: 500 }], 1001)).toThrow(
      /discount exceeds/,
    );
    expect(() => calculateBill([{ unitPricePaise: 10.5, quantity: 1, gstBps: 500 }], 0)).toThrow(
      /integer/,
    );
  });
});
