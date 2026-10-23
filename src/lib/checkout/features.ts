/**
 * Havale/EFT checkout UI + server accept path.
 * Default OFF — live customers must not see or select bank transfer
 * until Tervona havale APIs are ready and both flags are explicitly enabled.
 */
export function isHavaleEftEnabledServer(): boolean {
  const raw = (process.env.CHECKOUT_HAVALE_EFT_ENABLED ?? "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

/** Client-visible flag (must also be true for UI). Never trust alone — server re-checks. */
export function isHavaleEftEnabledClient(): boolean {
  const raw = (
    process.env.NEXT_PUBLIC_CHECKOUT_HAVALE_EFT_ENABLED ?? ""
  )
    .trim()
    .toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}
