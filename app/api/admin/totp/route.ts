import QRCode from "qrcode";
import { writeAudit } from "@/lib/audit";
import { currentStaffUser } from "@/lib/auth/current-user";
import { verifyPassword } from "@/lib/auth/password";
import { clientIp, hashIp } from "@/lib/auth/secrets";
import { createTotpSecret, encryptTotpSecret, otpauthUrl, secretFromStorage, totpMatches } from "@/lib/auth/totp";
import { prisma } from "@/lib/db";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { HttpError, assertSameOrigin } from "@/lib/security/request";
import { totpConfirmSchema, totpDisableSchema } from "@/lib/validation/schemas";

async function requireAdmin() {
  const user = await currentStaffUser();
  if (!user) throw new HttpError(401, "Sign in again.");
  if (user.role !== "ADMIN") throw new HttpError(403, "Forbidden");
  const record = await prisma.user.findUnique({ where: { id: user.id } });
  if (!record) throw new HttpError(401, "Sign in again.");
  return record;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    if (admin.totpEnabledAt) {
      throw new HttpError(400, "Authenticator is already on. Turn it off before setting it up again.");
    }
    const secret = createTotpSecret();
    await prisma.user.update({
      where: { id: admin.id },
      data: { totpSecretEnc: encryptTotpSecret(secret), totpEnabledAt: null },
    });
    const png = await QRCode.toBuffer(otpauthUrl(admin.email, secret), {
      type: "png",
      width: 320,
      margin: 1,
    });
    return jsonOk({
      ok: true,
      secret,
      qrDataUrl: `data:image/png;base64,${Buffer.from(png).toString("base64")}`,
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(request: Request) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const body = await readJson(request, totpConfirmSchema);
    if (!admin.totpSecretEnc) throw new HttpError(400, "Start authenticator setup first.");
    const secret = secretFromStorage(admin.totpSecretEnc);
    if (!totpMatches(secret, body.code)) throw new HttpError(401, "That authenticator code is not correct.");
    await prisma.user.update({ where: { id: admin.id }, data: { totpEnabledAt: new Date() } });
    await writeAudit({
      actorId: admin.id,
      action: "TOTP_ENABLED",
      entityType: "User",
      entityId: admin.id,
      ipHash: hashIp(clientIp(request)),
    });
    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const body = await readJson(request, totpDisableSchema);
    if (!admin.totpEnabledAt || !admin.totpSecretEnc) throw new HttpError(400, "Authenticator is not on.");
    const passwordOk = await verifyPassword(admin.passwordHash, body.password);
    const secret = secretFromStorage(admin.totpSecretEnc);
    if (!passwordOk || !totpMatches(secret, body.code)) {
      throw new HttpError(401, "The password or authenticator code is not correct.");
    }
    await prisma.user.update({
      where: { id: admin.id },
      data: { totpSecretEnc: null, totpEnabledAt: null },
    });
    await writeAudit({
      actorId: admin.id,
      action: "TOTP_DISABLED",
      entityType: "User",
      entityId: admin.id,
      ipHash: hashIp(clientIp(request)),
    });
    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
