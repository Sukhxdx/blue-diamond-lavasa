import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";
import { enterprise } from "@/lib/enterprise";
import { hostContact } from "@/lib/host-contact";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${brand.hotelName} uses guest details for bookings in Lavasa.`,
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow={brand.hotelName} title="Privacy policy">
        This policy explains what {brand.hotelName} collects when you enquire or book, and why.
      </PageIntro>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 leading-7 text-muted">
        <section>
          <h2 className="font-serif text-3xl text-ink">What we collect</h2>
          <p className="mt-3">
            For a booking we collect the guest’s name, phone number, email address, stay dates,
            number of guests, and any special request the guest chooses to write. Payment
            confirmation details, such as the Razorpay payment id and the amount captured, are
            stored with the booking. Card numbers, UPI PINs, and netbanking passwords are entered
            on Razorpay’s page and are not stored on this website.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Why we use it</h2>
          <p className="mt-3">
            We use these details to hold the dates, take the advance, send the receipt and
            booking details to the guest and the host, provide the stay, and handle a
            cancellation or refund. We do not sell guest information.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Who receives it</h2>
          <p className="mt-3">
            The guest receives the receipt. The host at {brand.hotelName} receives the same
            booking details so the stay can be prepared. Razorpay processes the payment.
            Email delivery uses our email provider. We share details with a third party only
            when that is required to complete the booking, the payment, or a refund, or when
            the law requires it.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">How long we keep it</h2>
          <p className="mt-3">
            Booking and payment records are kept for as long as tax and accounting rules
            require, and then deleted or reduced to what those rules still need.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Your requests</h2>
          <p className="mt-3">
            To ask for a copy of your booking details, or to correct them, email{" "}
            <a href={`mailto:${enterprise.email}`} className="text-ink underline">
              {enterprise.email}
            </a>{" "}
            or{" "}
            <a href={`mailto:${hostContact.email}`} className="text-ink underline">
              {hostContact.email}
            </a>
            , or call the host on{" "}
            <a href={hostContact.telHref} className="text-ink underline">
              {hostContact.phoneDisplay}
            </a>
            .
          </p>
        </section>
      </article>
    </>
  );
}
