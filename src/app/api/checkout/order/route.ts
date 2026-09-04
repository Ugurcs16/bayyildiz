import { bffJson, rejectCrossOrigin } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import { trustedClientIp } from "@/lib/customer/request-guard";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import { readIdempotencyCookie } from "@/lib/checkout/cookies";
import {
  checkoutClientIp,
  consumeCheckoutRateLimit,
} from "@/lib/checkout/rate-limit";
import { parseCheckoutPlaceBody, readCheckoutJson } from "@/lib/checkout/parse";
import {
  attachCheckoutCookies,
  checkoutErrorResponse,
  createStorefrontOrderForCheckout,
} from "@/lib/checkout/place";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  if (!consumeCheckoutRateLimit("createOrder", checkoutClientIp(request))) {
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
    const response = bffJson({
      orderId: created.orderId,
      orderNumber: created.orderNumber,
      paymentStatus: "pending",
    });
    return attachCheckoutCookies(response, created);
  } catch (error) {
    return checkoutErrorResponse(error);
  }
}
