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
  title: "Gizlilik Politikası",
  description: `${SITE_NAME} kişisel verilerin korunması ve gizlilik bilgilendirmesi.`,
  alternates: { canonical: LEGAL_ROUTES.privacy },
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Gizlilik Politikası"
      intro={`${SITE_NAME} olarak kişisel verilerinizi şeffaf ve ölçülü şekilde işlemeyi hedefleriz. Bu metin, mevcut Bayyıldız vitrin / e-ticaret uygulamasının davranışına dayanır; hukuki danışmanlık yerine geçmez.`}
    >
      <section>
        <h2>1. Veri sorumlusu</h2>
        <p>
          Veri sorumlusu kimliği resmi şirket bilgileri tamamlanana kadar şu
          yer tutucularla gösterilir:
        </p>
        <ul>
          <li>
            Unvan:{" "}
            <LegalPlaceholder>{LEGAL_PLACEHOLDERS.companyTitle}</LegalPlaceholder>
          </li>
          <li>
            Adres:{" "}
            <LegalPlaceholder>
              {LEGAL_PLACEHOLDERS.registeredAddress}
            </LegalPlaceholder>
          </li>
          <li>
            İletişim: WhatsApp {VERIFIED_CONTACT.whatsappDisplay}; mağaza
            telefonları (Heykel / FSM)
          </li>
          <li>
            Gizlilik / KVKK talepleri:{" "}
            <LegalPlaceholder>{LEGAL_PLACEHOLDERS.legalEmail}</LegalPlaceholder>
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Hangi veriler işlenebilir?</h2>
        <p>Uygulama akışına göre işlenebilecek başlıca veriler:</p>
        <ul>
          <li>
            Hesap: ad, soyad, e-posta, telefon, şifre (şifre Bayyıldız
            sunucusunda düz metin olarak tutulmaz; kimlik doğrulama Tervona
            üzerinden yürütülür)
          </li>
          <li>Teslimat / fatura adresi bilgileri</li>
          <li>Sipariş kalemleri, tutarlar, sipariş numarası ve durumu</li>
          <li>
            Ödeme ile ilgili durum bilgileri (ör. ödeme sonucu). Kart numarası
            / CVV Bayyıldız sitesinde işlenmez
          </li>
          <li>
            T.C. Kimlik No: ödeme başlatma adımında zorunlu alan olarak
            toplanır ve ödeme sağlayıcısı sürecine iletilir (aşağıya bakınız)
          </li>
          <li>
            Teknik veriler: tarayıcı depolama / çerez kayıtları, güvenlik ve
            oturum için gerekli tanımlayıcılar
          </li>
        </ul>
      </section>

      <section>
        <h2>3. T.C. Kimlik No (TCKN)</h2>
        <p>
          Checkout formunda 11 haneli T.C. Kimlik No alanı, ödeme
          sağlayıcısının (iyzico) kimlik doğrulama gereksinimi nedeniyle
          zorunludur. Bayyıldız vitrin kodunda TCKN; tarayıcı çerezlerinde veya
          localStorage / sessionStorage içinde saklanmaz. Değer, güvenli
          sunucu tarafı istekleriyle sipariş / ödeme başlatma akışında Tervona
          üzerinden iyzico sürecine iletilir.
        </p>
        <p>
          Tervona veya iyzico tarafındaki saklama süresi ve yöntemleri bu
          depodan doğrulanmamıştır; bu nedenle TCKN’nin tüm sistemlerde
          tutulmadığına dair kesin bir iddia ileri sürülmez. Güncel saklama
          uygulamaları için ödeme / altyapı sağlayıcılarının politikalarına ve
          veri sorumlusu beyanlarına bakılmalıdır.
        </p>
      </section>

      <section>
        <h2>4. İşleme amaçları</h2>
        <ul>
          <li>Sipariş oluşturma, stok doğrulama ve teslimat</li>
          <li>Ödeme işleminin başlatılması ve sonucunun gösterilmesi</li>
          <li>Müşteri hesabı, adres ve sipariş geçmişi</li>
          <li>Müşteri destek ve iletişim (ör. WhatsApp)</li>
          <li>Dolandırıcılık / güvenlik önlemleri ve çift işlem engeli</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        </ul>
      </section>

      <section>
        <h2>5. Çerezler ve yerel depolama</h2>
        <p>
          Sepet, oturum, ödeme güvenliği ve tercihleriniz için birinci taraf
          çerez / depolama kullanılır. Ayrıntılar ve tercih yönetimi için{" "}
          <Link
            href={LEGAL_ROUTES.cookies}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Çerez Politikası
          </Link>{" "}
          sayfasına bakınız. İsteğe bağlı kategorileri istediğiniz zaman
          değiştirebilirsiniz.
        </p>
      </section>

      <section>
        <h2>6. Hizmet sağlayıcılar</h2>
        <ul>
          <li>
            Tervona: katalog, sipariş ve müşteri hesabı altyapısı (Storefront
            API)
          </li>
          <li>iyzico: barındırmalı ödeme formu ve ödeme işleme</li>
          <li>
            Barındırma / altyapı: site Vercel üzerinde yayınlanır; teknik günlük
            ve güvenlik kayıtları altyapı sağlayıcısının işletim
            uygulamalarına tabi olabilir
          </li>
          <li>Kargo firmaları: teslimat için gerekli adres / iletişim paylaşımı</li>
        </ul>
      </section>

      <section>
        <h2>7. Saklama</h2>
        <p>
          Veriler, sipariş ve yasal yükümlülüklerin gerektirdiği sürelerle
          sınırlı tutulmayı hedefler. Kesin saklama tablosu, şirket kimliği ve
          muhasebe / tüketici mevzuatı gereksinimleri netleştikçe
          güncellenecektir. Tarayıcıdaki sepet verisi cihazınızda tutulur;
          çıkış / temizlik ile silinebilir.
        </p>
      </section>

      <section>
        <h2>8. Güvenlik</h2>
        <p>
          İletişim HTTPS ile yapılır. Oturum ve ödeme erişim çerezleri
          httpOnly olarak ayarlanır. Yine de internet üzerinden iletimde mutlak
          güvenlik garanti edilemez; şüpheli durumları bize bildiriniz.
        </p>
      </section>

      <section>
        <h2>9. Haklarınız</h2>
        <p>
          KVKK kapsamında; bilgilendirilme, erişim, düzeltme, silme, işlemeyi
          kısıtlama, itiraz ve yasal başvuru haklarınız bulunabilir. Talepleriniz
          için WhatsApp {VERIFIED_CONTACT.whatsappDisplay} veya{" "}
          <LegalPlaceholder>{LEGAL_PLACEHOLDERS.legalEmail}</LegalPlaceholder>{" "}
          üzerinden bize ulaşın. Kimlik doğrulaması istenebilir.
        </p>
      </section>

      <section>
        <h2>10. Çocuklar</h2>
        <p>
          Site yetişkinlere yönelik ürünler sunar; 18 yaş altı kullanıcıların
          veli / vasi onayı olmadan hesap açması veya sipariş vermesi
          beklenmez.
        </p>
      </section>

      <section>
        <h2>11. Güncellemeler</h2>
        <p>
          Bu politika güncellenebilir. Önemli değişikliklerde güncelleme tarihi
          yenilenir; çerez tercih sürümü değişirse yeniden onay istenebilir.
        </p>
      </section>
    </LegalDocument>
  );
}
