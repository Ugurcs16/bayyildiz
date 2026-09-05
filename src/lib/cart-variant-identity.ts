/**
 * Resolve cart line → storefront variant by stable IDs only.
 * Size and SKU are attributes, never identity across colorways.
 */

export type VariantIdentityProduct = {
  id: string;
  variants: Array<{
    id: string;
    sku: string;
    size?: string | null;
    attributes?: Record<string, string> | null;
    available?: boolean;
    availableStock?: number;
    price?: { amount?: string } | null;
  }>;
};

export type VariantIdentityLine = {
  productId: string;
  variationId: string;
  variantSku?: string;
  size?: string;
};

/**
 * Match only when productId and variationId both belong to the same product.
 * Never fall back to size or SKU (would cross F54083-K3 ↔ F54083-S1).
 */
export function resolveVariantByStableIds<T extends VariantIdentityProduct>(
  product: T,
  line: VariantIdentityLine,
): T["variants"][number] | undefined {
  if (product.id !== line.productId) {
    return undefined;
  }
  return product.variants.find((v) => v.id === line.variationId);
}
