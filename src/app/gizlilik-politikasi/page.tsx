import type { Metadata } from "next";
import Link from "next/link";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_ROUTES, SITE_NAME } from "@/lib/constants";
import { VERIFIED_CONTACT } from "@/lib/legal/business";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: `${SITE_NAME} kişisel verilerin korunması ve gizlilik bilgilendirmesi.`,
  alternates: { canonical: LEGAL_ROUTES.privacy },
};

export default function PrivacyPage() {
  const { heykel, fsm } = VERIFIED_CONTACT;

  return (
    <LegalDocument
      title="Gizlilik Politikası"
      intro="Bayyıldız Ayakkabı olarak kişisel verilerinizi ölçülü ve şeffaf şekilde işlemeyi hedefleriz. Bu metin, online mağazanın müşteriye dönük işleyişini özetler."
    >
      <section>
        <h2>Kimiz?</h2>
        <p>
          Bu site Bayyıldız Ayakkabı tarafından işletilir. Gizlilikle ilgili
          talepleriniz için WhatsApp {VERIFIED_CONTACT.whatsappDisplay}, Heykel{" "}
          {heykel.phone} veya FSM {fsm.phone} üzerinden bize ulaşabilirsiniz.
        </p>
      </section>

      <section>
        <h2>Hangi bilgiler işlenebilir?</h2>
        <ul>
          <li>Ad, soyad, telefon, e-posta</li>
          <li>Teslimat / adres bilgileri</li>
          <li>Hesap oluşturursanız hesap bilgileriniz</li>
          <li>Sipariş içeriği, tutar, sipariş numarası ve durumu</li>
          <li>Ödeme işlemi / referans / durum bilgileri</li>
          <li>
            Ödeme için gerekli kimlik bilgisi (T.C. Kimlik No), ödeme
            altyapısının gereksinimi doğrultusunda
          </li>
          <li>
            Sitenin çalışması için gerekli temel teknik / güvenlik kayıtları
            (ör. oturum, sepet, çerez tercihleri)
          </li>
        </ul>
      </section>

      <section>
        <h2>Ödeme ve kart bilgileri</h2>
        <p>
          Bayyıldız web sitesi kart numarası veya CVV toplamaz ve saklamaz.
          Ödeme, iyzico ödeme altyapısı / Checkout Form üzerinden tamamlanır.
          Kart bilgileriniz ödeme sayfasında iyzico’ya girilir.
        </p>
      </section>

      <section>
        <h2>İşleme amaçları</h2>
        <ul>
          <li>Siparişin alınması, hazırlanması ve teslimatı</li>
          <li>Ödeme sürecinin yürütülmesi ve sonucunun bildirilmesi</li>
          <li>Hesap ve müşteri iletişimi</li>
          <li>Güvenlik / dolandırıcılık önlemleri</li>
          <li>Yasal ve muhasebe yükümlülükleri</li>
        </ul>
      </section>

      <section>
        <h2>Hizmet sağlayıcılar</h2>
        <p>
          Sipariş, ödeme ve barındırma süreçlerinde güvenilir hizmet
          sağlayıcılarla çalışılabilir (ör. ödeme için iyzico; teslimat için
          kargo firmaları; site barındırma). Veriler yalnızca ilgili hizmetin
          gerektirdiği ölçüde paylaşılır. “Hiçbir veri paylaşılmaz” gibi kesin
          iddialarda bulunulmaz.
        </p>
      </section>

      <section>
        <h2>Saklama</h2>
        <p>
          Veriler, sipariş ve yasal yükümlülüklerin gerektirdiği sürelerle
          sınırlı tutulmayı hedefler. Kesin saklama süreleri işletme
          politikasına göre uygulanır; burada uydurma gün sayıları
          yazılmamıştır.
        </p>
      </section>

      <section>
        <h2>Çerezler</h2>
        <p>
          Zorunlu çerezler site, sepet ve güvenlik için kullanılır. İsteğe
          bağlı kategoriler (ör. analitik, pazarlama) yalnızca onayınızla
          devreye girer. Ayrıntılar için{" "}
          <Link
            href={LEGAL_ROUTES.cookies}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Çerez Politikası
          </Link>{" "}
          sayfasına bakın. Tercihlerinizi istediğiniz zaman{" "}
          <CookiePreferencesButton className="font-medium text-[var(--color-espresso)] underline underline-offset-2" />{" "}
          üzerinden değiştirebilirsiniz.
        </p>
      </section>

      <section>
        <h2>Haklarınız</h2>
        <p>
          KVKK kapsamında bilgilendirilme, erişim, düzeltme, silme ve itiraz
          gibi haklarınız bulunabilir. Talepleriniz için WhatsApp{" "}
          {VERIFIED_CONTACT.whatsappDisplay} hattından bize yazın.
        </p>
      </section>
    </LegalDocument>
  );
}
