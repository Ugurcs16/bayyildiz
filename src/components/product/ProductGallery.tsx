"use client";

import Image from "next/image";
import { useState } from "react";
import type { WCImage } from "@/lib/types/woocommerce";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/constants";

export function ProductGallery({
  images,
  productName,
}: {
  images: WCImage[];
  productName: string;
}) {
  const list = images.length ? images : [{ id: 0, src: PLACEHOLDER_PRODUCT_IMAGE, name: "placeholder", alt: productName }];
  const [active, setActive] = useState(0);
  const current = list[active] ?? list[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/8 bg-[var(--color-cream-dark)]">
        <Image
          src={current.src}
          alt={current.alt || productName}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
      </div>
      {list.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active
                  ? "border-[var(--color-espresso)]"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
