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
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          poster={poster}
          aria-label="Mağaza ve ayakkabı atmosferi"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-espresso)]/90 via-[var(--color-espresso)]/55 to-[var(--color-espresso)]/35"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-32 sm:px-6 sm:pb-24 md:pb-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-taupe)]">
            Bayyıldız Ayakkabı
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Yeni Sezon Erkek Ayakkabıları
          </h1>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">
            Hakiki Deri • Kaliteli İşçilik • Uygun Fiyat
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/#urunler"
              className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-[var(--color-espresso)] shadow-md transition-colors hover:bg-[var(--color-cream)]"
            >
              Modelleri İncele
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {"WhatsApp'tan Yaz"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
