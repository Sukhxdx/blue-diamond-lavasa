import { maskPhone } from "@/lib/phone";
import type { WhatsAppProvider } from "@/lib/whatsapp/types";

export const consoleWhatsApp: WhatsAppProvider = {
  async sendOtp(toE164) {
    console.info(`[whatsapp] otp template queued for ${maskPhone(toE164)}`);
  },
  async sendWelcome(toE164) {
    console.info(`[whatsapp] welcome template queued for ${maskPhone(toE164)}`);
  },
};
