import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/public-env";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/stay",
    "/pricing",
    "/restaurant",
    "/gallery",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/refunds",
    "/shipping",
  ];

  return paths.map((path) => ({
    url: `${publicEnv.siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
