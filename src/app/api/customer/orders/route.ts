import {
  bffJson,
  handleTervonaError,
  requireBffSession,
} from "@/lib/customer/bff";
import { mapCustomerOrder } from "@/lib/customer/map-dto";
import { tervonaListOrders } from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await requireBffSession();
  if (token instanceof Response) return token;

  try {
    const body = await tervonaListOrders(token);
    const rows =
      body && typeof body === "object" && Array.isArray((body as { orders?: unknown }).orders)
        ? (body as { orders: unknown[] }).orders
        : [];
    const orders = rows
      .map(mapCustomerOrder)
      .filter((row): row is NonNullable<typeof row> => Boolean(row));
    return bffJson({ orders });
  } catch (error) {
    return handleTervonaError(error, { clearCookieOn401: true });
  }
}
