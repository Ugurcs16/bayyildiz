import { STORE_HOURS, STORES } from "@/lib/constants";

export function StoreLocations() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <h2 className="text-2xl font-semibold text-[var(--color-espresso)] sm:text-3xl">
        Bursa&apos;daki mağazalarımız
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--color-anthracite-soft)] sm:text-base">
        İki şubemizde aynı ürünleri deneyebilir, numaranızı rahatça seçebilirsiniz.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {STORES.map((s) => (
          <article
            key={s.name}
            className="flex flex-col rounded-2xl border border-black/8 bg-white/90 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[var(--color-espresso)]">
              {s.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
              {s.address}
            </p>
            <a
              href={s.phoneHref}
              className="mt-4 inline-flex text-sm font-semibold text-[var(--color-espresso)] hover:underline"
            >
              {s.phone}
            </a>
            <div className="mt-4 text-sm text-[var(--color-anthracite-soft)]">
              <p>{STORE_HOURS.weekday}</p>
              <p className="mt-1">{STORE_HOURS.sunday}</p>
            </div>
            <a
              href={s.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-espresso)] px-4 text-sm font-semibold text-white"
            >
              Haritada aç
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
