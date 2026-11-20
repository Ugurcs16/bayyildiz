/**
 * GSC 404 paket 1 yönlendirme regresyon testleri (ağ zorunlu değil).
 * Run: npm run test:gsc-redirects
 *
 * Optional live Tervona check when TERVONA_STOREFRONT_API_URL is set:
 *   VERIFY_GSC_LIVE=1 npm run test:gsc-redirects
 */

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  GSC_LEGACY_PRODUCT_SLUG_REDIRECTS_PKG1,
  GSC_LEGACY_REDIRECTS_PKG1,
  getGscPkg1ProductSlugRedirect,
} from "../src/lib/gsc-legacy-redirects-pkg1.ts";
import { getCanonicalSlugRedirect } from "../src/lib/product-slug-compat.ts";
import { PRODUCT_SLUG_COMPAT_MAP } from "../src/lib/product-slug-compat-map.generated.ts";

const root = join(import.meta.dirname, "..");

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

/** Expected A-class paths from classification CSV (no trailing slash). */
const EXPECTED_A_SOURCES = [
  "/urun-kategori/klasik",
  "/urun-kategori/gunluk",
  "/urun/bayyildiz-gunluk-ayakkabi-model-m22183",
  "/urun/bayyildiz-gunluk-ayakkabi-model-m22096",
  "/urun/bayyildiz-gunluk-ayakkabi-model-p2239-2",
  "/urun/bayyildiz-gunluk-ayakkabi-model-h110396",
  "/urun/model-f263181-s1",
  "/urun/bayyildiz-gunluk-ayakkabi-model-p080",
  "/urun/bayyildiz-gunluk-ayakkabi-model-p080-3",
  "/urun/bayyildiz-gunluk-ayakkabi-model-m19551",
  "/urun/bayyildiz-gunluk-ayakkabi-model-p132470",
  "/urun/bayyildiz-gunluk-ayakkabi-model-m21514",
  "/urun/model-f2650-s1",
  "/urun/bayyildiz-gunluk-ayakkabi-model-m16197",
  "/urun-kategori/outdoor",
  "/urun-kategori/bot",
  "/urun/bayyildiz-gunluk-ayakkabi-model-h260881",
  "/urun/bayyildiz-gunluk-ayakkabi-model-p080-2",
  "/urun-kategori/gunluk/page/1",
] as const;

const FORBIDDEN_SOURCES = [
  "/urun-kategori/gunluk/page/2",
  "/urun-kategori/gunluk/page/3",
  "/urun-kategori/seri-sonu",
  // Sample B (multi-color) — must never be auto-redirected
  "/urun/bayyildiz-gunluk-ayakkabi-model-p1616",
  "/urun/bayyildiz-gunluk-ayakkabi-model-p1200",
] as const;

const VALID_CATS = new Set(["gunluk", "klasik", "sneaker", "outdoor", "bot"]);

console.log("gsc pkg1 rule count…");
assert.equal(GSC_LEGACY_REDIRECTS_PKG1.length, 20, "19 A + collections/bot");
assert.equal(
  Object.keys(GSC_LEGACY_PRODUCT_SLUG_REDIRECTS_PKG1).length,
  14,
  "14 product slug redirects",
);

console.log("A sources covered…");
const sources = new Set(GSC_LEGACY_REDIRECTS_PKG1.map((r) => r.source));
for (const src of EXPECTED_A_SOURCES) {
  assert.ok(sources.has(src), `missing A source ${src}`);
}
assert.ok(sources.has("/collections/bot"), "collections/bot included");

console.log("forbidden sources absent…");
for (const src of FORBIDDEN_SOURCES) {
  assert.ok(!sources.has(src), `forbidden source present: ${src}`);
}

console.log("shape / loop / chain checks…");
const sourceSet = new Set(GSC_LEGACY_REDIRECTS_PKG1.map((r) => r.source));
const destSet = new Set(GSC_LEGACY_REDIRECTS_PKG1.map((r) => r.destination));
assert.equal(sourceSet.size, GSC_LEGACY_REDIRECTS_PKG1.length, "duplicate sources");

for (const rule of GSC_LEGACY_REDIRECTS_PKG1) {
  assert.ok(rule.source.startsWith("/"), `source abs path: ${rule.source}`);
  assert.ok(!rule.source.endsWith("/") || rule.source === "/", `no trailing slash: ${rule.source}`);
  assert.ok(rule.destination.startsWith("/"), `dest abs path: ${rule.destination}`);
  assert.notEqual(rule.source, rule.destination, `self-redirect ${rule.source}`);
  assert.equal(rule.permanent, true);
  assert.ok(!sourceSet.has(rule.destination), `package chain ${rule.destination}`);

  if (rule.destination.startsWith("/kategori/")) {
    const cat = rule.destination.slice("/kategori/".length);
    assert.ok(VALID_CATS.has(cat), `invalid category dest ${rule.destination}`);
  } else if (rule.destination.startsWith("/urun/")) {
    const destSlug = rule.destination.slice("/urun/".length);
    assert.ok(destSlug.length > 0);
    // Destination must not be a generated-compat key that redirects onward.
    const onward =
      PRODUCT_SLUG_COMPAT_MAP[destSlug as keyof typeof PRODUCT_SLUG_COMPAT_MAP];
    assert.ok(
      !onward || onward === destSlug,
      `dest would chain via compat: ${destSlug} -> ${onward}`,
    );
  } else {
    assert.fail(`unexpected destination kind ${rule.destination}`);
  }
}

console.log("product slug helper + compat precedence…");
for (const [oldSlug, newSlug] of Object.entries(
  GSC_LEGACY_PRODUCT_SLUG_REDIRECTS_PKG1,
)) {
  assert.equal(getGscPkg1ProductSlugRedirect(oldSlug), newSlug);
  assert.equal(getCanonicalSlugRedirect(oldSlug), newSlug);
  // Exact GSC sources must not collide with generated compat keys.
  assert.equal(
    PRODUCT_SLUG_COMPAT_MAP[oldSlug as keyof typeof PRODUCT_SLUG_COMPAT_MAP],
    undefined,
    `GSC source unexpectedly in generated compat: ${oldSlug}`,
  );
}
assert.equal(getGscPkg1ProductSlugRedirect("not-a-real-slug"), null);

console.log("next.config wires pkg1…");
const nextConfig = read("next.config.ts");
assert.match(nextConfig, /GSC_LEGACY_REDIRECTS_PKG1/);
assert.match(nextConfig, /gsc-legacy-redirects-pkg1/);

console.log("generated compat map untouched size…");
assert.equal(Object.keys(PRODUCT_SLUG_COMPAT_MAP).length, 68);

// Optional: sitemap file proof (local cache if present)
const sitemapPath = "/tmp/bayy-sitemap.xml";
if (existsSync(sitemapPath)) {
  console.log("sitemap file proof…");
  const xml = readFileSync(sitemapPath, "utf8");
  for (const rule of GSC_LEGACY_REDIRECTS_PKG1) {
    if (!rule.destination.startsWith("/urun/")) continue;
    const slug = rule.destination.slice("/urun/".length);
    assert.ok(
      xml.includes(`/urun/${slug}`),
      `sitemap missing product dest ${slug}`,
    );
  }
  for (const cat of ["gunluk", "klasik", "outdoor", "bot"]) {
    assert.ok(xml.includes(`/kategori/${cat}`), `sitemap missing cat ${cat}`);
  }
} else {
  console.log("sitemap file proof… skipped (no /tmp/bayy-sitemap.xml)");
}

async function maybeLiveTervona() {
  if (process.env.VERIFY_GSC_LIVE !== "1") {
    console.log("live Tervona… skipped (set VERIFY_GSC_LIVE=1)");
    return;
  }
  const { fetchStorefrontProductBySlug, isTervonaConfigured } = await import(
    "../src/lib/tervona/client.ts"
  );
  assert.ok(isTervonaConfigured(), "TERVONA_STOREFRONT_API_URL required for live");
  console.log("live Tervona product targets…");
  const uniqueDest = [
    ...new Set(Object.values(GSC_LEGACY_PRODUCT_SLUG_REDIRECTS_PKG1)),
  ];
  for (const slug of uniqueDest) {
    const product = await fetchStorefrontProductBySlug(slug);
    assert.equal(product.slug, slug, `slug mismatch for ${slug}`);
  }
}

void maybeLiveTervona()
  .then(() => {
    console.log("OK — gsc redirects pkg1 verified");
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
