import { CATEGORIES } from "@/lib/dummy";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import type { CatalogProduct } from "@/lib/products-normalizer";

export function buildProductSeoTitle(product: CatalogProduct): string {
  const cat =
    CATEGORIES.find((c) => c.id === product.category)?.title ?? "Erkek";
  return `Hakiki Deri Erkek ${cat} Ayakkabı – ${product.name}`;
}

export function buildProductMetaDescription(product: CatalogProduct): string {
  const custom = product.seoDescription?.trim();
  if (custom && custom.length > 50) {
    return custom.length > 158 ? `${custom.slice(0, 155).trim()}…` : custom;
  }
  const cat =
    CATEGORIES.find((c) => c.id === product.category)?.title.toLowerCase() ??
    "erkek";
  const fallback = `Bursa üretimi hakiki deri erkek ${cat} ayakkabı. Günlük ve klasik kullanım için ideal. Hızlı kargo ve güvenli alışveriş.`;
  return fallback.length > 160 ? `${fallback.slice(0, 157)}…` : fallback;
}

export function buildProductJsonLd(
  product: CatalogProduct,
  priceNumber: number,
): Record<string, unknown> {
  const availability =
    product.stock === "yok"
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";
  const productUrl = new URL(`/urun/${product.slug}`, SITE_URL).href;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: buildProductSeoTitle(product),
    description: buildProductMetaDescription(product),
    brand: { "@type": "Brand", name: "Bayyıldız" },
    ...(product.image ? { image: [product.image] } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "TRY",
      price: priceNumber,
      availability,
    },
  };
}

/** Kategori vitrin sayfası: SEO başlık + kısa metin (Google dostu, sade). */
export function getCategorySeoIntro(slug: string): {
  heading: string;
  text: string;
  metaDescription: string;
} {
  const map: Record<
    string,
    { heading: string; text: string; metaDescription: string }
  > = {
    gunluk: {
      heading: "Erkek Günlük Ayakkabı Modelleri",
      text: "Şık, rahat ve hakiki deri erkek günlük ayakkabı modelleri. Bursa üretimi, uzun ömürlü kullanım.",
      metaDescription:
        "Hakiki deri erkek günlük ayakkabı modelleri. Bursa mağazasından güvenilir alışveriş, uygun fiyat.",
    },
    klasik: {
      heading: "Erkek Klasik Ayakkabı Modelleri",
      text: "Ofis ve özel günler için klasik deri ayakkabılar. Özenli işçilik, zamansız çizgiler.",
      metaDescription:
        "Klasik erkek ayakkabı modelleri: Oxford, loafer ve daha fazlası. Hakiki deri, Bursa üretimi.",
    },
    outdoor: {
      heading: "Erkek Outdoor Ayakkabı Modelleri",
      text: "Dayanıklı taban ve konforlu yapı; açık hava ve günlük kullanım için deri outdoor modeller.",
      metaDescription:
        "Outdoor ve rahat erkek ayakkabı modelleri. Hakiki deri, kaymaz taban seçenekleri.",
    },
    bot: {
      heading: "Erkek Bot Modelleri",
      text: "Soğuk hava ve kış koşulları için bot seçenekleri. Kaliteli deri ve sağlam dikiş.",
      metaDescription:
        "Erkek bot modelleri: hakiki deri, Bursa güvencesi. Kışa hazır seçenekler.",
    },
    "yeni-sezon": {
      heading: "Yeni Sezon Erkek Ayakkabı",
      text: "Yeni gelen hakiki deri modeller; vitrinde güncel seçenekler.",
      metaDescription:
        "Yeni sezon erkek ayakkabı modelleri. Hakiki deri, Bursa’dan hızlı kargo imkânı.",
    },
  };
  const cat = map[slug];
  if (cat) return cat;
  return {
    heading: "Erkek Ayakkabı",
    text: SITE_DESCRIPTION,
    metaDescription: SITE_DESCRIPTION,
  };
}
