function trim(value: string | undefined) {
  return value?.trim() ?? "";
}

function digits(value: string | undefined) {
  return trim(value).replace(/\D/g, "");
}

export const publicEnv = {
  siteUrl: (trim(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  whatsappE164: digits(process.env.NEXT_PUBLIC_WHATSAPP_E164),
  phoneDisplay: trim(process.env.NEXT_PUBLIC_PHONE_DISPLAY),
  phoneE164: digits(process.env.NEXT_PUBLIC_PHONE_E164),
  email: trim(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  mapsEmbedUrl: trim(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL),
};
