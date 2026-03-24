import type { WCCategory, WCProduct, WCVariation } from "./types/woocommerce";

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
  "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
];

function mockImage(src: string, i: number) {
  return {
    id: i,
    src,
    name: `gorsel-${i}`,
    alt: "Erkek ayakkabı",
  };
}

export const MOCK_PRODUCTS: WCProduct[] = [
  {
    id: 1001,
    name: "Deri Günlük Loafer — Espresso",
    slug: "deri-gunluk-loafer-espresso",
    type: "simple",
    status: "publish",
    sku: "BY-GN-2401",
    price: "2899",
    regular_price: "3299",
    sale_price: "2899",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 12,
    short_description: "Hakiki deri, esnek taban. Günlük kullanım için ideal.",
    description:
      "<p>Hakiki dana derisi, nefes alan astar ve hafif EVA taban. Bursa atölye işçiliği.</p>",
    images: [mockImage(MOCK_IMAGES[0], 1), mockImage(MOCK_IMAGES[1], 2)],
    categories: [
      { id: 1, name: "Günlük", slug: "gunluk" },
      { id: 5, name: "Yeni Sezon", slug: "yeni-sezon" },
    ],
    attributes: [],
    permalink: "https://example.com/urun/deri-gunluk-loafer-espresso",
  },
  {
    id: 1002,
    name: "Klasik Oxford — Antrasit",
    slug: "klasik-oxford-antrasit",
    type: "simple",
    status: "publish",
    sku: "BY-KL-1188",
    price: "3499",
    regular_price: "3499",
    sale_price: "",
    on_sale: false,
    stock_status: "instock",
    stock_quantity: 6,
    short_description: "İnce dikiş, zarif burun. Ofis ve davetler için.",
    description:
      "<p>Tam deri astar, deri taban kombinasyonu. Klasik Oxford formu.</p>",
    images: [mockImage(MOCK_IMAGES[2], 3)],
    categories: [{ id: 2, name: "Klasik", slug: "klasik" }],
    attributes: [],
    permalink: "https://example.com/urun/klasik-oxford-antrasit",
  },
  {
    id: 1003,
    name: "Outdoor Trek — Kahve",
    slug: "outdoor-trek-kahve",
    type: "simple",
    status: "publish",
    sku: "BY-OT-5520",
    price: "3199",
    regular_price: "3599",
    sale_price: "3199",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 9,
    short_description: "Kaymaz taban, su itici yüzey.",
    description: "<p>Deri + tekstil karışımı üst yüzey, güçlendirilmiş burun.</p>",
    images: [mockImage(MOCK_IMAGES[3], 4)],
    categories: [{ id: 3, name: "Outdoor", slug: "outdoor" }],
    attributes: [],
    permalink: "https://example.com/urun/outdoor-trek-kahve",
  },
  {
    id: 1004,
    name: "Kışlık Bot — Siyah",
    slug: "kislik-bot-siyah",
    type: "variable",
    status: "publish",
    sku: "BY-BT-9901",
    price: "3999",
    regular_price: "3999",
    sale_price: "",
    on_sale: false,
    stock_status: "instock",
    stock_quantity: null,
    short_description: "Polar astarlı, su geçirmez deri seçeneği.",
    description: "<p>Yüksek bilek, deri gövde, kauçuk dış taban.</p>",
    images: [mockImage(MOCK_IMAGES[0], 5), mockImage(MOCK_IMAGES[2], 6)],
    categories: [{ id: 4, name: "Bot", slug: "bot" }],
    attributes: [
      {
        id: 1,
        name: "Beden",
        slug: "beden",
        options: ["40", "41", "42", "43", "44", "45"],
      },
    ],
    permalink: "https://example.com/urun/kislik-bot-siyah",
  },
  {
    id: 1005,
    name: "Casual Sneaker — Kum Beji",
    slug: "casual-sneaker-kum-beji",
    type: "simple",
    status: "publish",
    sku: "BY-GN-7712",
    price: "2599",
    regular_price: "2799",
    sale_price: "2599",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 15,
    short_description: "Hafif taban, günlük kombinlere uyumlu.",
    description: "<p>Hakiki deri detaylar, konforlu iç taban.</p>",
    images: [mockImage(MOCK_IMAGES[1], 7)],
    categories: [
      { id: 1, name: "Günlük", slug: "gunluk" },
      { id: 5, name: "Yeni Sezon", slug: "yeni-sezon" },
    ],
    attributes: [],
    permalink: "https://example.com/urun/casual-sneaker-kum-beji",
  },
  {
    id: 1006,
    name: "Klasik Monk Strap — Taba",
    slug: "klasik-monk-strap-taba",
    type: "simple",
    status: "publish",
    sku: "BY-KL-3340",
    price: "3699",
    regular_price: "3699",
    sale_price: "",
    on_sale: false,
    stock_status: "onbackorder",
    stock_quantity: 0,
    short_description: "Çift tokalı monk strap. Ön siparişe açık.",
    description: "<p>Tam deri, el cilalı yüzey.</p>",
    images: [mockImage(MOCK_IMAGES[2], 8)],
    categories: [{ id: 2, name: "Klasik", slug: "klasik" }],
    attributes: [],
    permalink: "https://example.com/urun/klasik-monk-strap-taba",
  },
  {
    id: 1007,
    name: "Outdoor Hiker — Haki",
    slug: "outdoor-hiker-haki",
    type: "simple",
    status: "publish",
    sku: "BY-OT-6611",
    price: "3399",
    regular_price: "3399",
    sale_price: "",
    on_sale: false,
    stock_status: "instock",
    stock_quantity: 4,
    short_description: "Yüksek bilek desteği, vakum taban.",
    description: "<p>Deri gövde, metal bağcık halkaları.</p>",
    images: [mockImage(MOCK_IMAGES[3], 9)],
    categories: [{ id: 3, name: "Outdoor", slug: "outdoor" }],
    attributes: [],
    permalink: "https://example.com/urun/outdoor-hiker-haki",
  },
  {
    id: 1008,
    name: "Şehir Botu — Kahverengi",
    slug: "sehir-botu-kahverengi",
    type: "simple",
    status: "publish",
    sku: "BY-BT-4410",
    price: "3799",
    regular_price: "4199",
    sale_price: "3799",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 7,
    short_description: "Klasik şehir botu, yumuşak astar.",
    description: "<p>Fermuarlı yan detay, deri yüzey.</p>",
    images: [mockImage(MOCK_IMAGES[0], 10)],
    categories: [
      { id: 4, name: "Bot", slug: "bot" },
      { id: 5, name: "Yeni Sezon", slug: "yeni-sezon" },
    ],
    attributes: [],
    permalink: "https://example.com/urun/sehir-botu-kahverengi",
  },
  {
    id: 1009,
    name: "Minimal Loafer — Siyah",
    slug: "minimal-loafer-siyah",
    type: "simple",
    status: "publish",
    sku: "BY-GN-8820",
    price: "2699",
    regular_price: "2699",
    sale_price: "",
    on_sale: false,
    stock_status: "instock",
    stock_quantity: 20,
    short_description: "İnce profil, mat deri.",
    description: "<p>Günlük ve iş kombinlerine uygun sade çizgi.</p>",
    images: [mockImage(MOCK_IMAGES[1], 11)],
    categories: [{ id: 1, name: "Günlük", slug: "gunluk" }],
    attributes: [],
    permalink: "https://example.com/urun/minimal-loafer-siyah",
  },
  {
    id: 1010,
    name: "Yeni Sezon Deri Sneaker",
    slug: "yeni-sezon-deri-sneaker",
    type: "simple",
    status: "publish",
    sku: "BY-YS-1001",
    price: "2999",
    regular_price: "2999",
    sale_price: "",
    on_sale: false,
    stock_status: "instock",
    stock_quantity: 11,
    short_description: "Yeni sezon renkleri, hakiki deri kaplama.",
    description: "<p>Konforlu iç taban, hafif dış taban.</p>",
    images: [mockImage(MOCK_IMAGES[2], 12)],
    categories: [{ id: 5, name: "Yeni Sezon", slug: "yeni-sezon" }],
    attributes: [],
    permalink: "https://example.com/urun/yeni-sezon-deri-sneaker",
  },
];

export const MOCK_VARIATIONS: Record<number, WCVariation[]> = {
  1004: [
    {
      id: 2001,
      price: "3999",
      regular_price: "3999",
      sale_price: "",
      on_sale: false,
      stock_status: "instock",
      attributes: [{ name: "Beden", option: "42" }],
    },
    {
      id: 2002,
      price: "3999",
      regular_price: "3999",
      sale_price: "",
      on_sale: false,
      stock_status: "outofstock",
      attributes: [{ name: "Beden", option: "43" }],
    },
    {
      id: 2003,
      price: "3999",
      regular_price: "3999",
      sale_price: "",
      on_sale: false,
      stock_status: "instock",
      attributes: [{ name: "Beden", option: "44" }],
    },
  ],
};

const MOCK_CATEGORIES: WCCategory[] = [
  { id: 1, name: "Günlük", slug: "gunluk", parent: 0, count: 4 },
  { id: 2, name: "Klasik", slug: "klasik", parent: 0, count: 2 },
  { id: 3, name: "Outdoor", slug: "outdoor", parent: 0, count: 2 },
  { id: 4, name: "Bot", slug: "bot", parent: 0, count: 2 },
  { id: 5, name: "Yeni Sezon", slug: "yeni-sezon", parent: 0, count: 4 },
];

function getCredentials() {
  const url = process.env.WOOCOMMERCE_URL?.replace(/\/$/, "");
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!url || !key || !secret) return null;
  return { url, key, secret };
}

async function wcFetch<T>(path: string, params?: Record<string, string>) {
  const cred = getCredentials();
  if (!cred) return null;
  const u = new URL(`/wp-json/wc/v3/${path}`, `${cred.url}/`);
  u.searchParams.set("consumer_key", cred.key);
  u.searchParams.set("consumer_secret", cred.secret);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") u.searchParams.set(k, v);
    }
  }
  const res = await fetch(u.toString(), {
    next: { revalidate: 120 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export function isWooConfigured(): boolean {
  return getCredentials() !== null;
}

export async function getCategories(): Promise<WCCategory[]> {
  const cred = getCredentials();
  const data = await wcFetch<WCCategory[]>("products/categories", {
    per_page: "100",
    hide_empty: "true",
  });
  if (cred) return data ?? [];
  return MOCK_CATEGORIES;
}

export async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  const api = await getCategories();
  const found = api.find((c) => c.slug === slug);
  return found?.id ?? null;
}

export async function getProducts(options: {
  perPage?: number;
  page?: number;
  category?: string;
  featured?: boolean;
}): Promise<WCProduct[]> {
  const { perPage = 12, page = 1, category, featured } = options;
  const cred = getCredentials();
  const params: Record<string, string> = {
    per_page: String(perPage),
    page: String(page),
    status: "publish",
  };
  if (featured) params.featured = "true";

  if (category) {
    const id = await getCategoryIdBySlug(category);
    if (cred) {
      if (!id) return [];
      params.category = String(id);
    }
  }

  const data = await wcFetch<WCProduct[]>("products", params);
  if (cred) return data ?? [];

  let list = [...MOCK_PRODUCTS];
  if (category) {
    list = list.filter((p) =>
      p.categories.some((c) => c.slug === category),
    );
  }
  return list.slice(0, perPage);
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const cred = getCredentials();
  const data = await wcFetch<WCProduct[]>("products", {
    slug,
    per_page: "1",
  });
  if (cred) return data?.[0] ?? null;
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  const cred = getCredentials();
  if (cred) {
    const data = await wcFetch<WCProduct>(`products/${id}`);
    return data ?? null;
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function getVariations(productId: number): Promise<WCVariation[]> {
  const cred = getCredentials();
  const data = await wcFetch<WCVariation[]>(
    `products/${productId}/variations`,
    { per_page: "100" },
  );
  if (cred) return data ?? [];
  return MOCK_VARIATIONS[productId] ?? [];
}

export async function getSimilarProducts(
  product: WCProduct,
  limit = 4,
): Promise<WCProduct[]> {
  const cat = product.categories[0]?.slug;
  if (!cat) return [];
  const list = await getProducts({ perPage: limit + 2, category: cat });
  return list.filter((p) => p.id !== product.id).slice(0, limit);
}

export function formatTry(amount: string) {
  const n = Number.parseFloat(amount);
  if (Number.isNaN(n)) return amount;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function stockLabel(status: string, qty: number | null) {
  if (status === "instock")
    return qty !== null && qty > 0 ? `Stokta (${qty})` : "Stokta";
  if (status === "onbackorder") return "Ön sipariş";
  return "Tükendi";
}
