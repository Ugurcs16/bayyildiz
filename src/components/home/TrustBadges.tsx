import { TRUST_BADGES } from "@/lib/constants";

export function TrustBadges() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <h2 className="text-center text-xl font-semibold text-[var(--color-espresso)] sm:text-2xl">
        Neden Bayyıldız?
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[var(--color-anthracite-soft)] sm:text-base">
        Fiziki mağaza güveni, online hızı. Siparişten teslimata şeffaf süreç.
      </p>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {TRUST_BADGES.map((label) => (
          <li
            key={label}
            className="flex min-h-[72px] items-center justify-center rounded-xl border border-black/8 bg-white/90 px-3 py-3 text-center text-xs font-medium leading-snug text-[var(--color-anthracite)] shadow-sm sm:text-sm"
          >
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
