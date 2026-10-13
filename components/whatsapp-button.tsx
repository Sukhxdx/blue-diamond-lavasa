import { MessageCircle } from "lucide-react";
import { brand } from "@/lib/brand";
import { hostContact } from "@/lib/host-contact";
import { whatsappHref } from "@/lib/links";
import { publicEnv } from "@/lib/public-env";

export function WhatsAppButton() {
  const href = whatsappHref(
    publicEnv.whatsappE164 || hostContact.whatsappDigits,
    `Hello, I would like to ask about ${brand.villaName} / ${brand.hotelName} in Lavasa.`,
  );

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#1f6b45] px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-[#185538]"
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      WhatsApp
    </a>
  );
}
