import { prisma } from "@/lib/db";
import { isGuestName, normalizeIndianMobile } from "@/lib/phone";
import { HttpError } from "@/lib/security/request";

export function normalizeTableCode(code: string) {
  return code.trim().toUpperCase();
}

export async function requireActiveTable(code: string) {
  const normalized = normalizeTableCode(code);
  if (!/^[A-Z0-9]{2,8}$/.test(normalized)) {
    throw new HttpError(404, "This table code is not valid. Ask the staff for a new QR.");
  }
  const table = await prisma.diningTable.findUnique({ where: { code: normalized } });
  if (!table || !table.active) {
    throw new HttpError(404, "This table code is not valid. Ask the staff for a new QR.");
  }
  return table;
}

export function requireGuestIdentity(name: string, phone: string) {
  const trimmed = name.trim();
  if (!isGuestName(trimmed)) {
    throw new HttpError(400, "Enter the name you would like the staff to use.");
  }
  const phoneE164 = normalizeIndianMobile(phone);
  if (!phoneE164) {
    throw new HttpError(400, "Enter a 10-digit Indian WhatsApp number.");
  }
  return { name: trimmed, phoneE164 };
}
