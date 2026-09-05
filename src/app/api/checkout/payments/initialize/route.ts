import { bffError, bffJson, rejectCrossOrigin } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import { trustedClientIp } from "@/lib/customer/request-guard";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import { readCheckoutAccessCookie } from "@/lib/checkout/cookies";
import { parseInitializeBody, readCheckoutJson } from "@/lib/checkout/parse";
import {
  checkoutErrorResponse,
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
  if (!consumeCheckoutRateLimit("initializePayment", checkoutClientIp(request))) {
    return bffJson({ error: CUSTOMER_MESSAGES.tooMany }, 429);
  }

  const body = await readCheckoutJson(request);
  if (body instanceof Response) return body;
  const parsed = parseInitializeBody(body);
  if (parsed instanceof Response) return parsed;

  if (!parsed.identityNumber) {
    return bffJson(
      {
        error: "T.C. Kimlik No gerekli (11 haneli).",
        code: "IDENTITY_REQUIRED",
      },
      400,
    );
  }

  const cookie = await readCheckoutAccessCookie();
  const sessionToken = await readCustomerSessionToken();
  const orderId = parsed.orderId ?? cookie?.orderId;
  if (!orderId) {
    return bffError(404);
  }
  if (cookie && parsed.orderId && parsed.orderId !== cookie.orderId) {
    return bffError(404);
  }
  if (!cookie && !sessionToken) {
    return bffError(404);
  }

  try {
    const result = await initializePaymentForCheckout({
      orderId,
      identityNumber: parsed.identityNumber,
      sessionToken,
      clientIp: trustedClientIp(request),
    });
    if (result instanceof Response) return result;
    return bffJson({
      orderId: result.orderId,
      status: result.status,
      paymentPageUrl: result.paymentPageUrl,
    });
  } catch (error) {
    return checkoutErrorResponse(error);
  }
}
