const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export function nextMidnightIst(now: Date): Date {
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  const midnightUtc = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + 1);
  return new Date(midnightUtc - IST_OFFSET_MS);
}
