export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) throw new HttpError(403, "Forbidden");
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new HttpError(403, "Forbidden");
  }
  if (originHost !== host) throw new HttpError(403, "Forbidden");
}

export function devOtpAllowed(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DEV_RETURN_OTP === "true";
}
