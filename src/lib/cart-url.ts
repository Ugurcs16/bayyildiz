/** WooCommerce mağaza kökü — örn. https://magaza.site.com */
export function getWooCommerceStoreUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL?.replace(/\/$/, "");
  return raw || null;
}

/**
 * WooCommerce klasik ?add-to-cart= akışı.
 * Varyasyonlu ürünlerde genelde variation id ile kullanılır.
 */
export function buildAddToCartUrl(
  productOrVariationId: number,
  quantity = 1,
): string | null {
  const base = getWooCommerceStoreUrl();
  if (!base) return null;
  const u = new URL(base);
  u.searchParams.set("add-to-cart", String(productOrVariationId));
  if (quantity > 1) u.searchParams.set("quantity", String(quantity));
  return u.toString();
}
