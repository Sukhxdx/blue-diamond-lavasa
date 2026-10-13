import crypto from "crypto";
import { decryptString, encryptString } from "@/lib/auth/secrets";

const STEP_SECONDS = 30;
const DIGITS = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function createTotpSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

export function encryptTotpSecret(secret: string): string {
  return encryptString(secret);
}

export function totpCode(secret: string, at = new Date()): string {
  const counter = Math.floor(at.getTime() / 1000 / STEP_SECONDS);
  return hotp(base32Decode(secret), counter);
}

export function totpMatches(secret: string, code: string, at = new Date()): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const counter = Math.floor(at.getTime() / 1000 / STEP_SECONDS);
  const key = base32Decode(secret);
  return [-1, 0, 1].some((offset) => timingSafeCode(hotp(key, counter + offset), code));
}

export function otpauthUrl(email: string, secret: string): string {
  const label = encodeURIComponent(`Blue Diamond Restaurant:${email}`);
  const issuer = encodeURIComponent("Blue Diamond Restaurant");
  return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

export function secretFromStorage(payload: string): string {
  return decryptString(payload);
}

function hotp(key: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1]! & 0xf;
  const binary = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return binary.toString().padStart(DIGITS, "0");
}

function timingSafeCode(actual: string, expected: string): boolean {
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function base32Encode(data: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of data) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function base32Decode(input: string): Buffer {
  const clean = input.replace(/=+$/g, "").toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of clean) {
    const index = ALPHABET.indexOf(char);
    if (index < 0) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}
