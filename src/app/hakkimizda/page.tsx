import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${SITE_NAME} - Bursa kökenli, 35 yılı aşkın erkek ayakkabısı deneyimi.`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        BİZİM MİRASIMIZ
      </h1>

      <p className="mt-6 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
        Otuz yılı aşkın süredir Bayyıldız, Türk işçiliği ve çağdaş tasarım
        anlayışını erkek ayakkabısında buluşturur. Bursa&apos;da başlayan bu hikaye,
        kaliteye verilen önem ve yıllar içinde kazanılan tecrübeyle bugün de
        devam etmektedir.
      </p>

      <h2 className="font-display mt-12 text-xl font-semibold text-[var(--color-espresso)] sm:text-2xl">
        Bayyıldız&apos;ın 35 Yılı Aşan Yolculuğu
      </h2>

      <p className="mt-6 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
        1989 yılında Bursa Heykel&apos;de temelleri atılan Bayyıldız, erkek
        ayakkabısında kalite ve konforu odağına alan bir marka olarak
        yolculuğuna başladı. Kurulduğu günden bu yana, kaliteli dana derisi ve
        özenli işçilikle hazırlanan modelleriyle, günlük hayatta ve özel
        anlarda güvenle tercih edilebilecek ayakkabılar sunmayı amaçladı.
      </p>

      <p className="mt-6 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
        Bayyıldız, klasik ayakkabı anlayışını modern çizgilerle birleştirerek;
        sade, zamansız ve uzun süre kullanılabilecek tasarımlar ortaya koyar.
        Her model, hem estetik duruşu hem de gün boyu konfor sağlayan yapısıyla,
        detaylara verilen önemin bir yansımasıdır.
      </p>

      <p className="mt-6 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
        Bugün Bursa&apos;da Heykel ve FSM Bulvarı olmak üzere iki mağazasıyla
        hizmet veren Bayyıldız, erkek ayakkabısında güvenilir bir adres olmayı
        sürdürmektedir. Sunulan her çift ayakkabı; malzeme seçimi, işçilik ve
        kullanım konforu açısından titizlikle değerlendirilerek müşterilere
        ulaştırılır.
      </p>

      <p className="mt-6 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
        Bayyıldız, &quot;kalitenin erişilebilir olması&quot; gerektiğine inanır. Bu
        anlayışla, yıllara dayanan tecrübesini dürüst fiyat politikasıyla
        birleştirerek, farklı ihtiyaçlara hitap eden erkek ayakkabılarını
        müşterileriyle buluşturur. Markanın temel hedefi; sağlam, şık ve
        güvenilir ayakkabıları uzun yıllar boyunca aynı çizgide sunmaya devam
        etmektir.
      </p>
    </article>
  );
}