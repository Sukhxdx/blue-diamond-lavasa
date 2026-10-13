export function securityHeaders(production: boolean): { key: string; value: string }[] {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    production ? "script-src 'self' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "connect-src 'self'",
    "frame-src https://www.google.com https://*.google.com https://*.google.co.in",
    production ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");

  const headers = [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
  ];
  if (production) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }
  return headers;
}
