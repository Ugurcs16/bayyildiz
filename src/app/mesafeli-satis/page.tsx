import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
};

export default function DistanceSalesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold text-[var(--color-espresso)]">
        Mesafeli Satış Sözleşmesi
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
        Mesafeli satış sözleşmesi metninizi buraya ekleyebilirsiniz. {SITE_NAME}{" "}
        için taraflar, cayma hakkı, iade koşulları ve ödeme bilgileri gibi
        başlıklar WooCommerce sürecinizle uyumlu olmalıdır.
      </p>
    </article>
  );
}
