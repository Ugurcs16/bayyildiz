import Link from "next/link";
import { redirect } from "next/navigation";
import { CUSTOMER_MESSAGES } from "@/lib/customer/messages";
import { getCustomerProfile } from "@/lib/customer/server";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await readCustomerSessionToken();
  if (!token) {
    redirect("/giris?next=/hesabim");
  }

  let customer = null;
  try {
    customer = await getCustomerProfile();
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-[var(--color-anthracite-soft)]">{CUSTOMER_MESSAGES.unavailable}</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-espresso)] px-6 text-sm font-semibold text-white"
        >
          Alışverişe dön
        </Link>
      </div>
    );
  }

  if (!customer) {
    redirect("/giris?next=/hesabim&stale=1");
  }

  return <>{children}</>;
}
