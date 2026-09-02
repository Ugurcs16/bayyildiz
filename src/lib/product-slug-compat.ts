/**
 * Server-side old CSV slug → canonical Tervona slug redirects.
 * Static map only — never fetches the full catalog in the browser.
 */
import { PRODUCT_SLUG_COMPAT_MAP } from "@/lib/product-slug-compat-map.generated";

/**
 * If `slug` is a historical CSV slug with a deterministic Tervona target,
 * return that canonical slug. Otherwise null (caller loads by slug or 404).
 * Never returns the same slug (no self-redirect / loop).
 */
export function getCanonicalSlugRedirect(slug: string): string | null {
  const target =
    PRODUCT_SLUG_COMPAT_MAP[slug as keyof typeof PRODUCT_SLUG_COMPAT_MAP];
  if (!target || target === slug) return null;
  return target;
}

export function getSlugCompatMapSize(): number {
  return Object.keys(PRODUCT_SLUG_COMPAT_MAP).length;
}
