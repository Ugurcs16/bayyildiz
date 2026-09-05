/**
 * Browser-side checkout attempt key so rapid double-submit reuses one order
 * even before Set-Cookie from the first response lands.
 */

const STORAGE_KEY = "bayyildiz_checkout_attempt_v1";

export function clientCartFingerprint(
  items: { productId: string; variationId: string; quantity: number }[],
): string {
  return items
    .map((item) => `${item.productId}:${item.variationId}:${item.quantity}`)
    .sort()
    .join("|");
}

function mintClientKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `cko_${crypto.randomUUID().replace(/-/g, "")}`;
  }
  return `cko_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
}

export function readOrCreateCheckoutAttemptKey(fingerprint: string): string {
  if (typeof window === "undefined") {
    return mintClientKey();
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { fp?: string; key?: string };
      if (
        parsed.fp === fingerprint &&
        typeof parsed.key === "string" &&
        parsed.key.length >= 8 &&
        parsed.key.length <= 128 &&
        /^[A-Za-z0-9._:-]+$/.test(parsed.key)
      ) {
        return parsed.key;
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  const key = mintClientKey();
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ fp: fingerprint, key }));
  } catch {
    /* private mode / quota */
  }
  return key;
}

export function clearCheckoutAttemptKey(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
