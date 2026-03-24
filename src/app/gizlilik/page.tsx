import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold text-[var(--color-espresso)]">
        Gizlilik Politikası
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
        {SITE_NAME} olarak kişisel verilerinizi yalnızca sipariş, teslimat ve
        müşteri desteği süreçlerinde kullanırız. Bu sayfa hukuki metninizi
        eklemeniz için yer tutucudur; yayına almadan önce avukatınızla
        gözden geçirmenizi öneririz.
      </p>
    </article>
  );
}
