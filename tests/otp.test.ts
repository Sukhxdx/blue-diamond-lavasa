import { describe, expect, it } from "vitest";
import {
  OTP_MAX_ATTEMPTS,
  canSendOtp,
  generateOtp,
  hashOtp,
  hashPhone,
  otpMatches,
  verifyOtpDecision,
} from "../lib/otp/logic";
import { nextMidnightIst } from "../lib/time/ist";
import { normalizeIndianMobile } from "../lib/phone";

const pepper = "test-pepper-with-enough-length-123456";

describe("OTP", () => {
  it("stores a hash that is not the code", () => {
    const code = "042139";
    const hash = hashOtp(code, pepper);
    expect(hash).not.toContain(code);
    expect(otpMatches(code, hash, pepper)).toBe(true);
    expect(otpMatches("042140", hash, pepper)).toBe(false);
    expect(otpMatches(code, "zz", pepper)).toBe(false);
  });

  it("hashes the phone so the request row is not reversible without the pepper", () => {
    expect(hashPhone("+919623222130", pepper)).not.toContain("9623222130");
    expect(hashPhone("+919623222130", pepper)).not.toBe(hashPhone("+919623222131", pepper));
  });

  it("accepts a live code and rejects expiry, reuse, and the fourth attempt", () => {
    const now = new Date("2026-10-13T12:00:00.000Z");
    const record = {
      codeHash: hashOtp("123456", pepper),
      expiresAt: new Date(now.getTime() + 60_000),
      attempts: 0,
      consumedAt: null,
    };
    expect(verifyOtpDecision(record, "123456", pepper, now)).toEqual({ ok: true });
    expect(verifyOtpDecision(record, "000000", pepper, now)).toEqual({ ok: false, reason: "mismatch" });
    expect(verifyOtpDecision({ ...record, expiresAt: now }, "123456", pepper, now)).toEqual({
      ok: false,
      reason: "expired",
    });
    expect(verifyOtpDecision({ ...record, consumedAt: now }, "123456", pepper, now)).toEqual({
      ok: false,
      reason: "consumed",
    });
    expect(verifyOtpDecision({ ...record, attempts: OTP_MAX_ATTEMPTS }, "123456", pepper, now)).toEqual({
      ok: false,
      reason: "locked",
    });
    expect(verifyOtpDecision(null, "123456", pepper, now)).toEqual({ ok: false, reason: "missing" });
  });

  it("allows three sends per number per hour and a higher shared-network IP ceiling", () => {
    expect(canSendOtp(2, 29)).toBe("ok");
    expect(canSendOtp(3, 0)).toBe("phone");
    expect(canSendOtp(0, 30)).toBe("ip");
  });

  it("generates a 6-digit code", () => {
    expect(generateOtp()).toMatch(/^\d{6}$/);
  });

  it("keeps a guest session until the next midnight in IST", () => {
    expect(nextMidnightIst(new Date("2026-10-13T18:00:00.000Z")).toISOString()).toBe(
      "2026-10-13T18:30:00.000Z",
    );
    expect(nextMidnightIst(new Date("2026-10-13T18:30:00.000Z")).toISOString()).toBe(
      "2026-10-14T18:30:00.000Z",
    );
  });

  it("accepts Indian mobiles and rejects everything else", () => {
    expect(normalizeIndianMobile("9623222130")).toBe("+919623222130");
    expect(normalizeIndianMobile("+91 96232 22130")).toBe("+919623222130");
    expect(normalizeIndianMobile("09623222130")).toBe("+919623222130");
    expect(normalizeIndianMobile("12345")).toBeNull();
    expect(normalizeIndianMobile("1234567890")).toBeNull();
  });
});
