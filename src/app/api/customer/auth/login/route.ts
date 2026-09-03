import {
  applyCustomerSessionCookie,
} from "@/lib/customer/session-cookie";
import { bffError, bffJson, handleTervonaError, readJsonBody, rejectCrossOrigin } from "@/lib/customer/bff";
import { mapCustomerProfile } from "@/lib/customer/map-dto";
import { trustedClientIp } from "@/lib/customer/request-guard";
import { tervonaLogin, TervonaCustomerError } from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const body = await readJsonBody(request);
  if (body instanceof Response) return body;

  try {
    const result = await tervonaLogin(
      {
        email: body.email,
        password: body.password,
      },
      trustedClientIp(request),
    );
    const customer = mapCustomerProfile(result.customer);
    if (!customer) {
      return bffError(502);
    }
    const response = bffJson({ customer });
    applyCustomerSessionCookie(response, result.sessionToken, result.expiresAt);
    return response;
  } catch (error) {
    if (error instanceof TervonaCustomerError && error.status === 404) {
      return bffError(503);
    }
    return handleTervonaError(error);
  }
}
