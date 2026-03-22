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
        className="scroll-mt-20 border-t border-black/[0.06] bg-[var(--color-ivory)] px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
              Kategoriler
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-anthracite-soft)] sm:text-lg">
              Her stile uygun hatlar; vitrinde gezinin, kategoriye dokunarak
              modelleri süzün.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/60 px-4 py-4 sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
              Güven
            </span>
            <span className="hidden h-4 w-px bg-black/10 sm:block" aria-hidden />
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[var(--color-espresso)]">
              <li className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]"
                  aria-hidden
                />
                Hakiki deri
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]"
                  aria-hidden
                />
                Bursa · iki mağaza
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]"
                  aria-hidden
                />
                WhatsApp danışmanlık
              </li>
            </ul>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={`group flex min-h-[7.5rem] flex-col justify-between rounded-2xl border p-5 text-left transition-[border-color,box-shadow,background] sm:min-h-[8rem] ${
                active === "all"
                  ? "border-[var(--color-espresso)] bg-[var(--color-espresso)] text-white shadow-[0_12px_40px_rgba(44,24,16,0.2)]"
                  : "border-black/[0.08] bg-white shadow-sm hover:border-[var(--color-taupe)]/50 hover:shadow-md"
              }`}
            >
              <span
                className={`font-display text-xl font-semibold sm:text-2xl ${active === "all" ? "text-white" : "text-[var(--color-espresso)]"}`}
              >
                Tümü
              </span>
              <span
                className={`text-xs font-medium leading-snug ${active === "all" ? "text-white/85" : "text-[var(--color-anthracite-soft)]"}`}
              >
                Tüm vitrin modelleri
              </span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c.id)}
                className={`group flex min-h-[7.5rem] flex-col justify-between rounded-2xl border p-5 text-left transition-[border-color,box-shadow,background] sm:min-h-[8rem] ${
                  active === c.id
                    ? "border-[var(--color-espresso)] bg-[var(--color-espresso)] text-white shadow-[0_12px_40px_rgba(44,24,16,0.2)]"
                    : "border-black/[0.08] bg-white shadow-sm hover:border-[var(--color-taupe)]/50 hover:shadow-md"
                }`}
              >
                <span
                  className={`font-display text-xl font-semibold sm:text-2xl ${active === c.id ? "text-white" : "text-[var(--color-espresso)]"}`}
                >
                  {c.title}
                </span>
                <span
                  className={`text-xs font-medium leading-snug ${active === c.id ? "text-white/85" : "text-[var(--color-anthracite-soft)]"}`}
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
        className="scroll-mt-20 border-t border-black/[0.06] bg-[var(--color-cream)] px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
                Seçilmiş modeller
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-anthracite-soft)] sm:text-base">
                Örnek vitrin; fiyat ve stok bilgisi tanıtım amaçlıdır. Sipariş
                ve stok için mağaza veya WhatsApp ile iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="mt-14 text-center text-sm text-[var(--color-anthracite-soft)]">
              Bu kategoride örnek ürün yok.
            </p>
          ) : (
            <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
