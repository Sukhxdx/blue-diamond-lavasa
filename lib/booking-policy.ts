/**
 * Rules confirmed for On Air and Blue Diamond Hotel.
 * Amounts stay in the database. These are the rules, not the prices.
 */
export const bookingPolicy = {
  /** Booking the villa does not block hotel rooms, and a room booking does not block the villa. */
  inventory: "separate",
  /** Collected online. The rest is due at check-in. Editable in settings. */
  advancePercent: 30,
  /** Weekday, weekend, and seasonal prices are GST-inclusive. */
  pricesIncludeGst: true,
  /** Friday and Saturday nights. 0 is Sunday. Editable in settings. */
  weekendNights: [5, 6],
} as const;
