import {
  bffJson,
  handleTervonaError,
  readJsonBody,
  rejectCrossOrigin,
  requireBffSession,
} from "@/lib/customer/bff";
import { mapCustomerAddress } from "@/lib/customer/map-dto";
import {
  tervonaDeleteAddress,
  tervonaUpdateAddress,
} from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const token = await requireBffSession();
  if (token instanceof Response) return token;

  const { id } = await context.params;
  const body = await readJsonBody(request);
  if (body instanceof Response) return body;

  try {
    const result = await tervonaUpdateAddress(token, id, {
      title: typeof body.title === "string" ? body.title : undefined,
      firstName: typeof body.firstName === "string" ? body.firstName : undefined,
      lastName: typeof body.lastName === "string" ? body.lastName : undefined,
      phone: typeof body.phone === "string" ? body.phone : undefined,
      city: typeof body.city === "string" ? body.city : undefined,
      district: typeof body.district === "string" ? body.district : undefined,
      neighborhood:
        typeof body.neighborhood === "string" ? body.neighborhood : undefined,
      addressLine:
        typeof body.addressLine === "string" ? body.addressLine : undefined,
      postalCode:
        typeof body.postalCode === "string" ? body.postalCode : undefined,
    });
    const address = mapCustomerAddress(
      result && typeof result === "object"
        ? (result as { address?: unknown }).address ?? result
        : result,
    );
    if (!address) {
      return handleTervonaError(new Error("invalid address"));
    }
    return bffJson({ address });
  } catch (error) {
    return handleTervonaError(error, { clearCookieOn401: true });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const token = await requireBffSession();
  if (token instanceof Response) return token;

  const { id } = await context.params;
  try {
    await tervonaDeleteAddress(token, id);
    return bffJson({ ok: true });
  } catch (error) {
    return handleTervonaError(error, { clearCookieOn401: true });
  }
}
