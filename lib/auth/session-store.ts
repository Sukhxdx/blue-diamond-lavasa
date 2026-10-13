import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashToken, newSessionToken } from "@/lib/auth/secrets";
import { nextMidnightIst } from "@/lib/time/ist";

export const STAFF_COOKIE = "bd_staff";
export const GUEST_COOKIE = "bd_guest";

const STAFF_ABSOLUTE_MS = 12 * 60 * 60 * 1000;
const STAFF_IDLE_MS = 30 * 60 * 1000;

export type StaffPrincipal = {
  id: string;
  name: string;
  email: string;
  role: Role;
  disabledAt: Date | null;
  totpEnabled: boolean;
};

export function sessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    expires,
  };
}

export async function staffUserForToken(token: string | undefined): Promise<StaffPrincipal | null> {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.kind !== "STAFF" || !session.user) return null;

  const now = new Date();
  if (session.expiresAt <= now || now.getTime() - session.lastSeenAt.getTime() > STAFF_IDLE_MS) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  if (session.user.disabledAt) {
    await prisma.session.deleteMany({ where: { userId: session.user.id } });
    return null;
  }
  if (now.getTime() - session.lastSeenAt.getTime() > 60_000) {
    await prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: now } });
  }
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    disabledAt: session.user.disabledAt,
    totpEnabled: session.user.totpEnabledAt !== null,
  };
}

export async function createStaffSession(userId: string, ipHash: string | null, userAgent: string | null) {
  const token = newSessionToken();
  const now = new Date();
  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      kind: "STAFF",
      userId,
      expiresAt: new Date(now.getTime() + STAFF_ABSOLUTE_MS),
      lastSeenAt: now,
      ipHash,
      userAgent: userAgent?.slice(0, 200) ?? null,
    },
  });
  return { token, expiresAt: new Date(now.getTime() + STAFF_ABSOLUTE_MS) };
}

export async function deleteStaffSession(token: string | undefined) {
  if (!token) return;
  await prisma.session.deleteMany({ where: { tokenHash: hashToken(token), kind: "STAFF" } });
}

export type GuestPrincipal = {
  customerId: string;
  name: string;
  tableId: string;
  tableCode: string;
  tableLabel: string;
};

export async function guestForToken(token: string | undefined): Promise<GuestPrincipal | null> {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { customer: true, table: true },
  });
  if (!session || session.kind !== "CUSTOMER" || !session.customer || !session.table) return null;
  if (session.expiresAt <= new Date() || !session.table.active) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  return {
    customerId: session.customer.id,
    name: session.customer.name,
    tableId: session.table.id,
    tableCode: session.table.code,
    tableLabel: session.table.label,
  };
}

export async function createGuestSession(input: {
  customerId: string;
  tableId: string;
  ipHash: string | null;
  userAgent: string | null;
}) {
  const token = newSessionToken();
  const now = new Date();
  const expiresAt = nextMidnightIst(now);
  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      kind: "CUSTOMER",
      customerId: input.customerId,
      tableId: input.tableId,
      expiresAt,
      lastSeenAt: now,
      ipHash: input.ipHash,
      userAgent: input.userAgent?.slice(0, 200) ?? null,
    },
  });
  return { token, expiresAt };
}

export async function deleteGuestSession(token: string | undefined) {
  if (!token) return;
  await prisma.session.deleteMany({ where: { tokenHash: hashToken(token), kind: "CUSTOMER" } });
}
