import { brand } from "@/lib/brand";
import { enterprise } from "@/lib/enterprise";
import { hostContact } from "@/lib/host-contact";
import { publicEnv } from "@/lib/public-env";

export function LodgingJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "Restaurant"],
    name: brand.hotelName,
    legalName: enterprise.name,
    alternateName: [brand.villaName, enterprise.name],
    description: `Villas and hotels in Lavasa. ${brand.hotelName} in ${brand.location}. The ${brand.villaName} villa is booked as a whole home. Hotel rooms are booked individually. The restaurant serves ${brand.cuisine} cuisine.`,
    url: publicEnv.siteUrl,
    servesCuisine: brand.cuisine,
    address: {
      "@type": "PostalAddress",
      streetAddress: enterprise.streetAddress,
      addressLocality: enterprise.locality,
      postalCode: enterprise.postalCode,
      addressRegion: enterprise.region,
      addressCountry: "IN",
    },
    hasMap: hostContact.mapsUrl,
    containsPlace: {
      "@type": "Accommodation",
      name: brand.villaName,
      description: "Villa booked as a whole unit.",
    },
    telephone: publicEnv.phoneE164 ? `+${publicEnv.phoneE164}` : hostContact.phoneDisplay,
    email: publicEnv.email || hostContact.email,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
