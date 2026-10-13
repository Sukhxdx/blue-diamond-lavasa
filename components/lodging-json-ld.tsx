import { brand } from "@/lib/brand";
import { hostContact } from "@/lib/host-contact";
import { publicEnv } from "@/lib/public-env";

export function LodgingJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "Restaurant"],
    name: brand.hotelName,
    alternateName: brand.villaName,
    description: `Villas and hotels in Lavasa. ${brand.hotelName} in ${brand.location}. The ${brand.villaName} villa is booked as a whole home. Hotel rooms are booked individually. The restaurant serves ${brand.cuisine} cuisine.`,
    url: publicEnv.siteUrl,
    servesCuisine: brand.cuisine,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lavasa",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    containsPlace: {
      "@type": "Accommodation",
      name: brand.villaName,
      description: "Villa booked as a whole unit.",
    },
    telephone: publicEnv.phoneE164 ? `+${publicEnv.phoneE164}` : hostContact.phoneDisplay,
    ...(publicEnv.email ? { email: publicEnv.email } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
