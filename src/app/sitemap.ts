import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/hakkimizda`, lastModified: new Date() },
  ];
}
