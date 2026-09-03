import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { CatalogProduct } from "@/lib/products-normalizer";

type Props = {
  products: CatalogProduct[];
  /** Tam katalog girişi (ör. en dolu kategori sayfası). */
  catalogHref: string;
};

export function HomeCatalog({ products, catalogHref }: Props) {
  return (
    <section
      id="urunler"
      className="scroll-mt-20 border-t border-black/[0.06] bg-[var(--color-cream)] px-4 pb-8 pt-3 sm:px-6 sm:pb-10 sm:pt-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
              Öne çıkan modeller
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-anthracite-soft)] sm:text-base">
              Vitrinden seçilmiş modeller. Tüm koleksiyon için kategorilere
              göz atın veya ürün detayından numara seçerek sepete ekleyin.
            </p>
          </div>
          <p className="text-sm font-medium text-[var(--color-taupe-muted)]">
            Vitrin seçkisi
          </p>
        </div>
        {products.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[var(--color-anthracite-soft)]">
            Şu an listelenecek ürün yok.
          </p>
        ) : (
          <>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 lg:grid-cols-4">
              {products.map((p, index) => (
                <li key={p.id}>
                  <ProductCard product={p} imagePriority={index < 4} />
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center">
              <Link
                href={catalogHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white px-8 text-sm font-semibold text-[var(--color-espresso)] shadow-sm transition hover:border-black/20 hover:bg-[var(--color-cream)]"
              >
                Günlük modelleri gör
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
