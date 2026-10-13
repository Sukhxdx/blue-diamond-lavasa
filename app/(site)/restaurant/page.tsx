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
  description: `${brand.cuisine} cuisine at ${brand.hotelName} in Lavasa.`,
};

const categories = [
  "Starters",
  "Tandoor",
  "Curries",
  "Breads",
  "Rice",
  "Desserts",
  "Beverages",
];

export default function RestaurantPage() {
  const phone = telHref(publicEnv.phoneE164);
  const whatsapp = whatsappHref(
    publicEnv.whatsappE164 || hostContact.whatsappDigits,
    `Hello, I would like to reserve a table at ${brand.hotelName}.`,
  );

  return (
    <>
      <PageIntro eyebrow={brand.cuisine} title="Restaurant">
        {brand.cuisine} cuisine at {brand.hotelName} in {brand.location}. Scan the QR card on
        your table to open the live menu.
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
          {phone ? (
            <a href={phone} className="inline-flex justify-center rounded-full bg-pine px-5 py-3 text-sm text-cream">
              Call to reserve
            </a>
          ) : (
            <Link href="/contact" className="inline-flex justify-center rounded-full bg-pine px-5 py-3 text-sm text-cream">
              Contact to reserve
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

        <ul className="mt-10 divide-y divide-sand rounded-3xl border border-sand bg-paper">
          {categories.map((category) => (
            <li key={category} className="px-5 py-5">
              <h2 className="font-serif text-2xl">{category}</h2>
              <p className="mt-1 text-sm text-muted">No dishes published in this category yet.</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
