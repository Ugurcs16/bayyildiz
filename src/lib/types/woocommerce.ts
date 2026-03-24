export type WCImage = {
  id: number;
  src: string;
  name: string;
  alt: string;
};

export type WCAttribute = {
  id: number;
  name: string;
  slug: string;
  options: string[];
};

export type WCProduct = {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "variable" | string;
  status: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder" | string;
  stock_quantity: number | null;
  short_description: string;
  description: string;
  images: WCImage[];
  categories: { id: number; name: string; slug: string }[];
  attributes: WCAttribute[];
  permalink: string;
};

export type WCVariation = {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  attributes: { name: string; option: string }[];
};

export type WCCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
};
