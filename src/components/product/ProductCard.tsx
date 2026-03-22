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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_24px_rgba(44,24,16,0.06)] ring-1 ring-black/[0.03] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(44,24,16,0.1)]">
      <div
        className="relative aspect-[4/5] bg-[var(--color-cream-dark)]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src={src}
          alt={product.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
        />
        {product.oldPrice ? (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-espresso)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
            İndirim
          </span>
        ) : null}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-[var(--color-espresso)]">
          {product.name}
        </h3>
        <p className="mt-1.5 text-xs text-[var(--color-anthracite-soft)]">
          Model{" "}
          <span className="font-semibold text-[var(--color-anthracite)]">
            {product.code}
          </span>
        </p>
        <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
          {stockLabel(product.stock)}
        </p>

        <div className="mt-4 flex flex-wrap items-baseline gap-2 border-t border-black/[0.06] pt-4">
          <span className="font-display text-xl font-semibold text-[var(--color-espresso)]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice ? (
            <span className="text-sm text-[var(--color-anthracite-soft)] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </div>

        <details className="mt-4 rounded-xl border border-black/[0.06] bg-[var(--color-cream)]/50 px-3 py-2.5">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--color-espresso)]">
            Hızlı incele
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
            {product.teaser}
          </p>
        </details>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setFav((v) => !v)}
            className={`min-h-11 rounded-full text-sm font-semibold transition-colors ${
              fav
                ? "bg-[var(--color-taupe)]/30 text-[var(--color-espresso)]"
                : "border border-black/[0.08] bg-white text-[var(--color-espresso)] hover:border-black/15"
            }`}
          >
            {fav ? "Favoride" : "Favorilere ekle"}
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center rounded-full border border-emerald-800/20 bg-emerald-50/90 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-100/90"
          >
            {"WhatsApp"}
          </a>
        </div>

        <button
          type="button"
          disabled={out}
          className="mt-2.5 min-h-11 w-full rounded-full bg-[var(--color-espresso)] text-sm font-semibold text-[var(--color-ivory)] transition-colors hover:bg-[var(--color-espresso-hover)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {out ? "Stokta yok" : "Sepete ekle (yakında)"}
        </button>
      </div>
    </article>
  );
}
