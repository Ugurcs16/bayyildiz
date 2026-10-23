import { percentOfKurus, tryAmountToKurus } from "@/lib/checkout/money";

/** Storefront preview rate — authoritative discount must come from Tervona. */
export const HAVALE_EFT_DISCOUNT_PERCENT = 5;

/** Floor payable amount to this minor-unit step after %5 (50 TL = 5_000 kuruş). */
export const HAVALE_EFT_ROUNDING_MINOR = 5_000;

export type HavaleDiscountLine = {
  price: string;
  quantity: number;
};

export type HavaleDiscountBreakdown = {
  /** Merchandise subtotal in kuruş (product lines only). */
  merchandiseKurus: number;
  /** %5 half-up of merchandise. */
  percentDiscountKurus: number;
  /** Extra floor-to-50-TL discount after %5. */
  roundingDiscountKurus: number;
  /** percent + rounding. */
  totalDiscountKurus: number;
  /** Amount after %5, before rounding. */
  afterPercentKurus: number;
  /** Final preview payable (after %5 + rounding). */
  payableMerchandiseKurus: number;
  percent: number;
  /** @deprecated Prefer percentDiscountKurus — kept for older call sites. */
  discountKurus: number;
};

/**
 * Floor to the nearest lower multiple of `stepMinor`.
 * If the floored result would be ≤ 0, return 0 discount (do not wipe the order).
 */
export function bankTransferRoundingDiscountMinor(
  afterPercentMinor: number,
  stepMinor: number = HAVALE_EFT_ROUNDING_MINOR,
): number {
  if (!Number.isInteger(afterPercentMinor) || afterPercentMinor < 0) return 0;
  if (!Number.isInteger(stepMinor) || stepMinor <= 0) return 0;
  const rounded = Math.floor(afterPercentMinor / stepMinor) * stepMinor;
  if (rounded <= 0) return 0;
  return afterPercentMinor - rounded;
}

/**
 * Preview-only: 5% off cart merchandise, then floor to 50 TL.
 *
 * Current Bayyıldız checkout has no shipping fee line and no coupon field.
 * Discount is applied only to product line totals (price × qty).
 * Authoritative totals always come from Tervona amountDueMinor.
 */
export function previewHavaleDiscount(
  lines: readonly HavaleDiscountLine[],
  percent: number = HAVALE_EFT_DISCOUNT_PERCENT,
): HavaleDiscountBreakdown {
  let merchandiseKurus = 0;
  for (const line of lines) {
    const qty =
      typeof line.quantity === "number" && Number.isFinite(line.quantity)
        ? Math.max(0, Math.floor(line.quantity))
        : 0;
    merchandiseKurus += tryAmountToKurus(line.price) * qty;
  }
  const percentDiscountKurus = percentOfKurus(merchandiseKurus, percent);
  const afterPercentKurus = Math.max(0, merchandiseKurus - percentDiscountKurus);
  const roundingDiscountKurus =
    bankTransferRoundingDiscountMinor(afterPercentKurus);
  const payableMerchandiseKurus = Math.max(
    0,
    afterPercentKurus - roundingDiscountKurus,
  );
  const totalDiscountKurus = percentDiscountKurus + roundingDiscountKurus;
  return {
    merchandiseKurus,
    percentDiscountKurus,
    roundingDiscountKurus,
    totalDiscountKurus,
    afterPercentKurus,
    payableMerchandiseKurus,
    percent,
    discountKurus: percentDiscountKurus,
  };
}
