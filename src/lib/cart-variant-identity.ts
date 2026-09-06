/**
 * Cart ↔ catalog identity reconciliation.
 * Size is an attribute. Colorway/parent SKU is part of identity claims.
 * Never remap a claimed colorway to a sibling (F54083-K3 ↛ F54083-S1).
 */

import {
  normalizeSkuKey,
  parentSkuFromVariantSku,
} from "@/lib/sku-identity";
import { publicCartLineLabel } from "@/lib/public-product-identity";

export type IdentityVariant = {
  id: string;
  sku: string;
  size?: string | null;
  attributes?: Record<string, string> | null;
  available?: boolean;
  availableStock?: number;
  price?: { amount?: string } | null;
};

export type IdentityProduct = {
  id: string;
  slug: string;
  title?: string;
  variants: IdentityVariant[];
};

export type IdentityLineClaim = {
  productId: string;
  variationId: string;
  variantSku?: string;
  model?: string;
  size?: string;
  slug?: string;
  name?: string;
};

export type CartIdentityRejectReason =
  | "product_mismatch"
  | "variant_missing"
  | "colorway_mismatch"
  | "size_mismatch"
  | "empty_catalog_sku";

export type CartIdentityReconcileResult =
  | { status: "ok"; variant: IdentityVariant }
  | { status: "reject"; reason: CartIdentityRejectReason };

/** Parent colorway key: "F54083-K3 - 40" → "F54083-K3". */
export function colorwayParentKey(skuOrModel: string | undefined | null): string {
  if (!skuOrModel?.trim()) return "";
  return normalizeSkuKey(parentSkuFromVariantSku(skuOrModel));
}

export function variantSizeLabel(variant: IdentityVariant): string {
  const raw =
    variant.size ??
    variant.attributes?.size ??
    variant.attributes?.Numara ??
    "";
  return String(raw).trim() || "Standart";
}

/**
 * Match only by productId + variationId on the fetched product.
 * Then enforce claimed colorway/model/size against that variant — never remap.
 */
export function reconcileCartLineIdentity(
  product: IdentityProduct,
  line: IdentityLineClaim,
): CartIdentityReconcileResult {
  if (product.id !== line.productId) {
    return { status: "reject", reason: "product_mismatch" };
  }

  const variant = product.variants.find((v) => v.id === line.variationId);
  if (!variant) {
    return { status: "reject", reason: "variant_missing" };
  }

  const catalogSku = (variant.sku ?? "").trim();
  if (!catalogSku) {
    return { status: "reject", reason: "empty_catalog_sku" };
  }

  const catalogColorway = colorwayParentKey(catalogSku);
  const claimedSkuColorway = colorwayParentKey(line.variantSku);
  if (claimedSkuColorway && claimedSkuColorway !== catalogColorway) {
    // e.g. UI/localStorage says F54083-K3 but IDs resolve to F54083-S1
    return { status: "reject", reason: "colorway_mismatch" };
  }

  const claimedModelColorway = colorwayParentKey(line.model);
  if (claimedModelColorway && claimedModelColorway !== catalogColorway) {
    return { status: "reject", reason: "colorway_mismatch" };
  }

  const claimedSize = (line.size ?? "").trim();
  if (claimedSize) {
    const catalogSize = variantSizeLabel(variant);
    if (normalizeSkuKey(claimedSize) !== normalizeSkuKey(catalogSize)) {
      return { status: "reject", reason: "size_mismatch" };
    }
  }

  return { status: "ok", variant };
}

export function cartIdentityRejectMessage(
  line: { name?: string; size?: string; variantSku?: string; model?: string },
  reason: CartIdentityRejectReason,
): string {
  const label = `"${publicCartLineLabel(line)}"${line.size ? ` (${line.size})` : ""}`;
  switch (reason) {
    case "product_mismatch":
    case "variant_missing":
      return `${label} katalog yenilendiği için sepetten çıkarıldı. Lütfen ürünü yeniden ekleyin.`;
    case "colorway_mismatch":
      return `${label} renk / SKU uyuşmazlığı nedeniyle sepetten çıkarıldı. Lütfen doğru renk yolunu yeniden ekleyin.`;
    case "size_mismatch":
      return `${label} numara uyuşmazlığı nedeniyle sepetten çıkarıldı. Lütfen ürünü yeniden ekleyin.`;
    case "empty_catalog_sku":
      return `${label} satışa uygun değil ve sepetten çıkarıldı.`;
    default:
      return `${label} sepetten çıkarıldı. Lütfen ürünü yeniden ekleyin.`;
  }
}
