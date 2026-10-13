import { rupeesToPaise } from "@/lib/money";
import type { NightRates } from "@/lib/pricing/quote";

export type StayListing = {
  slug: string;
  kind: "villa" | "hotel_room";
  name: string;
  count: number | null;
  guests: number | null;
  summary: string;
  cover: string;
  alt: string;
  /** Per night, GST included. Holiday applies only on dates marked as holidays. */
  rates: NightRates;
};

/** Inventory and night rates confirmed by the owner. */
export const stayListings: StayListing[] = [
  {
    slug: "on-air",
    kind: "villa",
    name: "On Air",
    count: 1,
    guests: null,
    summary: "The villa, booked as one whole home.",
    cover: "/photos/villa/house-front.jpg",
    alt: "Front of the On Air villa",
    rates: {
      weekdayPaise: rupeesToPaise(7000),
      weekendPaise: rupeesToPaise(9000),
      holidayPaise: rupeesToPaise(10000),
    },
  },
  {
    slug: "double-room",
    kind: "hotel_room",
    name: "Double room",
    count: 3,
    guests: 2,
    summary: "Three double rooms at Blue Diamond Hotel. Each sleeps two.",
    cover: "/photos/rooms/double-bed.jpg",
    alt: "Double room at Blue Diamond Hotel",
    rates: {
      weekdayPaise: rupeesToPaise(1800),
      weekendPaise: rupeesToPaise(2000),
      holidayPaise: rupeesToPaise(2200),
    },
  },
  {
    slug: "deluxe-4-sharing",
    kind: "hotel_room",
    name: "Deluxe, 4 sharing",
    count: 2,
    guests: 4,
    summary: "Two deluxe rooms at Blue Diamond Hotel. Each sleeps four.",
    cover: "/photos/rooms/deluxe-lake-door.jpg",
    alt: "Deluxe four-sharing room opening onto the lake",
    rates: {
      weekdayPaise: rupeesToPaise(2500),
      weekendPaise: rupeesToPaise(3000),
      holidayPaise: rupeesToPaise(3500),
    },
  },
];
