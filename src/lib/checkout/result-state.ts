export type CheckoutViewKind = "paid" | "failed" | "pending" | "unknown";

export function checkoutViewKindFromPaymentStatus(
  paymentStatus: string | undefined,
): CheckoutViewKind {
  const status = (paymentStatus ?? "").toLowerCase();
  if (status === "paid") return "paid";
  if (status === "failed" || status === "cancelled") return "failed";
  if (status === "pending" || status === "processing") return "pending";
  return "unknown";
}

/** Query `payment=` is never authority. Kept so callers pass it explicitly. */
export function ignoreQueryPayment(value?: string | null): void {
  void value;
}

export function shouldClearCart(kind: CheckoutViewKind): boolean {
  return kind === "paid";
}

export function sanitizeOrderLookup(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 64) return null;
  if (!/^[A-Za-z0-9._\-/#]+$/.test(trimmed)) return null;
  return trimmed;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isOrderUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export function guestLookupMatchesCookie(
  queryOrder: string | null,
  cookie: { orderId: string; orderNumber: string } | null,
): cookie is { orderId: string; orderNumber: string } {
  if (!cookie) {
    return false;
  }
  if (!queryOrder) {
    return true;
  }
  const q = queryOrder.trim().toLowerCase();
  return q === cookie.orderId.toLowerCase() || q === cookie.orderNumber.toLowerCase();
}
