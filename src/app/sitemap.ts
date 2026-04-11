import type { MetadataRoute } from "next";
import { CATEGORY_QUICK, SITE_URL } from "@/lib/constants";
import { getCatalogProducts } from "@/lib/products-normalizer";

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "/hakkimizda", priority: 0.6, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.6, changeFrequency: "monthly" },
  { path: "/gizlilik-politikasi", priority: 0.4, changeFrequency: "yearly" },
  { path: "/sartlar-ve-kosullar", priority: 0.4, changeFrequency: "yearly" },
  { path: "/iade-degisim", priority: 0.45, changeFrequency: "yearly" },
  { path: "/mesafeli-satis", priority: 0.4, changeFrequency: "yearly" },
  { path: "/gizlilik", priority: 0.35, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const home: MetadataRoute.Sitemap[0] = {
    url: `${base}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  };

  const categories: MetadataRoute.Sitemap = CATEGORY_QUICK.map((c) => ({
    url: `${base}/kategori/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const products = getCatalogProducts().map((p) => ({
    url: `${base}/urun/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = STATIC_PATHS.map((s) => ({
    url: `${base}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  return [home, ...categories, ...products, ...staticPages];
}
