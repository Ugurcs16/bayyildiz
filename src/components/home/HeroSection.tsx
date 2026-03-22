"use client";

import Link from "next/link";
import { DEFAULT_HERO_POSTER, WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl, DEFAULT_PRODUCT_MESSAGE } from "@/lib/whatsapp";

type Props = {
  videoUrl: string;
  posterUrl?: string;
};

export function HeroSection({ videoUrl, posterUrl }: Props) {
  const poster = posterUrl ?? DEFAULT_HERO_POSTER;
  const wa = buildWhatsAppUrl(DEFAULT_PRODUCT_MESSAGE, WHATSAPP_NUMBER);

  return (
    <section className="relative flex min-h-[100svh] items-end sm:items-center">
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
          autoPlay
          muted
          playsInline
          loop
          poster={poster}
          aria-label="Deri ayakkabı ve mağaza atmosferi"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Mobilde okunabilirlik: altta daha koyu şerit */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/92 via-[var(--color-espresso)]/70 to-[var(--color-espresso)]/25 sm:from-[var(--color-espresso)]/88 sm:via-[var(--color-espresso)]/50 sm:to-[var(--color-espresso)]/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,169,98,0.12),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-28 sm:px-6 sm:pb-24 sm:pt-32 md:pb-20 md:pt-28">
        <div className="max-w-2xl">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-soft)] sm:text-sm">
            Bayyıldız Ayakkabı
          </p>
          <h1 className="font-display mt-4 text-[2.125rem] font-semibold leading-[1.08] tracking-tight text-white text-balance drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            Her adımda hakiki deri, Bursa işçiliği
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/95 text-balance [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] sm:text-lg sm:leading-relaxed">
            Klasikten günlüğe, vitrinde seçtiğiniz çift; mağazada deneyimlediğiniz
            kaliteyle kapınıza kadar gelir.
          </p>
          <p className="mt-3 text-sm font-medium text-white/80 sm:text-base">
            Hakiki deri · El işçiliği · İki mağaza Bursa
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/#urunler"
              className="group inline-flex min-h-[3.25rem] min-w-[200px] items-center justify-center rounded-full bg-[var(--color-ivory)] px-8 text-sm font-semibold tracking-wide text-[var(--color-espresso)] shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-black/5 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
            >
              Koleksiyonu keşfet
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[3.25rem] min-w-[200px] items-center justify-center rounded-full border border-white/35 bg-white/[0.08] px-8 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-[background-color,border-color] hover:border-white/55 hover:bg-white/[0.14]"
            >
              {"WhatsApp ile danış"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
