import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import {
  getCatalogProducts,
  type CatalogProduct,
} from "@/lib/products-normalizer";

export async function ProductDetailSections({
  product,
}: {
  product: CatalogProduct;
}) {
  const similar = getCatalogProducts()
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto mt-16 max-w-6xl space-y-16 px-4 sm:px-6">
      <section className="grid gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-espresso)]">
            Özellikler
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-[var(--color-anthracite-soft)]">
            <li>Model kodu: {product.code}</li>
            <li>Kategori: {product.category}</li>
            <li>Anatomik destekli iç taban</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-espresso)]">
            Kullanım
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-[var(--color-anthracite-soft)]">
            <li>Günlük ve ofis kullanımına uygundur</li>
            <li>Deri bakım kremi ile düzenli bakım önerilir</li>
            <li>Doğrudan ısı kaynaklarında kurutmayınız</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-espresso)]">
            Materyal
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-[var(--color-anthracite-soft)]">
            <li>Hakiki deri üst yüzey ve nefes alan astar seçenekleri</li>
            <li>Konforlu iç taban, günlük kullanıma uygun esnek yapı</li>
            <li>Taban ve topuk bileşenleri modele göre değişebilir</li>
          </ul>
        </div>
      </section>

      {product.seoDescription || product.teaser ? (
        <section className="rounded-2xl border border-black/8 bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--color-espresso)]">
            Ürün notu
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
            {product.seoDescription ?? product.teaser}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
            Değişim ve iade süreçlerinde mağaza ekibimiz destek olur. Detaylar için{" "}
            <Link href="/sartlar-ve-kosullar" className="font-medium text-[var(--color-espresso)] underline">
              şartlar ve koşullar
            </Link>{" "}
            sayfasına bakabilirsiniz.
          </p>
        </section>
      ) : null}

      {similar.length > 0 ? (
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-espresso)]">
            Benzer ürünler
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
