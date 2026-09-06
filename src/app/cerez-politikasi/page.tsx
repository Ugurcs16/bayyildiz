import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";
import {
  HAS_ACTIVE_ANALYTICS,
  HAS_ACTIVE_MARKETING,
  TECHNOLOGY_CATALOG,
  technologiesByCategory,
} from "@/lib/consent/catalog";
import { LEGAL_ROUTES, SITE_NAME } from "@/lib/constants";
import { VERIFIED_CONTACT } from "@/lib/legal/business";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: `${SITE_NAME} çerez ve tarayıcı depolama politikası.`,
  alternates: { canonical: LEGAL_ROUTES.cookies },
};

function TechTable({
  title,
  category,
}: {
  title: string;
  category: "essential" | "functional" | "analytics" | "marketing";
}) {
  const rows = technologiesByCategory(category);
  if (rows.length === 0) {
    return (
      <section>
        <h2>{title}</h2>
        <p>Bu kategoride şu an aktif bir teknoloji bulunmamaktadır.</p>
      </section>
    );
  }
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {rows.map((row) => (
          <li key={row.id}>
            <strong className="text-[var(--color-anthracite)]">{row.name}</strong>
            {" — "}
            {row.purpose}. Tür: {row.kind}; taraf:{" "}
            {row.party === "first" ? "birinci taraf" : "üçüncü taraf"}; süre:{" "}
            {row.duration}.
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      title="Çerez Politikası"
      intro={`Bu sayfa, ${SITE_NAME} sitesinde kullanılan çerez ve tarayıcı depolama teknolojilerini açıklar. Liste, mevcut kod tabanı denetimine dayanır; hayali çerez tablosu içermez.`}
    >
      <section>
        <h2>1. Çerez ve yerel depolama nedir?</h2>
        <p>
          Çerezler, tarayıcınızın sakladığı küçük metin dosyalarıdır.
          localStorage ve sessionStorage ise tarayıcıda tutulan benzer yerel
          kayıtlardır. Bunlar sepet, oturum, güvenlik ve tercihleriniz için
          kullanılabilir.
        </p>
      </section>

      <section>
        <h2>2. Bayyıldız’da durum özeti</h2>
        <ul>
          <li>
            Zorunlu teknolojiler: sepet, oturum, ödeme güvenliği ve tercih
            kaydı ({TECHNOLOGY_CATALOG.filter((t) => t.category === "essential").length}{" "}
            kayıt)
          </li>
          <li>
            İşlevsel: favori listesi depolaması (isteğe bağlı onayla)
          </li>
          <li>
            Analitik:{" "}
            {HAS_ACTIVE_ANALYTICS
              ? "aktif"
              : "şu an kod tabanında aktif analitik aracı yok"}
          </li>
          <li>
            Pazarlama:{" "}
            {HAS_ACTIVE_MARKETING
              ? "aktif"
              : "şu an kod tabanında Meta Pixel / reklam izleyicisi yok"}
          </li>
        </ul>
      </section>

      <TechTable title="3. Zorunlu teknolojiler" category="essential" />
      <TechTable title="4. İşlevsel teknolojiler" category="functional" />
      <TechTable title="5. Analitik teknolojiler" category="analytics" />
      <TechTable title="6. Pazarlama teknolojileri" category="marketing" />

      <section>
        <h2>7. Onay</h2>
        <p>
          İlk ziyarette çerez paneli gösterilir. “Tümünü Kabul Et”, “Yalnızca
          Gerekli Çerezler” veya “Tercihleri Yönet” seçenekleri sunulur. İsteğe
          bağlı kategorileri reddetmek, sepet ve ödeme gibi zorunlu işlevleri
          engellemez.
        </p>
        <p>
          Tercihlerinizi istediğiniz zaman sayfa altındaki{" "}
          <strong>Çerez Tercihleri</strong> bağlantısından
          değiştirebilirsiniz. Politika sürümü değişirse yeniden seçim
          istenebilir.
        </p>
      </section>

      <section>
        <h2>8. Onayı geri çekme</h2>
        <p>
          İsteğe bağlı onay geri alındığında gelecekteki isteğe bağlı
          izleme/depolama durur; Bayyıldız’ın kontrolündeki isteğe bağlı
          birinci taraf kayıtlar (ör. favoriler) silinmeye çalışılır. Sepet,
          oturum ve ödeme güvenlik kayıtları korunur.
        </p>
      </section>

      <section>
        <h2>9. Tarayıcı kontrolleri</h2>
        <p>
          Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilirsiniz.
          Zorunlu çerezleri engellemek site işlevlerini bozabilir.
        </p>
      </section>

      <section>
        <h2>10. İlgili belgeler</h2>
        <p>
          <Link
            href={LEGAL_ROUTES.privacy}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Gizlilik Politikası
          </Link>
          {" · "}
          <Link
            href={LEGAL_ROUTES.terms}
            className="font-medium text-[var(--color-espresso)] underline underline-offset-2"
          >
            Şartlar ve Koşullar
          </Link>
        </p>
        <p className="mt-3">
          Sorularınız için WhatsApp {VERIFIED_CONTACT.whatsappDisplay}.
        </p>
      </section>
    </LegalDocument>
  );
}
