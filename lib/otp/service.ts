import { writeAudit } from "@/lib/audit";
import { createGuestSession } from "@/lib/auth/session-store";
import {
  OTP_IP_WINDOW_MS,
  OTP_PHONE_WINDOW_MS,
  OTP_TTL_MS,
  canSendOtp,
  generateOtp,
  hashOtp,
  hashPhone,
  verifyOtpDecision,
} from "@/lib/otp/logic";
import { prisma } from "@/lib/db";
import { CONSENT_VERSION } from "@/lib/restaurant/constants";
import { requirePepper } from "@/lib/auth/secrets";
import { HttpError } from "@/lib/security/request";
import { getWhatsApp } from "@/lib/whatsapp";

export async function sendMenuOtp(input: {
  phoneE164: string;
  ipHash: string;
  devReturn: boolean;
}) {
  const pepper = requirePepper();
  const phoneHash = hashPhone(input.phoneE164, pepper);
  const now = new Date();
  const [phoneSends, ipSends] = await Promise.all([
    prisma.otpRequest.count({
      where: { phoneHash, createdAt: { gte: new Date(now.getTime() - OTP_PHONE_WINDOW_MS) } },
    }),
    prisma.otpRequest.count({
      where: { ipHash: input.ipHash, createdAt: { gte: new Date(now.getTime() - OTP_IP_WINDOW_MS) } },
    }),
  ]);
  const limit = canSendOtp(phoneSends, ipSends);
  if (limit !== "ok") {
    throw new HttpError(429, "Too many codes were requested. Wait a little, then try again.");
  }

  const code = generateOtp();
  const created = await prisma.$transaction(async (tx) => {
    await tx.otpRequest.updateMany({
      where: { phoneHash, consumedAt: null, expiresAt: { gt: now } },
      data: { consumedAt: now },
    });
    return tx.otpRequest.create({
      data: {
        phoneHash,
        codeHash: hashOtp(code, pepper),
        expiresAt: new Date(now.getTime() + OTP_TTL_MS),
        ipHash: input.ipHash,
      },
    });
  });

  try {
    await getWhatsApp().sendOtp(input.phoneE164, code);
  } catch {
    await prisma.otpRequest.update({ where: { id: created.id }, data: { consumedAt: new Date() } });
    throw new HttpError(502, "The code could not be sent. Try again in a moment.");
  }

  await writeAudit({
    action: "OTP_SEND",
    entityType: "OtpRequest",
    entityId: created.id,
    metadata: { phoneLast4: input.phoneE164.slice(-4) },
    ipHash: input.ipHash,
  });

  return {
    phoneLast4: input.phoneE164.slice(-4),
    devCode: input.devReturn ? code : undefined,
  };
}

export async function verifyMenuOtp(input: {
  phoneE164: string;
  name: string;
  code: string;
  tableId: string;
  ipHash: string;
  userAgent: string | null;
}) {
  const pepper = requirePepper();
  const phoneHash = hashPhone(input.phoneE164, pepper);
  const now = new Date();
  const record = await prisma.otpRequest.findFirst({
    where: { phoneHash },
    orderBy: { createdAt: "desc" },
  });
  const decision = verifyOtpDecision(record, input.code, pepper, now);
  if (!decision.ok) {
    if (decision.reason === "mismatch" && record) {
      await prisma.otpRequest.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
    }
    await writeAudit({
      action: "OTP_VERIFY_FAILURE",
      entityType: "OtpRequest",
      entityId: record?.id,
      metadata: { phoneLast4: input.phoneE164.slice(-4), reason: decision.reason },
      ipHash: input.ipHash,
    });
    throw new HttpError(401, verifyMessage(decision.reason));
  }

  if (!record) throw new HttpError(401, "That code has expired. Request a new one.");

  const customer = await prisma.$transaction(async (tx) => {
    const consumed = await tx.otpRequest.updateMany({
      where: { id: record.id, consumedAt: null, attempts: { lt: 3 } },
      data: { consumedAt: now },
    });
    if (consumed.count !== 1) {
      throw new HttpError(401, "That code has expired. Request a new one.");
    }
    return tx.customer.upsert({
      where: { phoneE164: input.phoneE164 },
      create: {
        name: input.name,
        phoneE164: input.phoneE164,
        consentAt: now,
        consentVersion: CONSENT_VERSION,
      },
      update: {
        name: input.name,
        consentAt: now,
        consentVersion: CONSENT_VERSION,
      },
    });
  });

  const session = await createGuestSession({
    customerId: customer.id,
    tableId: input.tableId,
    ipHash: input.ipHash,
    userAgent: input.userAgent,
  });

  try {
    await getWhatsApp().sendWelcome(input.phoneE164, input.name);
  } catch {
    await writeAudit({
      action: "WELCOME_FAILED",
      entityType: "Customer",
      entityId: customer.id,
      metadata: { phoneLast4: input.phoneE164.slice(-4) },
      ipHash: input.ipHash,
    });
  }

  await writeAudit({
    action: "OTP_VERIFY_SUCCESS",
    entityType: "Customer",
    entityId: customer.id,
    metadata: { phoneLast4: input.phoneE164.slice(-4) },
    ipHash: input.ipHash,
  });

  return session;
}

function verifyMessage(reason: "missing" | "consumed" | "expired" | "locked" | "mismatch") {
  if (reason === "expired" || reason === "consumed" || reason === "missing") {
    return "That code has expired. Request a new one.";
  }
  if (reason === "locked") return "Too many attempts. Request a new code.";
  return "That code is not correct.";
}
