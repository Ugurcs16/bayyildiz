import { LEGAL_ROUTES, SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şartlar ve Koşullar",
  description: `${SITE_NAME} web sitesi kullanım şartları.`,
  alternates: { canonical: LEGAL_ROUTES.terms },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        Şartlar ve Koşullar
      </h1>
      <p className="mt-4 text-sm text-[var(--color-anthracite-soft)]">
        Son güncelleme: {new Date().getFullYear()}
      </p>
      <div className="mt-10 space-y-8 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
        <p>
          Bu web sitesi {SITE_NAME} markasına ait tanıtım ve vitrin amaçlı
          içerik sunar. E-ticaret altyapısı devreye alındığında mesafeli satış,
          iade ve ödeme koşulları burada detaylandırılacaktır.
        </p>
        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--color-espresso)]">
            Kullanım
          </h2>
          <p className="mt-3">
            Sitedeki metin ve görseller telif hakkı ile korunabilir; ticari
            kullanım için yazılı izin gereklidir. Fiyat ve stok bilgileri örnek
            olabilir; güncel bilgi için mağaza ile iletişime geçiniz.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--color-espresso)]">
            Sorumluluk
          </h2>
          <p className="mt-3">
            Site &quot;olduğu gibi&quot; sunulur. Bağlantılı üçüncü taraf
            sitelerinin içeriğinden {SITE_NAME} sorumlu tutulamaz.
          </p>
        </section>
      </div>
    </article>
  );
}
