/**
 * Report-only wrapper around shared slug compat builder.
 * Run: TERVONA_STOREFRONT_API_URL=https://tervona.vercel.app npx tsx scripts/analyze-slug-compat.ts
 */
import {
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
  const report = buildSlugCompatReport(
    loadCsvCatalogForCompat(),
    await loadAllTervona(),
  );

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
        coverageOfCsv: `${report.exactSlugMatches + report.deterministicMapped}/${report.csvCount}`,
      },
      null,
      2,
    ),
  );

  const interesting = [
    "f23212",
    "g505",
    "g510",
    "f54082",
    "m22001",
    "g500",
    "jr24076",
    "g584",
  ];
  const samples = [];
  for (const hint of interesting) {
    const hit = report.entries.find((r) =>
      r.oldSlug.toLowerCase().includes(hint),
    );
    if (hit) samples.push(hit);
  }
  console.log("\nSAMPLES");
  console.log(JSON.stringify(samples, null, 2));
  console.log("\nAMBIGUOUS");
  console.log(JSON.stringify(report.ambiguousDetails, null, 2));
  console.log("\nCOLLISIONS");
  console.log(JSON.stringify(report.collisions, null, 2));
  console.log("\nUNMATCHED");
  console.log(JSON.stringify(report.unmatchedSlugs, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
