import type { Metadata } from "next";
import Link from "next/link";
import { CartClearOnPaid } from "@/components/checkout/CartClearOnPaid";
import { loadCheckoutResult } from "@/lib/checkout/load-result";
import { SITE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";
import { hasCustomerSessionCookie } from "@/lib/customer/session-cookie";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Ödeme sonucu",
  description: `${SITE_NAME} ödeme sonucu bilgilendirme sayfası.`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/odeme/sonuc" },
};

function primaryButtonClass() {
  return "inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-espresso)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--color-espresso-hover)]";
}

function secondaryButtonClass() {
  return "inline-flex min-h-12 items-center justify-center rounded-xl border border-black/12 bg-white px-6 text-sm font-semibold text-[var(--color-espresso)]";
}

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string | string[]; order?: string | string[] }>;
}) {
  const params = await searchParams;
  const result = await loadCheckoutResult({
    queryOrder: params.order,
    queryPayment: params.payment,
  });
  const signedIn = await hasCustomerSessionCookie();
  const kind = result.kind;

  const wa = buildWhatsAppUrl(
    result.orderNumber
      ? `Merhaba, ${result.orderNumber} sipariş numarası için ödeme konusunda yardım istiyorum.`
      : "Merhaba, ödeme konusunda yardım istiyorum.",
    WHATSAPP_NUMBER,
  );

  let title: string;
  let body: string;
  let accent: string;

  if (kind === "paid") {
    title = "Ödemeniz alındı";
    body =
      "Ödemeniz başarıyla alındı. Siparişiniz hazırlanmaya başlayacak. Onay e-postası veya SMS kısa süre içinde iletilebilir.";
    accent = "border-emerald-200/80 bg-emerald-50/70";
  } else if (kind === "failed") {
    title = "Ödeme tamamlanamadı";
    body =
      "Siparişiniz için ödeme başarıyla alınamadı. Kartınızdan tahsilat yapılmış gibi görünmez; emin değilseniz bankanızla veya bizimle iletişime geçebilirsiniz.";
    accent = "border-red-200/80 bg-red-50/70";
  } else if (kind === "pending") {
    title = "Ödeme kontrol ediliyor";
    body =
      "Ödeme onayı henüz tamamlanmamış olabilir. Birkaç dakika içinde sipariş durumunuz güncellenebilir. Lütfen şu an başarı olarak değerlendirmeyin.";
    accent = "border-amber-200/80 bg-amber-50/60";
  } else {
    title = "Ödeme durumu doğrulanamadı";
    body =
      "Bu sayfa ödeme sonucunu yalnızca Tervona kaydına bakarak gösterir. Siparişinize erişilemedi. Adres çubuğundaki payment parametresi dikkate alınmaz.";
    accent = "border-black/[0.08] bg-white/80";
  }

  return (
    <article className="mx-auto w-full max-w-lg px-4 py-14 sm:px-6 sm:py-20">
      <CartClearOnPaid orderId={result.orderId} paid={kind === "paid"} />
      <div className={`rounded-2xl border px-5 py-6 sm:px-6 sm:py-7 ${accent}`}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
          Ödeme sonucu
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-anthracite-soft)] sm:text-base">
          {body}
        </p>
        {result.orderNumber && kind !== "unknown" ? (
          <p className="mt-5 text-sm text-[var(--color-anthracite)]">
            Sipariş referansı:{" "}
            <span className="font-semibold tabular-nums text-[var(--color-espresso)]">
              {result.orderNumber}
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {kind === "failed" ? (
          <Link href="/odeme" className={primaryButtonClass()}>
            Ödemeye geri dön
          </Link>
        ) : null}

        {signedIn && kind !== "unknown" ? (
          <Link
            href="/hesabim/siparisler"
            className={kind === "failed" ? secondaryButtonClass() : primaryButtonClass()}
          >
            Siparişlerim
          </Link>
        ) : null}

        <Link
          href="/"
          className={
            kind === "failed" || signedIn ? secondaryButtonClass() : primaryButtonClass()
          }
        >
          Ana Sayfa
        </Link>

        {kind === "failed" || kind === "unknown" ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryButtonClass()}
          >
            WhatsApp ile yardım
          </a>
        ) : null}
      </div>
    </article>
  );
}
