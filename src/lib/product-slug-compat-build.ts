/**
 * Shared deterministic CSV → Tervona slug compatibility builder.
 * Used by analyze + generate scripts. No fuzzy matching.
 */
import { getCatalogProducts, type CatalogProduct } from "./products-normalizer";
import {
  familyCodeFromParentSku,
  normalizeSkuKey,
  parentSkuFromVariantSku,
} from "./sku-identity";
import type { StorefrontProduct } from "./tervona/types";

export type SlugCompatEntry = {
  oldSlug: string;
  newSlug: string;
  via: string;
  identity: string;
};

export type SlugCompatReport = {
  csvCount: number;
  tervonaCount: number;
  exactSlugMatches: number;
  deterministicMapped: number;
  unmatched: number;
  ambiguous: number;
  collisionDestinations: number;
  entries: SlugCompatEntry[];
  exact: string[];
  unmatchedSlugs: string[];
  ambiguousDetails: {
    oldSlug: string;
    candidates: string[];
    via: string;
    identity: string;
  }[];
  collisions: { dest: string; sources: string[] }[];
};

function parentsOf(product: StorefrontProduct): string[] {
  const set = new Set<string>();
  for (const v of product.variants ?? []) {
    const parent = parentSkuFromVariantSku(v.sku);
    if (parent) set.add(parent);
  }
  return [...set];
}

function uniqueHit(hits: StorefrontProduct[]): StorefrontProduct | null {
  return hits.length === 1 ? hits[0]! : null;
}

export function buildSlugCompatReport(
  csv: CatalogProduct[],
  tervona: StorefrontProduct[],
): SlugCompatReport {
  const byExactSlug = new Map(tervona.map((p) => [p.slug, p]));
  const byParentSku = new Map<string, StorefrontProduct[]>();
  const byFamily = new Map<string, StorefrontProduct[]>();

  for (const p of tervona) {
    for (const parent of parentsOf(p)) {
      const key = normalizeSkuKey(parent);
      if (!key) continue;
      const arr = byParentSku.get(key) ?? [];
      if (!arr.includes(p)) arr.push(p);
      byParentSku.set(key, arr);
      const family = familyCodeFromParentSku(parent);
      if (family) {
        const farr = byFamily.get(family) ?? [];
        if (!farr.includes(p)) farr.push(p);
        byFamily.set(family, farr);
      }
    }
  }

  const entries: SlugCompatEntry[] = [];
  const exact: string[] = [];
  const unmatchedSlugs: string[] = [];
  const ambiguousDetails: SlugCompatReport["ambiguousDetails"] = [];
  const destCounts = new Map<string, string[]>();

  function recordDest(newSlug: string, oldSlug: string) {
    const d = destCounts.get(newSlug) ?? [];
    d.push(oldSlug);
    destCounts.set(newSlug, d);
  }

  for (const product of csv) {
    const oldSlug = product.slug;
    if (byExactSlug.has(oldSlug)) {
      exact.push(oldSlug);
      recordDest(oldSlug, oldSlug);
      continue;
    }

    const rep = normalizeSkuKey(product.representativeParentSku ?? "");
    const family = normalizeSkuKey(product.code);
    const haystack = normalizeSkuKey(`${product.name} ${oldSlug}`);

    const tryParent = (
      identity: string,
      via: string,
    ): "done" | "continue" => {
      const hits = byParentSku.get(identity) ?? [];
      const one = uniqueHit(hits);
      if (one) {
        entries.push({
          oldSlug,
          newSlug: one.slug,
          via,
          identity,
        });
        recordDest(one.slug, oldSlug);
        return "done";
      }
      if (hits.length > 1) {
        ambiguousDetails.push({
          oldSlug,
          candidates: hits.map((p) => p.slug).sort(),
          via,
          identity,
        });
        return "done";
      }
      return "continue";
    };

    if (rep) {
      if (tryParent(rep, "representative_parent_sku") === "done") continue;
    }

    const variationParents = [
      ...new Set(
        (product.variations ?? [])
          .map((v) => normalizeSkuKey(v.parentSku))
          .filter(Boolean),
      ),
    ];
    if (variationParents.length === 1) {
      if (
        tryParent(variationParents[0]!, "unique_variation_parent_sku") ===
        "done"
      ) {
        continue;
      }
    } else if (variationParents.length > 1) {
      const dest = new Set<string>();
      for (const identity of variationParents) {
        for (const hit of byParentSku.get(identity) ?? []) {
          dest.add(hit.slug);
        }
      }
      if (dest.size === 1) {
        const newSlug = [...dest][0]!;
        entries.push({
          oldSlug,
          newSlug,
          via: "variation_parents_single_destination",
          identity: variationParents.join("|"),
        });
        recordDest(newSlug, oldSlug);
        continue;
      }
      if (dest.size > 1) {
        ambiguousDetails.push({
          oldSlug,
          candidates: [...dest].sort(),
          via: "variation_parents",
          identity: variationParents.join("|"),
        });
        continue;
      }
    }

    if (family) {
      const familyHits = byFamily.get(family) ?? [];
      if (familyHits.length > 0) {
        const embedded = new Map<string, StorefrontProduct>();
        for (const p of familyHits) {
          for (const parent of parentsOf(p)) {
            const key = normalizeSkuKey(parent);
            if (key === family) continue;
            if (key && haystack.includes(key)) {
              embedded.set(p.slug, p);
            }
          }
        }
        if (embedded.size === 1) {
          const one = [...embedded.values()][0]!;
          const identity =
            parentsOf(one)
              .map(normalizeSkuKey)
              .find((k) => k !== family && haystack.includes(k)) ?? family;
          entries.push({
            oldSlug,
            newSlug: one.slug,
            via: "embedded_parent_in_name_or_slug",
            identity,
          });
          recordDest(one.slug, oldSlug);
          continue;
        }
        if (embedded.size > 1) {
          ambiguousDetails.push({
            oldSlug,
            candidates: [...embedded.keys()].sort(),
            via: "embedded_parent_in_name_or_slug",
            identity: family,
          });
          continue;
        }
      }

      const one = uniqueHit(familyHits);
      if (one) {
        entries.push({
          oldSlug,
          newSlug: one.slug,
          via: "family_code_unique",
          identity: family,
        });
        recordDest(one.slug, oldSlug);
        continue;
      }
      if (familyHits.length > 1) {
        ambiguousDetails.push({
          oldSlug,
          candidates: familyHits.map((p) => p.slug).sort(),
          via: "family_code_unique",
          identity: family,
        });
        continue;
      }
    }

    unmatchedSlugs.push(oldSlug);
  }

  const collisions = [...destCounts.entries()]
    .filter(([, sources]) => sources.length > 1)
    .map(([dest, sources]) => ({ dest, sources }));

  return {
    csvCount: csv.length,
    tervonaCount: tervona.length,
    exactSlugMatches: exact.length,
    deterministicMapped: entries.length,
    unmatched: unmatchedSlugs.length,
    ambiguous: ambiguousDetails.length,
    collisionDestinations: collisions.length,
    entries,
    exact,
    unmatchedSlugs,
    ambiguousDetails,
    collisions,
  };
}

export function buildSlugCompatMapFromReport(
  report: SlugCompatReport,
): Record<string, string> {
  if (report.ambiguous > 0) {
    throw new Error(
      `Refusing to generate slug compat map: ambiguous=${report.ambiguous}`,
    );
  }
  const map: Record<string, string> = {};
  for (const e of report.entries) {
    if (e.oldSlug !== e.newSlug) {
      map[e.oldSlug] = e.newSlug;
    }
  }
  return map;
}

export function loadCsvCatalogForCompat(): CatalogProduct[] {
  return getCatalogProducts();
}
