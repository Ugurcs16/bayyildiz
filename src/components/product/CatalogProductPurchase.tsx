"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  getPurchaseVariations,
  isVariationSelectable,
  stockQtyLabel,
  stockQtyTone,
} from "@/lib/catalog-purchase";
import { cartLineKey, useCart } from "@/components/providers/cart-context";
import { SalesToast } from "@/components/ui/SalesToast";
import type { CatalogProduct, CatalogVariation } from "@/lib/products-normalizer";
import { buildWhatsAppUrl, productWhatsAppMessage } from "@/lib/whatsapp";

function priceString(n: number) {
  return String(n);
}

function stockBadgeClass(tone: ReturnType<typeof stockQtyTone>) {
  if (tone === "out") {
    return "border border-rose-200/90 bg-rose-50/95 text-rose-900";
  }
  if (tone === "low") {
    return "border border-amber-200/90 bg-amber-50/95 text-amber-950";
  }
  return "border border-emerald-200/80 bg-emerald-50/90 text-emerald-950";
}

export function CatalogProductPurchase({
  product,
}: {
  product: CatalogProduct;
}) {
  const { addItem, items } = useCart();
  const variations = useMemo(() => getPurchaseVariations(product), [product]);

  const firstSelectable = useMemo(
    () => variations.find((v) => isVariationSelectable(v)),
    [variations],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId !== null) return;
    if (firstSelectable) setSelectedId(firstSelectable.id);
    else if (variations[0]) setSelectedId(variations[0].id);
  }, [firstSelectable, selectedId, variations]);

  const selected = useMemo(
    () => variations.find((v) => v.id === selectedId) ?? variations[0],
    [variations, selectedId],
  );

  const selectedOk = selected ? isVariationSelectable(selected) : false;
  const maxQty = selectedOk && selected ? Math.min(99, Math.max(1, selected.stockQty)) : 1;
  const displayPrice = selected?.price ?? product.price;

  useEffect(() => {
    if (qty > maxQty) setQty(maxQty);
  }, [maxQty, qty]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 12000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const wa = buildWhatsAppUrl(
    productWhatsAppMessage(product.name, product.code),
    WHATSAPP_NUMBER,
  );

  const thumb =
    selected?.image ||
    product.images[0] ||
    product.image ||
    product.hoverImage ||
    "";

  const handleSizeClick = (v: CatalogVariation) => {
    if (!isVariationSelectable(v)) return;
    setSelectedId(v.id);
  };

  const handleAddToCart = () => {
    if (!selected || !selectedOk) return;
    const lineKey = cartLineKey(product.id, selected.id);
    const wasInCart = items.some((x) => x.key === lineKey);
    addItem({
      productId: product.id,
      variationId: selected.id,
      name: product.name,
      slug: product.slug,
      model: product.code,
      size: selected.size,
      variantSku: selected.sku || product.code,
      image: thumb || product.image,
      price: priceString(displayPrice),
      quantity: qty,
      key: lineKey,
    });
    setToast(
      wasInCart
        ? "Ürün adedi sepette güncellendi"
        : "Ürün sepete eklendi",
    );
  };

  const primaryLabel = selectedOk ? "Sepete ekle" : "Bu numara tükendi";

  const selectedStockLabel = selected
    ? stockQtyLabel(selected, selectedOk)
    : "—";
  const selectedTone = selected
    ? stockQtyTone(selected, selectedOk)
    : "out";

  return (
    <>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:mt-2 sm:text-4xl">
        {product.name}
      </h1>

      <p className="mt-4 font-display text-3xl font-semibold text-[var(--color-espresso)]">
        {new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
          maximumFractionDigits: 0,
        }).format(displayPrice)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {product.stock === "var" ? (
          <span className="inline-flex rounded-full bg-emerald-100/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-emerald-900">
            Stokta
          </span>
        ) : null}
        {product.stock === "az" ? (
          <span className="inline-flex rounded-full bg-amber-100/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-amber-950">
            Son ürünler
          </span>
        ) : null}
        {product.stock === "yok" ? (
          <span className="inline-flex rounded-full bg-rose-100/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-rose-900">
            Tükendi
          </span>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl border border-black/10 bg-white/85 p-3.5 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--color-espresso)]">
            Numaranızı seçin
          </p>
          {selected ? (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[0.7rem] font-semibold tracking-wide ${stockBadgeClass(selectedTone)}`}
            >
              {selectedStockLabel}
            </span>
          ) : null}
        </div>
        <div
          className="mt-3 flex flex-wrap gap-1.5 sm:gap-2"
          role="radiogroup"
          aria-label="Numara"
        >
          {variations.map((v) => {
            const ok = isVariationSelectable(v);
            const isActive = selectedId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                disabled={!ok}
                onClick={() => handleSizeClick(v)}
                className={`inline-flex min-h-10 min-w-[2.5rem] items-center justify-center rounded-full border px-2 text-xs font-semibold transition-all sm:min-h-11 sm:min-w-[2.75rem] sm:px-3 ${
                  !ok
                    ? "cursor-not-allowed border-black/[0.06] bg-black/[0.03] text-[var(--color-anthracite-soft)] opacity-[0.48] line-through"
                    : isActive
                      ? "scale-[1.03] border-[var(--color-espresso)] bg-[var(--color-espresso)] text-white shadow-md ring-2 ring-[var(--color-espresso)]/25 ring-offset-2 ring-offset-[var(--color-cream)]"
                      : "border-black/12 bg-white text-[var(--color-espresso)] hover:border-black/25 hover:bg-[var(--color-cream)]/80"
                }`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
        <div className="mt-4 rounded-xl border border-black/[0.07] bg-[var(--color-cream)]/65 px-3 py-2.5 text-xs text-[var(--color-anthracite-soft)]">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[var(--color-taupe-muted)]">SKU</span>
            <span className="font-semibold tracking-wide text-[var(--color-anthracite)]">
              {selected?.sku ?? product.code}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label htmlFor="pqty" className="text-sm font-semibold text-[var(--color-espresso)]">
          Adet
        </label>
        <div className="flex items-center gap-1 rounded-xl border border-black/12 bg-white p-1 shadow-sm">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-medium text-[var(--color-espresso)] transition-colors hover:bg-black/[0.04] disabled:opacity-40"
            disabled={qty <= 1 || !selectedOk}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Adet azalt"
          >
            −
          </button>
          <input
            id="pqty"
            type="number"
            min={1}
            max={maxQty}
            value={qty}
            disabled={!selectedOk}
            onChange={(e) =>
              setQty(
                Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)),
              )
            }
            className="w-12 border-0 bg-transparent text-center text-sm font-semibold text-[var(--color-espresso)] focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-medium text-[var(--color-espresso)] transition-colors hover:bg-black/[0.04] disabled:opacity-40"
            disabled={!selectedOk}
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            aria-label="Adet artır"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedOk}
          className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-[var(--color-espresso)] px-8 text-base font-semibold text-white shadow-[0_10px_36px_-12px_rgba(0,0,0,0.45)] transition-all hover:bg-[var(--color-espresso-hover)] hover:shadow-[0_14px_40px_-10px_rgba(0,0,0,0.5)] disabled:cursor-not-allowed disabled:opacity-[0.42] disabled:shadow-none"
        >
          {primaryLabel}
        </button>
        <Link
          href="/sepet"
          className="text-center text-sm font-medium text-[var(--color-espresso)] underline decoration-black/15 underline-offset-4 transition hover:decoration-[var(--color-espresso)]"
        >
          Sepeti görüntüle
        </Link>
        <p className="text-center text-[0.7rem] leading-relaxed text-[var(--color-taupe-muted)] sm:text-xs">
          Aynı gün kargo · Güvenli ödeme · Kolay değişim
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-[var(--color-espresso)] shadow-sm transition-colors hover:bg-[var(--color-cream)]"
        >
          WhatsApp ile yazın
        </a>
      </div>

      <SalesToast message={toast} showCartActions={Boolean(toast)} />
    </>
  );
}
