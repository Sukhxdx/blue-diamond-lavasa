import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";
import { hostContact } from "@/lib/host-contact";
import { cancellationPolicy } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Cancellation and refund policy",
  description: `How ${brand.hotelName} cancels a stay and refunds the Razorpay advance.`,
};

export default function RefundsPage() {
  return (
    <>
      <PageIntro eyebrow={brand.hotelName} title="Cancellation and refunds">
        Refunds go back to the original Razorpay payment method. The balance due at check-in
        is not taken online.
      </PageIntro>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 leading-7 text-muted">
        <section>
          <h2 className="font-serif text-3xl text-ink">What is paid online</h2>
          <p className="mt-3">
            A booking takes a 30% advance through Razorpay. Prices are listed on the{" "}
            <Link href="/pricing" className="text-ink underline">pricing page</Link> and include
            GST. The remaining 70% is paid at {brand.hotelName} at check-in.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">If you cancel in time</h2>
          <p className="mt-3">
            Cancel {cancellationPolicy.freeCancelHours} hours or more before the check-in date
            and the full amount paid online is refunded. {brand.hotelName} starts the refund
            within {cancellationPolicy.refundBusinessDays} business days. Razorpay returns it
            to the original payment method. Bank timelines after that are set by the guest’s
            bank.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">Late cancellation and no-show</h2>
          <p className="mt-3">
            If you cancel inside {cancellationPolicy.freeCancelHours} hours of the check-in
            date, or you do not arrive, the 30% advance is kept. Any amount paid online above
            that advance is refunded within {cancellationPolicy.refundBusinessDays} business
            days.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">If the hotel cancels</h2>
          <p className="mt-3">
            If {brand.hotelName} cancels a confirmed booking, the full amount paid online is
            refunded within {cancellationPolicy.refundBusinessDays} business days.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-ink">How to cancel</h2>
          <p className="mt-3">
            Call or WhatsApp the host on{" "}
            <a href={hostContact.telHref} className="text-ink underline">
              {hostContact.phoneDisplay}
            </a>{" "}
            and quote the booking id from your receipt. The cancellation time is the time the
            host receives that message.
          </p>
        </section>
      </article>
    </>
  );
}
