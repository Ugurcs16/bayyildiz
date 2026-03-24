export const SITE_NAME = "Bayyıldız Ayakkabı";
export const SITE_URL = "https://bayyildiz.com";
export const SITE_DESCRIPTION =
  "Hakiki deri erkek ayakkabıları. Bursa'dan güvenilir alışveriş, uygun fiyat ve kaliteli işçilik.";

export const WHATSAPP_NUMBER = "905522208298";
export const WHATSAPP_DISPLAY = "0552 220 82 98";

/** Kategori satırları vitrin bölümüne kaydırır; Hakkımızda ayrı sayfa. */
export const NAV_ITEMS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#kategoriler", label: "Günlük" },
  { href: "/#kategoriler", label: "Klasik" },
  { href: "/#kategoriler", label: "Outdoor" },
  { href: "/#kategoriler", label: "Bot" },
  { href: "/#kategoriler", label: "Yeni Sezon" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/#iletisim", label: "İletişim" },
] as const;

export const FOOTER_ABOUT_SNIPPET =
  "Bursa kökenli Bayyıldız; hakiki deri erkek ayakkabısında kalite, konfor ve dürüst fiyatı bir araya getirir. İki mağazamızda sizi ağırlamaktan mutluluk duyarız.";

export const LEGAL_ROUTES = {
  privacy: "/gizlilik-politikasi",
  terms: "/sartlar-ve-kosullar",
} as const;

export const CATEGORY_QUICK = [
  { slug: "gunluk", title: "Günlük", subtitle: "Her güne rahat adım" },
  { slug: "klasik", title: "Klasik", subtitle: "Zamansız şıklık" },
  { slug: "outdoor", title: "Outdoor", subtitle: "Dayanıklı taban" },
  { slug: "bot", title: "Bot", subtitle: "Kışa hazır çizgiler" },
  { slug: "yeni-sezon", title: "Yeni Sezon", subtitle: "Yeni gelen modeller" },
] as const;

export const TRUST_BADGES = [
  "Hakiki deri kalitesi",
  "Bursa'da iki mağaza",
  "Hızlı WhatsApp desteği",
  "Güvenli alışveriş deneyimi",
  "Özenli paketleme",
] as const;

export const PLACEHOLDER_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop";

export const INSTAGRAM_URL = "https://www.instagram.com/bayyildizayakkabi/";
export const INSTAGRAM_HANDLE = "@bayyildizayakkabi";

export const STORE_HOURS = {
  weekday: "Hafta içi ve Cumartesi: 09.00 - 21.00",
  sunday: "Pazar: 11.00 - 20.00",
} as const;

export const STORES = [
  {
    name: "Bayyıldız Heykel",
    address:
      "Orhanbey Mah. Atatürk Cad. Kurtul Sok. No:4-42 Osmangazi, Bursa",
    phone: "(0224) 220 82 98",
    phoneHref: "tel:+902242208298",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Bayy%C4%B1ld%C4%B1z+Ayakkab%C4%B1+Heykel+Bursa",
  },
  {
    name: "Bayyıldız FSM",
    address: "Fatih Sultan Mehmet Blv. Üstünkaya Sitesi A Blok No:84/C, Bursa",
    phone: "0552 222 82 98",
    phoneHref: "tel:+905522228298",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=%C3%9Cst%C3%BCnkaya+Sitesi+A+Blok+84%2FC+Bursa",
  },
] as const;

/** Deri / erkek ayakkabı vitrin atmosferi (Pexels). */
export const DEFAULT_HERO_VIDEO =
  "https://videos.pexels.com/video-files/4927864/4927864-hd_1920_1080_24fps.mp4";

export const DEFAULT_HERO_POSTER =
  "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1920&q=80";
