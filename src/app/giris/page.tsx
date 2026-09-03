import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/LoginForm";
import { hasCustomerSessionCookie } from "@/lib/customer/session-cookie";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Giriş",
  description: `${SITE_NAME} müşteri girişi.`,
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ stale?: string; next?: string }>;
}) {
  const params = await searchParams;
  if (params.stale !== "1" && (await hasCustomerSessionCookie())) {
    redirect("/hesabim");
  }

  return (
    <article className="mx-auto w-full max-w-md px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)]">
        Giriş yap
      </h1>
      <p className="mt-3 text-sm text-[var(--color-anthracite-soft)]">
        Hesabınıza giriş yaparak sipariş ve adreslerinizi yönetebilirsiniz.
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </article>
  );
}
