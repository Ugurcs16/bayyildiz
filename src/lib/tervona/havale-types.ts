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
 * Create-order / checkout-status bankTransfer object.
 * IBAN and beneficiary come only from Tervona env — never hardcode in Bayyıldız.
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
