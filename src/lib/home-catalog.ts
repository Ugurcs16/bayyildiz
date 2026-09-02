import type { CatalogProduct } from "@/lib/products-normalizer";

const HOME_FEATURED_LIMIT = 12;

function featuredScore(p: CatalogProduct): number {
  let score = 0;
  if (p.stock !== "yok") score += 10;
  if (p.stock === "az") score += 2;
  if (p.image?.trim()) score += 5;
  if (p.images.length > 0) score += 2;
  if (p.hoverImage?.trim()) score += 1;
  return score;
}

/** Ana sayfa vitrini: stoklu ve görselli ürünler önce, en fazla 12 adet. */
export function pickHomeFeaturedProducts(
  products: CatalogProduct[],
  limit = HOME_FEATURED_LIMIT,
): CatalogProduct[] {
  return [...products]
    .sort((a, b) => featuredScore(b) - featuredScore(a) || a.name.localeCompare(b.name, "tr"))
    .slice(0, limit);
}

export { HOME_FEATURED_LIMIT };
