import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";
import { formatInr } from "@/lib/money";
import { stayListings } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Weekday, weekend, and holiday prices for the ${brand.villaName} villa and rooms at ${brand.hotelName}. GST included.`,
};

export default function PricingPage() {
  return (
    <>
      <PageIntro eyebrow={brand.hotelName} title="Pricing">
        Prices are per night in Indian rupees and include GST. Friday and Saturday nights use
        the weekend rate. A holiday rate applies only on dates {brand.hotelName} marks as
        holidays. Guests pay 30% online. The balance is paid at check-in.
      </PageIntro>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {stayListings.map((stay) => (
            <article key={stay.slug} className="rounded-3xl border border-sand bg-paper p-6">
              <h2 className="font-serif text-3xl text-ink">{stay.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{stay.summary}</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">Weekday</dt>
                  <dd className="font-medium text-ink">{formatInr(stay.rates.weekdayPaise)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">Weekend</dt>
                  <dd className="font-medium text-ink">{formatInr(stay.rates.weekendPaise)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">Holiday</dt>
                  <dd className="font-medium text-ink">{formatInr(stay.rates.holidayPaise)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-muted">
          See the{" "}
          <Link href="/refunds" className="underline">cancellation and refund policy</Link>
          {" "}and the{" "}
          <Link href="/terms" className="underline">terms and conditions</Link>.
        </p>
      </div>
    </>
  );
}
