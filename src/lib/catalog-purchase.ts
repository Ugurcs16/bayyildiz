import type { CatalogProduct, CatalogVariation } from "@/lib/products-normalizer";

/** Stok adedi veya bayrak: 0 ise numara seçilemez. */
export function isVariationSelectable(v: CatalogVariation): boolean {
  if (v.stockQty <= 0) return false;
  return v.stock !== "yok";
}

/** Dummy ürünlerde varyasyon yoksa tek satır üretir. */
/** Seçili numara için kısa stok metni (satış odaklı). */
export function stockQtyLabel(v: CatalogVariation, selectable: boolean): string {
  if (!selectable || v.stockQty <= 0) return "Tükendi";
  if (v.stockQty === 1) return "Son 1 adet";
  if (v.stockQty <= 3) return "Son adetler";
  return "Stokta";
}

export type StockQtyTone = "out" | "low" | "ok";

/** Etiket rengi: tükendi | düşük stok uyarısı | rahat stok. */
export function stockQtyTone(v: CatalogVariation, selectable: boolean): StockQtyTone {
  if (!selectable || v.stockQty <= 0) return "out";
  if (v.stockQty <= 3) return "low";
  return "ok";
}

export function getPurchaseVariations(product: CatalogProduct): CatalogVariation[] {
  if (product.variations.length > 0) {
    return [...product.variations].sort(
      (a, b) => Number(a.size) - Number(b.size) || a.size.localeCompare(b.size, "tr"),
    );
  }
  const qty =
    product.stock === "yok" ? 0 : product.stock === "az" ? 2 : 8;
  return [
    {
      id: `local-${product.id}`,
      parentSku: product.code,
      sku: product.code,
      size: "Standart",
      price: product.price,
      stockQty: qty,
      stock: product.stock,
      image: product.image,
    },
  ];
}
