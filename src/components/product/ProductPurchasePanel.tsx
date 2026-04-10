"use client";

import { useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl, productWhatsAppMessage } from "@/lib/whatsapp";
import type { WCProduct, WCVariation } from "@/lib/types/woocommerce";
import { formatTry, stockLabel } from "@/lib/woocommerce";
import { useCart } from "@/components/providers/cart-context";

function variationLabel(v: WCVariation) {
  if (!v.attributes.length) return "Varyasyon";
  return v.attributes.map((a) => a.option).join(" / ");
}

export function ProductPurchasePanel({
  product,
  variations,
}: {
  product: WCProduct;
  variations: WCVariation[];
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const selectable = variations.length > 0;
  const defaultVar =
    variations.find((v) => v.stock_status === "instock") ?? variations[0];
  const [selectedId, setSelectedId] = useState<number | null>(
    defaultVar?.id ?? null,
  );

  const selected = useMemo(
    () => variations.find((v) => v.id === selectedId) ?? defaultVar,
    [variations, selectedId, defaultVar],
  );

  const displayPrice = selected?.price ?? product.price;
  const displayRegular = selected?.regular_price ?? product.regular_price;
  const onSale = selected?.on_sale ?? product.on_sale;

  const wa = buildWhatsAppUrl(
    productWhatsAppMessage(product.name, product.sku),
    WHATSAPP_NUMBER,
  );

  const thumb = product.images[0]?.src ?? "";

  const handleAddToCart = () => {
    if ((selected?.stock_status ?? product.stock_status) === "outofstock") return;
    const variationKey = selectable && selected ? String(selected.id) : `simple-${product.id}`;
    addItem({
      productId: String(product.id),
      variationId: variationKey,
      quantity: qty,
      name: product.name,
      slug: product.slug,
      model: product.sku || String(product.id),
      size: selectable && selected ? variationLabel(selected) : "Standart",
      variantSku: product.sku
        ? `${product.sku}-${selected?.id ?? "std"}`
        : String(selected?.id ?? product.id),
      image: thumb,
      price: displayPrice,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-anthracite-soft)]">
          Model:{" "}
          <span className="font-medium text-[var(--color-anthracite)]">
            {product.sku || "—"}
          </span>
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--color-taupe-muted)]">
          {stockLabel(
            selected?.stock_status ?? product.stock_status,
            selectable ? null : product.stock_quantity,
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-semibold text-[var(--color-espresso)]">
          {formatTry(displayPrice)}
        </span>
        {onSale && displayRegular && displayRegular !== displayPrice ? (
          <span className="text-lg text-[var(--color-anthracite-soft)] line-through">
            {formatTry(displayRegular)}
          </span>
        ) : null}
      </div>

      {selectable ? (
        <div>
          <label
            htmlFor="variation"
            className="text-sm font-semibold text-[var(--color-espresso)]"
          >
            Beden / varyasyon
          </label>
          <select
            id="variation"
            value={selected?.id ?? ""}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="mt-2 w-full min-h-12 rounded-xl border border-black/15 bg-white px-4 text-sm font-medium text-[var(--color-anthracite)]"
          >
            {variations.map((v) => (
              <option key={v.id} value={v.id} disabled={v.stock_status === "outofstock"}>
                {variationLabel(v)} — {formatTry(v.price)}{" "}
                {v.stock_status === "outofstock" ? "(Tükendi)" : ""}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex items-center gap-4">
        <label htmlFor="qty" className="text-sm font-semibold text-[var(--color-espresso)]">
          Adet
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-24 min-h-11 rounded-xl border border-black/15 bg-white px-3 text-center text-sm"
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={
            (selected?.stock_status ?? product.stock_status) === "outofstock"
          }
          className="flex min-h-14 w-full items-center justify-center rounded-xl bg-[var(--color-espresso)] text-base font-semibold text-white transition-colors hover:bg-[var(--color-espresso-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sepete Ekle
        </button>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 text-base font-semibold text-[#075E54]"
        >
          WhatsApp ile hemen yaz
        </a>
      </div>
    </div>
  );
}
