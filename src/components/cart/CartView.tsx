"use client";

import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/constants";
import { useCart } from "@/components/providers/cart-context";
import { formatTry } from "@/lib/woocommerce";

export function CartView() {
  const { items, removeItem, setQuantity, clear, totalQuantity, subtotal } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-black/[0.07] bg-gradient-to-b from-white to-[var(--color-cream-dark)]/30 px-6 py-14 text-center shadow-sm sm:px-10">
        <p className="font-display text-lg text-[var(--color-espresso)] sm:text-xl">
          Sepetiniz henüz boş
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--color-anthracite-soft)]">
          Beğendiğiniz modeli seçip numaranızı ekleyerek devam edin.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-espresso)] px-8 text-sm font-semibold text-white shadow-[0_10px_32px_-14px_rgba(0,0,0,0.45)] transition hover:bg-[var(--color-espresso-hover)]"
        >
          Alışverişe dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center sm:justify-start">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/12 bg-white px-5 text-sm font-semibold text-[var(--color-espresso)] shadow-sm transition hover:border-black/20 hover:bg-[var(--color-cream)]"
        >
          Alışverişe devam et
        </Link>
      </div>
      <ul className="flex flex-col gap-4">
        {items.map((line) => {
          const lineSum = (Number.parseFloat(line.price) || 0) * line.quantity;
          return (
            <li
              key={line.key}
              className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white/95 shadow-sm"
            >
              <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                <Link
                  href={`/urun/${line.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--color-cream-dark)] ring-1 ring-black/[0.06] sm:h-32 sm:w-28"
                >
                  <Image
                    src={line.image || PLACEHOLDER_PRODUCT_IMAGE}
                    alt={line.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/urun/${line.slug}`}
                    className="font-semibold leading-snug text-[var(--color-espresso)] hover:underline"
                  >
                    {line.name}
                  </Link>
                  <dl className="mt-2 grid gap-1 text-xs text-[var(--color-anthracite-soft)] sm:text-[0.8125rem]">
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                      <div>
                        <dt className="sr-only">Model</dt>
                        <dd>
                          <span className="text-[var(--color-taupe-muted)]">Model</span>{" "}
                          <span className="font-medium text-[var(--color-anthracite)]">
                            {line.model}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">Numara</dt>
                        <dd>
                          <span className="text-[var(--color-taupe-muted)]">Numara</span>{" "}
                          <span className="font-medium text-[var(--color-anthracite)]">
                            {line.size}
                          </span>
                        </dd>
                      </div>
                    </div>
                    <div>
                      <dt className="sr-only">SKU</dt>
                      <dd>
                        <span className="text-[var(--color-taupe-muted)]">SKU</span>{" "}
                        <span className="font-mono text-[0.7rem] font-medium tracking-wide text-[var(--color-anthracite)] sm:text-xs">
                          {line.variantSku}
                        </span>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-sm text-[var(--color-anthracite-soft)]">
                    Birim: {formatTry(line.price)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-xl border border-black/10 bg-[var(--color-cream)]/50 p-0.5">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-medium text-[var(--color-espresso)] transition-colors hover:bg-white"
                        disabled={line.quantity <= 1}
                        onClick={() =>
                          setQuantity(line.key, Math.max(1, line.quantity - 1))
                        }
                        aria-label="Adet azalt"
                      >
                        −
                      </button>
                      <span className="min-w-[2.25rem] text-center text-sm font-semibold tabular-nums text-[var(--color-espresso)]">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-medium text-[var(--color-espresso)] transition-colors hover:bg-white"
                        onClick={() =>
                          setQuantity(
                            line.key,
                            Math.min(99, line.quantity + 1),
                          )
                        }
                        aria-label="Adet artır"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-base font-semibold tabular-nums text-[var(--color-espresso)]">
                      {formatTry(String(lineSum))}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.key)}
                    className="mt-3 self-start text-xs font-medium text-red-800/85 underline-offset-4 hover:underline sm:text-sm"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="rounded-2xl border border-black/[0.1] bg-[var(--color-cream-dark)]/50 p-6 shadow-inner">
        <div className="flex items-center justify-between text-sm text-[var(--color-anthracite-soft)]">
          <span>Ara toplam</span>
          <span className="font-semibold tabular-nums text-[var(--color-espresso)]">
            {formatTry(String(subtotal))}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
          <div>
            <p className="text-lg font-semibold text-[var(--color-espresso)]">
              Toplam
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-anthracite-soft)]">
              {totalQuantity} ürün
            </p>
          </div>
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-espresso)]">
            {formatTry(String(subtotal))}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-center sm:justify-between">
        <Link
          href="/odeme"
          className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center rounded-full bg-[var(--color-espresso)] px-8 text-base font-semibold text-white shadow-[0_12px_36px_-14px_rgba(0,0,0,0.45)] transition hover:bg-[var(--color-espresso-hover)] sm:max-w-sm sm:flex-none"
        >
          Ödemeye geç
        </Link>
        <button
          type="button"
          onClick={() => clear()}
          className="text-center text-sm font-medium text-[var(--color-taupe-muted)] underline-offset-4 hover:underline sm:text-left"
        >
          Sepeti temizle
        </button>
      </div>

      <p className="rounded-xl border border-black/8 bg-white/60 px-4 py-3 text-center text-xs text-[var(--color-anthracite-soft)]">
        Sepet bu cihazda saklanır. Ödeme adımında teslimat bilgilerinizi
        paylaşın.
      </p>
    </div>
  );
}
