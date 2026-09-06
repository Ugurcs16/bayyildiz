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
  title: "İade & Değişim",
  description: `${SITE_NAME} iade ve değişim bilgilendirmesi.`,
  alternates: { canonical: LEGAL_ROUTES.returns },
};

export default function ReturnsPage() {
  return (
    <LegalDocument
      title="İade & Değişim"
      intro="Kullanılmamış ve satışa uygun ürünlerde iade / değişim taleplerinizi mağaza veya WhatsApp üzerinden iletebilirsiniz. Aşağıdaki süre ve istisna satırları hukuki kimlik bilgileri tamamlanıp avukat incelemesinden sonra netleştirilecektir."
    >
      <section>
        <h2>Nasıl başvurulur?</h2>
        <ul>
          <li>WhatsApp: {VERIFIED_CONTACT.whatsappDisplay}</li>
          <li>Heykel: {VERIFIED_CONTACT.stores[0].phone}</li>
          <li>FSM: {VERIFIED_CONTACT.stores[1].phone}</li>
        </ul>
        <p>
          Sipariş numaranızı, ürün model kodunu ve talebinizin iade mi yoksa
          değişim mi olduğunu belirtiniz.
        </p>
      </section>

      <section>
        <h2>İade adresi</h2>
        <p>
          <LegalPlaceholder>{LEGAL_PLACEHOLDERS.returnAddress}</LegalPlaceholder>
        </p>
      </section>

      <section>
        <h2>Yasal haklar</h2>
        <p>
          Tüketici mevzuatından doğan haklarınız saklıdır. Somut cayma süreleri
          ve istisnalar (ör. hijyen / kişiye özel ürünler) bu sayfada henüz
          kesinleştirilmemiştir; detay için{" "}
          <Link
            href={LEGAL_ROUTES.distanceSales}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Mesafeli Satış
          </Link>{" "}
          ve{" "}
          <Link
            href={LEGAL_ROUTES.terms}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Şartlar ve Koşullar
          </Link>{" "}
          sayfalarına bakınız.
        </p>
      </section>
    </LegalDocument>
  );
}
