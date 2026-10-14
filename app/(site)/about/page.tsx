import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";
import { enterprise } from "@/lib/enterprise";

export const metadata: Metadata = {
  title: "About",
  description: `Villas and hotels in Lavasa. ${brand.villaName} is the villa. ${brand.hotelName} is the registered hotel in Lavasa, Maharashtra.`,
};

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow={enterprise.name} title="About">
        {enterprise.name} operates {brand.hotelName} and the {brand.villaName} villa in{" "}
        {brand.location}, {brand.country}.
      </PageIntro>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-2">
        <article className="rounded-3xl border border-sand bg-paper p-6 md:col-span-2">
          <h2 className="font-serif text-4xl">{enterprise.name}</h2>
          <p className="mt-3 leading-7 text-muted">
            Proprietorship of {enterprise.proprietor}. Udyam registration {enterprise.udyam}.
            Registered address: {enterprise.addressLines.join(", ")}.
          </p>
        </article>
        <article className="rounded-3xl bg-paper p-6">
          <h2 className="font-serif text-4xl">{brand.villaName}</h2>
          <p className="mt-3 leading-7 text-muted">
            On Air is the name of the villa. Guests book it as one whole home. Booking the
            villa does not block the hotel rooms.
          </p>
        </article>
        <article className="rounded-3xl bg-pine p-6 text-cream">
          <h2 className="font-serif text-4xl">{brand.hotelName}</h2>
          <p className="mt-3 leading-7 text-cream/80">
            Blue Diamond Hotel is the hotel. It has three double rooms
            and two deluxe rooms for four. Rooms are booked individually. The restaurant
            serves {brand.cuisine.toLowerCase()} cuisine.
          </p>
        </article>
      </div>
    </>
  );
}
