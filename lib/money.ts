export function rupeesToPaise(rupees: number): number {
  if (!Number.isInteger(rupees)) {
    throw new Error("Rupee amounts from the menu must be whole rupees");
  }
  return rupees * 100;
}

export function formatInr(paise: number): string {
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(paise);
  const rupees = Math.floor(abs / 100);
  const rest = abs % 100;
  const body = new Intl.NumberFormat("en-IN").format(rupees);
  if (rest === 0) return `${sign}₹${body}`;
  return `${sign}₹${body}.${rest.toString().padStart(2, "0")}`;
}
