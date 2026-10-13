import { cookies } from "next/headers";
import { clientIp, hashIp } from "@/lib/auth/secrets";
import { GUEST_COOKIE, sessionCookieOptions } from "@/lib/auth/session-store";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { verifyMenuOtp } from "@/lib/otp/service";
import { requireActiveTable, requireGuestIdentity } from "@/lib/restaurant/guest";
import { assertSameOrigin } from "@/lib/security/request";
import { otpVerifySchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJson(request, otpVerifySchema);
    const table = await requireActiveTable(body.tableCode);
    const guest = requireGuestIdentity(body.name, body.phone);
    const session = await verifyMenuOtp({
      phoneE164: guest.phoneE164,
      name: guest.name,
      code: body.code,
      tableId: table.id,
      ipHash: hashIp(clientIp(request)),
      userAgent: request.headers.get("user-agent"),
    });
    const jar = await cookies();
    jar.set(GUEST_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
