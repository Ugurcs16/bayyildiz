/**
 * Checkout coupon helpers — normalize + parse only.
 * Never hardcode campaign codes or compute charged totals from a local percent.
 */

import { tryAmountToKurus } from "@/lib/checkout/money";
import type { CheckoutPaymentMethod } from "@/lib/checkout/payment-method";

export const COUPON_CODE_MAX_LEN = 40;

export type DiscountPreviewItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type DiscountPreviewRequest = {
  items: DiscountPreviewItem[];
  paymentMethod: CheckoutPaymentMethod;
  couponCode: string;
};

/** Successful Tervona preview (valid === true). Amounts in TL; *Minor in kuruş. */
export type DiscountPreviewSuccess = {
  valid: true;
  code: string;
  percent: number;
  percentDiscount: number;
  percentDiscountMinor: number;
  roundingDiscount: number;
  roundingDiscountMinor: number;
  totalDiscount: number;
  totalDiscountMinor: number;
  subtotal: number;
  amount: number;
  currency: string;
  paymentMethod: CheckoutPaymentMethod;
};

export type DiscountPreviewFailure = {
  valid: false;
  code?: string;
  error: string;
};

export type DiscountPreviewResult = DiscountPreviewSuccess | DiscountPreviewFailure;

export function normalizeCouponCode(value: unknown): string {
  if (typeof value !== "string") return "";
  // ASCII uppercasing — avoid tr-TR "i" → "İ" breaking Latin coupon codes.
  return value.trim().toUpperCase().slice(0, COUPON_CODE_MAX_LEN);
}

export function parseCouponCodeInput(value: unknown): string | null {
  const code = normalizeCouponCode(value);
  if (!code) return null;
  if (!/^[A-Z0-9][A-Z0-9_-]*$/i.test(code)) return null;
  return code;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function readFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

function readNonNegInt(value: unknown): number | null {
  const n = readFiniteNumber(value);
  if (n === null || n < 0 || !Number.isInteger(n)) return null;
  return n;
}

function readPaymentMethod(value: unknown): CheckoutPaymentMethod | null {
  if (value === "card" || value === "bank_transfer") return value;
  return null;
}

/**
 * Parse Tervona preview JSON. HTTP 200 + valid:false is a failure result.
 * Rejects malformed success payloads rather than inventing totals.
 */
export function parseDiscountPreviewBody(body: unknown): DiscountPreviewResult | null {
  if (!isRecord(body)) return null;
  if (body.valid === false) {
    const error =
      typeof body.error === "string" && body.error.trim()
        ? body.error.trim()
        : "İndirim kodu geçersiz.";
    const code =
      typeof body.code === "string" && body.code.trim()
        ? normalizeCouponCode(body.code)
        : undefined;
    return { valid: false, code, error };
  }
  if (body.valid !== true) return null;

  const code = parseCouponCodeInput(body.code);
  const percent = readFiniteNumber(body.percent);
  const percentDiscount = readFiniteNumber(body.percentDiscount);
  const percentDiscountMinor = readNonNegInt(body.percentDiscountMinor);
  const roundingDiscount = readFiniteNumber(body.roundingDiscount);
  const roundingDiscountMinor = readNonNegInt(body.roundingDiscountMinor);
  const totalDiscount = readFiniteNumber(body.totalDiscount);
  const totalDiscountMinor = readNonNegInt(body.totalDiscountMinor);
  const subtotal = readFiniteNumber(body.subtotal);
  const amount = readFiniteNumber(body.amount);
  const currency =
    typeof body.currency === "string" && body.currency.trim()
      ? body.currency.trim().toUpperCase()
      : null;
  const paymentMethod = readPaymentMethod(body.paymentMethod);

  if (
    !code ||
    percent === null ||
    percent < 0 ||
    percentDiscount === null ||
    percentDiscountMinor === null ||
    roundingDiscount === null ||
    roundingDiscountMinor === null ||
    totalDiscount === null ||
    totalDiscountMinor === null ||
    subtotal === null ||
    amount === null ||
    !currency ||
    !paymentMethod
  ) {
    return null;
  }

  if (percentDiscountMinor + roundingDiscountMinor !== totalDiscountMinor) {
    return null;
  }

  return {
    valid: true,
    code,
    percent,
    percentDiscount,
    percentDiscountMinor,
    roundingDiscount,
    roundingDiscountMinor,
    totalDiscount,
    totalDiscountMinor,
    subtotal,
    amount,
    currency,
    paymentMethod,
  };
}

/** Compare preview amount (TL) with authoritative order amount (TL). */
export function previewMatchesOrderAmount(
  previewAmountTl: number,
  orderAmountTl: number,
): boolean {
  return tryAmountToKurus(previewAmountTl) === tryAmountToKurus(orderAmountTl);
}

/**
 * Stable fingerprint fragment for cart + payment method + coupon.
 * Used by server/client idempotency helpers.
 */
export function checkoutAttemptFingerprintParts(input: {
  itemLines: string[];
  paymentMethod: CheckoutPaymentMethod | string;
  couponCode?: string | null;
}): string {
  const lines = [...input.itemLines].sort().join("|");
  const pm =
    input.paymentMethod === "bank_transfer" ? "bank_transfer" : "card";
  const coupon = normalizeCouponCode(input.couponCode ?? "");
  return `${lines}|pm:${pm}|coupon:${coupon}`;
}

/**
 * Expected merchandise math fixtures for unit tests only.
 * Mirrors documented BIGM10 / BIGM15 + floor-to-50 behaviour — not used for charging.
 */
export function expectedCouponMerchandiseMinor(input: {
  subtotalMinor: number;
  percent: number;
  applyRoundingFloor50: boolean;
}): {
  percentDiscountMinor: number;
  roundingDiscountMinor: number;
  totalDiscountMinor: number;
  amountMinor: number;
} {
  const subtotal = Math.max(0, Math.trunc(input.subtotalMinor));
  const percentDiscountMinor = Math.floor(
    (subtotal * input.percent + 50) / 100,
  );
  const afterPercent = Math.max(0, subtotal - percentDiscountMinor);
  let roundingDiscountMinor = 0;
  if (input.applyRoundingFloor50) {
    const step = 5000;
    const floored = Math.floor(afterPercent / step) * step;
    if (floored > 0) {
      roundingDiscountMinor = afterPercent - floored;
    }
  }
  const amountMinor = afterPercent - roundingDiscountMinor;
  return {
    percentDiscountMinor,
    roundingDiscountMinor,
    totalDiscountMinor: percentDiscountMinor + roundingDiscountMinor,
    amountMinor,
  };
}
