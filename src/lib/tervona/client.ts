import type {
  StorefrontListParams,
  StorefrontProduct,
  StorefrontProductList,
} from "./types";

const DEFAULT_TIMEOUT_MS = 8_000;
const REVALIDATE_SECONDS = 30;

export class TervonaTransportError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "TervonaTransportError";
  }
}

export class TervonaNotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "TervonaNotFoundError";
  }
}

function baseUrl(): string | null {
  const raw = (process.env.TERVONA_STOREFRONT_API_URL ?? "").trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

function isJsonContentType(value: string | null): boolean {
  return Boolean(value && value.toLowerCase().includes("application/json"));
}

async function tervonaFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const root = baseUrl();
  if (!root) {
    throw new TervonaTransportError("TERVONA_STOREFRONT_API_URL is not set");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const cache = init?.cache;
    const res = await fetch(`${root}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
      ...(cache === "no-store"
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE_SECONDS } }),
    });

    const contentType = res.headers.get("content-type");
    if (!isJsonContentType(contentType)) {
      throw new TervonaTransportError(
        `Non-JSON response (${res.status})`,
        res.status,
      );
    }

    const body: unknown = await res.json();

    if (res.status === 404) {
      throw new TervonaNotFoundError(
        typeof body === "object" &&
          body &&
          "error" in body &&
          typeof (body as { error: unknown }).error === "string"
          ? (body as { error: string }).error
          : "Not found",
      );
    }

    if (!res.ok) {
      throw new TervonaTransportError(
        `Tervona HTTP ${res.status}`,
        res.status,
      );
    }

    return body as T;
  } catch (error) {
    if (
      error instanceof TervonaNotFoundError ||
      error instanceof TervonaTransportError
    ) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new TervonaTransportError("Tervona request timeout");
    }
    throw new TervonaTransportError(
      error instanceof Error ? error.message : "Tervona request failed",
    );
  } finally {
    clearTimeout(timer);
  }
}

function buildListQuery(params: StorefrontListParams = {}): string {
  const q = new URLSearchParams();
  if (params.category?.trim()) q.set("category", params.category.trim());
  if (params.featured === true) q.set("featured", "true");
  if (params.featured === false) q.set("featured", "false");
  if (params.sort) q.set("sort", params.sort);
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  const s = q.toString();
  return s ? `?${s}` : "";
}

function assertProductList(body: unknown): StorefrontProductList {
  if (!body || typeof body !== "object") {
    throw new TervonaTransportError("Invalid product list payload");
  }
  const data = body as StorefrontProductList;
  if (!Array.isArray(data.products)) {
    throw new TervonaTransportError("Invalid product list: products");
  }
  return {
    products: data.products,
    page: Number(data.page) || 1,
    limit: Number(data.limit) || data.products.length,
    total: Number(data.total) || data.products.length,
    pageCount: Number(data.pageCount) || 1,
  };
}

function assertProductEnvelope(body: unknown): StorefrontProduct {
  if (!body || typeof body !== "object") {
    throw new TervonaTransportError("Invalid product payload");
  }
  const product = (body as { product?: StorefrontProduct }).product;
  if (!product || typeof product !== "object" || !product.slug) {
    throw new TervonaTransportError("Invalid product envelope");
  }
  return product;
}

export function isTervonaConfigured(): boolean {
  return Boolean(baseUrl());
}

export async function fetchStorefrontProducts(
  params?: StorefrontListParams,
): Promise<StorefrontProductList> {
  const body = await tervonaFetch<unknown>(
    `/api/storefront/products${buildListQuery(params)}`,
  );
  return assertProductList(body);
}

export async function fetchStorefrontProductBySlug(
  slug: string,
): Promise<StorefrontProduct> {
  const encoded = encodeURIComponent(slug.trim());
  const body = await tervonaFetch<unknown>(
    `/api/storefront/products/${encoded}`,
    { cache: "no-store" },
  );
  return assertProductEnvelope(body);
}
