/** Public Tervona Storefront DTO (read-only). No inventory/provider internals. */

export type StorefrontStockState =
  | "sold_out"
  | "last_item"
  | "low_stock"
  | "in_stock";

export type StorefrontMoney = {
  amount: string;
  currency: "TRY";
};

export type StorefrontCategory = {
  id: string;
  slug: string;
  name: string;
};

export type StorefrontImage = {
  url: string;
  alt: string;
  sortOrder: number;
};

export type StorefrontVariant = {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  size?: string;
  price: StorefrontMoney;
  compareAtPrice: StorefrontMoney | null;
  onlineEnabled: boolean;
  availableStock: number;
  available: boolean;
  stockState: StorefrontStockState;
};

export type StorefrontProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: StorefrontCategory | null;
  images: StorefrontImage[];
  price: StorefrontMoney;
  compareAtPrice: StorefrontMoney | null;
  currency: "TRY";
  variants: StorefrontVariant[];
  available: boolean;
  totalAvailableStock: number;
};

export type StorefrontProductList = {
  products: StorefrontProduct[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

export type StorefrontListParams = {
  category?: string;
  featured?: boolean;
  sort?: "title" | "price" | "featured";
  page?: number;
  limit?: number;
};
