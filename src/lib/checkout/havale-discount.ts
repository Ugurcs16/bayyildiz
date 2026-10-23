import { percentOfKurus, tryAmountToKurus } from "@/lib/checkout/money";

/** Storefront preview rate — authoritative discount must come from Tervona. */
export const HAVALE_EFT_DISCOUNT_PERCENT = 5;

export type HavaleDiscountLine = {
  price: string;
  quantity: number;
};

export type HavaleDiscountBreakdown = {
  /** Merchandise subtotal in kuruş (product lines only). */
  merchandiseKurus: number;
  /** Rounded %5 of merchandise. */
  discountKurus: number;
  /** Amount customer would pay for merchandise after discount. */
  payableMerchandiseKurus: number;
  percent: number;
};

/**
 * Preview-only: 5% off cart line merchandise.
 *
 * Current Bayyıldız checkout has no shipping fee line and no coupon field.
 * Discount is applied only to product line totals (price × qty).
 * Do not stack with unknown Tervona-side shipping/coupon until API documents it.
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
  const discountKurus = percentOfKurus(merchandiseKurus, percent);
  return {
    merchandiseKurus,
    discountKurus,
    payableMerchandiseKurus: Math.max(0, merchandiseKurus - discountKurus),
    percent,
  };
}
