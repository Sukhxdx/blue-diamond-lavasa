import crypto from "crypto";

export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_SENDS_PER_PHONE_PER_HOUR = 3;
export const OTP_SENDS_PER_IP_PER_10_MIN = 30;
export const OTP_PHONE_WINDOW_MS = 60 * 60 * 1000;
export const OTP_IP_WINDOW_MS = 10 * 60 * 1000;

export function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(code: string, pepper: string): string {
  return crypto.createHmac("sha256", pepper).update(`otp:${code}`).digest("hex");
}

export function hashPhone(e164: string, pepper: string): string {
  return crypto.createHmac("sha256", pepper).update(`phone:${e164}`).digest("hex");
}

export function otpMatches(code: string, codeHash: string, pepper: string): boolean {
  const next = hashOtp(code, pepper);
  const actual = Buffer.from(next, "hex");
  const expected = Buffer.from(codeHash, "hex");
  if (actual.length === 0 || actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

export type OtpSnapshot = {
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  consumedAt: Date | null;
};

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "missing" | "consumed" | "expired" | "locked" | "mismatch" };

export function verifyOtpDecision(
  record: OtpSnapshot | null,
  code: string,
  pepper: string,
  now: Date,
): VerifyResult {
  if (!record) return { ok: false, reason: "missing" };
  if (record.consumedAt) return { ok: false, reason: "consumed" };
  if (record.expiresAt.getTime() <= now.getTime()) return { ok: false, reason: "expired" };
  if (record.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: "locked" };
  if (!otpMatches(code, record.codeHash, pepper)) return { ok: false, reason: "mismatch" };
  return { ok: true };
}

export function canSendOtp(phoneSends: number, ipSends: number): "ok" | "phone" | "ip" {
  if (phoneSends >= OTP_SENDS_PER_PHONE_PER_HOUR) return "phone";
  if (ipSends >= OTP_SENDS_PER_IP_PER_10_MIN) return "ip";
  return "ok";
}
