import type { WCProduct } from "./types/woocommerce";

function siteUrl() {
  const u = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return u || "https://bayyildiz.com";
}

export function organizationJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ShoeStore",
    name: "Bayyıldız Ayakkabı",
    url,
    description:
      "Hakiki deri erkek ayakkabıları. Bursa merkez ve FSM şubeleri ile hizmet.",
    sameAs: ["https://www.instagram.com/bayyildizayakkabi/"],
  };
}

export function productJsonLd(product: WCProduct) {
  const base = siteUrl();
  const inStock = product.stock_status === "instock";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku || undefined,
    image: product.images.map((i) => i.src),
    description: product.short_description.replace(/<[^>]*>/g, "").slice(0, 500),
    brand: {
      "@type": "Brand",
      name: "Bayyıldız Ayakkabı",
    },
    offers: {
      "@type": "Offer",
      url: `${base}/urun/${product.slug}`,
      priceCurrency: "TRY",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}
