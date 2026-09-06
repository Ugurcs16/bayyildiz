import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_ROUTES, SITE_NAME } from "@/lib/constants";
import { VERIFIED_CONTACT } from "@/lib/legal/business";

export const metadata: Metadata = {
  title: "Şartlar ve Koşullar",
  description: `${SITE_NAME} web sitesi ve online alışveriş kullanım şartları.`,
  alternates: { canonical: LEGAL_ROUTES.terms },
};

export default function TermsPage() {
  const { heykel, fsm } = VERIFIED_CONTACT;

  return (
    <LegalDocument
      title="Şartlar ve Koşullar"
      intro="Bu şartlar, Bayyıldız Ayakkabı internet sitesinin kullanımı ve online sipariş süreçleri için geçerlidir. Tüketici mevzuatından doğan zorunlu haklarınız saklıdır; siteyi gezmek bu haklardan feragat anlamına gelmez."
    >
      <section>
        <h2>Site ve işletmeci</h2>
        <p>
          Bu internet sitesi Bayyıldız Ayakkabı tarafından işletilen online
          satış mağazasıdır. Bayyıldız Ayakkabı, 1989&apos;dan beri Bursa&apos;da
          müşterilerine hizmet vermektedir.
        </p>
        <p className="font-semibold text-[var(--color-anthracite)]">
          Bayyıldız Ayakkabı
        </p>
        <address className="mt-3 text-sm leading-relaxed">
          <strong className="text-[var(--color-anthracite)]">Heykel</strong>
          <br />
          {heykel.address}
          <br />
          Telefon:{" "}
          <a href={heykel.phoneHref} className="underline underline-offset-2">
            {heykel.phone}
          </a>
        </address>
        <address className="mt-4 text-sm leading-relaxed">
          <strong className="text-[var(--color-anthracite)]">FSM</strong>
          <br />
          {fsm.address}
          <br />
          Telefon:{" "}
          <a href={fsm.phoneHref} className="underline underline-offset-2">
            {fsm.phone}
          </a>
        </address>
        <p className="mt-4 text-sm">
          WhatsApp:{" "}
          <a
            href={VERIFIED_CONTACT.whatsappHref}
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {VERIFIED_CONTACT.whatsappDisplay}
          </a>
        </p>
      </section>

      <section>
        <h2>Kapsam</h2>
        <p>
          Bu şartlar; site içeriğinin görüntülenmesi, ürün inceleme, sepet,
          üyelik, sipariş ve ödeme yönlendirme süreçlerini kapsar. Mağaza içi
          yüz yüze satışlar ayrıca mağaza uygulamalarına tabi olabilir.
        </p>
      </section>

      <section>
        <h2>Ürün bilgileri</h2>
        <p>
          Ürün görselleri, model kodları, açıklamalar ve stok bilgileri mümkün
          olduğunca güncel tutulur. Ekran ayarlarına göre renk tonları
          farklılık gösterebilir. Sipariş anındaki katalog bilgisi esas alınır.
        </p>
      </section>

      <section>
        <h2>Fiyatlar</h2>
        <p>
          Fiyatlar Türk Lirası (₺) cinsindendir. Ödeme öncesi sipariş
          özetindeki tutarı kontrol ediniz. Kampanya veya stok kaynaklı
          değişiklikler olabilir.
        </p>
      </section>

      <section>
        <h2>Stok ve sipariş</h2>
        <p>
          Sipariş; ürün ve numara seçimi, sepete ekleme, iletişim / teslimat
          bilgileri ve ödeme adımıyla ilerler. Stok sipariş anında
          doğrulanabilir; yetersiz stokta ilgili kalemler güncellenebilir veya
          sipariş tamamlanamayabilir.
        </p>
      </section>

      <section>
        <h2>Ödeme</h2>
        <p>
          Online ödemeler iyzico ödeme altyapısı / Checkout Form üzerinden
          tamamlanır. Kart numarası ve CVV Bayyıldız web sitesinde toplanmaz
          veya saklanmaz; kart bilgileri ödeme sayfasında iyzico
          altyapısına girilir.
        </p>
      </section>

      <section>
        <h2>Teslimat</h2>
        <p>
          Teslimat, siparişte verdiğiniz adrese yapılır. Adres ve iletişim
          bilgilerinin doğruluğu sizin sorumluluğunuzdadır. Kargo süreleri
          bölgeye ve kargo firmasına göre değişebilir.
        </p>
      </section>

      <section>
        <h2>İptal, iade ve değişim</h2>
        <p>
          Tüketici mevzuatı kapsamındaki yasal haklarınız saklıdır. Süreç
          ayrıntıları için{" "}
          <Link
            href={LEGAL_ROUTES.returns}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            İade &amp; Değişim
          </Link>{" "}
          sayfasına bakınız veya WhatsApp / mağaza telefonlarından bize
          ulaşın. Ayıplı ürünlerde yasal haklarınız geçerlidir.
        </p>
      </section>

      <section>
        <h2>Fikri mülkiyet</h2>
        <p>
          Sitedeki marka, metin, görsel ve tasarım öğeleri ilgili hak
          sahiplerine aittir. İzinsiz ticari kullanım yasaktır.
        </p>
      </section>

      <section>
        <h2>Site erişilebilirliği</h2>
        <p>
          Bakım, teknik arıza veya kontrol dışı nedenlerle geçici kesintiler
          olabilir. Mümkün olduğunca hızlı çözüm hedeflenir.
        </p>
      </section>

      <section>
        <h2>Kişisel veriler</h2>
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
        <h2>İletişim</h2>
        <p>
          Sorularınız için WhatsApp {VERIFIED_CONTACT.whatsappDisplay} veya
          mağaza telefonlarını kullanabilirsiniz. Tüketici uyuşmazlıklarında
          yasal başvuru mercileri saklıdır.
        </p>
      </section>
    </LegalDocument>
  );
}
