import { bffJson } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import { loadCheckoutResult } from "@/lib/checkout/load-result";
import {
  checkoutClientIp,
  consumeCheckoutRateLimit,
} from "@/lib/checkout/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!consumeCheckoutRateLimit("result", checkoutClientIp(request))) {
    return bffJson({ error: CUSTOMER_MESSAGES.tooMany }, 429);
  }
  const url = new URL(request.url);
  const result = await loadCheckoutResult({
    queryOrder: url.searchParams.get("order") ?? undefined,
    queryPayment: url.searchParams.get("payment") ?? undefined,
  });
  return bffJson({
    kind: result.kind,
    orderNumber: result.orderNumber,
  });
}
