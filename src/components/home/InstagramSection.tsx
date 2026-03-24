import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";

export function InstagramSection() {
  return (
    <section className="bg-[var(--color-cream-dark)] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-semibold text-[var(--color-espresso)] sm:text-3xl">
          Kombinleri Instagram&apos;da keşfet
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-anthracite-soft)] sm:text-base">
          <span className="font-semibold text-[var(--color-espresso)]">
            40.000+ takipçi
          </span>{" "}
          ile yeni gelenler, mağaza stokları ve stil önerileri her gün güncelleniyor.
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-12 min-w-[220px] items-center justify-center rounded-xl bg-[var(--color-espresso)] px-8 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-espresso-hover)]"
        >
          Instagram&apos;da İncele
        </a>
        <p className="mt-4 text-sm text-[var(--color-anthracite-soft)]">
          {INSTAGRAM_HANDLE}
        </p>
      </div>
    </section>
  );
}
