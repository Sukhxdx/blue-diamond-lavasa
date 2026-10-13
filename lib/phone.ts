export function normalizeIndianMobile(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let national = "";
  if (digits.length === 10) national = digits;
  else if (digits.length === 11 && digits.startsWith("0")) national = digits.slice(1);
  else if (digits.length === 12 && digits.startsWith("91")) national = digits.slice(2);
  else return null;
  if (!/^[6-9]\d{9}$/.test(national)) return null;
  return `+91${national}`;
}

export function maskPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  return `****${digits.slice(-4)}`;
}

export function isGuestName(name: string): boolean {
  return /^\p{L}[\p{L} .'-]{1,59}$/u.test(name);
}
