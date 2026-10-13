/** Published rules Razorpay and guests can read. Amounts match the confirmed rate card. */
export const cancellationPolicy = {
  /** Hours before the check-in date. Inside this window the advance is kept. */
  freeCancelHours: 48,
  refundBusinessDays: 7,
} as const;
