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
  title: "Şartlar ve Koşullar",
  description: `${SITE_NAME} web sitesi ve online alışveriş kullanım şartları.`,
  alternates: { canonical: LEGAL_ROUTES.terms },
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Şartlar ve Koşullar"
      intro={`Bu metin, ${SITE_NAME} markasıyla sunulan internet sitesinin ve online sipariş süreçlerinin kullanım koşullarını açıklar. Siteyi kullanarak bu şartları okuduğunuzu kabul etmiş sayılırsınız.`}
    >
      <section>
        <h2>1. Site ve işletmeci kimliği</h2>
        <p>
          Site, {VERIFIED_CONTACT.brand} markası altında Bursa&apos;daki Heykel
          ve FSM mağazalarıyla ilişkilendirilen bir e-ticaret vitrinidir.
        </p>
        <ul>
          <li>
            Marka: {VERIFIED_CONTACT.brand}
          </li>
          <li>
            Şirket unvanı:{" "}
            <LegalPlaceholder>{LEGAL_PLACEHOLDERS.companyTitle}</LegalPlaceholder>
          </li>
          <li>
            Merkez adresi:{" "}
            <LegalPlaceholder>
              {LEGAL_PLACEHOLDERS.registeredAddress}
            </LegalPlaceholder>
          </li>
          <li>
            Vergi dairesi / no:{" "}
            <LegalPlaceholder>{LEGAL_PLACEHOLDERS.taxOffice}</LegalPlaceholder> /{" "}
            <LegalPlaceholder>{LEGAL_PLACEHOLDERS.taxNumber}</LegalPlaceholder>
          </li>
          <li>
            MERSİS:{" "}
            <LegalPlaceholder>{LEGAL_PLACEHOLDERS.mersis}</LegalPlaceholder>
          </li>
          <li>
            Ticaret sicil:{" "}
            <LegalPlaceholder>
              {LEGAL_PLACEHOLDERS.tradeRegistry}
            </LegalPlaceholder>
          </li>
          <li>
            Mağaza iletişim: WhatsApp {VERIFIED_CONTACT.whatsappDisplay}; Heykel{" "}
            {VERIFIED_CONTACT.stores[0].phone}; FSM{" "}
            {VERIFIED_CONTACT.stores[1].phone}
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Kapsam</h2>
        <p>
          Bu şartlar; site içeriğinin görüntülenmesi, ürün inceleme, sepet,
          üyelik, sipariş oluşturma ve ödeme yönlendirme süreçleri için
          geçerlidir. Mağaza içi yüz yüze satışlar ayrıca mağaza uygulamalarına
          tabi olabilir.
        </p>
      </section>

      <section>
        <h2>3. Ürün bilgileri</h2>
        <p>
          Ürün görselleri, model kodları, açıklamalar ve stok durumları mümkün
          olduğunca güncel tutulur. Renk tonları ekran ayarlarına göre farklılık
          gösterebilir. Nihai ürün özellikleri sipariş anındaki katalog
          bilgisine göre değerlendirilir.
        </p>
      </section>

      <section>
        <h2>4. Fiyatlar ve vergiler</h2>
        <p>
          Sitede görünen fiyatlar Türk Lirası (₺) cinsindendir. Fiyatlar, yasal
          olarak uygulanması gereken vergiler dahil veya hariç şekilde
          gösterilebilir; sipariş özetinde görünen tutar ödeme öncesi
          teyit edilmelidir. Kampanya ve stok kaynaklı fiyat değişiklikleri
          saklıdır.
        </p>
      </section>

      <section>
        <h2>5. Sipariş süreci</h2>
        <p>
          Sipariş; ürün seçimi, numara/beden tercihi, sepete ekleme, teslimat ve
          iletişim bilgilerinin girilmesi, T.C. Kimlik No alanının doldurulması
          (ödeme sağlayıcısı gereksinimi) ve ödeme adımına geçilmesiyle
          ilerler. Sipariş, stok doğrulaması ve ödeme sağlayıcısı sürecinin
          tamamlanmasına bağlıdır.
        </p>
      </section>

      <section>
        <h2>6. Ödeme</h2>
        <p>
          Online ödemeler, iyzico barındırmalı (hosted) ödeme formu üzerinden
          gerçekleştirilir. Kart numarası ve CVV bilgileri Bayyıldız sitesinde
          işlenmez; kart verisi ödeme sayfasında iyzico altyapısına girilir.
          Ödeme sonucu Bayyıldız’a sipariş / ödeme durumu olarak iletilir.
        </p>
      </section>

      <section>
        <h2>7. Sipariş onayı ve stok</h2>
        <p>
          Stok, sipariş anında yeniden doğrulanabilir. Stok yetersizliğinde
          ilgili kalemler sepetten düşürülebilir veya sipariş tamamlanamayabilir.
          Başarılı ödeme sonrası sipariş durumu sonuç sayfasında ve (hesabınız
          varsa) siparişlerim alanında görüntülenebilir.
        </p>
      </section>

      <section>
        <h2>8. Teslimat</h2>
        <p>
          Teslimat, siparişte verdiğiniz adrese yapılır. Adres, telefon ve
          iletişim bilgilerinin doğruluğu müşterinin sorumluluğundadır. Yanlış
          veya eksik bilgi nedeniyle oluşan gecikme / teslim sorunlarından
          Bayyıldız sorumlu tutulamaz. Kargo süreleri bölgeye ve kargo
          firmasına göre değişebilir.
        </p>
      </section>

      <section>
        <h2>9. Cayma, iptal, iade ve değişim</h2>
        <p>
          Tüketici mevzuatı kapsamındaki yasal haklarınız saklıdır. Cayma,
          iade ve değişim süreçlerinin ayrıntıları için{" "}
          <Link
            href={LEGAL_ROUTES.returns}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            İade &amp; Değişim
          </Link>{" "}
          ve{" "}
          <Link
            href={LEGAL_ROUTES.distanceSales}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Mesafeli Satış
          </Link>{" "}
          sayfalarına bakınız. Somut süre ve istisnalar, hukuki kimlik
          bilgileri tamamlandıktan sonra netleştirilecektir.
        </p>
        <p>
          Ayıplı / kusurlu ürünlerde yasal tüketici hakları geçerlidir; mağaza
          veya WhatsApp üzerinden bildirimde bulunabilirsiniz.
        </p>
      </section>

      <section>
        <h2>10. Müşteri sorumlulukları</h2>
        <ul>
          <li>Doğru iletişim ve teslimat bilgisi vermek</li>
          <li>Hesap bilgilerini gizli tutmak</li>
          <li>Siteyi hukuka aykırı veya kötü niyetli kullanmamak</li>
        </ul>
      </section>

      <section>
        <h2>11. Fikri mülkiyet</h2>
        <p>
          Sitedeki marka, metin, görsel ve tasarım öğeleri ilgili hak
          sahiplerine aittir. İzinsiz kopyalama, çoğaltma veya ticari kullanım
          yasaktır.
        </p>
      </section>

      <section>
        <h2>12. Mücbir sebep</h2>
        <p>
          Doğal afet, salgın, grev, ulaşım/kesinti, altyapı arızası gibi
          kontrol dışı durumlarda gecikme veya ifa engellerinden kaynaklanan
          sorumluluk sınırlı tutulabilir.
        </p>
      </section>

      <section>
        <h2>13. Kişisel veriler</h2>
        <p>
          Kişisel verilerin işlenmesi{" "}
          <Link
            href={LEGAL_ROUTES.privacy}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Gizlilik Politikası
          </Link>{" "}
          ve{" "}
          <Link
            href={LEGAL_ROUTES.cookies}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Çerez Politikası
          </Link>{" "}
          kapsamında açıklanır.
        </p>
      </section>

      <section>
        <h2>14. İletişim ve uyuşmazlık</h2>
        <p>
          Sorularınız için WhatsApp {VERIFIED_CONTACT.whatsappDisplay} veya
          mağaza telefonlarını kullanabilirsiniz. Tüketici uyuşmazlıklarında
          yasal başvuru mercileri (ör. tüketici hakem heyetleri / mahkemeler)
          saklıdır. Bu metin hukuki danışmanlık yerine geçmez; resmi şirket
          kimliği alanları tamamlanıp avukat incelemesinden geçirilmelidir.
        </p>
      </section>
    </LegalDocument>
  );
}
