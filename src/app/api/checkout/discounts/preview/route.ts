import {
  normalizeCouponCode,
  parseCouponCodeInput,
  parseDiscountPreviewBody,
  type DiscountPreviewItem,
} from "@/lib/checkout/coupon";
import {
  checkoutClientIp,
  consumeCheckoutRateLimit,
} from "@/lib/checkout/rate-limit";
import { parseCheckoutPaymentMethod } from "@/lib/checkout/payment-method";
import { readCheckoutJson } from "@/lib/checkout/parse";
import { bffError, bffJson, rejectCrossOrigin } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import { trustedClientIp } from "@/lib/customer/request-guard";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import {
  TervonaCustomerError,
  tervonaPreviewCheckoutDiscount,
} from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parsePreviewItems(raw: unknown): DiscountPreviewItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const items: DiscountPreviewItem[] = [];
  for (const entry of raw) {
    if (!isRecord(entry)) return null;
    const productId =
      typeof entry.productId === "string" ? entry.productId.trim() : "";
    const variantIdRaw = entry.variantId ?? entry.variationId;
    const variantId =
      typeof variantIdRaw === "string" ? variantIdRaw.trim() : "";
    const quantity =
      typeof entry.quantity === "number" && Number.isInteger(entry.quantity)
        ? entry.quantity
        : NaN;
    if (
      !UUID_RE.test(productId) ||
      !UUID_RE.test(variantId) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 20
    ) {
      return null;
    }
    items.push({
      productId: productId.toLowerCase(),
      variantId: variantId.toLowerCase(),
      quantity,
    });
  }
  return items;
}

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  if (!consumeCheckoutRateLimit("discountPreview", checkoutClientIp(request))) {
    return bffJson({ error: CUSTOMER_MESSAGES.tooMany }, 429);
  }

  const body = await readCheckoutJson(request);
  if (body instanceof Response) return body;

  // Never accept client-calculated money fields.
  if (
    body.amount !== undefined ||
    body.grandTotal !== undefined ||
    body.discount !== undefined ||
    body.couponPercent !== undefined ||
    body.percentDiscount !== undefined ||
    body.totalDiscount !== undefined ||
    body.subtotal !== undefined
  ) {
    return bffJson({ error: CUSTOMER_MESSAGES.invalidInput }, 400);
  }

  const items = parsePreviewItems(body.items);
  if (!items) {
    return bffError(400);
  }

  const paymentMethod = parseCheckoutPaymentMethod(
    body.paymentMethod ?? "card",
  );
  if (!paymentMethod) {
    return bffJson(
      { error: CUSTOMER_MESSAGES.invalidInput, code: "PAYMENT_METHOD_INVALID" },
      400,
    );
  }

  const couponCode = parseCouponCodeInput(body.couponCode);
  if (!couponCode) {
    return bffJson(
      {
        valid: false,
        code: normalizeCouponCode(body.couponCode),
        error: "İndirim kodu geçersiz.",
      },
      400,
    );
  }

  try {
    const remote = await tervonaPreviewCheckoutDiscount({
      payload: {
        items,
        paymentMethod,
        couponCode,
      },
      sessionToken: await readCustomerSessionToken(),
      clientIp: trustedClientIp(request),
    });

    const parsed = parseDiscountPreviewBody(remote);
    if (!parsed) {
      return bffJson(
        {
          valid: false,
          error: "İndirim önizlemesi alınamadı. Lütfen tekrar deneyin.",
          code: "COUPON_PREVIEW_INVALID",
        },
        502,
      );
    }

    if (!parsed.valid) {
      return bffJson(parsed, 400);
    }

    return bffJson(parsed, 200);
  } catch (error) {
    if (error instanceof TervonaCustomerError) {
      if (error.status === 429) {
        return bffJson({ error: CUSTOMER_MESSAGES.tooMany }, 429);
      }
      if (error.status === 401) {
        // Guest checkout has no customer session; Tervona 401 here is BFF auth,
        // not a shopper login problem — avoid "session ended" copy.
        return bffJson(
          {
            valid: false,
            error:
              "İndirim şu an doğrulanamıyor. Kuponsuz devam edebilir veya daha sonra deneyebilirsiniz.",
            code: "COUPON_PREVIEW_UNAUTHORIZED",
          },
          503,
        );
      }
      if (error.status === 400) {
        return bffJson(
          {
            valid: false,
            code: couponCode,
            error:
              error.remoteMessage?.trim() ||
              "İndirim kodu bu ödeme için geçerli değil.",
          },
          400,
        );
      }
      return bffJson(
        {
          valid: false,
          error: CUSTOMER_MESSAGES.unavailable,
          code: "COUPON_PREVIEW_UNAVAILABLE",
        },
        error.status >= 500 ? error.status : 503,
      );
    }
    return bffJson(
      {
        valid: false,
        error: CUSTOMER_MESSAGES.unavailable,
        code: "COUPON_PREVIEW_UNAVAILABLE",
      },
      503,
    );
  }
}
