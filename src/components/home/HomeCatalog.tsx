"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import {
  CATEGORIES,
  DUMMY_PRODUCTS,
  type CategoryId,
} from "@/lib/dummy";

export function HomeCatalog() {
  const [active, setActive] = useState<CategoryId | "all">("all");

  const filtered = useMemo(() => {
    if (active === "all") return DUMMY_PRODUCTS;
    return DUMMY_PRODUCTS.filter((p) => p.category === active);
  }, [active]);

  return (
    <>
      <section
        id="kategoriler"
        className="scroll-mt-20 border-t border-black/8 bg-[var(--color-cream)] px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-3xl">
            Kategoriler
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-anthracite-soft)] sm:text-base">
            Dokunmatik alanlar geniş; istediğiniz hattı seçip aşağıdaki ürün
            listesini süzün.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={`min-h-12 rounded-2xl border px-5 text-sm font-semibold transition-colors ${
                active === "all"
                  ? "border-[var(--color-espresso)] bg-[var(--color-espresso)] text-white"
                  : "border-black/10 bg-white/90 text-[var(--color-espresso)] hover:border-black/20"
              }`}
            >
              Tümü
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c.id)}
                className={`min-h-12 min-w-[140px] rounded-2xl border px-5 text-left text-sm font-semibold transition-colors ${
                  active === c.id
                    ? "border-[var(--color-espresso)] bg-[var(--color-espresso)] text-white"
                    : "border-black/10 bg-white/90 text-[var(--color-espresso)] hover:border-black/20"
                }`}
              >
                <span className="block">{c.title}</span>
                <span
                  className={`mt-0.5 block text-xs font-normal ${
                    active === c.id
                      ? "text-white/85"
                      : "text-[var(--color-anthracite-soft)]"
                  }`}
                >
                  {c.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="urunler"
        className="scroll-mt-20 border-t border-black/8 bg-[var(--color-cream-dark)]/35 px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-3xl">
            Ürünler
          </h2>
          <p className="mt-2 text-sm text-[var(--color-anthracite-soft)] sm:text-base">
            Örnek vitrin - fiyat ve stok bilgisi gösterim amaçlıdır.
          </p>
          {filtered.length === 0 ? (
            <p className="mt-10 text-center text-sm text-[var(--color-anthracite-soft)]">
              Bu kategoride örnek ürün yok.
            </p>
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
