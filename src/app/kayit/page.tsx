import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/account/RegisterForm";
import { hasCustomerSessionCookie } from "@/lib/customer/session-cookie";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kayıt ol",
  description: `${SITE_NAME} müşteri kaydı.`,
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  if (await hasCustomerSessionCookie()) {
    redirect("/hesabim");
  }

  return (
    <article className="mx-auto w-full max-w-md px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)]">
        Hesap oluştur
      </h1>
      <p className="mt-3 text-sm text-[var(--color-anthracite-soft)]">
        Üyelik ücretsizdir. Alışveriş için hesap zorunlu değildir.
      </p>
      <RegisterForm />
    </article>
  );
}
