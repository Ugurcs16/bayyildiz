/** Integer minor units (kuruş) for TRY — avoid float drift. */

export function tryAmountToKurus(amount: string | number): number {
  if (typeof amount === "number") {
    if (!Number.isFinite(amount) || amount < 0) return 0;
    return Math.round(amount * 100);
  }
  const normalized = amount.trim().replace(",", ".");
  if (!normalized) return 0;
  const n = Number.parseFloat(normalized);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

export function kurusToTryNumber(kurus: number): number {
  if (!Number.isFinite(kurus)) return 0;
  return Math.trunc(kurus) / 100;
}

export function formatTryFromKurus(kurus: number): string {
  const safe = Number.isFinite(kurus) ? Math.trunc(kurus) : 0;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kurusToTryNumber(safe));
}

/**
 * Half-up percentage of a kuruş amount (e.g. 5 → %5).
 * Matches Tervona: Math.floor((minor * percent + 50) / 100).
 */
export function percentOfKurus(kurus: number, percent: number): number {
  if (!Number.isFinite(kurus) || kurus <= 0) return 0;
  if (!Number.isFinite(percent) || percent <= 0) return 0;
  const minor = Math.trunc(kurus);
  return Math.floor((minor * percent + 50) / 100);
}
