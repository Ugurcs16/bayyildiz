import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_ROUTES, SITE_NAME } from "@/lib/constants";
import { VERIFIED_CONTACT } from "@/lib/legal/business";

export const metadata: Metadata = {
  title: "İade & Değişim",
  description: `${SITE_NAME} iade ve değişim bilgilendirmesi.`,
  alternates: { canonical: LEGAL_ROUTES.returns },
};

export default function ReturnsPage() {
  const { heykel, fsm } = VERIFIED_CONTACT;

  return (
    <LegalDocument
      title="İade & Değişim"
      intro="İade veya değişim için ürünü göndermeden önce bizimle iletişime geçin. Ekibimiz size süreç ve gönderim bilgileri konusunda yardımcı olacaktır."
    >
      <section>
        <h2>İletişim</h2>
        <ul>
          <li>
            WhatsApp:{" "}
            <a
              href={VERIFIED_CONTACT.whatsappHref}
              className="underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {VERIFIED_CONTACT.whatsappDisplay}
            </a>
          </li>
          <li>
            Heykel:{" "}
            <a href={heykel.phoneHref} className="underline underline-offset-2">
              {heykel.phone}
            </a>
          </li>
          <li>
            FSM:{" "}
            <a href={fsm.phoneHref} className="underline underline-offset-2">
              {fsm.phone}
            </a>
          </li>
        </ul>
        <p>
          Başvurunuzda sipariş numaranızı, ürün model kodunu ve talebinizin
          iade mi yoksa değişim mi olduğunu belirtiniz.
        </p>
      </section>

      <section>
        <h2>Mağaza bilgisi</h2>
        <p>
          Gerekirse görüşme veya teslim için Heykel mağazamızın adresi:
        </p>
        <address className="mt-3 text-sm leading-relaxed">
          Bayyıldız Heykel
          <br />
          {heykel.address}
          <br />
          {heykel.phone}
        </address>
        <p className="mt-3 text-sm">
          Lütfen ürünü bu adrese göndermeden önce onay alın; iade kargo adresi
          talebinize göre ayrıca bildirilir.
        </p>
      </section>

      <section>
        <h2>Yasal haklar</h2>
        <p>
          Tüketici mevzuatından doğan haklarınız saklıdır. Ayrıntılı genel
          koşullar için{" "}
          <Link
            href={LEGAL_ROUTES.terms}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Şartlar ve Koşullar
          </Link>{" "}
          sayfasına bakabilirsiniz.
        </p>
      </section>
    </LegalDocument>
  );
}
