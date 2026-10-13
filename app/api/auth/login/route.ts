import { cookies } from "next/headers";
import { loginStaff } from "@/lib/auth/login";
import { clientIp, hashIp } from "@/lib/auth/secrets";
import { STAFF_COOKIE, sessionCookieOptions } from "@/lib/auth/session-store";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { assertSameOrigin } from "@/lib/security/request";
import { loginSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJson(request, loginSchema);
    const session = await loginStaff({
      email: body.email,
      password: body.password,
      totp: body.totp,
      ipHash: hashIp(clientIp(request)),
      userAgent: request.headers.get("user-agent"),
    });
    const jar = await cookies();
    jar.set(STAFF_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
