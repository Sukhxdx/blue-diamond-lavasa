import { writeAudit } from "@/lib/audit";
import { clearStaffCookie, currentStaffUser } from "@/lib/auth/current-user";
import { clientIp, hashIp } from "@/lib/auth/secrets";
import { jsonError, jsonOk } from "@/lib/http";
import { assertSameOrigin } from "@/lib/security/request";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await currentStaffUser();
    await clearStaffCookie();
    if (user) {
      await writeAudit({
        actorId: user.id,
        action: "LOGOUT",
        entityType: "User",
        entityId: user.id,
        ipHash: hashIp(clientIp(request)),
      });
    }
    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
