import type { Metadata } from "next";
import { AddressBook } from "@/components/account/AddressBook";
import { SITE_NAME } from "@/lib/constants";
import { mapCustomerAddress } from "@/lib/customer/map-dto";
import { requireCustomerProfile } from "@/lib/customer/server";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import { tervonaListAddresses } from "@/lib/tervona/customer-client";

export const metadata: Metadata = {
  title: "Adreslerim",
  description: `${SITE_NAME} teslimat adresleri.`,
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  await requireCustomerProfile("/hesabim/adresler");
  const token = await readCustomerSessionToken();
  const body = token ? await tervonaListAddresses(token) : { addresses: [] };
  const rows =
    body && typeof body === "object" && Array.isArray((body as { addresses?: unknown }).addresses)
      ? (body as { addresses: unknown[] }).addresses
      : [];
  const addresses = rows
    .map(mapCustomerAddress)
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)]">
        Adreslerim
      </h1>
      <p className="mt-3 text-sm text-[var(--color-anthracite-soft)]">
        Teslimat adreslerinizi kaydedin ve düzenleyin.
      </p>
      <AddressBook initial={addresses} />
    </article>
  );
}
