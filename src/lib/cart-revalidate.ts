import type { CartLine } from "@/components/providers/cart-context";
import { resolveVariantByStableIds } from "@/lib/cart-variant-identity";
import {
  fetchStorefrontProductBySlug,
  TervonaNotFoundError,
  TervonaTransportError,
} from "@/lib/tervona/client";
import type { StorefrontProduct, StorefrontVariant } from "@/lib/tervona/types";

export type CartValidationIssue = {
  key: string;
  message: string;
  action: "removed" | "reduced" | "unverified";
  quantity?: number;
};

export type CartValidationResult = {
  items: CartLine[];
  issues: CartValidationIssue[];
  /** True when checkout may continue (cart non-empty, stock verified or adjusted). */
  ok: boolean;
};

function variantSize(variant: StorefrontVariant): string {
  const raw =
    variant.size ??
    variant.attributes?.size ??
    variant.attributes?.Numara ??
    "";
  return String(raw).trim() || "Standart";
}

/**
 * Authoritative line from Tervona product + matched variant IDs.
 * Never copies identity from SKU/size alone.
 */
export function authoritativeCartLine(
  line: CartLine,
  product: StorefrontProduct,
  variant: StorefrontVariant,
  quantity: number,
): CartLine {
  return {
    ...line,
    productId: product.id,
    variationId: variant.id,
    slug: product.slug,
    name: product.title || line.name,
    variantSku: variant.sku || line.variantSku,
    size: variantSize(variant),
    price: variant.price?.amount ?? line.price,
    availableStock: Math.max(0, variant.availableStock),
    quantity,
    key: `${product.id}::${variant.id}`,
  };
}

/**
 * Revalidate cart lines against live Tervona stock.
 * Transport failures leave items unchanged and mark `unverified`.
 */
export async function revalidateCartAgainstTervona(
  items: CartLine[],
): Promise<CartValidationResult> {
  const next: CartLine[] = [];
  const issues: CartValidationIssue[] = [];
  let unverified = false;

  for (const line of items) {
    try {
      const product = await fetchStorefrontProductBySlug(line.slug);
      if (product.id !== line.productId) {
        issues.push({
          key: line.key,
          action: "removed",
          message: `"${line.name}" sepet kimliği ürünle uyuşmuyor ve çıkarıldı.`,
        });
        continue;
      }
      const variant = resolveVariantByStableIds(product, line);
      if (!variant || !variant.available || variant.availableStock <= 0) {
        issues.push({
          key: line.key,
          action: "removed",
          message: `"${line.name}" (${line.size}) stokta kalmadı ve sepetten çıkarıldı.`,
        });
        continue;
      }
      const max = Math.max(0, variant.availableStock);
      if (line.quantity > max) {
        next.push(authoritativeCartLine(line, product, variant, max));
        issues.push({
          key: line.key,
          action: "reduced",
          quantity: max,
          message: `"${line.name}" (${line.size}) için stok ${max} adetle sınırlandı.`,
        });
        continue;
      }
      next.push(authoritativeCartLine(line, product, variant, line.quantity));
    } catch (error) {
      if (error instanceof TervonaNotFoundError) {
        issues.push({
          key: line.key,
          action: "removed",
          message: `"${line.name}" artık satışta değil ve sepetten çıkarıldı.`,
        });
        continue;
      }
      if (error instanceof TervonaTransportError) {
        unverified = true;
        next.push(line);
        issues.push({
          key: line.key,
          action: "unverified",
          message:
            "Stok doğrulaması şu an yapılamadı. Lütfen biraz sonra tekrar deneyin.",
        });
        continue;
      }
      unverified = true;
      next.push(line);
    }
  }

  return {
    items: next,
    issues,
    ok: next.length > 0 && !unverified,
  };
}
