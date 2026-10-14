function trim(value: string | undefined) {
  return value?.trim() ?? "";
}

function digits(value: string | undefined) {
  return trim(value).replace(/\D/g, "");
}

function httpsHost(value: string | undefined) {
  const host = trim(value).replace(/^https?:\/\//, "").replace(/\/$/, "");
  return host ? `https://${host}` : "";
}

function siteUrl() {
  const configured = trim(process.env.NEXT_PUBLIC_SITE_URL).replace(/\/$/, "");
  if (configured && !configured.includes("localhost")) return configured;
  return (
    httpsHost(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    httpsHost(process.env.VERCEL_URL) ||
    configured ||
    "http://localhost:3000"
  );
}

export const publicEnv = {
  siteUrl: siteUrl(),
  whatsappE164: digits(process.env.NEXT_PUBLIC_WHATSAPP_E164),
  phoneDisplay: trim(process.env.NEXT_PUBLIC_PHONE_DISPLAY),
  phoneE164: digits(process.env.NEXT_PUBLIC_PHONE_E164),
  email: trim(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  mapsEmbedUrl: trim(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL),
};
