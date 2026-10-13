import { currentStaffUser } from "@/lib/auth/current-user";
import { createStaffAccount } from "@/lib/auth/staff";
import { clientIp, hashIp } from "@/lib/auth/secrets";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { HttpError, assertSameOrigin } from "@/lib/security/request";
import { staffSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const admin = await currentStaffUser();
    if (!admin) throw new HttpError(401, "Sign in again.");
    if (admin.role !== "ADMIN") throw new HttpError(403, "Forbidden");
    const body = await readJson(request, staffSchema);
    await createStaffAccount({
      name: body.name.trim(),
      email: body.email,
      password: body.password,
      actorId: admin.id,
      ipHash: hashIp(clientIp(request)),
    });
    return jsonOk({ ok: true }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
