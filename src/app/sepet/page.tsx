import type { Metadata } from "next";
import Link from "next/link";
import { CartView } from "@/components/cart/CartView";
import { SITE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl, DEFAULT_PRODUCT_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Sepet",
  description: `${SITE_NAME} sepetiniz — WooCommerce ile güvenli ödeme.`,
};

export default function CartPage() {
  const wa = buildWhatsAppUrl(DEFAULT_PRODUCT_MESSAGE, WHATSAPP_NUMBER);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        Sepet
      </h1>
      <p className="mt-3 text-sm text-[var(--color-anthracite-soft)] sm:text-base">
        Sepetiniz bu cihazda saklanır. Ödeme için WooCommerce mağazanızdaki sepet
        akışını kullanın; takıldığınız yerde WhatsApp&apos;tan yazmanız yeterli.
      </p>
      <div className="mt-10">
        <CartView />
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 text-sm font-semibold text-[#075E54]"
        >
          WhatsApp ile sipariş
        </a>
        <Link
          href="/"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[var(--color-espresso)] text-sm font-semibold text-white"
        >
          Alışverişe devam
        </Link>
      </div>
    </div>
  );
}
