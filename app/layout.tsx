import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { brand } from "@/lib/brand";
import { publicEnv } from "@/lib/public-env";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: `Villas and hotels in Lavasa | ${brand.villaName} & ${brand.hotelName}`,
    template: `%s | ${brand.hotelName}, Lavasa`,
  },
  description: `Villas and hotels in Lavasa: book the ${brand.villaName} villa as one home, or a room at ${brand.hotelName}. A villa and hotel in Lavasa, Maharashtra, with a North Indian restaurant.`,
  keywords: [
    "villas and hotels in Lavasa",
    "villas and hotel in Lavasa",
    "villa in Lavasa",
    "hotel in Lavasa",
    "On Air Lavasa",
    "Blue Diamond Hotel Lavasa",
    "On Air villa",
    "restaurant in Lavasa",
  ],
  openGraph: {
    title: `Villas and hotels in Lavasa | ${brand.villaName} & ${brand.hotelName}`,
    description: `Villas and hotels in Lavasa. Book the ${brand.villaName} villa or a room at ${brand.hotelName}.`,
    locale: "en_IN",
    type: "website",
    siteName: brand.siteName,
    url: publicEnv.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `Villas and hotels in Lavasa | ${brand.villaName} & ${brand.hotelName}`,
    description: `Villas and hotels in Lavasa. Book the ${brand.villaName} villa or a room at ${brand.hotelName}.`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
