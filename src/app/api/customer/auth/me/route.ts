import {
  bffError,
  bffJson,
  handleTervonaError,
  requireBffSession,
} from "@/lib/customer/bff";
import { mapCustomerProfile } from "@/lib/customer/map-dto";
import { clearCustomerSessionCookie } from "@/lib/customer/session-cookie";
import { tervonaMe } from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await requireBffSession();
  if (token instanceof Response) return token;

  try {
    const body = await tervonaMe(token);
    const customer = mapCustomerProfile(body);
    if (!customer) {
      const response = bffError(401);
      clearCustomerSessionCookie(response);
      return response;
    }
    return bffJson({ customer });
  } catch (error) {
    return handleTervonaError(error, { clearCookieOn401: true });
  }
}
