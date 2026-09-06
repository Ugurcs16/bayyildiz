import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalDocument,
  LegalPlaceholder,
} from "@/components/legal/LegalDocument";
import { LEGAL_ROUTES, SITE_NAME } from "@/lib/constants";
import {
  LEGAL_PLACEHOLDERS,
  VERIFIED_CONTACT,
} from "@/lib/legal/business";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: `${SITE_NAME} mesafeli satış bilgilendirmesi.`,
  alternates: { canonical: LEGAL_ROUTES.distanceSales },
};

export default function DistanceSalesPage() {
  return (
    <LegalDocument
      title="Mesafeli Satış Sözleşmesi"
      intro="Bu sayfa, internet üzerinden verilen siparişlere ilişkin mesafeli satış bilgilendirmesinin iskeletidir. Tarafların resmi kimliği ve cayma süreleri avukat onayıyla tamamlanmalıdır."
    >
      <section>
        <h2>Taraflar</h2>
        <ul>
          <li>
            Satıcı unvanı:{" "}
            <LegalPlaceholder>{LEGAL_PLACEHOLDERS.companyTitle}</LegalPlaceholder>
          </li>
          <li>
            Adres:{" "}
            <LegalPlaceholder>
              {LEGAL_PLACEHOLDERS.registeredAddress}
            </LegalPlaceholder>
          </li>
          <li>
            Alıcı: Sipariş formunda belirtilen ad, soyad, adres ve iletişim
            bilgileri
          </li>
        </ul>
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
          Ödeme iyzico barındırmalı form üzerinden alınır. Teslimat, alıcının
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
        <h2>Cayma hakkı</h2>
        <p>
          Mesafeli satışlarda tüketicinin yasal cayma hakkı saklıdır. Bu
          depoda kesin gün sayısı ve istisna listesi doğrulanmış bir hukuki
          kaynaktan alınmadığı için burada süre uydurulmamıştır. Net süre /
          istisna metni şirket bilgileriyle birlikte eklenecektir.
        </p>
        <p>
          İade süreci için{" "}
          <Link
            href={LEGAL_ROUTES.returns}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            İade &amp; Değişim
          </Link>{" "}
          sayfasına ve WhatsApp {VERIFIED_CONTACT.whatsappDisplay} hattına
          başvurabilirsiniz.
        </p>
      </section>
    </LegalDocument>
  );
}
