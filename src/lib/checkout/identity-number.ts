/**
 * Checkout identityNumber (T.C. Kimlik No) helpers.
 * Never log or put these values in URLs.
 */

export function normalizeIdentityNumber(value: string): string {
  return value.replace(/\D/g, "");
}

/** Launch rule: require exactly 11 digits. Foreign IDs are a future feature. */
export function isValidIdentityNumber(value: string | undefined | null): boolean {
  if (value == null) return false;
  return /^\d{11}$/.test(normalizeIdentityNumber(value));
}

/**
 * Returns normalized 11-digit identityNumber, or null if invalid.
 * Does not throw; callers decide UX / HTTP status.
 */
export function parseIdentityNumber(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const digits = normalizeIdentityNumber(value);
  if (!/^\d{11}$/.test(digits)) return null;
  return digits;
}
