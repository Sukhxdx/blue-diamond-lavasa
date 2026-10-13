export function whatsappHref(e164Digits: string, text?: string) {
  if (!e164Digits) return null;

  const url = new URL(`https://wa.me/${e164Digits}`);
  if (text) url.searchParams.set("text", text);
  return url.toString();
}

export function telHref(e164Digits: string) {
  if (!e164Digits) return null;
  return `tel:+${e164Digits}`;
}

export function mailHref(email: string) {
  if (!email) return null;
  return `mailto:${email}`;
}
