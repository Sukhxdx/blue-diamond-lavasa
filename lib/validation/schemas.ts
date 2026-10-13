import { z } from "zod";

export const otpSendSchema = z.object({
  tableCode: z.string().trim().min(2).max(8),
  name: z.string().trim().min(2).max(60),
  phone: z.string().trim().min(10).max(20),
  consent: z.literal(true),
});

export const otpVerifySchema = otpSendSchema.extend({
  code: z.string().regex(/^\d{6}$/),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
  totp: z.string().regex(/^\d{6}$/).optional(),
});

export const tableSchema = z.object({
  code: z.string().trim().regex(/^[A-Za-z0-9]{2,8}$/),
  label: z.string().trim().min(1).max(40),
});

export const staffSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(12).max(200),
});

export const staffStatusSchema = z.object({
  disabled: z.boolean(),
});

export const totpConfirmSchema = z.object({
  code: z.string().regex(/^\d{6}$/),
});

export const totpDisableSchema = z.object({
  password: z.string().min(1).max(200),
  code: z.string().regex(/^\d{6}$/),
});
