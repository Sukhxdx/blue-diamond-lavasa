import type { WhatsAppProvider } from "@/lib/whatsapp/types";

type TemplateComponent = {
  type: "body" | "button";
  sub_type?: "url";
  index?: string;
  parameters: { type: "text"; text: string }[];
};

function metaConfig() {
  const token = process.env.WHATSAPP_TOKEN ?? "";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID ?? "";
  const lang = process.env.WHATSAPP_TEMPLATE_LANG || "en";
  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp Cloud API is not configured");
  }
  return { token, phoneNumberId, lang };
}

async function sendTemplate(toE164: string, templateName: string, components: TemplateComponent[]) {
  if (!templateName) throw new Error("WhatsApp template name is missing");
  const { token, phoneNumberId, lang } = metaConfig();
  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toE164.replace(/^\+/, ""),
      type: "template",
      template: {
        name: templateName,
        language: { code: lang },
        ...(components.length > 0 ? { components } : {}),
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`WhatsApp template failed with status ${response.status}`);
  }
}

function safeName(name: string): string {
  const cleaned = name.replace(/[^\p{L} .'-]/gu, "").trim().slice(0, 30);
  return cleaned || "Guest";
}

export const metaWhatsApp: WhatsAppProvider = {
  async sendOtp(toE164, code) {
    const components: TemplateComponent[] = [
      { type: "body", parameters: [{ type: "text", text: code }] },
    ];
    if (process.env.WHATSAPP_OTP_BUTTON !== "false") {
      components.push({
        type: "button",
        sub_type: "url",
        index: "0",
        parameters: [{ type: "text", text: code }],
      });
    }
    await sendTemplate(toE164, process.env.WHATSAPP_OTP_TEMPLATE ?? "", components);
  },
  async sendWelcome(toE164, guestName) {
    const components: TemplateComponent[] = [];
    if (process.env.WHATSAPP_WELCOME_HAS_NAME === "true") {
      components.push({ type: "body", parameters: [{ type: "text", text: safeName(guestName) }] });
    }
    await sendTemplate(toE164, process.env.WHATSAPP_WELCOME_TEMPLATE ?? "", components);
  },
};
