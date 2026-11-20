/**
 * Server-side old CSV slug → canonical Tervona slug redirects.
 * Static map only — never fetches the full catalog in the browser.
 */
import { getGscPkg1ProductSlugRedirect } from "@/lib/gsc-legacy-redirects-pkg1";
import { PRODUCT_SLUG_COMPAT_MAP } from "@/lib/product-slug-compat-map.generated";

/**
 * If `slug` is a historical CSV slug with a deterministic Tervona target,
 * return that canonical slug. Otherwise null (caller loads by slug or 404).
 * Never returns the same slug (no self-redirect / loop).
 *
 * GSC pkg1 curated redirects are checked first (verified live targets).
 * Generated compat map is unchanged (including known-dead destinations).
 */
export function getCanonicalSlugRedirect(slug: string): string | null {
  const gsc = getGscPkg1ProductSlugRedirect(slug);
  if (gsc) return gsc;
  const target =
    PRODUCT_SLUG_COMPAT_MAP[slug as keyof typeof PRODUCT_SLUG_COMPAT_MAP];
  if (!target || target === slug) return null;
  return target;
}

export function getSlugCompatMapSize(): number {
  return Object.keys(PRODUCT_SLUG_COMPAT_MAP).length;
}
