import type { CartLine } from "@/components/providers/cart-context";
import {
  cartIdentityRejectMessage,
  reconcileCartLineIdentity,
  variantSizeLabel,
} from "@/lib/cart-variant-identity";
import { parentSkuFromVariantSku } from "@/lib/sku-identity";
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
  reason?: string;
};

export type CartValidationResult = {
  items: CartLine[];
  issues: CartValidationIssue[];
  /** True when checkout may continue (cart non-empty, stock verified or adjusted). */
  ok: boolean;
};

/**
 * Authoritative line from Tervona product + matched variant IDs.
 * Always overwrites identity fields from catalog — never keeps a conflicting claim.
 */
export function authoritativeCartLine(
  line: CartLine,
  product: StorefrontProduct,
  variant: StorefrontVariant,
  quantity: number,
): CartLine {
  const sku = (variant.sku ?? "").trim();
  return {
    ...line,
    productId: product.id,
    variationId: variant.id,
    slug: product.slug,
    name: product.title || line.name,
    model: parentSkuFromVariantSku(sku) || line.model,
    variantSku: sku,
    size: variantSizeLabel(variant),
    price: variant.price?.amount ?? line.price,
    availableStock: Math.max(0, variant.availableStock),
    quantity,
    key: `${product.id}::${variant.id}`,
  };
}

/**
 * Revalidate cart lines against live Tervona stock + colorway identity.
 * Stale / conflicting lines are removed — never remapped to a sibling colorway.
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
      const reconciled = reconcileCartLineIdentity(product, line);
      if (reconciled.status === "reject") {
        issues.push({
          key: line.key,
          action: "removed",
          reason: reconciled.reason,
          message: cartIdentityRejectMessage(line, reconciled.reason),
        });
        continue;
      }

      const variant = reconciled.variant as StorefrontVariant;
      if (!variant.available || variant.availableStock <= 0) {
        issues.push({
          key: line.key,
          action: "removed",
          reason: "out_of_stock",
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
          reason: "not_found",
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
