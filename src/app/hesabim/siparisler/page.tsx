import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { mapCustomerOrder } from "@/lib/customer/map-dto";
import { requireCustomerProfile } from "@/lib/customer/server";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import { formatTry } from "@/lib/woocommerce";
import { tervonaListOrders } from "@/lib/tervona/customer-client";

export const metadata: Metadata = {
  title: "Siparişlerim",
  description: `${SITE_NAME} sipariş geçmişi.`,
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function OrdersPage() {
  await requireCustomerProfile("/hesabim/siparisler");
  const token = await readCustomerSessionToken();
  const body = token ? await tervonaListOrders(token) : { orders: [] };
  const rows =
    body && typeof body === "object" && Array.isArray((body as { orders?: unknown }).orders)
      ? (body as { orders: unknown[] }).orders
      : [];
  const orders = rows
    .map(mapCustomerOrder)
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)]">
        Siparişlerim
      </h1>

      {orders.length === 0 ? (
        <div className="mt-10">
          <p className="text-base text-[var(--color-anthracite-soft)]">
            Henüz siparişiniz bulunmuyor.
          </p>
          <Link
            href="/kategori/gunluk"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-espresso)] px-6 text-sm font-semibold text-white"
          >
            Alışverişe başla
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-8">
          {orders.map((order) => (
            <li key={order.id} className="border-b border-black/[0.06] pb-6 last:border-0">
              <p className="text-sm font-semibold text-[var(--color-espresso)]">
                {order.reference}
              </p>
              <p className="mt-1 text-sm text-[var(--color-anthracite-soft)]">
                {formatDate(order.createdAt)}
                {order.status ? ` · ${order.status}` : ""}
              </p>
              <p className="mt-2 text-base font-semibold tabular-nums text-[var(--color-espresso)]">
                {formatTry(String(order.total))}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-[var(--color-anthracite-soft)]">
                {order.lines.map((line, index) => (
                  <li key={`${order.id}-${index}`}>
                    {line.title}
                    {line.variantTitle ? ` · ${line.variantTitle}` : ""} × {line.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
