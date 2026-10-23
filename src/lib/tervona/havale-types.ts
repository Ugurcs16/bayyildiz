/**
 * Tervona storefront Havale/EFT contract (Production).
 * @see Tervona storefront-contract.ts — POST /api/storefront/orders
 *      GET /api/storefront/checkout/orders/:orderId
 */

export type TervonaPaymentMethod = "card" | "bank_transfer";

/** POST /api/storefront/orders — when placing Havale/EFT. */
export type TervonaCreateOrderHavaleRequestExtras = {
  paymentMethod: "bank_transfer";
};

/**
 * Optional discount breakdown on new havale orders.
 * Older snapshots omit `discount` entirely — never invent it locally.
 */
export type TervonaBankTransferDiscount = {
  percentDiscount: number;
  percentDiscountMinor: number;
  roundingDiscount: number;
  roundingDiscountMinor: number;
  totalDiscount: number;
  totalDiscountMinor: number;
};

/**
 * Create-order / checkout-status bankTransfer object.
 * IBAN and beneficiary come only from Tervona env — never hardcode in Bayyıldız.
 * `amountDueMinor` is the authoritative payable amount.
 */
export type TervonaBankTransferInstructions = {
  beneficiaryName: string;
  iban: string;
  paymentReference: string;
  amountDue: number;
  amountDueMinor?: number;
  currency: "TRY";
  bankName?: string;
  expiresAt?: string;
  discount?: TervonaBankTransferDiscount;
};

export type TervonaBankTransferCreateResponse = {
  orderId: string;
  orderNumber: string;
  paymentStatus: "awaiting_transfer";
  fulfillmentStatus: string;
  amount: number;
  currency: "TRY";
  bankTransfer: TervonaBankTransferInstructions;
};
