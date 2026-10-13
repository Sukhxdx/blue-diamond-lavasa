import crypto from "crypto";

export function requirePepper(): string {
  const pepper = process.env.DATA_PEPPER ?? "";
  if (pepper.length < 32) {
    throw new Error("DATA_PEPPER must be at least 32 characters");
  }
  return pepper;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function newSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashIp(ip: string, pepper = requirePepper()): string {
  return crypto.createHmac("sha256", pepper).update(`ip:${ip}`).digest("hex");
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return request.headers.get("x-real-ip")?.slice(0, 64) || "unknown";
}

function encryptionKey(): Buffer {
  const raw = process.env.APP_ENCRYPTION_KEY ?? "";
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("APP_ENCRYPTION_KEY must be 32 bytes, base64-encoded");
  }
  return key;
}

export function encryptString(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptString(payload: string): string {
  const buf = Buffer.from(payload, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
