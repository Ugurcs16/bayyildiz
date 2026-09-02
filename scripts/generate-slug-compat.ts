/**
 * Generate static old→new product slug map from CSV + live Tervona catalog.
 * Run: TERVONA_STOREFRONT_API_URL=https://tervona.vercel.app npx tsx scripts/generate-slug-compat.ts
 *
 * Refuses to write if ambiguous > 0 or unexplained collisions.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildSlugCompatMapFromReport,
  buildSlugCompatReport,
  loadCsvCatalogForCompat,
} from "../src/lib/product-slug-compat-build";
import { fetchStorefrontProducts } from "../src/lib/tervona/client";
import type { StorefrontProduct } from "../src/lib/tervona/types";

async function loadAllTervona(): Promise<StorefrontProduct[]> {
  const first = await fetchStorefrontProducts({
    page: 1,
    limit: 48,
    sort: "featured",
  });
  const all = [...first.products];
  for (let page = 2; page <= first.pageCount; page += 1) {
    const next = await fetchStorefrontProducts({
      page,
      limit: 48,
      sort: "featured",
    });
    all.push(...next.products);
  }
  return all;
}

async function main() {
  const csv = loadCsvCatalogForCompat();
  const tervona = await loadAllTervona();
  const report = buildSlugCompatReport(csv, tervona);

  console.log(
    JSON.stringify(
      {
        csvCount: report.csvCount,
        tervonaCount: report.tervonaCount,
        exactSlugMatches: report.exactSlugMatches,
        deterministicMapped: report.deterministicMapped,
        unmatched: report.unmatched,
        ambiguous: report.ambiguous,
        collisionDestinations: report.collisionDestinations,
        unmatchedSlugs: report.unmatchedSlugs,
      },
      null,
      2,
    ),
  );

  if (report.ambiguous > 0) {
    console.error("BLOCKED: ambiguous mappings", report.ambiguousDetails);
    process.exit(1);
  }
  if (report.collisionDestinations > 0) {
    console.error("BLOCKED: destination collisions", report.collisions);
    process.exit(1);
  }

  const map = buildSlugCompatMapFromReport(report);
  const outPath = resolve("src/lib/product-slug-compat-map.generated.ts");
  const body = `/**
 * AUTO-GENERATED — do not edit by hand.
 * Source: CSV catalog + Tervona Storefront API (deterministic parent/family identity).
 * Regenerate: TERVONA_STOREFRONT_API_URL=… npx tsx scripts/generate-slug-compat.ts
 *
 * csv=${report.csvCount} tervona=${report.tervonaCount}
 * exact=${report.exactSlugMatches} mapped=${report.deterministicMapped}
 * unmatched=${report.unmatched} ambiguous=${report.ambiguous}
 */
export const PRODUCT_SLUG_COMPAT_MAP = ${JSON.stringify(map, null, 2)} as const;

export type CompatOldSlug = keyof typeof PRODUCT_SLUG_COMPAT_MAP;
`;

  writeFileSync(outPath, body, "utf8");
  console.log(`Wrote ${Object.keys(map).length} redirects → ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
