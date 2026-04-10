"use client";

import { ProductCard } from "@/components/product/ProductCard";
import type { CatalogProduct } from "@/lib/products-normalizer";

export function HomeCatalog({ products }: { products: CatalogProduct[] }) {
  return (
    <section
      id="urunler"
      className="scroll-mt-20 border-t border-black/[0.06] bg-[var(--color-cream)] px-4 pb-8 pt-3 sm:px-6 sm:pb-10 sm:pt-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
              Seçilmiş modeller
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-anthracite-soft)] sm:text-base">
              Örnek vitrin; fiyat ve stok bilgisi tanıtım amaçlıdır. Sipariş
              ve stok için mağaza veya WhatsApp ile iletişime geçebilirsiniz.
            </p>
          </div>
          <p className="text-sm font-semibold text-[var(--color-espresso)]/80">
            {products.length} model gösteriliyor
          </p>
        </div>
        {products.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[var(--color-anthracite-soft)]">
            Şu an listelenecek ürün yok.
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
