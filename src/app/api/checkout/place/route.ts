import { bffJson, rejectCrossOrigin } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import { trustedClientIp } from "@/lib/customer/request-guard";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import { parseDiscountPreviewBody } from "@/lib/checkout/coupon";
import { readIdempotencyCookie } from "@/lib/checkout/cookies";
import { isHavaleEftEnabledServer } from "@/lib/checkout/features";
import { parseCheckoutPlaceBody, readCheckoutJson } from "@/lib/checkout/parse";
import {
  attachCheckoutCookies,
  checkoutErrorResponse,
  createStorefrontOrderForCheckout,
  initializePaymentForCheckout,
  rejectCouponAmountMismatch,
  type CreatedCheckoutOrder,
} from "@/lib/checkout/place";
import {
  checkoutClientIp,
  consumeCheckoutRateLimit,
} from "@/lib/checkout/rate-limit";
import { tervonaPreviewCheckoutDiscount } from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  if (!consumeCheckoutRateLimit("place", checkoutClientIp(request))) {
    return bffJson({ error: CUSTOMER_MESSAGES.tooMany }, 429);
  }

  const body = await readCheckoutJson(request);
  if (body instanceof Response) return body;
  const parsed = parseCheckoutPlaceBody(body);
  if (parsed instanceof Response) return parsed;

  if (parsed.paymentMethod === "bank_transfer" && !isHavaleEftEnabledServer()) {
    return bffJson(
      {
        error: "Havale / EFT ödeme yöntemi şu an kapalı.",
        code: "HAVALE_DISABLED",
      },
      403,
    );
  }

  let created: CreatedCheckoutOrder | undefined;
  try {
    // Coupon: preview on the server before create (avoids single-use consume races).
    let couponPreviewAmountTl: number | null = null;
    if (parsed.couponCode) {
      try {
        const remote = await tervonaPreviewCheckoutDiscount({
          payload: {
            items: parsed.orderItems,
            paymentMethod: parsed.paymentMethod,
            couponCode: parsed.couponCode,
          },
          sessionToken: await readCustomerSessionToken(),
          clientIp: trustedClientIp(request),
        });
        const preview = parseDiscountPreviewBody(remote);
        if (!preview || !preview.valid) {
          return bffJson(
            {
              valid: false,
              error:
                preview && !preview.valid
                  ? preview.error
                  : "İndirim kodu doğrulanamadı.",
              code: "COUPON_INVALID",
            },
            400,
          );
        }
        couponPreviewAmountTl = preview.amount;
      } catch (error) {
        return checkoutErrorResponse(error);
      }
    }

    const existing = await readIdempotencyCookie();
    const order = await createStorefrontOrderForCheckout({
      parsed,
      sessionToken: await readCustomerSessionToken(),
      clientIp: trustedClientIp(request),
      idempotencyRaw: existing
        ? `v1|${existing.fingerprint}|${existing.key}`
        : undefined,
    });
    if (order instanceof Response) return order;
    created = order;

    if (parsed.couponCode) {
      const mismatch = rejectCouponAmountMismatch({
        created,
        previewAmountTl: couponPreviewAmountTl,
      });
      if (mismatch) {
        return attachCheckoutCookies(mismatch, created);
      }
    }

    // Havale/EFT: never call iyzico — Tervona already set awaiting_transfer.
    if (parsed.paymentMethod === "bank_transfer") {
      const response = bffJson({
        orderId: created.orderId,
        orderNumber: created.orderNumber,
        status: created.paymentStatus || "awaiting_transfer",
        amount: created.amount,
        currency: created.currency,
      });
      return attachCheckoutCookies(response, created);
    }

    const paid = await initializePaymentForCheckout({
      orderId: created.orderId,
      identityNumber: parsed.identityNumber,
      sessionToken: await readCustomerSessionToken(),
      clientIp: trustedClientIp(request),
    });
    if (paid instanceof Response) {
      return attachCheckoutCookies(paid, created);
    }

    const response = bffJson({
      orderId: created.orderId,
      orderNumber: created.orderNumber,
      status: paid.status,
      paymentPageUrl: paid.paymentPageUrl,
    });
    return attachCheckoutCookies(response, created);
  } catch (error) {
    const failure = checkoutErrorResponse(error);
    // Persist idempotency + access even when initialize throws (e.g. missing TCKN upstream).
    if (created) {
      return attachCheckoutCookies(failure, created);
    }
    return failure;
  }
}
