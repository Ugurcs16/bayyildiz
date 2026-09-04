import { bffError, bffJson } from "@/lib/customer/bff";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import type { CartLine } from "@/components/providers/cart-context";

export const CHECKOUT_BODY_MAX_BYTES = 32 * 1024;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export async function readCheckoutJson(
  request: Request,
): Promise<Record<string, unknown> | Response> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > CHECKOUT_BODY_MAX_BYTES) {
    return bffJson({ error: CUSTOMER_MESSAGES.invalidInput }, 413);
  }
  const raw = await request.text();
  if (raw.length > CHECKOUT_BODY_MAX_BYTES) {
    return bffJson({ error: CUSTOMER_MESSAGES.invalidInput }, 413);
  }
  try {
    const body = JSON.parse(raw) as unknown;
    if (!isRecord(body)) {
      return bffError(400);
    }
    return body;
  } catch {
    return bffError(400);
  }
}

function requiredString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function parseUuid(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!UUID_RE.test(trimmed)) return null;
  return trimmed.toLowerCase();
}

export type CheckoutPlaceInput = {
  items: CartLine[];
  orderItems: { productId: string; variantId: string; quantity: number }[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    city: string;
    district: string;
    neighborhood?: string;
    postalCode?: string;
    country?: string;
  };
};

export function parseCheckoutPlaceBody(
  body: Record<string, unknown>,
): CheckoutPlaceInput | Response {
  if (
    body.amount !== undefined ||
    body.grandTotal !== undefined ||
    body.currency !== undefined ||
    body.paymentStatus !== undefined ||
    body.status !== undefined
  ) {
    return bffJson({ error: CUSTOMER_MESSAGES.invalidInput }, 400);
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return bffError(400);
  }

  const items: CartLine[] = [];
  const orderItems: CheckoutPlaceInput["orderItems"] = [];

  for (const raw of body.items) {
    if (!isRecord(raw)) {
      return bffError(400);
    }
    const productId = parseUuid(raw.productId);
    const variantId = parseUuid(raw.variationId ?? raw.variantId);
    const quantity =
      typeof raw.quantity === "number" && Number.isInteger(raw.quantity)
        ? raw.quantity
        : null;
    if (!productId || !variantId || !quantity || quantity < 1 || quantity > 20) {
      return bffError(400);
    }
    items.push(raw as unknown as CartLine);
    orderItems.push({ productId, variantId, quantity });
  }

  if (!isRecord(body.customer) || !isRecord(body.shippingAddress)) {
    return bffError(400);
  }

  const email = requiredString(body.customer.email, 254);
  const firstName = requiredString(body.customer.firstName, 80);
  const lastName = requiredString(body.customer.lastName, 80);
  const phone = requiredString(body.customer.phone, 32);
  const addressLine1 = requiredString(
    body.shippingAddress.addressLine1 ?? body.shippingAddress.addressLine,
    200,
  );
  const city = requiredString(body.shippingAddress.city, 80);
  const district = requiredString(body.shippingAddress.district, 80);
  if (!email || !firstName || !lastName || !phone || !addressLine1 || !city || !district) {
    return bffError(400);
  }
  if (!email.includes("@")) {
    return bffError(400);
  }

  const neighborhood = requiredString(body.shippingAddress.neighborhood, 80) ?? undefined;
  const postalCode = requiredString(body.shippingAddress.postalCode, 16) ?? undefined;

  return {
    items,
    orderItems,
    customer: { email, firstName, lastName, phone },
    shippingAddress: {
      addressLine1,
      city,
      district,
      neighborhood,
      postalCode,
      country: "TR",
    },
  };
}

export function parseInitializeBody(
  body: Record<string, unknown>,
): { orderId?: string } | Response {
  if (
    body.amount !== undefined ||
    body.grandTotal !== undefined ||
    body.currency !== undefined ||
    body.paymentStatus !== undefined
  ) {
    return bffJson({ error: CUSTOMER_MESSAGES.invalidInput }, 400);
  }
  if (body.orderId === undefined || body.orderId === null || body.orderId === "") {
    return {};
  }
  const orderId = parseUuid(body.orderId);
  if (!orderId) {
    return bffError(400);
  }
  return { orderId };
}
