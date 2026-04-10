import { HeroSection } from "@/components/home/HeroSection";
import { HomeCategoryStrip } from "@/components/home/HomeCategoryStrip";
import { HomeCatalog } from "@/components/home/HomeCatalog";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { getCatalogProducts } from "@/lib/products-normalizer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "FootwearStore",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  areaServed: { "@type": "City", name: "Bursa" },
  priceRange: "$$",
};

export default function HomePage() {
  const products = getCatalogProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <HeroSection videoUrl="/hero-video.mp4" />
      <HomeCategoryStrip />
      <HomeCatalog products={products} />
      <section
        aria-label="Öne çıkan vaatler"
        className="border-b border-black/[0.06] bg-[var(--color-cream-dark)]/40 px-4 py-8 sm:px-6 sm:py-10"
      >
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {[
            {
              t: "Hakiki deri",
              d: "Seçili modellerde doğal dana derisi ve özenli işçilik.",
            },
            {
              t: "Mağazada deneyim",
              d: "Heykel ve FSM’de aynı gün deneme; uzman yönlendirme.",
            },
            {
              t: "Şeffaf iletişim",
              d: "WhatsApp ile model, beden ve stok için hızlı yanıt.",
            },
            {
              t: "Yerel güven",
              d: "Bursa’da yıllara dayanan mağaza geleneği.",
            },
          ].map((item) => (
            <div key={item.t} className="flex gap-4">
              <span
                className="mt-1 h-10 w-1 shrink-0 rounded-full bg-[var(--color-gold-soft)]/80"
                aria-hidden
              />
              <div>
                <h2 className="font-display text-lg font-semibold text-[var(--color-espresso)]">
                  {item.t}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
                  {item.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
