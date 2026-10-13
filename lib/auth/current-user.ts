import { cookies } from "next/headers";
import {
  deleteGuestSession,
  deleteStaffSession,
  GUEST_COOKIE,
  guestForToken,
  STAFF_COOKIE,
  staffUserForToken,
} from "@/lib/auth/session-store";

export async function currentStaffUser() {
  const jar = await cookies();
  return staffUserForToken(jar.get(STAFF_COOKIE)?.value);
}

export async function currentGuest() {
  const jar = await cookies();
  return guestForToken(jar.get(GUEST_COOKIE)?.value);
}

export async function clearStaffCookie() {
  const jar = await cookies();
  await deleteStaffSession(jar.get(STAFF_COOKIE)?.value);
  jar.delete(STAFF_COOKIE);
}

export async function clearGuestCookie() {
  const jar = await cookies();
  await deleteGuestSession(jar.get(GUEST_COOKIE)?.value);
  jar.delete(GUEST_COOKIE);
}
