/**
 * Smoke probe against production Tervona Storefront API.
 * Run: npx tsx scripts/smoke-tervona-storefront.ts
 */
const BASE = (
  process.env.TERVONA_STOREFRONT_API_URL ?? "https://tervona.vercel.app"
).replace(/\/$/, "");

type Variant = {
  sku?: string;
  size?: string;
  availableStock?: number;
  available?: boolean;
  attributes?: Record<string, string>;
};

type Product = {
  slug?: string;
  title?: string;
  variants?: Variant[];
};

async function getJson(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  const ct = res.headers.get("content-type") ?? "";
  const text = await res.text();
  return {
    status: res.status,
    contentType: ct,
    isJson: ct.includes("application/json"),
    body: text.slice(0, 400),
    json: ct.includes("application/json")
      ? (JSON.parse(text) as unknown)
      : null,
  };
}

function sizeOf(v: Variant): string {
  return (v.size ?? v.attributes?.size ?? "").toString();
}

function findStock(product: Product, size: string): number | null {
  const v = (product.variants ?? []).find((x) => sizeOf(x) === size);
  return v ? Number(v.availableStock ?? 0) : null;
}

async function main() {
  console.log("BASE", BASE);
  const list = await getJson("/api/storefront/products?limit=2&sort=featured");
  console.log("LIST", {
    status: list.status,
    isJson: list.isJson,
    preview: list.body.slice(0, 120),
  });

  if (!list.isJson || list.status !== 200) {
    console.error(
      "BLOCKER: Storefront list endpoint not returning JSON 200. Deploy Tervona /api/storefront/* first.",
    );
    process.exit(2);
  }

  const samples = [
    { slugHint: "f23212", expect: { "42": 5, "39": 0 } },
    { slugHint: "g505", expect: { "40": 2 } },
  ];

  // Prefer searching list for matching titles/skus via detail slug walk
  const listBody = list.json as { products?: Product[] };
  const allSlugs = (listBody.products ?? [])
    .map((p) => p.slug)
    .filter(Boolean) as string[];

  // Fetch more pages for smoke discovery
  const wide = await getJson(
    "/api/storefront/products?limit=48&sort=featured&page=1",
  );
  const wideProducts =
    wide.isJson && wide.json
      ? ((wide.json as { products?: Product[] }).products ?? [])
      : [];

  for (const sample of samples) {
    const match = wideProducts.find((p) =>
      (p.slug ?? p.title ?? "")
        .toLocaleLowerCase("tr-TR")
        .includes(sample.slugHint),
    );
    if (!match?.slug) {
      console.warn("WARN: no product match for", sample.slugHint, {
        known: allSlugs.slice(0, 5),
      });
      continue;
    }
    const detail = await getJson(
      `/api/storefront/products/${encodeURIComponent(match.slug)}`,
    );
    if (!detail.isJson || detail.status !== 200) {
      console.error("FAIL detail", match.slug, detail.status);
      process.exit(3);
    }
    const product = (detail.json as { product: Product }).product;
    for (const [size, expected] of Object.entries(sample.expect)) {
      const got = findStock(product, size);
      const pass = got === expected;
      console.log(
        pass ? "OK" : "FAIL",
        match.slug,
        `size ${size}`,
        `expected=${expected}`,
        `got=${got}`,
      );
      if (!pass) process.exitCode = 4;
    }
  }

  if (process.exitCode && process.exitCode !== 0) {
    process.exit(process.exitCode);
  }
  console.log("SMOKE_OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
