import "server-only";

import { mapCustomerOrder } from "@/lib/customer/map-dto";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import {
  TervonaCustomerError,
  tervonaCheckoutStatus,
  tervonaListOrders,
  type TervonaCheckoutStatusResponse,
} from "@/lib/tervona/customer-client";
import { readCheckoutAccessCookie } from "@/lib/checkout/cookies";
import {
  checkoutViewKindFromPaymentStatus,
  guestLookupMatchesCookie,
  isOrderUuid,
  sanitizeOrderLookup,
  type CheckoutViewKind,
} from "@/lib/checkout/result-state";
import type { TervonaBankTransferInstructions } from "@/lib/tervona/havale-types";

export type CheckoutResultView = {
  kind: CheckoutViewKind;
  orderId?: string;
  orderNumber?: string;
  amount?: number;
  currency?: string;
  /** Present only when Tervona returns bank instructions — never invented locally. */
  bankTransfer?: TervonaBankTransferInstructions;
};

function readBankTransfer(
  row: TervonaCheckoutStatusResponse,
): TervonaBankTransferInstructions | undefined {
  const raw = row.bankTransfer;
  if (!raw || typeof raw !== "object") return undefined;
  const beneficiaryName =
    typeof raw.beneficiaryName === "string" ? raw.beneficiaryName.trim() : "";
  const iban = typeof raw.iban === "string" ? raw.iban.trim() : "";
  const paymentReference =
    typeof raw.paymentReference === "string"
      ? raw.paymentReference.trim()
      : typeof row.orderNumber === "string"
        ? row.orderNumber.trim()
        : "";
  const amountDue =
    typeof raw.amountDue === "number" && Number.isFinite(raw.amountDue)
      ? raw.amountDue
      : typeof row.amount === "number" && Number.isFinite(row.amount)
        ? row.amount
        : NaN;
  if (!beneficiaryName || !iban || !paymentReference || !Number.isFinite(amountDue)) {
    return undefined;
  }
  const amountDueMinor =
    typeof raw.amountDueMinor === "number" && Number.isFinite(raw.amountDueMinor)
      ? Math.trunc(raw.amountDueMinor)
      : undefined;
  return {
    amountDue,
    amountDueMinor,
    currency: "TRY",
    beneficiaryName,
    iban,
    paymentReference,
    bankName: typeof raw.bankName === "string" ? raw.bankName : undefined,
    expiresAt: typeof raw.expiresAt === "string" ? raw.expiresAt : undefined,
  };
}

function viewFromStatus(row: TervonaCheckoutStatusResponse): CheckoutResultView {
  const bankTransfer = readBankTransfer(row);
  let kind = checkoutViewKindFromPaymentStatus(row.paymentStatus);
  if (bankTransfer && kind === "pending") {
    kind = "awaiting_transfer";
  }
  return {
    kind,
    orderId: row.orderId,
    orderNumber: row.orderNumber,
    amount: row.amount,
    currency: row.currency,
    bankTransfer,
  };
}

async function fetchStatus(input: {
  orderId: string;
  sessionToken?: string | null;
  checkoutAccess?: string | null;
}): Promise<CheckoutResultView> {
  try {
    const row = await tervonaCheckoutStatus(input);
    return viewFromStatus(row);
  } catch (error) {
    if (error instanceof TervonaCustomerError && (error.status === 404 || error.status === 401)) {
      return { kind: "unknown" };
    }
    return { kind: "pending" };
  }
}

async function orderIdForAuthenticatedLookup(
  queryOrder: string,
  sessionToken: string,
): Promise<string | null> {
  if (isOrderUuid(queryOrder)) {
    return queryOrder.toLowerCase();
  }
  try {
    const body = await tervonaListOrders(sessionToken);
    const rows =
      body && typeof body === "object" && Array.isArray((body as { orders?: unknown }).orders)
        ? (body as { orders: unknown[] }).orders
        : [];
    const match = rows
      .map(mapCustomerOrder)
      .find(
        (order) =>
          order && order.reference.toLowerCase() === queryOrder.toLowerCase(),
      );
    return match?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Authoritative checkout result. Query `payment=` is ignored.
 * Guest lookup requires the signed checkout cookie bound to this attempt.
 */
export async function loadCheckoutResult(input: {
  queryOrder?: string | string[] | undefined;
  queryPayment?: string | string[] | undefined;
}): Promise<CheckoutResultView> {
  void input.queryPayment;
  const queryOrder = sanitizeOrderLookup(input.queryOrder);
  const cookie = await readCheckoutAccessCookie();
  const sessionToken = await readCustomerSessionToken();

  if (guestLookupMatchesCookie(queryOrder, cookie)) {
    return fetchStatus({
      orderId: cookie.orderId,
      checkoutAccess: cookie.accessToken,
      sessionToken,
    });
  }

  if (sessionToken && queryOrder) {
    const orderId = await orderIdForAuthenticatedLookup(queryOrder, sessionToken);
    if (!orderId) {
      return { kind: "unknown" };
    }
    return fetchStatus({
      orderId,
      sessionToken,
    });
  }

  return { kind: "unknown" };
}
