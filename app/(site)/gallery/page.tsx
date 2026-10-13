import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photographs of the ${brand.villaName} villa, ${brand.hotelName} rooms, restaurant, and views in Lavasa.`,
};

export default function GalleryPage() {
  return (
    <>
      <PageIntro eyebrow="Photographs" title="Gallery">
        Villa, rooms, restaurant, and views at {brand.villaName} and {brand.hotelName}.
      </PageIntro>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <GalleryGrid />
      </div>
    </>
  );
}
