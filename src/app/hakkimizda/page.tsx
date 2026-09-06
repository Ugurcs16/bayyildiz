import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${SITE_NAME} — 1989'dan bugüne Bursa Heykel ve FSM mağazalarıyla hakiki deri erkek ayakkabı.`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        1989&apos;dan Bugüne Bayyıldız
      </h1>

      <p className="mt-8 text-base leading-relaxed text-[var(--color-anthracite-soft)] sm:text-lg sm:leading-relaxed">
        Bayyıldız Ayakkabı, 1989 yılında Bursa Heykel&apos;de başlayan
        yolculuğunu bugün Heykel ve FSM mağazalarıyla sürdürüyor. Hakiki deri,
        özenli işçilik ve yılların tecrübesiyle seçilen erkek ayakkabılarını
        müşterileriyle buluşturuyor.
      </p>
    </article>
  );
}
