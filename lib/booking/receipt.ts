import { hostContact } from "@/lib/host-contact";

export type BookingReceipt = {
  bookingId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalLabel: string;
  advanceLabel: string;
  balanceLabel: string;
};

export type ReceiptNotice = {
  role: "customer" | "host";
  channel: "email" | "phone";
  to: string;
  subject: string;
  text: string;
};

function bookingLines(receipt: BookingReceipt): string[] {
  return [
    `Booking ${receipt.bookingId}`,
    `Stay: ${receipt.propertyName}`,
    `Check-in: ${receipt.checkIn}`,
    `Check-out: ${receipt.checkOut}`,
    `Guest: ${receipt.guestName}`,
    `Guest phone: ${receipt.guestPhone}`,
    `Guest email: ${receipt.guestEmail}`,
    `Total: ${receipt.totalLabel}`,
    `Paid now: ${receipt.advanceLabel}`,
    `Balance at check-in: ${receipt.balanceLabel}`,
    `Host phone after booking: ${hostContact.phoneDisplay}`,
  ];
}

export function planBookingReceipt(
  receipt: BookingReceipt,
  hostEmail?: string | null,
): ReceiptNotice[] {
  const subject = `Booking ${receipt.bookingId} · ${receipt.propertyName}`;
  const text = bookingLines(receipt).join("\n");
  const notices: ReceiptNotice[] = [
    {
      role: "customer",
      channel: "email",
      to: receipt.guestEmail,
      subject,
      text,
    },
    {
      role: "host",
      channel: "phone",
      to: hostContact.phoneDigits,
      subject,
      text,
    },
  ];

  const email = hostEmail?.trim();
  if (email) {
    notices.push({
      role: "host",
      channel: "email",
      to: email,
      subject,
      text,
    });
  }

  return notices;
}
