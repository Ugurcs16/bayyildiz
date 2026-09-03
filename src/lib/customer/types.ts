/** Browser-safe customer DTOs. Do not expose session tokens or Tervona internals. */

export type CustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CustomerAddress = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string | null;
  addressLine: string;
  postalCode: string;
};

export type CustomerAddressInput = {
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood?: string;
  addressLine: string;
  postalCode?: string;
};

export type CustomerOrderLine = {
  title: string;
  variantTitle: string;
  quantity: number;
};

export type CustomerOrderSummary = {
  id: string;
  reference: string;
  createdAt: string;
  total: number;
  currency: string;
  status: string;
  lines: CustomerOrderLine[];
};

export type CustomerOrderDetail = CustomerOrderSummary;
