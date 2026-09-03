import {
  bffJson,
  handleTervonaError,
  requireBffSession,
} from "@/lib/customer/bff";
import { mapCustomerOrder } from "@/lib/customer/map-dto";
import { tervonaGetOrder } from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const token = await requireBffSession();
  if (token instanceof Response) return token;

  const { id } = await context.params;
  try {
    const body = await tervonaGetOrder(token, id);
    const order = mapCustomerOrder(
      body && typeof body === "object"
        ? (body as { order?: unknown }).order ?? body
        : body,
    );
    if (!order) {
      return handleTervonaError(new Error("invalid order"));
    }
    return bffJson({ order });
  } catch (error) {
    return handleTervonaError(error, { clearCookieOn401: true });
  }
}
