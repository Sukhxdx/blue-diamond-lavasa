import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PayAdvanceLink } from "@/components/pay-advance-link";
import { SearchBar } from "@/components/search-bar";
import { brand } from "@/lib/brand";
import { hostContact } from "@/lib/host-contact";
import { formatInr } from "@/lib/money";
import { stayListings } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Stay",
  description: `Book the ${brand.villaName} villa as a whole home, or a room at ${brand.hotelName} in Lavasa.`,
};

type StaySearch = {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
};

export default function StayPage({
  searchParams,
}: {
  searchParams: Promise<StaySearch>;
}) {
  return (
    <>
      <PageIntro eyebrow={brand.location} title="Stay">
        Book the {brand.villaName} villa as one home, or a room at {brand.hotelName}.
      </PageIntro>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Suspense fallback={<p className="text-muted">Loading your dates…</p>}>
          <StayQuery searchParams={searchParams} />
        </Suspense>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stayListings.map((stay) => (
            <article key={stay.slug} className="overflow-hidden rounded-3xl border border-sand bg-paper">
              <Image
                src={stay.cover}
                alt={stay.alt}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-brass">
                  {stay.kind === "villa" ? "Villa" : brand.hotelName}
                </p>
                <h2 className="mt-2 font-serif text-3xl">{stay.name}</h2>
                <p className="mt-3 leading-7 text-muted">{stay.summary}</p>
                {stay.guests ? <p className="mt-3 text-sm text-ink">Sleeps {stay.guests}</p> : null}
                <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-muted">Weekday</dt>
                    <dd className="font-medium text-ink">{formatInr(stay.rates.weekdayPaise)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Weekend</dt>
                    <dd className="font-medium text-ink">{formatInr(stay.rates.weekendPaise)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Holiday</dt>
                    <dd className="font-medium text-ink">{formatInr(stay.rates.holidayPaise)}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-5 text-muted">
                  Per night, GST included. Friday and Saturday nights use the weekend rate.
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-start gap-3">
          <PayAdvanceLink />
          <p className="max-w-xl text-sm leading-6 text-muted">
            Pay 30% of the stay on Razorpay. In the note, write your name, phone, the stay, and
            the dates. The balance is paid at check-in.
          </p>
        </div>
        <p className="mt-6 text-sm leading-6 text-muted">
          After payment, the receipt and booking details go to you and to the host. Call the
          host on{" "}
          <a href={hostContact.telHref} className="font-medium text-ink underline">
            {hostContact.phoneDisplay}
          </a>
          . Read the{" "}
          <Link href="/pricing" className="font-medium text-ink underline">
            prices
          </Link>
          ,{" "}
          <Link href="/terms" className="font-medium text-ink underline">
            terms
          </Link>
          , and{" "}
          <Link href="/refunds" className="font-medium text-ink underline">
            cancellation and refund policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}

async function StayQuery({ searchParams }: { searchParams: Promise<StaySearch> }) {
  const params = await searchParams;
  const guests = params.guests || "2";

  return (
    <div>
      <SearchBar checkIn={params.checkIn} checkOut={params.checkOut} guests={guests} />
      {params.checkIn && params.checkOut ? (
        <p className="mt-4 text-sm text-muted">
          Dates selected: {params.checkIn} to {params.checkOut}, {guests}{" "}
          {guests === "1" ? "guest" : "guests"}. A confirmed booking collects 30% online. The
          balance is paid at check-in.
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Choose dates above. Nightly prices for each stay are listed below and on the{" "}
          <Link href="/pricing" className="font-medium text-ink underline">
            pricing page
          </Link>
          .
        </p>
      )}
    </div>
  );
}
