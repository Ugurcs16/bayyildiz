import {
  bffJson,
  handleTervonaError,
  readJsonBody,
  rejectCrossOrigin,
  requireBffSession,
} from "@/lib/customer/bff";
import { mapCustomerAddress } from "@/lib/customer/map-dto";
import {
  tervonaCreateAddress,
  tervonaListAddresses,
} from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await requireBffSession();
  if (token instanceof Response) return token;

  try {
    const body = await tervonaListAddresses(token);
    const rows =
      body && typeof body === "object" && Array.isArray((body as { addresses?: unknown }).addresses)
        ? (body as { addresses: unknown[] }).addresses
        : [];
    const addresses = rows
      .map(mapCustomerAddress)
      .filter((row): row is NonNullable<typeof row> => Boolean(row));
    return bffJson({ addresses });
  } catch (error) {
    return handleTervonaError(error, { clearCookieOn401: true });
  }
}

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const token = await requireBffSession();
  if (token instanceof Response) return token;

  const body = await readJsonBody(request);
  if (body instanceof Response) return body;

  try {
    const result = await tervonaCreateAddress(token, {
      title: String(body.title ?? ""),
      firstName: String(body.firstName ?? ""),
      lastName: String(body.lastName ?? ""),
      phone: String(body.phone ?? ""),
      city: String(body.city ?? ""),
      district: String(body.district ?? ""),
      neighborhood:
        typeof body.neighborhood === "string" ? body.neighborhood : undefined,
      addressLine: String(body.addressLine ?? ""),
      postalCode: typeof body.postalCode === "string" ? body.postalCode : undefined,
    });
    const address = mapCustomerAddress(
      result && typeof result === "object"
        ? (result as { address?: unknown }).address ?? result
        : result,
    );
    if (!address) {
      return handleTervonaError(new Error("invalid address"));
    }
    return bffJson({ address }, 201);
  } catch (error) {
    return handleTervonaError(error, { clearCookieOn401: true });
  }
}
