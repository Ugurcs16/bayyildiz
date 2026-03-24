import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "İade & Değişim",
};

export default function ReturnsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold text-[var(--color-espresso)]">
        İade & Değişim
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
        Kullanılmamış ve etiketleri yerinde ürünlerde değişim ve iade
        koşullarınızı bu alanda detaylandırın. {SITE_NAME} müşterileri için
        süreç adımlarını (başvuru, kargo, iade ödemesi) net şekilde yazmanız
        güveni artırır.
      </p>
    </article>
  );
}
