/**
 * GSC 404 düzeltme paketi 1 — yalnızca sınıf A (kesin eşleşme) + değerlendirilmiş
 * `/collections/bot`. B/C/D (page/2|3, seri-sonu) ve ölü compat hedefleri yok.
 *
 * Kaynak: bayyildiz-gsc-133-classification.csv (class=A).
 * Hedefler: sitemap ∩ Tervona aktif ürün / geçerli kategori.
 */

export type LegacyRedirectRule = {
  /** Path without domain; no trailing slash. */
  source: string;
  destination: string;
  permanent: true;
};

/** Category + collections + product path redirects for next.config. */
export const GSC_LEGACY_REDIRECTS_PKG1: readonly LegacyRedirectRule[] = [
  // Categories (A)
  {
    source: "/urun-kategori/klasik",
    destination: "/kategori/klasik",
    permanent: true,
  },
  {
    source: "/urun-kategori/gunluk",
    destination: "/kategori/gunluk",
    permanent: true,
  },
  {
    source: "/urun-kategori/outdoor",
    destination: "/kategori/outdoor",
    permanent: true,
  },
  {
    source: "/urun-kategori/bot",
    destination: "/kategori/bot",
    permanent: true,
  },
  {
    source: "/urun-kategori/gunluk/page/1",
    destination: "/kategori/gunluk",
    permanent: true,
  },
  // Evaluated D→A candidate (same target as /urun-kategori/bot)
  {
    source: "/collections/bot",
    destination: "/kategori/bot",
    permanent: true,
  },
  // Products (A) — single live colorway / variant only
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-m22183",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-m22183-m22183-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-m22096",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-m22096-m22096-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-p2239-2",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-p2239-p2239-s2",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-h110396",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-h110396-h110396-s1",
    permanent: true,
  },
  {
    source: "/urun/model-f263181-s1",
    destination: "/urun/model-f263181-s1-f263181-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-p080",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-p080-p080-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-p080-3",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-p080-p080-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-p080-2",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-p080-p080-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-m19551",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-m19551-m19551-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-p132470",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-p132470-p132470-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-m21514",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-m21514-m21514-s1",
    permanent: true,
  },
  {
    source: "/urun/model-f2650-s1",
    destination: "/urun/model-f2650-s1-f2650-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-m16197",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-m16197-m16197-s1",
    permanent: true,
  },
  {
    source: "/urun/bayyildiz-gunluk-ayakkabi-model-h260881",
    destination: "/urun/bayyildiz-gunluk-ayakkabi-model-h260881-h260881-s1",
    permanent: true,
  },
] as const;

/** Product slug → canonical slug (for page-level compat lookup). */
export const GSC_LEGACY_PRODUCT_SLUG_REDIRECTS_PKG1: Readonly<
  Record<string, string>
> = Object.fromEntries(
  GSC_LEGACY_REDIRECTS_PKG1.filter(
    (r) => r.source.startsWith("/urun/") && r.destination.startsWith("/urun/"),
  ).map((r) => [
    r.source.slice("/urun/".length),
    r.destination.slice("/urun/".length),
  ]),
);

export function getGscPkg1ProductSlugRedirect(slug: string): string | null {
  const target = GSC_LEGACY_PRODUCT_SLUG_REDIRECTS_PKG1[slug];
  if (!target || target === slug) return null;
  return target;
}
