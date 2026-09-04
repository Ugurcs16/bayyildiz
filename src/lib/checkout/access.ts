import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import "server-only";

export const CHECKOUT_ACCESS_COOKIE = "bayyildiz_checkout_access";
export const CHECKOUT_IDEMPOTENCY_COOKIE = "bayyildiz_checkout_idem";

function bffSecret(): string {
  return (process.env.TERVONA_STOREFRONT_BFF_KEY ?? "").trim();
}

/** Same HMAC formula as Tervona `storefrontCheckoutAccessToken`. */
export function checkoutAccessToken(orderId: string): string {
  const secret = bffSecret();
  if (!secret) {
    return "";
  }
  return createHmac("sha256", secret)
    .update(`checkout-access:v1:${orderId}`)
    .digest("hex");
}

export function verifyCheckoutAccessToken(
  orderId: string,
  provided: string | null | undefined,
): boolean {
  const expected = checkoutAccessToken(orderId);
  const token = provided?.trim() ?? "";
  if (!expected || !token) {
    return false;
  }
  const left = Buffer.from(expected);
  const right = Buffer.from(token);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export type CheckoutAccessCookie = {
  orderId: string;
  orderNumber: string;
  accessToken: string;
};

export function serializeCheckoutAccessCookie(value: CheckoutAccessCookie): string {
  return `v1|${value.orderId}|${value.accessToken}|${value.orderNumber}`;
}

export function parseCheckoutAccessCookie(
  raw: string | null | undefined,
): CheckoutAccessCookie | null {
  const value = raw?.trim() ?? "";
  if (!value) {
    return null;
  }
  const parts = value.split("|");
  if (parts.length !== 4 || parts[0] !== "v1") {
    return null;
  }
  const orderId = parts[1]?.trim() ?? "";
  const accessToken = parts[2]?.trim() ?? "";
  const orderNumber = parts[3]?.trim() ?? "";
  if (!orderId || !accessToken || !orderNumber) {
    return null;
  }
  if (!verifyCheckoutAccessToken(orderId, accessToken)) {
    return null;
  }
  return { orderId, orderNumber, accessToken };
}

export type CheckoutIdempotencyCookie = {
  fingerprint: string;
  key: string;
};

export function serializeIdempotencyCookie(value: CheckoutIdempotencyCookie): string {
  return `v1|${value.fingerprint}|${value.key}`;
}

export function parseIdempotencyCookie(
  raw: string | null | undefined,
): CheckoutIdempotencyCookie | null {
  const value = raw?.trim() ?? "";
  const parts = value.split("|");
  if (parts.length !== 3 || parts[0] !== "v1") {
    return null;
  }
  const fingerprint = parts[1]?.trim() ?? "";
  const key = parts[2]?.trim() ?? "";
  if (!fingerprint || key.length < 8 || key.length > 128) {
    return null;
  }
  if (!/^[A-Za-z0-9._:-]+$/.test(key)) {
    return null;
  }
  return { fingerprint, key };
}

export function cartFingerprint(
  items: { productId: string; variantId: string; quantity: number }[],
): string {
  const normalized = items
    .map((item) => `${item.productId}:${item.variantId}:${item.quantity}`)
    .sort()
    .join("|");
  return createHash("sha256").update(normalized).digest("hex").slice(0, 32);
}
