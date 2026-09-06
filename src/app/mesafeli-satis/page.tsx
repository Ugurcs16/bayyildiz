import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_ROUTES, SITE_NAME } from "@/lib/constants";
import { VERIFIED_CONTACT } from "@/lib/legal/business";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: `${SITE_NAME} mesafeli satış bilgilendirmesi.`,
  alternates: { canonical: LEGAL_ROUTES.distanceSales },
};

export default function DistanceSalesPage() {
  const { heykel, fsm } = VERIFIED_CONTACT;

  return (
    <LegalDocument
      title="Mesafeli Satış Sözleşmesi"
      intro="Bu bilgilendirme, Bayyıldız Ayakkabı internet sitesinden verilen siparişlere ilişkindir. Tüketici mevzuatından doğan haklarınız saklıdır."
    >
      <section>
        <h2>Satıcı</h2>
        <p>Bayyıldız Ayakkabı</p>
        <address className="mt-3 text-sm leading-relaxed">
          Heykel: {heykel.address} · {heykel.phone}
          <br />
          FSM: {fsm.address} · {fsm.phone}
          <br />
          WhatsApp: {VERIFIED_CONTACT.whatsappDisplay}
        </address>
      </section>

      <section>
        <h2>Alıcı</h2>
        <p>
          Sipariş formunda belirtilen ad, soyad, adres ve iletişim bilgileri.
        </p>
      </section>

      <section>
        <h2>Konu</h2>
        <p>
          Sözleşmenin konusu; alıcının elektronik ortamda sipariş ettiği
          ürünlerin satışı ve teslimidir. Ürün bilgileri sipariş özetinde yer
          alır.
        </p>
      </section>

      <section>
        <h2>Ödeme ve teslimat</h2>
        <p>
          Ödeme iyzico ödeme altyapısı üzerinden alınır. Teslimat, alıcının
          bildirdiği adrese yapılır. Ayrıntılar için{" "}
          <Link
            href={LEGAL_ROUTES.terms}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Şartlar ve Koşullar
          </Link>{" "}
          geçerlidir.
        </p>
      </section>

      <section>
        <h2>Cayma ve iade</h2>
        <p>
          Mesafeli satışlarda tüketicinin yasal cayma hakkı saklıdır. İade /
          değişim için ürünü göndermeden önce bizimle iletişime geçin; süreç{" "}
          <Link
            href={LEGAL_ROUTES.returns}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            İade &amp; Değişim
          </Link>{" "}
          sayfasında ve WhatsApp {VERIFIED_CONTACT.whatsappDisplay} hattında
          paylaşılır.
        </p>
      </section>
    </LegalDocument>
  );
}
