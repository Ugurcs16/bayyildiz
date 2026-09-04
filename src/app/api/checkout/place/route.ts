import { bffJson, rejectCrossOrigin } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import { trustedClientIp } from "@/lib/customer/request-guard";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import { readIdempotencyCookie } from "@/lib/checkout/cookies";
import { parseCheckoutPlaceBody, readCheckoutJson } from "@/lib/checkout/parse";
import {
  attachCheckoutCookies,
  checkoutErrorResponse,
  createStorefrontOrderForCheckout,
  initializePaymentForCheckout,
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

  try {
    const existing = await readIdempotencyCookie();
    const created = await createStorefrontOrderForCheckout({
      parsed,
      sessionToken: await readCustomerSessionToken(),
      clientIp: trustedClientIp(request),
      idempotencyRaw: existing
        ? `v1|${existing.fingerprint}|${existing.key}`
        : undefined,
    });
    if (created instanceof Response) return created;

    const paid = await initializePaymentForCheckout({
      orderId: created.orderId,
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
    return checkoutErrorResponse(error);
  }
}
