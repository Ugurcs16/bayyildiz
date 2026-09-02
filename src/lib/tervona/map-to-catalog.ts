import type { CategoryId } from "@/lib/dummy";
import type { CatalogProduct, CatalogVariation } from "@/lib/products-normalizer";
import type { StorefrontProduct, StorefrontStockState, StorefrontVariant } from "./types";

const CATEGORY_SLUGS: CategoryId[] = [
  "gunluk",
  "klasik",
  "outdoor",
  "bot",
  "yeni-sezon",
];

function parseMoney(amount: string | undefined): number {
  const n = Number.parseFloat(amount ?? "");
  return Number.isFinite(n) ? n : 0;
}

function stripHtml(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapCategory(slug: string | null | undefined): CategoryId {
  const value = (slug ?? "").toLocaleLowerCase("tr-TR");
  if ((CATEGORY_SLUGS as string[]).includes(value)) {
    return value as CategoryId;
  }
  if (value.includes("bot")) return "bot";
  if (value.includes("outdoor")) return "outdoor";
  if (value.includes("klasik") || value.includes("classic")) return "klasik";
  if (value.includes("sezon") || value.includes("yeni")) return "yeni-sezon";
  if (value.includes("gunluk") || value.includes("günlük") || value.includes("casual")) {
    return "gunluk";
  }
  return "gunluk";
}

function stockFromQty(qty: number): CatalogProduct["stock"] {
  if (qty <= 0) return "yok";
  if (qty <= 3) return "az";
  return "var";
}

function stockFromState(
  state: StorefrontStockState | undefined,
  qty: number,
): CatalogProduct["stock"] {
  if (state === "sold_out" || qty <= 0) return "yok";
  if (state === "last_item" || state === "low_stock") return "az";
  return "var";
}

function modelCodeFromVariants(variants: StorefrontVariant[], title: string): string {
  const sku = variants[0]?.sku?.trim() ?? "";
  if (!sku) return title.slice(0, 32);
  const base = sku.split(" - ")[0]?.trim() || sku;
  return base;
}

function mapVariation(
  product: StorefrontProduct,
  variant: StorefrontVariant,
): CatalogVariation {
  const qty = Math.max(0, Number(variant.availableStock) || 0);
  const size =
    (variant.size ?? variant.attributes?.size ?? variant.attributes?.Numara ?? "")
      .toString()
      .trim() || "Standart";

  return {
    id: variant.id,
    parentSku: modelCodeFromVariants(product.variants, product.title),
    sku: variant.sku,
    size,
    price: parseMoney(variant.price?.amount) || parseMoney(product.price?.amount),
    stockQty: qty,
    stock: stockFromState(variant.stockState, qty),
  };
}

/** Map Tervona public product → existing CatalogProduct shape (UI-compatible). */
export function mapStorefrontProductToCatalog(
  product: StorefrontProduct,
): CatalogProduct {
  const images = [...(product.images ?? [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((img) => img.url)
    .filter(Boolean);

  const variations = (product.variants ?? [])
    .map((v) => mapVariation(product, v))
    .sort(
      (a, b) =>
        Number(a.size) - Number(b.size) || a.size.localeCompare(b.size, "tr"),
    );

  const totalStock =
    typeof product.totalAvailableStock === "number"
      ? product.totalAvailableStock
      : variations.reduce((s, v) => s + v.stockQty, 0);

  const desc = stripHtml(product.description ?? "");
  const teaser =
    desc.length > 140 ? `${desc.slice(0, 137)}...` : desc || "Hakiki deri erkek ayakkabı.";

  const price =
    parseMoney(product.price?.amount) ||
    Math.min(...variations.map((v) => v.price).filter((n) => n > 0), Infinity);
  const safePrice = Number.isFinite(price) ? price : 0;

  const compare = parseMoney(product.compareAtPrice?.amount ?? undefined);
  const oldPrice = compare > safePrice ? compare : undefined;

  const category = mapCategory(product.category?.slug);
  const mainImage = images[0] ?? "";

  return {
    id: product.id,
    slug: product.slug,
    name: product.title,
    code: modelCodeFromVariants(product.variants ?? [], product.title),
    price: safePrice,
    oldPrice,
    image: mainImage,
    imageAlt: product.images?.[0]?.alt || product.title,
    hoverImage: images[1],
    teaser,
    seoDescription: desc || undefined,
    stock: stockFromQty(totalStock),
    category,
    description: desc,
    categoriesText: product.category?.name ?? category,
    images,
    variations,
  };
}

/** Count products whose primary image still points at WordPress wp-content. */
export function countWpContentImages(products: CatalogProduct[]): number {
  return products.filter((p) =>
    (p.image || p.images[0] || "").includes("/wp-content/"),
  ).length;
}
