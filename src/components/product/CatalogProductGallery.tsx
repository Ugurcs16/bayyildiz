"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/constants";

function dedupeImages(urls: string[]) {
  const seen = new Set<string>();
  return urls.filter((u) => {
    const t = u.trim();
    if (!t || seen.has(t)) return false;
    seen.add(t);
    return true;
  });
}

export function CatalogProductGallery({
  images,
  productName,
  imageAlt,
}: {
  images: string[];
  productName: string;
  imageAlt: string;
}) {
  const list = useMemo(() => {
    const d = dedupeImages(images);
    return d.length > 0 ? d : [PLACEHOLDER_PRODUCT_IMAGE];
  }, [images]);

  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, list.length - 1);
  const current = list[safeIndex] ?? list[0];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/8 bg-[var(--color-cream-dark)] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)]">
        <Image
          src={current}
          alt={imageAlt || productName}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
      </div>
      {list.length > 1 ? (
        <div
          className="-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain scroll-smooth px-1 pb-2 pt-0.5 [scrollbar-width:thin] sm:mx-0 sm:gap-3 sm:px-0"
          role="tablist"
          aria-label="Ürün görselleri"
        >
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              onClick={() => setActive(i)}
              className={`relative h-[4.25rem] w-[3.35rem] shrink-0 snap-start overflow-hidden rounded-xl transition-all sm:h-24 sm:w-[4.5rem] ${
                i === safeIndex
                  ? "border-[2.5px] border-[var(--color-espresso)] shadow-md ring-2 ring-[var(--color-espresso)]/35 ring-offset-2 ring-offset-[var(--color-cream)]"
                  : "border-2 border-black/10 opacity-90 hover:border-black/30 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
