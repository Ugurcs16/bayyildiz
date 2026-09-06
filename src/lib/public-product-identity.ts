import { parentSkuFromVariantSku } from "@/lib/sku-identity";

/**
 * Presentation-only helpers: strip supplier/manufacturer brands from public UI labels.
 * Does not mutate catalog or API data.
 */

const SUPPLIER_BRANDS = [
  "freefoot",
  "free foot",
  "macosen",
  "marcomen",
  "pikkolo",
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Remove known supplier brand tokens (prefix or glued before digits). */
export function stripSupplierBrandLabel(value: string): string {
  let s = value.trim();
  if (!s) return "";

  const sorted = [...SUPPLIER_BRANDS].sort((a, b) => b.length - a.length);
  for (const brand of sorted) {
    const escaped = brand
      .split(/\s+/)
      .map(escapeRegExp)
      .join("\\s*");
    s = s.replace(new RegExp(`^${escaped}\\s*[-–—]?\\s*`, "i"), "");
    s = s.replace(new RegExp(`^${escaped}(?=[0-9A-Z])`, "i"), "");
    s = s.replace(new RegExp(`\\b${escaped}\\b\\s*[-–—]?\\s*`, "i"), "");
  }

  return s.replace(/\s+/g, " ").trim();
}

function looksLikeModelCode(value: string): boolean {
  const v = value.trim();
  if (!v || v.length > 48) return false;
  if (/\s/.test(v) && !/\s-\s?\d+$/.test(v)) return false;
  return /[A-Za-z]?\d{2,}[A-Za-z0-9-]*/.test(v);
}

function normalizeDisplayCode(value: string): string {
  return stripSupplierBrandLabel(value)
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function extractFromMarketingTitle(name: string): string | null {
  const modelMatch = name.match(/\bModel\s+([A-Za-z0-9][A-Za-z0-9-]*)/i);
  if (modelMatch?.[1]) {
    const code = normalizeDisplayCode(modelMatch[1]);
    if (looksLikeModelCode(code)) return code;
  }

  const stripped = stripSupplierBrandLabel(name)
    .replace(/^Bayy[ıi]ld[ıi]z\b/i, "")
    .replace(/^[–—\-:\s]+/, "")
    .replace(
      /\b(Günlük|Klasik|Outdoor|Bot|Ayakkabı|Ayakkabılar|Erkek|Kadın|Sezon)\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();

  const token = stripped.match(
    /\b([A-Z]?\d{3,}(?:-[A-Z0-9]+)?|[A-Z]\d{3,}(?:-[A-Z0-9]+)?)\b/i,
  );
  if (token?.[1]) {
    const code = normalizeDisplayCode(token[1]);
    if (looksLikeModelCode(code)) return code;
  }

  return null;
}

/**
 * Authoritative public product identity: colorway / model code only.
 * Prefer SKU parent → catalog code → model → title extraction.
 */
export function publicProductCode(input: {
  code?: string | null;
  name?: string | null;
  variantSku?: string | null;
  model?: string | null;
  title?: string | null;
}): string {
  const fromSku = parentSkuFromVariantSku(input.variantSku ?? "");
  const candidates = [fromSku, input.code, input.model]
    .map((v) => (v ?? "").trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    const cleaned = normalizeDisplayCode(candidate);
    if (looksLikeModelCode(cleaned)) return cleaned;
  }

  const title = (input.name ?? input.title ?? "").trim();
  if (title) {
    const extracted = extractFromMarketingTitle(title);
    if (extracted) return extracted;

    const cleanedTitle = normalizeDisplayCode(stripSupplierBrandLabel(title));
    if (looksLikeModelCode(cleanedTitle)) return cleanedTitle;
  }

  return candidates[0]
    ? normalizeDisplayCode(candidates[0])
    : stripSupplierBrandLabel(title) || "Ürün";
}

/** Full variant SKU for display (size suffix kept), supplier brands stripped. */
export function publicVariantSkuLabel(sku: string | null | undefined): string {
  const raw = (sku ?? "").trim();
  if (!raw) return "";
  const parent = parentSkuFromVariantSku(raw);
  const sizePart = raw.slice(parent.length).trim();
  const publicParent = normalizeDisplayCode(parent) || stripSupplierBrandLabel(parent);
  if (!sizePart) return publicParent;
  const sizeClean = sizePart.replace(/^\s*-\s*/, "").trim();
  return sizeClean ? `${publicParent} - ${sizeClean}` : publicParent;
}

export function publicProductImageAlt(input: {
  code?: string | null;
  name?: string | null;
  variantSku?: string | null;
  imageAlt?: string | null;
}): string {
  const code = publicProductCode(input);
  const alt = stripSupplierBrandLabel(input.imageAlt ?? "");
  if (!alt || /pikkolo|freefoot|macosen|marcomen/i.test(alt)) {
    return `${code} erkek ayakkabı`;
  }
  if (/model\s+/i.test(alt) || alt.length > 60) return `${code} erkek ayakkabı`;
  return alt;
}

export function publicCartLineLabel(line: {
  name?: string | null;
  model?: string | null;
  variantSku?: string | null;
}): string {
  return publicProductCode({
    name: line.name,
    model: line.model,
    variantSku: line.variantSku,
    code: line.model,
  });
}
