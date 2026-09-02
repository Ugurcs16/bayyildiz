/**
 * Deterministic SKU / model identity helpers for CSV ↔ Tervona slug compatibility.
 * No fuzzy matching — only exact keys after normalization.
 */

/** Drop trailing size: "F23212-S3 - 42" | "JR24076 - G3 - 39" → parent. */
export function parentSkuFromVariantSku(sku: string): string {
  const raw = sku.trim();
  if (!raw) return "";
  return raw.replace(/\s*-\s*\d+\s*$/, "").trim();
}

/** Casefold + collapse hyphen/space noise so "G584 - S3" === "G584-S3". */
export function normalizeSkuKey(value: string): string {
  return value
    .trim()
    .toLocaleUpperCase("tr-TR")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, "");
}

export function familyCodeFromParentSku(parentSku: string): string {
  const p = normalizeSkuKey(parentSku);
  if (!p) return "";
  const m = p.match(/^([A-Z0-9]+)/);
  return (m?.[1] ?? p).toUpperCase();
}
