export type CategoryId =
  | "gunluk"
  | "klasik"
  | "outdoor"
  | "bot"
  | "yeni-sezon";

export type DummyProduct = {
  id: string;
  slug: string;
  name: string;
  code: string;
  price: number;
  oldPrice?: number;
  image: string;
  imageAlt: string;
  hoverImage?: string;
  teaser: string;
  /** WooCommerce / CMS ile doldurulacak meta açıklama; kartta gösterilmez. */
  seoDescription?: string;
  stock: "var" | "az" | "yok";
  category: CategoryId;
};

export const CATEGORIES: {
  id: CategoryId;
  title: string;
  subtitle: string;
}[] = [
  { id: "gunluk", title: "Günlük", subtitle: "Her güne rahat adım" },
  { id: "klasik", title: "Klasik", subtitle: "Zamansız şıklık" },
  { id: "outdoor", title: "Outdoor", subtitle: "Dayanıklı taban" },
  { id: "bot", title: "Bot", subtitle: "Kışa hazır" },
  { id: "yeni-sezon", title: "Yeni Sezon", subtitle: "Taze modeller" },
];

export const DUMMY_PRODUCTS: DummyProduct[] = [
  {
    id: "1",
    slug: "espresso-hakiki-deri-loafer",
    name: "Espresso Hakiki Deri Loafer",
    code: "BY-GN-2401",
    price: 2899,
    oldPrice: 3299,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Espresso renk deri loafer",
    hoverImage:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=80&auto=format&fit=crop",
    teaser: "Hakiki deri, günlük kullanım için esnek taban.",
    stock: "var",
    category: "gunluk",
  },
  {
    id: "2",
    slug: "antrasit-klasik-oxford",
    name: "Antrasit Klasik Oxford Ayakkabı",
    code: "BY-KL-1188",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Antrasit klasik oxford ayakkabı",
    teaser: "Ofis ve davetler için zarif Oxford formu.",
    stock: "var",
    category: "klasik",
  },
  {
    id: "3",
    slug: "kahverengi-outdoor-deri",
    name: "Kahverengi Outdoor Deri Ayakkabı",
    code: "BY-OT-5520",
    price: 3199,
    oldPrice: 3599,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Kahverengi outdoor ayakkabı",
    teaser: "Kaymaz taban, dayanıklı dikiş.",
    stock: "az",
    category: "outdoor",
  },
  {
    id: "4",
    slug: "siyah-kislik-deri-bot",
    name: "Siyah Kışlık Deri Bot",
    code: "BY-BT-9901",
    price: 3999,
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b0ed4?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Siyah deri bot",
    teaser: "Kış şartlarına uygun bilek desteği.",
    stock: "var",
    category: "bot",
  },
  {
    id: "5",
    slug: "kum-beji-gunluk-deri",
    name: "Kum Beji Günlük Deri Ayakkabı",
    code: "BY-GN-7712",
    price: 2599,
    oldPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Kum beji günlük sneaker",
    hoverImage:
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1200&q=80&auto=format&fit=crop",
    teaser: "Yeni sezon renkleri, hafif taban.",
    stock: "var",
    category: "yeni-sezon",
  },
  {
    id: "6",
    slug: "taba-klasik-cift-tokali-monk",
    name: "Taba Klasik Çift Tokalı Monk",
    code: "BY-KL-3340",
    price: 3699,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Taba renk monk strap",
    teaser: "Çift tokalı monk strap, el cilalı yüzey.",
    stock: "yok",
    category: "klasik",
  },
  {
    id: "7",
    slug: "haki-yuksek-bilek-outdoor",
    name: "Haki Yüksek Bilekli Outdoor Ayakkabı",
    code: "BY-OT-6611",
    price: 3399,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Haki outdoor hiker",
    teaser: "Yüksek bilek desteği, sağlam bağcık sistemi.",
    stock: "var",
    category: "outdoor",
  },
  {
    id: "8",
    slug: "kahverengi-deri-sehir-botu",
    name: "Kahverengi Deri Şehir Botu",
    code: "BY-BT-4410",
    price: 3799,
    oldPrice: 4199,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Kahverengi şehir botu",
    teaser: "Şehir kullanımına uygun klasik bot silüeti.",
    stock: "az",
    category: "yeni-sezon",
  },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function stockLabel(stock: DummyProduct["stock"]) {
  if (stock === "var") return "Stokta";
  if (stock === "az") return "Son adetler";
  return "Tükendi";
}

export function getDummyProductBySlug(slug: string) {
  return DUMMY_PRODUCTS.find((product) => product.slug === slug);
}
