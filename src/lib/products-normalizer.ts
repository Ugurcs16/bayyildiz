import { CATEGORIES, DUMMY_PRODUCTS, type CategoryId, type DummyProduct } from "@/lib/dummy";
import { loadProductsCsvRows, type CsvRow } from "@/lib/products-csv";

export type CatalogVariation = {
  id: string;
  parentSku: string;
  sku: string;
  size: string;
  price: number;
  stockQty: number;
  stock: DummyProduct["stock"];
  image?: string;
};

export type CatalogProduct = DummyProduct & {
  description: string;
  categoriesText: string;
  images: string[];
  variations: CatalogVariation[];
};

const CATEGORY_LABEL_BY_ID: Record<CategoryId, string> = {
  gunluk: "Günlük",
  klasik: "Klasik",
  outdoor: "Outdoor",
  bot: "Bot",
  "yeni-sezon": "Yeni Sezon",
};

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function stripHtml(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePrice(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function parseImages(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.startsWith("http"));
}

function mapCategory(raw: string): CategoryId {
  const value = raw.toLocaleLowerCase("tr-TR");
  if (value.includes("bot")) return "bot";
  if (value.includes("outdoor")) return "outdoor";
  if (value.includes("klasik")) return "klasik";
  if (value.includes("yeni sezon")) return "yeni-sezon";
  if (value.includes("günlük") || value.includes("gunluk")) return "gunluk";
  return "gunluk";
}

function extractFamilyCode(name: string, sku: string) {
  const fromName = name.match(/model\s+([a-z0-9]+)/i)?.[1];
  if (fromName) return fromName.toUpperCase();
  const skuCore = sku.split("-")[0]?.trim();
  return skuCore ? skuCore.toUpperCase() : sku.toUpperCase();
}

function makeTeaser(shortDesc: string, fullDesc: string) {
  const source = stripHtml(shortDesc) || stripHtml(fullDesc);
  if (!source) return "Hakiki deri erkek ayakkabı modeli.";
  return source.length > 140 ? `${source.slice(0, 137)}...` : source;
}

function stockFromQty(inStock: boolean, qty: number): DummyProduct["stock"] {
  if (!inStock) return "yok";
  if (qty > 0 && qty <= 3) return "az";
  return "var";
}

function pickStock(variations: CatalogVariation[]): DummyProduct["stock"] {
  const inStock = variations.filter((v) => v.stock !== "yok");
  if (inStock.length === 0) return "yok";
  const lowOnly = inStock.every((v) => v.stock === "az");
  return lowOnly ? "az" : "var";
}

function parseVariation(row: CsvRow): CatalogVariation | null {
  const parentSku = (row["Ebeveyn"] ?? "").trim();
  if (!parentSku) return null;

  const priceRaw = row["İndirimli satış fiyatı"] || row["Normal fiyat"] || "";
  const price = parsePrice(priceRaw);
  const inStock = (row["Stokta?"] ?? "").trim() === "1";
  const qty = Number((row["Stok"] ?? "0").trim() || 0);

  const variationImages = parseImages(row["Görseller"] ?? "");

  return {
    id: (row["Kimlik"] ?? "").trim(),
    parentSku,
    sku: (row["Stok kodu (SKU)"] ?? "").trim(),
    size: ((row["Nitelik 1 değer(ler)i"] ?? "").trim() || "Standart").replace(/"/g, ""),
    price,
    stockQty: Number.isFinite(qty) ? qty : 0,
    stock: stockFromQty(inStock, Number.isFinite(qty) ? qty : 0),
    image: variationImages[0],
  };
}

function normalizeFromCsv(rows: CsvRow[]): CatalogProduct[] {
  const variables = rows.filter((row) => (row["Tür"] ?? "").trim() === "variable");
  const parentSkuToFamily = new Map<string, string>();

  variables.forEach((row) => {
    const sku = (row["Stok kodu (SKU)"] ?? "").trim();
    const name = (row["İsim"] ?? "").trim();
    if (!sku) return;
    parentSkuToFamily.set(sku, extractFamilyCode(name, sku));
  });

  const variationsByFamily = new Map<string, CatalogVariation[]>();
  rows
    .filter((row) => (row["Tür"] ?? "").trim() === "variation")
    .forEach((row) => {
      const variation = parseVariation(row);
      if (!variation) return;
      const family =
        parentSkuToFamily.get(variation.parentSku) ??
        extractFamilyCode("", variation.parentSku);
      const arr = variationsByFamily.get(family) ?? [];
      arr.push(variation);
      variationsByFamily.set(family, arr);
    });

  const familyToVariables = new Map<string, CsvRow[]>();
  variables.forEach((row) => {
    const sku = (row["Stok kodu (SKU)"] ?? "").trim();
    const name = (row["İsim"] ?? "").trim();
    const family = extractFamilyCode(name, sku);
    const arr = familyToVariables.get(family) ?? [];
    arr.push(row);
    familyToVariables.set(family, arr);
  });

  return [...familyToVariables.entries()].map(([family, familyRows]) => {
    const row =
      [...familyRows].sort((a, b) => {
        const aImages = parseImages(a["Görseller"] ?? "").length;
        const bImages = parseImages(b["Görseller"] ?? "").length;
        return bImages - aImages;
      })[0] ?? familyRows[0];

    const sku = (row["Stok kodu (SKU)"] ?? "").trim();
    const name = (row["İsim"] ?? "").trim();
    const images = parseImages(row["Görseller"] ?? "");
    const variations = variationsByFamily.get(family) ?? [];
    const categoryText = (row["Kategoriler"] ?? "").trim();
    const category = mapCategory(categoryText);

    const dedupedVariations = [...variations]
      .sort((a, b) => Number(a.size) - Number(b.size))
      .reduce<CatalogVariation[]>((acc, curr) => {
        const exists = acc.some((v) => v.size === curr.size);
        if (!exists) acc.push(curr);
        return acc;
      }, []);

    const variationPrices = dedupedVariations.map((v) => v.price).filter((v) => v > 0);
    const minPrice =
      variationPrices.length > 0
        ? Math.min(...variationPrices)
        : parsePrice(row["Normal fiyat"] ?? "");

    const stock = dedupedVariations.length > 0 ? pickStock(dedupedVariations) : "yok";
    const fullDesc = row["Açıklama"] ?? "";
    const shortDesc = row["Kısa açıklama"] ?? "";
    const slugBase = `${name}-${family}`;

    const mainImage =
      images[0] ??
      dedupedVariations.find((v) => v.image)?.image ??
      DUMMY_PRODUCTS[0]?.image ??
      "";

    return {
      id: ((row["Kimlik"] ?? sku) || name).trim(),
      slug: slugify(slugBase) || slugify(name) || sku.toLocaleLowerCase("tr-TR"),
      name,
      code: family || sku,
      price: minPrice || 0,
      image: mainImage,
      imageAlt: name,
      hoverImage: images[1],
      teaser: makeTeaser(shortDesc, fullDesc),
      seoDescription: stripHtml(shortDesc) || undefined,
      stock,
      category,
      oldPrice: undefined,
      description: stripHtml(fullDesc),
      categoriesText: categoryText || CATEGORY_LABEL_BY_ID[category],
      images,
      variations: dedupedVariations,
    } satisfies CatalogProduct;
  });
}

let cachedProducts: CatalogProduct[] | null = null;

export function getCatalogProducts(): CatalogProduct[] {
  if (cachedProducts) return cachedProducts;
  const rows = loadProductsCsvRows();
  const fromCsv = normalizeFromCsv(rows).filter((p) => p.name && p.code);
  if (fromCsv.length > 0) {
    cachedProducts = fromCsv;
    return cachedProducts;
  }

  cachedProducts = DUMMY_PRODUCTS.map((p) => ({
    ...p,
    description: p.seoDescription ?? p.teaser,
    categoriesText: CATEGORY_LABEL_BY_ID[p.category],
    images: [p.image, p.hoverImage].filter(Boolean) as string[],
    variations: [],
  }));
  return cachedProducts;
}

export function getCatalogProductBySlug(slug: string) {
  return getCatalogProducts().find((product) => product.slug === slug);
}

export function getCategoryList() {
  return CATEGORIES;
}
