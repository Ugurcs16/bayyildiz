/**
 * Customer-facing Siparişlerim status copy from Tervona order fields.
 * Exact equality only — never substring-match "unfulfilled" as delivered.
 */

export type CustomerOrderStatusInput = {
  orderStatus?: string | null;
  paymentStatus?: string | null;
  fulfillmentStatus?: string | null;
};

export const CUSTOMER_ORDER_STATUS = {
  cancelled: "Siparişiniz iptal edildi.",
  awaitingTransfer: "Havale ödemeniz bekleniyor.",
  paidPreparing: "Ödemeniz onaylandı. Siparişiniz hazırlanıyor.",
  shipped: "Siparişiniz kargoya verildi.",
  delivered: "Siparişiniz teslim edildi.",
  paymentPending: "Ödeme bekleniyor.",
  fallback: "Siparişiniz alındı.",
} as const;

function norm(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

/**
 * Priority: cancel → warehouse progress → havale wait → paid preparing →
 * card payment wait → neutral fallback.
 */
export function customerOrderStatusMessage(
  input: CustomerOrderStatusInput,
): string {
  const orderStatus = norm(input.orderStatus);
  const paymentStatus = norm(input.paymentStatus);
  const fulfillmentStatus = norm(input.fulfillmentStatus);

  if (orderStatus === "cancelled" || fulfillmentStatus === "cancelled") {
    return CUSTOMER_ORDER_STATUS.cancelled;
  }

  if (fulfillmentStatus === "delivered") {
    return CUSTOMER_ORDER_STATUS.delivered;
  }

  if (fulfillmentStatus === "shipped") {
    return CUSTOMER_ORDER_STATUS.shipped;
  }

  if (paymentStatus === "awaiting_transfer") {
    return CUSTOMER_ORDER_STATUS.awaitingTransfer;
  }

  if (
    paymentStatus === "paid" &&
    (fulfillmentStatus === "unfulfilled" || fulfillmentStatus === "preparing")
  ) {
    return CUSTOMER_ORDER_STATUS.paidPreparing;
  }

  if (paymentStatus === "pending" || paymentStatus === "processing") {
    return CUSTOMER_ORDER_STATUS.paymentPending;
  }

  return CUSTOMER_ORDER_STATUS.fallback;
}
