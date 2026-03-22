import Link from "next/link";
import {
  FOOTER_ABOUT_SNIPPET,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LEGAL_ROUTES,
  NAV_ITEMS,
  SITE_NAME,
  STORE_HOURS,
  STORES,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/[0.08] bg-[var(--color-espresso)] text-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-12 sm:gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="font-display text-2xl font-semibold tracking-tight text-[var(--color-ivory)]">
              {SITE_NAME}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--color-cream)]/80">
              {FOOTER_ABOUT_SNIPPET}
            </p>
            <Link
              href="/hakkimizda"
              className="mt-5 inline-flex text-sm font-semibold text-[var(--color-gold-soft)] underline-offset-4 hover:underline"
            >
              Hakkımızda
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]/90">
                Menü
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--color-cream)]/85 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]/90">
                Yasal
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                <li>
                  <Link
                    href={LEGAL_ROUTES.terms}
                    className="text-sm text-[var(--color-cream)]/85 transition-colors hover:text-white"
                  >
                    Şartlar ve Koşullar
                  </Link>
                </li>
                <li>
                  <Link
                    href={LEGAL_ROUTES.privacy}
                    className="text-sm text-[var(--color-cream)]/85 transition-colors hover:text-white"
                  >
                    Gizlilik Politikası
                  </Link>
                </li>
              </ul>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]/90">
                Sosyal
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-medium text-[var(--color-cream)]/90 hover:text-white"
              >
                Instagram · {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>

          <div
            id="iletisim"
            className="scroll-mt-24 border-t border-white/10 pt-10 lg:col-span-4 lg:border-t-0 lg:pt-0"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]/90">
              Çalışma saatleri
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-cream)]/85">
              {STORE_HOURS.weekday}
              <br />
              {STORE_HOURS.sunday}
            </p>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]/90">
              Mağazalar
            </p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {STORES.map((s) => (
                <li
                  key={s.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="font-display text-lg font-semibold text-[var(--color-ivory)]">
                    {s.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-cream)]/75">
                    {s.address}
                  </p>
                  <a
                    href={s.phoneHref}
                    className="mt-3 inline-block text-sm font-semibold text-[var(--color-gold-soft)] hover:underline"
                  >
                    {s.phone}
                  </a>
                  <div className="mt-2">
                    <a
                      href={s.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[var(--color-cream)]/70 underline-offset-2 hover:text-white hover:underline"
                    >
                      Haritada aç
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-[var(--color-cream)]/55 sm:px-6">
          © {new Date().getFullYear()} {SITE_NAME}. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
