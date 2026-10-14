import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { brand } from "@/lib/brand";
import { enterprise } from "@/lib/enterprise";
import { formatInr } from "@/lib/money";
import { photos } from "@/lib/photos";
import { stayListings } from "@/lib/rooms";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-pine text-cream">
        <Image
          src="/photos/villa/on-air-lake.jpg"
          alt="The On Air lawn and name, looking over the lake in Lavasa"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_65%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/55 to-pine/25" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-6xl flex-col justify-end px-4 pt-16 pb-10">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-brass-bright">
            {brand.location}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[0.95] sm:text-7xl">
            {brand.villaName}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-cream/85">
            Villas and hotels in Lavasa. Book the {brand.villaName} villa as one home, or a
            room at {brand.hotelName}, with a North Indian restaurant on site.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="stay-heading">
          <h2 id="stay-heading" className="font-serif text-4xl text-ink sm:text-5xl">
          Villas and hotels in Lavasa
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stayListings.map((stay) => (
            <Link
              key={stay.slug}
              href="/stay"
              className="overflow-hidden rounded-3xl border border-sand bg-paper transition hover:-translate-y-0.5 hover:border-brass"
            >
              <Image
                src={stay.cover}
                alt={stay.alt}
                width={1800}
                height={1200}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">
                {stay.kind === "villa" ? "Villa" : "Hotel room"}
              </p>
              <h3 className="mt-3 font-serif text-4xl text-ink">{stay.name}</h3>
              <p className="mt-3 leading-7 text-muted">{stay.summary}</p>
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
              <p className="mt-3 text-xs text-muted">Per night, GST included.</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-sand bg-paper" aria-labelledby="gallery-heading">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <h2 id="gallery-heading" className="font-serif text-4xl text-ink sm:text-5xl">
              Gallery
            </h2>
            <p className="mt-4 max-w-md leading-7 text-muted">
              The On Air villa, Blue Diamond Hotel rooms, the restaurant, and the lake.
            </p>
            <Link href="/gallery" className="mt-6 inline-flex text-sm font-medium text-lake underline">
              Open the gallery
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["/photos/villa/house-front.jpg", "/photos/rooms/deluxe-lake-door.jpg", "/photos/restaurant/dining-terrace.jpg", "/photos/views/lavasa-lake.jpg"].map((src) => {
              const photo = photos.find((item) => item.src === src);
              if (!photo) return null;
              return (
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-[4/5] rounded-2xl object-cover"
              />
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2" aria-labelledby="restaurant-heading">
        <div className="overflow-hidden rounded-3xl bg-lake text-cream">
          <Image
            src="/photos/restaurant/dining-terrace.jpg"
            alt="Open-air restaurant terrace at Blue Diamond Hotel"
            width={1800}
            height={1350}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="px-6 py-10">
          <p className="text-xs uppercase tracking-[0.18em] text-brass-bright">{brand.cuisine} cuisine</p>
          <h2 id="restaurant-heading" className="mt-3 font-serif text-4xl sm:text-5xl">
            The restaurant
          </h2>
          <p className="mt-4 max-w-md leading-7 text-cream/85">
            A {brand.cuisine} restaurant at {brand.hotelName}, for guests staying at the villa or the hotel.
          </p>
          <Link
            href="/restaurant"
            className="mt-6 inline-flex rounded-full bg-cream px-4 py-3 text-sm font-medium text-ink"
          >
            View the restaurant
          </Link>
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <h2 className="font-serif text-4xl text-ink">Location</h2>
          <p className="mt-4 leading-7 text-muted">
            {enterprise.name}, {enterprise.addressLines[0]}, {enterprise.addressLines[1]},{" "}
            {enterprise.addressLines[2]}.
          </p>
          <Link href="/contact" className="mt-6 inline-flex text-sm font-medium text-lake underline">
            Contact
          </Link>
        </div>
      </section>
    </>
  );
}
