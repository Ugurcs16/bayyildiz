import { bffJson, rejectCrossOrigin } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import { trustedClientIp } from "@/lib/customer/request-guard";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import { readIdempotencyCookie } from "@/lib/checkout/cookies";
import { isHavaleEftEnabledServer } from "@/lib/checkout/features";
import { parseCheckoutPlaceBody, readCheckoutJson } from "@/lib/checkout/parse";
import {
  attachCheckoutCookies,
  checkoutErrorResponse,
  createStorefrontOrderForCheckout,
  initializePaymentForCheckout,
  type CreatedCheckoutOrder,
} from "@/lib/checkout/place";
import {
  checkoutClientIp,
  consumeCheckoutRateLimit,
} from "@/lib/checkout/rate-limit";

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
