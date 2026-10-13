import { currentStaffUser } from "@/lib/auth/current-user";
import { setStaffDisabled } from "@/lib/auth/staff";
import { clientIp, hashIp } from "@/lib/auth/secrets";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { HttpError, assertSameOrigin } from "@/lib/security/request";
import { staffStatusSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const admin = await currentStaffUser();
    if (!admin) throw new HttpError(401, "Sign in again.");
    if (admin.role !== "ADMIN") throw new HttpError(403, "Forbidden");
    const { id } = await context.params;
    const body = await readJson(request, staffStatusSchema);
    await setStaffDisabled({
      userId: id,
      disabled: body.disabled,
      actorId: admin.id,
      ipHash: hashIp(clientIp(request)),
    });
    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
