export type CategoryId =
  | "gunluk"
  | "klasik"
  | "outdoor"
  | "bot"
  | "yeni-sezon";

export type DummyProduct = {
  id: string;
  name: string;
  code: string;
  price: number;
  oldPrice?: number;
  image: string;
  imageAlt: string;
  hoverImage?: string;
  teaser: string;
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
    name: "Espresso Hakiki Deri Loafer",
    code: "BY-GN-2401",
    price: 2899,
    oldPrice: 3299,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    imageAlt: "Espresso renk deri loafer",
    hoverImage:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
    teaser: "Hakiki deri, günlük kullanım için esnek taban.",
    stock: "var",
    category: "gunluk",
  },
  {
    id: "2",
    name: "Antrasit Klasik Oxford Ayakkabı",
    code: "BY-KL-1188",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80",
    imageAlt: "Antrasit klasik oxford ayakkabı",
    teaser: "Ofis ve davetler için zarif Oxford formu.",
    stock: "var",
    category: "klasik",
  },
  {
    id: "3",
    name: "Kahverengi Outdoor Deri Ayakkabı",
    code: "BY-OT-5520",
    price: 3199,
    oldPrice: 3599,
    image:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
    imageAlt: "Kahverengi outdoor ayakkabı",
    teaser: "Kaymaz taban, dayanıklı dikiş.",
    stock: "az",
    category: "outdoor",
  },
  {
    id: "4",
    name: "Siyah Kışlık Deri Bot",
    code: "BY-BT-9901",
    price: 3999,
    image:
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80",
    imageAlt: "Siyah deri bot",
    teaser: "Kış şartlarına uygun bilek desteği.",
    stock: "var",
    category: "bot",
  },
  {
    id: "5",
    name: "Kum Beji Günlük Deri Ayakkabı",
    code: "BY-GN-7712",
    price: 2599,
    oldPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    imageAlt: "Kum beji günlük sneaker",
    hoverImage:
      "https://images.unsplash.com/photo-1605348535680-58b8b4a5e5b5?w=800&q=80",
    teaser: "Yeni sezon renkleri, hafif taban.",
    stock: "var",
    category: "yeni-sezon",
  },
  {
    id: "6",
    name: "Taba Klasik Çift Tokalı Monk",
    code: "BY-KL-3340",
    price: 3699,
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80",
    imageAlt: "Taba renk monk strap",
    teaser: "Çift tokalı monk strap, el cilalı yüzey.",
    stock: "yok",
    category: "klasik",
  },
  {
    id: "7",
    name: "Haki Yüksek Bilekli Outdoor Ayakkabı",
    code: "BY-OT-6611",
    price: 3399,
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    imageAlt: "Haki outdoor hiker",
    teaser: "Yüksek bilek desteği, sağlam bağcık sistemi.",
    stock: "var",
    category: "outdoor",
  },
  {
    id: "8",
    name: "Kahverengi Deri Şehir Botu",
    code: "BY-BT-4410",
    price: 3799,
    oldPrice: 4199,
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b0ed4?w=800&q=80",
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
