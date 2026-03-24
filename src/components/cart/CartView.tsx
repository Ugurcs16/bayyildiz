"use client";

import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/constants";
import { buildAddToCartUrl } from "@/lib/cart-url";
import { useCart } from "@/components/providers/cart-context";
import { formatTry } from "@/lib/woocommerce";

export function CartView() {
  const { items, removeItem, setQuantity, clear, totalQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-black/8 bg-white/90 p-10 text-center shadow-sm">
        <p className="text-[var(--color-anthracite-soft)]">
          Sepetiniz boş. Koleksiyonlarımızdan model ekleyebilirsiniz.
        </p>
        <Link
          href="/#one-cikanlar"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-espresso)] px-6 text-sm font-semibold text-white"
        >
          Alışverişe başla
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="flex flex-col gap-4">
        {items.map((line) => {
          const wcUrl = buildAddToCartUrl(
            line.variationId ?? line.productId,
            line.quantity,
          );
          return (
            <li
              key={line.key}
              className="flex gap-4 rounded-2xl border border-black/8 bg-white/95 p-4 shadow-sm"
            >
              <Link
                href={`/urun/${line.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--color-cream-dark)]"
              >
                <Image
                  src={line.image || PLACEHOLDER_PRODUCT_IMAGE}
                  alt={line.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/urun/${line.slug}`}
                  className="font-semibold text-[var(--color-espresso)] hover:underline"
                >
                  {line.name}
                </Link>
                <p className="mt-1 text-sm text-[var(--color-anthracite-soft)]">
                  {formatTry(line.price)} × {line.quantity}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`qty-${line.key}`}>
                    Adet
                  </label>
                  <input
                    id={`qty-${line.key}`}
                    type="number"
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(e) =>
                      setQuantity(line.key, Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-16 rounded-lg border border-black/15 px-2 py-1 text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(line.key)}
                    className="text-sm font-medium text-red-700/90 underline"
                  >
                    Kaldır
                  </button>
                </div>
                {wcUrl ? (
                  <a
                    href={wcUrl}
                    className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--color-espresso)] px-4 text-xs font-semibold text-white sm:text-sm"
                  >
                    WooCommerce&apos;de bu kalemi sepete aktar
                  </a>
                ) : (
                  <p className="mt-2 text-xs text-[var(--color-anthracite-soft)]">
                    Mağaza URL&apos;si tanımlı değil; WhatsApp ile sipariş
                    verebilirsiniz.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-anthracite-soft)]">
          Toplam adet:{" "}
          <span className="font-semibold text-[var(--color-espresso)]">
            {totalQuantity}
          </span>
        </p>
        <button
          type="button"
          onClick={() => clear()}
          className="text-sm font-medium text-[var(--color-taupe-muted)] underline"
        >
          Sepeti temizle
        </button>
      </div>
      <p className="rounded-xl border border-black/8 bg-[var(--color-cream-dark)]/50 p-4 text-sm text-[var(--color-anthracite-soft)]">
        Ödeme WooCommerce üzerinden tamamlanır. Her satırdaki düğme ilgili ürünü
        klasik <code className="rounded bg-black/5 px-1">add-to-cart</code>{" "}
        akışıyla mağaza sepetinize ekler.
      </p>
    </div>
  );
}
