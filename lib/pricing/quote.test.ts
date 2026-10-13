import { describe, expect, it } from "vitest";
import { rupeesToPaise } from "@/lib/money";
import { stayListings } from "@/lib/rooms";
import { nightKind, quoteStay } from "./quote";

const villa = stayListings.find((stay) => stay.slug === "on-air")!;
const doubleRoom = stayListings.find((stay) => stay.slug === "double-room")!;
const deluxe = stayListings.find((stay) => stay.slug === "deluxe-4-sharing")!;

describe("published night rates", () => {
  it("keeps the On Air villa rates", () => {
    expect(villa.rates).toEqual({
      weekdayPaise: rupeesToPaise(7000),
      weekendPaise: rupeesToPaise(9000),
      holidayPaise: rupeesToPaise(10000),
    });
  });

  it("keeps the double room rates", () => {
    expect(doubleRoom.rates).toEqual({
      weekdayPaise: rupeesToPaise(1800),
      weekendPaise: rupeesToPaise(2000),
      holidayPaise: rupeesToPaise(2200),
    });
  });

  it("keeps the deluxe four-sharing rates", () => {
    expect(deluxe.rates).toEqual({
      weekdayPaise: rupeesToPaise(2500),
      weekendPaise: rupeesToPaise(3000),
      holidayPaise: rupeesToPaise(3500),
    });
  });
});

describe("quoteStay", () => {
  it("charges Friday and Saturday as weekend nights and Sunday as a weekday", () => {
    const quote = quoteStay({
      checkIn: "2026-11-06",
      checkOut: "2026-11-09",
      rates: villa.rates,
    });

    expect(quote.nights.map((night) => night.kind)).toEqual(["weekend", "weekend", "weekday"]);
    expect(quote.totalPaise).toBe(rupeesToPaise(9000 + 9000 + 7000));
    expect(quote.advancePaise).toBe(rupeesToPaise(7500));
    expect(quote.balancePaise).toBe(rupeesToPaise(17500));
  });

  it("uses the holiday rate even when the holiday falls on a weekend", () => {
    const quote = quoteStay({
      checkIn: "2026-11-07",
      checkOut: "2026-11-08",
      rates: deluxe.rates,
      holidayDates: new Set(["2026-11-07"]),
    });

    expect(nightKind("2026-11-07", new Set(["2026-11-07"]))).toBe("holiday");
    expect(quote.totalPaise).toBe(rupeesToPaise(3500));
    expect(quote.advancePaise).toBe(rupeesToPaise(1050));
  });

  it("prices a weekday double room at 1800 including GST", () => {
    const quote = quoteStay({
      checkIn: "2026-11-04",
      checkOut: "2026-11-05",
      rates: doubleRoom.rates,
    });

    expect(quote.nights[0]?.kind).toBe("weekday");
    expect(quote.totalPaise).toBe(rupeesToPaise(1800));
    expect(quote.pricesIncludeGst).toBe(true);
  });

  it("rejects a stay that does not include a night", () => {
    expect(() =>
      quoteStay({
        checkIn: "2026-11-08",
        checkOut: "2026-11-08",
        rates: villa.rates,
      }),
    ).toThrow(/after check-in/);
  });
});
