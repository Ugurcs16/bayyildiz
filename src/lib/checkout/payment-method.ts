export const CHECKOUT_PAYMENT_METHODS = ["card", "bank_transfer"] as const;

export type CheckoutPaymentMethod = (typeof CHECKOUT_PAYMENT_METHODS)[number];

export function parseCheckoutPaymentMethod(
  value: unknown,
): CheckoutPaymentMethod | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "card" || normalized === "iyzico" || normalized === "credit_card") {
    return "card";
  }
  if (
    normalized === "bank_transfer" ||
    normalized === "havale" ||
    normalized === "eft" ||
    normalized === "havale_eft"
  ) {
    return "bank_transfer";
  }
  return null;
}

export function defaultCheckoutPaymentMethod(): CheckoutPaymentMethod {
  return "card";
}
