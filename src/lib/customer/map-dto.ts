import type {
  CustomerAddress,
  CustomerOrderDetail,
  CustomerOrderLine,
  CustomerProfile,
} from "./types";
import { publicProductCode, stripSupplierBrandLabel } from "@/lib/public-product-identity";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function mapCustomerProfile(value: unknown): CustomerProfile | null {
  const row = asRecord(value);
  if (!row) return null;
  const customer = asRecord(row.customer) ?? row;
  if (!str(customer.id) || !str(customer.email)) return null;
  return {
    id: str(customer.id),
    firstName: str(customer.firstName),
    lastName: str(customer.lastName),
    email: str(customer.email),
    phone: str(customer.phone),
  };
}

export function mapCustomerAddress(value: unknown): CustomerAddress | null {
  const row = asRecord(value);
  if (!row || !str(row.id)) return null;
  return {
    id: str(row.id),
    title: str(row.title),
    firstName: str(row.firstName),
    lastName: str(row.lastName),
    phone: str(row.phone),
    city: str(row.city),
    district: str(row.district),
    neighborhood: str(row.neighborhood) || null,
    addressLine: str(row.addressLine),
    postalCode: str(row.postalCode),
  };
}

function mapOrderLine(value: unknown): CustomerOrderLine | null {
  const row = asRecord(value);
  if (!row) return null;
  const rawTitle = str(row.productTitle) || str(row.title);
  if (!rawTitle) return null;
  const sku = str(row.sku) || str(row.variantSku) || str(row.variantTitle);
  const title = publicProductCode({
    name: rawTitle,
    variantSku: sku,
    code: str(row.productCode) || str(row.model),
  });
  const variantTitle = stripSupplierBrandLabel(str(row.variantTitle));
  return {
    title,
    variantTitle:
      variantTitle &&
      variantTitle.toLocaleUpperCase("tr-TR") !== title.toLocaleUpperCase("tr-TR")
        ? variantTitle
        : "",
    quantity: Math.max(0, Math.floor(num(row.quantity))),
  };
}

function statusLabel(orderStatus: string, fulfillmentStatus: string): string {
  const raw = (fulfillmentStatus || orderStatus).toLowerCase();
  if (raw.includes("cancel")) return "İptal";
  if (raw.includes("fulfill") || raw.includes("deliver")) return "Teslim edildi";
  if (raw.includes("ship")) return "Kargoda";
  if (raw.includes("prepar") || raw.includes("process") || raw.includes("pending")) {
    return "Hazırlanıyor";
  }
  return orderStatus || fulfillmentStatus || "Sipariş alındı";
}

export function mapCustomerOrder(value: unknown): CustomerOrderDetail | null {
  const row = asRecord(value);
  if (!row || !str(row.id)) return null;
  const lines = Array.isArray(row.lines)
    ? row.lines.map(mapOrderLine).filter((line): line is CustomerOrderLine => Boolean(line))
    : [];
  return {
    id: str(row.id),
    reference: str(row.orderNumber) || str(row.reference) || str(row.id),
    createdAt: str(row.createdAt),
    total: num(row.grandTotal) || num(row.total),
    currency: str(row.currency) || "TRY",
    status: statusLabel(str(row.orderStatus), str(row.fulfillmentStatus)),
    lines,
  };
}

