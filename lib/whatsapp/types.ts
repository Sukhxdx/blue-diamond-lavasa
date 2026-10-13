export interface WhatsAppProvider {
  sendOtp(toE164: string, code: string): Promise<void>;
  sendWelcome(toE164: string, guestName: string): Promise<void>;
}
