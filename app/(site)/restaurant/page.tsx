import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";
import { hostContact } from "@/lib/host-contact";
import { telHref, whatsappHref } from "@/lib/links";
import { publicEnv } from "@/lib/public-env";

export const metadata: Metadata = {
  title: "Restaurant",
  description: `${brand.cuisine} restaurant at ${brand.hotelName} in Lavasa, beside the On Air villa.`,
};

export default function RestaurantPage() {
  const phone = telHref(publicEnv.phoneE164);
  const whatsapp = whatsappHref(
    publicEnv.whatsappE164 || hostContact.whatsappDigits,
    `Hello, I would like to reserve a table at ${brand.hotelName}.`,
  );

  return (
    <>
      <PageIntro eyebrow={brand.cuisine} title="Restaurant">
        {brand.hotelName} has a {brand.cuisine} restaurant on the property, next to the{" "}
        {brand.villaName} villa. Breakfast, lunch, and dinner are served for staying guests.
        To book a room or the villa, use the stay page.
      </PageIntro>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Image
          src="/photos/restaurant/dining-terrace.jpg"
          alt="Open-air restaurant terrace at Blue Diamond Hotel"
          width={1800}
          height={1350}
          priority
          sizes="(min-width: 1152px) 72rem, 100vw"
          className="mb-8 aspect-[16/9] w-full rounded-3xl object-cover"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/stay" className="inline-flex justify-center rounded-full bg-pine px-5 py-3 text-sm text-cream">
            Book a stay
          </Link>
          {phone ? (
            <a href={phone} className="inline-flex justify-center rounded-full border border-sand bg-paper px-5 py-3 text-sm">
              Call to reserve a table
            </a>
          ) : (
            <Link href="/contact" className="inline-flex justify-center rounded-full border border-sand bg-paper px-5 py-3 text-sm">
              Contact to reserve a table
            </Link>
          )}
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-sand bg-paper px-5 py-3 text-sm"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
        <p className="mt-8 max-w-2xl leading-7 text-muted">
          Nightly prices for the villa and the hotel rooms are on the{" "}
          <Link href="/pricing" className="font-medium text-ink underline">
            pricing page
          </Link>
          .
        </p>
      </div>
    </>
  );
}
