import { ProductCard } from "@/components/product/ProductCard";
import { getCatalogProducts } from "@/lib/products-normalizer";

export async function FeaturedProducts() {
  const products = getCatalogProducts().slice(0, 8);

  return (
    <section
      id="one-cikanlar"
      className="scroll-mt-24 border-t border-black/8 bg-[var(--color-cream)] py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-3xl">
              Öne çıkan ürünler
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--color-anthracite-soft)] sm:text-base">
              Yeni sezon ve klasik modellerden seçilmiş vitrin ürünleri.
            </p>
          </div>
        </div>
        {products.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[var(--color-anthracite-soft)]">
            Şu an listelenecek ürün bulunamadı. Lütfen daha sonra tekrar deneyin.
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
