"use client";

import Image from "next/image";
import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  type DummyProduct,
  formatPrice,
  stockLabel,
} from "@/lib/dummy";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function waMessage(p: DummyProduct) {
  return `Merhaba, "${p.name}" (${p.code}) hakkında bilgi almak istiyorum.`;
}

export function ProductCard({ product }: { product: DummyProduct }) {
  const [hover, setHover] = useState(false);
  const [fav, setFav] = useState(false);
  const src =
    hover && product.hoverImage ? product.hoverImage : product.image;
  const wa = buildWhatsAppUrl(waMessage(product), WHATSAPP_NUMBER);
  const out = product.stock === "yok";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 bg-white/95 shadow-sm">
      <div
        className="relative aspect-[4/5] bg-[var(--color-cream-dark)]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src={src}
          alt={product.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
        />
        {product.oldPrice ? (
          <span className="absolute left-3 top-3 rounded-lg bg-[var(--color-espresso)] px-2 py-1 text-xs font-semibold text-white">
            İndirim
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-[var(--color-espresso)]">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-[var(--color-anthracite-soft)]">
          Model:{" "}
          <span className="font-medium text-[var(--color-anthracite)]">
            {product.code}
          </span>
        </p>
        <p className="mt-2 text-xs font-medium text-[var(--color-taupe-muted)]">
          {stockLabel(product.stock)}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-[var(--color-espresso)]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice ? (
            <span className="text-sm text-[var(--color-anthracite-soft)] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </div>

        <details className="mt-4 rounded-xl border border-black/10 bg-[var(--color-cream)]/60 px-3 py-2">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--color-espresso)]">
            Hızlı İncele
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
            {product.teaser}
          </p>
        </details>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setFav((v) => !v)}
            className={`min-h-11 rounded-xl text-sm font-semibold ${
              fav
                ? "bg-[var(--color-taupe)]/35 text-[var(--color-espresso)]"
                : "border border-black/10 bg-white text-[var(--color-espresso)]"
            }`}
          >
            {fav ? "Favoride" : "Favorilere Ekle"}
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center rounded-xl bg-[#128C7E]/10 text-sm font-semibold text-[#128C7E]"
          >
            {"WhatsApp'tan Sor"}
          </a>
        </div>

        <button
          type="button"
          disabled={out}
          className="mt-2 min-h-11 w-full rounded-xl bg-[var(--color-espresso)] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {out ? "Stokta yok" : "Sepete ekle (yakında)"}
        </button>
      </div>
    </article>
  );
}
