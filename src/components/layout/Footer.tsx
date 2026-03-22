import Link from "next/link";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  NAV_ITEMS,
  SITE_DESCRIPTION,
  SITE_NAME,
  STORE_HOURS,
  STORES,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-[var(--color-cream-dark)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="text-lg font-semibold text-[var(--color-espresso)]">
              {SITE_NAME}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
              {SITE_DESCRIPTION}
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-sm font-semibold text-[var(--color-espresso)]">
              Menü
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-anthracite-soft)] hover:text-[var(--color-espresso)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/hakkimizda"
                  className="text-sm text-[var(--color-anthracite-soft)] hover:text-[var(--color-espresso)]"
                >
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          <div id="iletisim" className="scroll-mt-24 lg:col-span-5">
            <p className="text-sm font-semibold text-[var(--color-espresso)]">
              Mağazalar ve iletişim
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
              <span className="font-medium text-[var(--color-anthracite)]">
                Çalışma saatleri
              </span>
              <br />
              {STORE_HOURS.weekday}
              <br />
              {STORE_HOURS.sunday}
            </p>
            <ul className="mt-6 flex flex-col gap-6">
              {STORES.map((s) => (
                <li key={s.name} className="text-sm">
                  <p className="font-semibold text-[var(--color-espresso)]">
                    {s.name}
                  </p>
                  <p className="mt-1 leading-relaxed text-[var(--color-anthracite-soft)]">
                    {s.address}
                  </p>
                  <a
                    href={s.phoneHref}
                    className="mt-2 inline-block font-medium text-[var(--color-espresso)] hover:underline"
                  >
                    {s.phone}
                  </a>
                  <div className="mt-2">
                    <a
                      href={s.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--color-taupe-muted)] underline-offset-2 hover:underline"
                    >
                      Haritada aç
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-[var(--color-anthracite-soft)]">
              Instagram:{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-espresso)] hover:underline"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 py-5 text-center text-xs text-[var(--color-anthracite-soft)]">
        © {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}
