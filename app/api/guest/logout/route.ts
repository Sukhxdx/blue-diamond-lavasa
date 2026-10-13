import { clearGuestCookie } from "@/lib/auth/current-user";
import { jsonError, jsonOk } from "@/lib/http";
import { assertSameOrigin } from "@/lib/security/request";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await clearGuestCookie();
    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
