import type { Metadata } from "next";
import Link from "next/link";
import {
  INSTAGRAM_URL,
  SITE_NAME,
  STORE_HOURS,
  STORES,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import { buildWhatsAppUrl, DEFAULT_PRODUCT_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${SITE_NAME} mağaza adresleri, telefon ve WhatsApp iletişim.`,
};

export default function ContactPage() {
  const wa = buildWhatsAppUrl(DEFAULT_PRODUCT_MESSAGE, WHATSAPP_NUMBER);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        İletişim
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-[var(--color-anthracite-soft)] sm:text-base">
        Sipariş, stok ve beden sorularınız için WhatsApp hattımız en hızlı
        kanaldır. Mağazalarımızda ürünü denemek isterseniz çalışma saatlerimize
        göz atın.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/8 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-espresso)]">
            WhatsApp
          </h2>
          <p className="mt-2 text-sm text-[var(--color-anthracite-soft)]">
            Hattımız:{" "}
            <span className="font-medium text-[var(--color-anthracite)]">
              {WHATSAPP_DISPLAY}
            </span>
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25D366] px-6 text-sm font-semibold text-white"
          >
            WhatsApp&apos;tan yaz
          </a>
        </section>

        <section className="rounded-2xl border border-black/8 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-espresso)]">
            Instagram
          </h2>
          <p className="mt-2 text-sm text-[var(--color-anthracite-soft)]">
            40.000+ takipçi ile yeni modelleri ve mağaza stoklarını paylaşıyoruz.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-espresso)] px-6 text-sm font-semibold text-white"
          >
            Instagram profili
          </a>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-[var(--color-espresso)]">
          Mağazalar
        </h2>
        <p className="mt-2 text-sm text-[var(--color-anthracite-soft)]">
          {STORE_HOURS.weekday}
          <br />
          {STORE_HOURS.sunday}
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {STORES.map((s) => (
            <li
              key={s.name}
              className="rounded-2xl border border-black/8 bg-[var(--color-cream)] p-6"
            >
              <h3 className="font-semibold text-[var(--color-espresso)]">
                {s.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-anthracite-soft)]">
                {s.address}
              </p>
              <a
                href={s.phoneHref}
                className="mt-3 inline-block text-sm font-medium text-[var(--color-espresso)]"
              >
                {s.phone}
              </a>
              <div className="mt-4">
                <a
                  href={s.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--color-taupe-muted)] underline"
                >
                  Haritada aç
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-center text-sm text-[var(--color-anthracite-soft)]">
        <Link href="/" className="font-medium text-[var(--color-espresso)]">
          Ana sayfaya dön
        </Link>
      </p>
    </div>
  );
}
