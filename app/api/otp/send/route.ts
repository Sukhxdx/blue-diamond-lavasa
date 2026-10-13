import { clientIp, hashIp } from "@/lib/auth/secrets";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { sendMenuOtp } from "@/lib/otp/service";
import { requireActiveTable, requireGuestIdentity } from "@/lib/restaurant/guest";
import { assertSameOrigin, devOtpAllowed } from "@/lib/security/request";
import { otpSendSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJson(request, otpSendSchema);
    await requireActiveTable(body.tableCode);
    const guest = requireGuestIdentity(body.name, body.phone);
    const result = await sendMenuOtp({
      phoneE164: guest.phoneE164,
      ipHash: hashIp(clientIp(request)),
      devReturn: devOtpAllowed(),
    });
    return jsonOk({
      ok: true,
      phoneLast4: result.phoneLast4,
      ...(result.devCode ? { devCode: result.devCode } : {}),
    });
  } catch (error) {
    return jsonError(error);
  }
}
