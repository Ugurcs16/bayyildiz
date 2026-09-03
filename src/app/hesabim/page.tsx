import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/account/LogoutButton";
import { SITE_NAME } from "@/lib/constants";
import { requireCustomerProfile } from "@/lib/customer/server";

export const metadata: Metadata = {
  title: "Hesabım",
  description: `${SITE_NAME} müşteri hesabı.`,
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const customer = await requireCustomerProfile("/hesabim");
  const name = `${customer.firstName} ${customer.lastName}`.trim();

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)]">
        Hesabım
      </h1>
      <p className="mt-4 text-base text-[var(--color-anthracite)]">{name}</p>
      <p className="mt-1 text-sm text-[var(--color-anthracite-soft)]">{customer.email}</p>
      {customer.phone ? (
        <p className="mt-1 text-sm text-[var(--color-anthracite-soft)]">{customer.phone}</p>
      ) : null}

      <nav className="mt-10 flex flex-col gap-3" aria-label="Hesap menüsü">
        <Link
          href="/hesabim/siparisler"
          className="flex min-h-14 items-center justify-between border-b border-black/[0.06] py-3 text-base font-semibold text-[var(--color-espresso)]"
        >
          Siparişlerim
          <span aria-hidden className="text-[var(--color-taupe-muted)]">
            →
          </span>
        </Link>
        <Link
          href="/hesabim/adresler"
          className="flex min-h-14 items-center justify-between border-b border-black/[0.06] py-3 text-base font-semibold text-[var(--color-espresso)]"
        >
          Adreslerim
          <span aria-hidden className="text-[var(--color-taupe-muted)]">
            →
          </span>
        </Link>
      </nav>

      <div className="mt-10">
        <LogoutButton />
      </div>
    </article>
  );
}
