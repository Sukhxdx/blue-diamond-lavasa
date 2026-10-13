import { NextResponse } from "next/server";
import type { z } from "zod";
import { HttpError } from "@/lib/security/request";

export function jsonError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: error.message, ...(error.code ? { code: error.code } : {}) },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  }
  console.error(error instanceof Error ? error.name : "request failed");
  return NextResponse.json(
    { error: "Something went wrong. Try again." },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}

export function jsonOk(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function readJson<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new HttpError(400, "Check the form and try again.");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new HttpError(400, "Check the form and try again.");
  return parsed.data;
}
