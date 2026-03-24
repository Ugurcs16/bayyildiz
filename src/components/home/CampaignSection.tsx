import Link from "next/link";

export function CampaignSection() {
  return (
    <section className="border-y border-black/8 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-taupe)_22%,transparent)_0%,transparent_50%,color-mix(in_srgb,var(--color-bronze-end)_12%,transparent)_100%)] py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-espresso)]">
            Yeni sezon
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
            Deride kalite, fiyatta netlik
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
            Mağazamızda dokunduğunuz deriyi online’da da aynı titizlikle sunuyoruz.
            Yeni sezon modelleri stoklarla sınırlı — erken seçen kazanır.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/kategori/yeni-sezon"
            className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-xl bg-[var(--color-espresso)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-espresso-hover)]"
          >
            Yeni sezonu aç
          </Link>
          <Link
            href="/#one-cikanlar"
            className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-xl border border-[var(--color-espresso)]/25 bg-white/90 px-6 text-sm font-semibold text-[var(--color-espresso)]"
          >
            Öne çıkanlar
          </Link>
        </div>
      </div>
    </section>
  );
}
