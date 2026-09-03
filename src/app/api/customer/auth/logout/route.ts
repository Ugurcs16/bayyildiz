import {
  bffJson,
  rejectCrossOrigin,
} from "@/lib/customer/bff";
import { trustedClientIp } from "@/lib/customer/request-guard";
import {
  clearCustomerSessionCookie,
  readCustomerSessionToken,
} from "@/lib/customer/session-cookie";
import { tervonaLogout } from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const token = await readCustomerSessionToken();
  await tervonaLogout(token, trustedClientIp(request));

  const response = bffJson({ ok: true });
  clearCustomerSessionCookie(response);
  return response;
}
