import { hostContact } from "@/lib/host-contact";

export function PayAdvanceLink({ className }: { className?: string }) {
  return (
    <a
      href={hostContact.paymentUrl}
      className={
        className ??
        "inline-flex rounded-full bg-pine px-5 py-3 text-sm font-medium text-cream hover:bg-pine-deep"
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      Pay the advance
    </a>
  );
}
