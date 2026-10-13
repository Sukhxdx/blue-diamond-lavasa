import { describe, expect, it } from "vitest";
import { hostContact } from "@/lib/host-contact";
import { planBookingReceipt, type BookingReceipt } from "./receipt";

const receipt: BookingReceipt = {
  bookingId: "OA-1001",
  propertyName: "On Air",
  checkIn: "2026-11-06",
  checkOut: "2026-11-08",
  guestName: "Asha Kale",
  guestEmail: "asha@example.com",
  guestPhone: "9811111111",
  totalLabel: "₹18,000",
  advanceLabel: "₹5,400",
  balanceLabel: "₹12,600",
};

describe("booking receipt delivery", () => {
  it("sends the same booking details to the guest and the host", () => {
    const notices = planBookingReceipt(receipt, "host@bluediamond.example");
    const roles = notices.map((notice) => notice.role);

    expect(roles).toContain("customer");
    expect(roles).toContain("host");
    expect(notices.every((notice) => notice.text.includes("OA-1001"))).toBe(true);
    expect(notices.every((notice) => notice.text.includes("On Air"))).toBe(true);
    expect(notices.every((notice) => notice.text.includes("₹18,000"))).toBe(true);
  });

  it("gives the guest the host phone and gives the host the guest contact", () => {
    const notices = planBookingReceipt(receipt);
    const customer = notices.find((notice) => notice.role === "customer");
    const host = notices.find((notice) => notice.role === "host" && notice.channel === "phone");

    expect(customer?.to).toBe("asha@example.com");
    expect(customer?.text).toContain(hostContact.phoneDisplay);
    expect(host?.to).toBe(hostContact.phoneDigits);
    expect(host?.text).toContain("asha@example.com");
    expect(host?.text).toContain("9811111111");
  });

  it("also emails the host when a host inbox is configured", () => {
    const notices = planBookingReceipt(receipt, "owner@bluediamond.example");
    expect(notices.filter((notice) => notice.role === "host")).toEqual([
      expect.objectContaining({ channel: "phone", to: "7758044744" }),
      expect.objectContaining({ channel: "email", to: "owner@bluediamond.example" }),
    ]);
  });
});
