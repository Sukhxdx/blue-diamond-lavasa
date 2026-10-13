import { writeAudit } from "@/lib/audit";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { loginBlocked } from "@/lib/auth/rbac";
import { createStaffSession } from "@/lib/auth/session-store";
import { secretFromStorage, totpMatches } from "@/lib/auth/totp";
import { prisma } from "@/lib/db";
import { HttpError } from "@/lib/security/request";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;

let dummyHash: Promise<string> | null = null;

function dummyPasswordHash() {
  dummyHash ??= hashPassword("timing-only-not-a-credential");
  return dummyHash;
}

export async function loginStaff(input: {
  email: string;
  password: string;
  totp?: string;
  ipHash: string;
  userAgent: string | null;
}) {
  const email = input.email.toLowerCase();
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [emailFails, ipFails] = await Promise.all([
    prisma.auditLog.count({
      where: {
        action: "LOGIN_FAILURE",
        createdAt: { gte: since },
        metadata: { path: ["email"], equals: email },
      },
    }),
    prisma.auditLog.count({
      where: { action: "LOGIN_FAILURE", createdAt: { gte: since }, ipHash: input.ipHash },
    }),
  ]);
  if (loginBlocked(emailFails, ipFails)) {
    throw new HttpError(429, "Too many sign-in attempts. Wait 15 minutes and try again.");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordOk = await verifyPassword(user?.passwordHash ?? (await dummyPasswordHash()), input.password);
  const usable = Boolean(user && !user.disabledAt && passwordOk);
  if (!user || !usable) {
    await writeAudit({
      action: "LOGIN_FAILURE",
      entityType: "User",
      entityId: user?.id,
      metadata: { email, reason: user?.disabledAt ? "disabled" : "password" },
      ipHash: input.ipHash,
    });
    throw new HttpError(401, "The email or password is not correct.");
  }

  if (user.totpEnabledAt && user.totpSecretEnc) {
    if (!input.totp) {
      throw new HttpError(401, "Enter the 6-digit authenticator code.", "totp_required");
    }
    const secret = secretFromStorage(user.totpSecretEnc);
    if (!totpMatches(secret, input.totp)) {
      await writeAudit({
        actorId: user.id,
        action: "LOGIN_FAILURE",
        entityType: "User",
        entityId: user.id,
        metadata: { email, reason: "totp" },
        ipHash: input.ipHash,
      });
      throw new HttpError(401, "That authenticator code is not correct.");
    }
  }

  const session = await createStaffSession(user.id, input.ipHash, input.userAgent);
  await writeAudit({
    actorId: user.id,
    action: "LOGIN_SUCCESS",
    entityType: "User",
    entityId: user.id,
    metadata: { email },
    ipHash: input.ipHash,
  });
  return session;
}
