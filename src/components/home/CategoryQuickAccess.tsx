import Link from "next/link";
import { CATEGORY_QUICK } from "@/lib/constants";

export function CategoryQuickAccess() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-3xl">
            Kategorilere göz at
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-anthracite-soft)] sm:text-base">
            Mobilde tek dokunuşla koleksiyonlara ulaş. Deri günlükten bota,
            ihtiyacına uygun modeli seç.
          </p>
        </div>
      </div>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_QUICK.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/kategori/${c.slug}`}
              className="group flex min-h-[120px] flex-col justify-between rounded-2xl border border-black/8 bg-white/80 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <span className="text-lg font-semibold text-[var(--color-espresso)] group-hover:underline">
                  {c.title}
                </span>
                <p className="mt-2 text-sm text-[var(--color-anthracite-soft)]">
                  {c.subtitle}
                </p>
              </div>
              <span className="mt-4 text-sm font-medium text-[var(--color-taupe-muted)]">
                Ürünleri gör →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
