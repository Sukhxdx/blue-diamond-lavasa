import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";
import { enterprise } from "@/lib/enterprise";
import { hostContact } from "@/lib/host-contact";
import { cancellationPolicy } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: `Booking terms for ${brand.hotelName} and the ${brand.villaName} villa in Lavasa.`,
};

export default function TermsPage() {
  return (
    <>
      <PageIntro eyebrow={enterprise.name} title="Terms and conditions">
        These terms cover stays booked with {enterprise.name} at {brand.hotelName} in{" "}
        {brand.location}, {brand.country}.
      </PageIntro>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 leading-7 text-muted">
        <section>
          <h2 className="font-serif text-3xl text-ink">Who you are booking with</h2>
          <p className="mt-3">
            Stays are sold by {enterprise.name}, a proprietorship of {enterprise.proprietor},
            Udyam {enterprise.udyam}. {brand.hotelName} is the hotel. {brand.villaName} is the
            villa at the same property and is booked as one whole home. Hotel rooms are booked
            individually. Booking the villa does not block the hotel rooms.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Prices and payment</h2>
          <p className="mt-3">
            Prices on the <Link href="/pricing" className="text-ink underline">pricing page</Link>{" "}
            are per night, in Indian rupees, and include GST. Friday and Saturday nights use
            the weekend rate. Other nights use the weekday rate unless the date is marked as a
            holiday, in which case the holiday rate applies. A confirmed booking collects 30%
            of the stay total online on{" "}
            <a href={hostContact.paymentUrl} className="text-ink underline" target="_blank" rel="noopener noreferrer">
              Razorpay
            </a>
            . The balance is paid at the property at
            check-in. Card, UPI, and netbanking details are handled by Razorpay and are not
            stored on this website.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Confirmation</h2>
          <p className="mt-3">
            A booking is confirmed when Razorpay captures the advance. The receipt and booking
            details are sent to the guest and to the host. After that, the guest can reach the
            host on{" "}
            <a href={hostContact.telHref} className="text-ink underline">
              {hostContact.phoneDisplay}
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Cancellation</h2>
          <p className="mt-3">
            Cancellations and refunds follow the{" "}
            <Link href="/refunds" className="text-ink underline">cancellation and refund policy</Link>
            . The free-cancellation window is {cancellationPolicy.freeCancelHours} hours before
            the check-in date.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">The stay</h2>
          <p className="mt-3">
            The service is the stay itself, provided at {brand.hotelName} in {brand.location}.
            Nothing is shipped. Guests must use the rooms for lawful personal stay and leave
            them in reasonable condition.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Liability</h2>
          <p className="mt-3">
            These terms are governed by the laws of India. Courts at Pune, Maharashtra, have
            jurisdiction, without limiting any rights a guest has under Indian consumer law.
          </p>
        </section>
      </article>
    </>
  );
}
