import { bookingPolicy } from "@/lib/booking-policy";

export type NightKind = "weekday" | "weekend" | "holiday";

export type NightRates = {
  weekdayPaise: number;
  weekendPaise: number;
  holidayPaise: number;
};

export type NightCharge = {
  date: string;
  kind: NightKind;
  amountPaise: number;
};

export type StayQuote = {
  nights: NightCharge[];
  totalPaise: number;
  advancePaise: number;
  balancePaise: number;
  pricesIncludeGst: true;
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Civil date as UTC midnight, so weekday does not depend on the server timezone. */
export function parseStayDate(isoDate: string): number {
  const match = ISO_DATE.exec(isoDate);
  if (!match) throw new Error("Dates must use YYYY-MM-DD");

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);

  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new Error("Invalid date");
  }

  return utc;
}

export function formatStayDate(utc: number): string {
  const date = new Date(utc);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}-${day}`;
}

export function nightsBetween(checkIn: string, checkOut: string): string[] {
  const start = parseStayDate(checkIn);
  const end = parseStayDate(checkOut);
  if (end <= start) throw new Error("Check-out must be after check-in");

  const nights: string[] = [];
  for (let cursor = start; cursor < end; cursor += 86_400_000) {
    nights.push(formatStayDate(cursor));
  }
  return nights;
}

export function nightKind(
  isoDate: string,
  holidayDates: ReadonlySet<string>,
  weekendNights: readonly number[] = bookingPolicy.weekendNights,
): NightKind {
  if (holidayDates.has(isoDate)) return "holiday";
  const day = new Date(parseStayDate(isoDate)).getUTCDay();
  return weekendNights.includes(day) ? "weekend" : "weekday";
}

export function rateForNight(kind: NightKind, rates: NightRates): number {
  if (kind === "holiday") return rates.holidayPaise;
  if (kind === "weekend") return rates.weekendPaise;
  return rates.weekdayPaise;
}

export function quoteStay(input: {
  checkIn: string;
  checkOut: string;
  rates: NightRates;
  holidayDates?: ReadonlySet<string>;
  advancePercent?: number;
}): StayQuote {
  const holidayDates = input.holidayDates ?? new Set<string>();
  const advancePercent = input.advancePercent ?? bookingPolicy.advancePercent;
  const nights = nightsBetween(input.checkIn, input.checkOut).map((date) => {
    const kind = nightKind(date, holidayDates);
    return { date, kind, amountPaise: rateForNight(kind, input.rates) };
  });
  const totalPaise = nights.reduce((sum, night) => sum + night.amountPaise, 0);
  const advancePaise = Math.round((totalPaise * advancePercent) / 100);

  return {
    nights,
    totalPaise,
    advancePaise,
    balancePaise: totalPaise - advancePaise,
    pricesIncludeGst: true,
  };
}
