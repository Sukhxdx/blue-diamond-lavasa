import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Service delivery",
  description: `${brand.hotelName} provides the stay at the property in Lavasa. No goods are shipped.`,
};

export default function ShippingPage() {
  return (
    <>
      <PageIntro eyebrow={brand.hotelName} title="Service delivery">
        This is a hotel and villa stay. There is no courier shipping.
      </PageIntro>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 leading-7 text-muted">
        <p>
          {brand.hotelName} does not ship physical goods. The service you pay for is the stay:
          the {brand.villaName} villa, booked as one home, or a room at the hotel.
        </p>
        <p>
          The stay is provided at the property in {brand.location}, {brand.country}, from the
          check-in date to the check-out date on the booking receipt. After Razorpay captures
          the advance, the receipt and booking details are sent to the guest and the host.
        </p>
      </article>
    </>
  );
}
