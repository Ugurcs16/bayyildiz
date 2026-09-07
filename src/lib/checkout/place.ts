import "server-only";

import type { NextResponse } from "next/server";
import { revalidateCartAgainstTervona } from "@/lib/cart-revalidate";
import { bffJson } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import {
  TervonaCustomerError,
  tervonaCreateStorefrontOrder,
  tervonaInitializeCheckoutPayment,
} from "@/lib/tervona/customer-client";
import {
  cartFingerprint,
  checkoutAccessToken,
  parseIdempotencyCookie,
  type CheckoutAccessCookie,
  type CheckoutIdempotencyCookie,
} from "@/lib/checkout/access";
import { resolveCheckoutIdempotencyKey } from "@/lib/checkout/idempotency-key";
import {
  applyCheckoutAccessCookie,
  applyIdempotencyCookie,
  mintIdempotencyKey,
} from "@/lib/checkout/cookies";
import { isAllowedIyzicoCheckoutUrl } from "@/lib/checkout/iyzico-url";
import type { CheckoutPlaceInput } from "@/lib/checkout/parse";

export function checkoutErrorResponse(error: unknown): NextResponse {
  if (error instanceof TervonaCustomerError) {
    if (error.status === 409 && error.code === "INSUFFICIENT_STOCK") {
      return bffJson(
        {
          error:
            "Bazı ürünlerin stoğu değişti. Lütfen sepetinizi kontrol edip tekrar deneyin.",
          code: "INSUFFICIENT_STOCK",
          items: error.items ?? [],
        },
        409,
      );
    }
    if (error.status === 409) {
      return bffJson(
        {
          error:
            "Bu ürün şu anda satışa uygun değil. Lütfen sepetinizi güncelleyin.",
          code: error.code,
        },
        409,
      );
    }
    if (error.status === 400) {
      const remote = (error.remoteMessage ?? "").toLowerCase();
      if (remote.includes("identity") || remote.includes("tckn")) {
        return bffJson(
          {
            error: "T.C. Kimlik No gerekli (11 haneli).",
            code: "IDENTITY_REQUIRED",
          },
          400,
        );
      }
      if (remote.includes("already in progress")) {
        return bffJson(
          {
            error: "Ödeme zaten başlatılıyor. Lütfen bekleyin.",
            code: "PAYMENT_IN_PROGRESS",
          },
          409,
        );
      }
      return bffJson({ error: CUSTOMER_MESSAGES.invalidInput }, 400);
    }
    if (error.status === 429) {
      return bffJson({ error: CUSTOMER_MESSAGES.tooMany }, 429);
    }
    if (error.status === 401) {
      return bffJson({ error: CUSTOMER_MESSAGES.unauthorized }, 401);
    }
    return bffJson(
      { error: CUSTOMER_MESSAGES.unavailable },
      error.status >= 500 ? error.status : 503,
    );
  }
  return bffJson({ error: CUSTOMER_MESSAGES.unavailable }, 503);
}

export type CreatedCheckoutOrder = {
  orderId: string;
  orderNumber: string;
  access: CheckoutAccessCookie;
  idempotency: CheckoutIdempotencyCookie;
};

export async function createStorefrontOrderForCheckout(input: {
  parsed: CheckoutPlaceInput;
  sessionToken: string | null;
  clientIp?: string;
  idempotencyRaw: string | undefined;
}): Promise<CreatedCheckoutOrder | NextResponse> {
  const stock = await revalidateCartAgainstTervona(input.parsed.items);
  if (!stock.ok) {
    return bffJson(
      {
        error:
          stock.items.length === 0
            ? "Sepetinizdeki ürünler stokta kalmadı."
            : "Stok değişti. Lütfen sepetinizi kontrol edip tekrar deneyin.",
        code: "STOCK_CHANGED",
        items: stock.items,
        issues: stock.issues,
      },
      409,
    );
  }

  // Authoritative IDs from revalidated cart — never size-only remapping.
  const orderItems = stock.items.map((line) => ({
    productId: line.productId,
    variantId: line.variationId,
    quantity: line.quantity,
  }));

  for (const line of stock.items) {
    if (!(line.variantSku ?? "").trim()) {
      return bffJson(
        {
          error:
            "Sepet kimliği doğrulanamadı. Lütfen ürünü sepetten çıkarıp yeniden ekleyin.",
          code: "CART_IDENTITY_INVALID",
          items: [],
          issues: stock.issues,
        },
        409,
      );
    }
  }

  const fingerprint = cartFingerprint(orderItems);
  const idempotency = resolveCheckoutIdempotencyKey({
    fingerprint,
    cookie: parseIdempotencyCookie(input.idempotencyRaw),
    clientKey: input.parsed.checkoutAttemptKey,
    mint: mintIdempotencyKey,
  });

  const created = await tervonaCreateStorefrontOrder({
    payload: {
      items: orderItems,
      customer: input.parsed.customer,
      shippingAddress: input.parsed.shippingAddress,
    },
    idempotencyKey: idempotency.key,
    sessionToken: input.sessionToken,
    clientIp: input.clientIp,
  });

  const accessToken = checkoutAccessToken(created.orderId);
  if (!accessToken) {
    return bffJson({ error: CUSTOMER_MESSAGES.unavailable }, 503);
  }

  return {
    orderId: created.orderId,
    orderNumber: created.orderNumber,
    access: {
      orderId: created.orderId,
      orderNumber: created.orderNumber,
      accessToken,
    },
    idempotency,
  };
}

export async function initializePaymentForCheckout(input: {
  orderId: string;
  identityNumber: string;
  sessionToken: string | null;
  clientIp?: string;
}): Promise<
  | { status: string; paymentPageUrl?: string; orderId: string }
  | NextResponse
> {
  const initialized = await tervonaInitializeCheckoutPayment({
    orderId: input.orderId,
    identityNumber: input.identityNumber,
    sessionToken: input.sessionToken,
    clientIp: input.clientIp,
  });

  if (initialized.status === "paid") {
    return { status: "paid", orderId: input.orderId };
  }
  if (initialized.status === "failed") {
    return bffJson(
      {
        error: "Ödeme başlatılamadı. Lütfen tekrar deneyin.",
        status: "failed",
      },
      502,
    );
  }
  if (!isAllowedIyzicoCheckoutUrl(initialized.paymentPageUrl)) {
    return bffJson({ error: CUSTOMER_MESSAGES.unavailable }, 502);
  }
  return {
    status: initialized.status,
    paymentPageUrl: initialized.paymentPageUrl,
    orderId: input.orderId,
  };
}

export function attachCheckoutCookies(
  response: NextResponse,
  created: CreatedCheckoutOrder,
): NextResponse {
  applyIdempotencyCookie(response, created.idempotency);
  applyCheckoutAccessCookie(response, created.access);
  return response;
}
