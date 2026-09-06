import { CATEGORIES } from "@/lib/dummy";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import type { CatalogProduct } from "@/lib/products-normalizer";
import { publicProductCode } from "@/lib/public-product-identity";

export function buildProductSeoTitle(product: CatalogProduct): string {
  const cat =
    CATEGORIES.find((c) => c.id === product.category)?.title ?? "Erkek";
  const code = publicProductCode(product);
  return `Hakiki Deri Erkek ${cat} Ayakkabı – ${code}`;
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
      heading: "Günlük Ayakkabılar",
      text: "Her güne konforlu ve şık modeller.",
      metaDescription:
        "Hakiki deri erkek günlük ayakkabı modelleri. Bursa mağazasından güvenilir alışveriş, uygun fiyat.",
    },
    klasik: {
      heading: "Klasik Ayakkabılar",
      text: "Zamansız şıklık, özenli işçilik.",
      metaDescription:
        "Klasik erkek ayakkabı modelleri: Oxford, loafer ve daha fazlası. Hakiki deri, Bursa üretimi.",
    },
    outdoor: {
      heading: "Outdoor Ayakkabılar",
      text: "Güçlü adımlar için konforlu modeller.",
      metaDescription:
        "Outdoor ve rahat erkek ayakkabı modelleri. Hakiki deri, kaymaz taban seçenekleri.",
    },
    bot: {
      heading: "Erkek Bot Modelleri",
      text: "Soğuk günler için sağlam ve şık seçenekler.",
      metaDescription:
        "Erkek bot modelleri: hakiki deri, Bursa güvencesi. Kışa hazır seçenekler.",
    },
    "yeni-sezon": {
      heading: "Yeni Sezon",
      text: "Sezonun öne çıkan yeni modelleri.",
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
