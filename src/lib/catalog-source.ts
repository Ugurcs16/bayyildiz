import {
  getCatalogProductBySlug as getCsvProductBySlug,
  getCatalogProducts as getCsvProducts,
  type CatalogProduct,
} from "@/lib/products-normalizer";
import {
  fetchStorefrontProductBySlug,
  fetchStorefrontProducts,
  isTervonaConfigured,
  TervonaNotFoundError,
  TervonaTransportError,
} from "@/lib/tervona/client";
import { mapStorefrontProductToCatalog } from "@/lib/tervona/map-to-catalog";
import type { StorefrontListParams } from "@/lib/tervona/types";

export type CatalogSource = "tervona" | "csv-fallback";

export type CatalogListResult = {
  products: CatalogProduct[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
  source: CatalogSource;
};

function logFallback(reason: string, detail?: unknown) {
  const extra =
    detail instanceof Error ? detail.message : detail != null ? String(detail) : "";
  console.warn(
    `[catalog] Tervona unavailable — CSV fallback (${reason})${extra ? `: ${extra}` : ""}`,
  );
}

function csvPage(
  products: CatalogProduct[],
  page: number,
  limit: number,
): CatalogListResult {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(48, limit));
  const start = (safePage - 1) * safeLimit;
  const slice = products.slice(start, start + safeLimit);
  const pageCount = Math.max(1, Math.ceil(products.length / safeLimit));
  return {
    products: slice,
    page: safePage,
    limit: safeLimit,
    total: products.length,
    pageCount,
    source: "csv-fallback",
  };
}

/**
 * Preferred: Tervona Storefront API.
 * Fallback: CSV only when Tervona is unreachable (transport / misconfig / non-JSON).
 * Stock-zero from Tervona is NEVER replaced by CSV stock.
 */
export async function listCatalogProducts(
  params: StorefrontListParams = {},
): Promise<CatalogListResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 24;

  if (!isTervonaConfigured()) {
    logFallback("not_configured");
    let all = getCsvProducts();
    if (params.category) {
      all = all.filter((p) => p.category === params.category);
    }
    if (params.sort === "featured" || params.featured) {
      all = [...all].sort((a, b) => {
        const score = (p: CatalogProduct) =>
          (p.stock !== "yok" ? 10 : 0) + (p.image ? 5 : 0);
        return score(b) - score(a);
      });
    }
    return csvPage(all, page, limit);
  }

  try {
    const list = await fetchStorefrontProducts({
      ...params,
      page,
      limit,
    });
    return {
      products: list.products.map(mapStorefrontProductToCatalog),
      page: list.page,
      limit: list.limit,
      total: list.total,
      pageCount: list.pageCount,
      source: "tervona",
    };
  } catch (error) {
    if (error instanceof TervonaNotFoundError) {
      // List endpoint should not 404; treat as transport for list.
      logFallback("list_not_found", error);
    } else if (error instanceof TervonaTransportError) {
      logFallback("transport", error);
    } else {
      logFallback("unknown", error);
    }
    let all = getCsvProducts();
    if (params.category) {
      all = all.filter((p) => p.category === params.category);
    }
    return csvPage(all, page, limit);
  }
}

/**
 * Product by slug.
 * - Tervona JSON 404 → null (caller should notFound) — no CSV substitute.
 * - Transport failure → CSV by slug (dev safety only).
 */
export async function getCatalogProductBySlugResolved(
  slug: string,
): Promise<{ product: CatalogProduct; source: CatalogSource } | null> {
  if (!isTervonaConfigured()) {
    logFallback("not_configured");
    const csv = getCsvProductBySlug(slug);
    return csv ? { product: csv, source: "csv-fallback" } : null;
  }

  try {
    const dto = await fetchStorefrontProductBySlug(slug);
    return {
      product: mapStorefrontProductToCatalog(dto),
      source: "tervona",
    };
  } catch (error) {
    if (error instanceof TervonaNotFoundError) {
      return null;
    }
    logFallback("product_transport", error);
    const csv = getCsvProductBySlug(slug);
    return csv ? { product: csv, source: "csv-fallback" } : null;
  }
}

/** Sitemap / bulk: prefer Tervona page walk; fall back to CSV. */
export async function listAllCatalogProductsForSitemap(): Promise<{
  products: CatalogProduct[];
  source: CatalogSource;
}> {
  if (!isTervonaConfigured()) {
    logFallback("not_configured");
    return { products: getCsvProducts(), source: "csv-fallback" };
  }

  try {
    const first = await fetchStorefrontProducts({
      page: 1,
      limit: 48,
      sort: "featured",
    });
    const products = [...first.products.map(mapStorefrontProductToCatalog)];
    for (let page = 2; page <= first.pageCount; page += 1) {
      const next = await fetchStorefrontProducts({
        page,
        limit: 48,
        sort: "featured",
      });
      products.push(...next.products.map(mapStorefrontProductToCatalog));
    }
    return { products, source: "tervona" };
  } catch (error) {
    logFallback("sitemap_transport", error);
    return { products: getCsvProducts(), source: "csv-fallback" };
  }
}
