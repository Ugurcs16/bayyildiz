import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--color-espresso)] sm:text-3xl">
        Sayfa bulunamadı
      </h1>
      <p className="mt-4 text-sm text-[var(--color-anthracite-soft)]">
        Aradığınız sayfa taşınmış, sılınmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-espresso)] px-8 text-sm font-semibold text-white"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
