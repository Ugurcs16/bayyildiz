import { LEGAL_ROUTES, SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: `${SITE_NAME} gizlilik ve kişisel verilerin korunması hakkında bilgilendirme.`,
  alternates: { canonical: LEGAL_ROUTES.privacy },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        Gizlilik Politikası
      </h1>
      <p className="mt-4 text-sm text-[var(--color-anthracite-soft)]">
        Son güncelleme: {new Date().getFullYear()}
      </p>
      <div className="mt-10 space-y-8 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
        <p>
          Bu sayfa, {SITE_NAME} web sitesini ziyaret ettiğinizde hangi verilerin
          işlenebileceğine dair genel bir çerçeve sunar. Çevrimiçi mağaza veya
          form entegrasyonları eklendiğinde bu metin güncellenecektir.
        </p>
        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--color-espresso)]">
            Toplanan veriler
          </h2>
          <p className="mt-3">
            Şu aşamada site statik vitrin niteliğindedir. Üyelik veya ödeme
            alınmamaktadır. Üçüncü taraf analitik veya reklam çerezleri
            kullanıldığında burada açıkça listelenecektir.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--color-espresso)]">
            İletişim
          </h2>
          <p className="mt-3">
            Gizlilikle ilgili sorularınız için mağaza telefonlarımızdan veya
            Instagram üzerinden bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </article>
  );
}
