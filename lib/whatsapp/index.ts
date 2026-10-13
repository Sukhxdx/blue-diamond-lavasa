import { consoleWhatsApp } from "@/lib/whatsapp/console";
import { metaWhatsApp } from "@/lib/whatsapp/meta";
import type { WhatsAppProvider } from "@/lib/whatsapp/types";

export function getWhatsApp(): WhatsAppProvider {
  const provider = process.env.WHATSAPP_PROVIDER ?? "console";
  if (provider === "meta") return metaWhatsApp;
  if (provider === "console") return consoleWhatsApp;
  throw new Error("WHATSAPP_PROVIDER must be console or meta");
}
