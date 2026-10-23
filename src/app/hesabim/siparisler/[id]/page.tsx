import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import { mapCustomerOrder } from "@/lib/customer/map-dto";
import { requireCustomerProfile } from "@/lib/customer/server";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import { formatTry } from "@/lib/woocommerce";
import {
  TervonaCustomerError,
  tervonaGetOrder,
} from "@/lib/tervona/customer-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sipariş detayı",
  description: `${SITE_NAME} sipariş detayı.`,
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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCustomerProfile("/hesabim/siparisler");
  const { id } = await params;
  const token = await readCustomerSessionToken();
  if (!token || !id.trim()) {
    notFound();
  }

  let body: unknown;
  try {
    body = await tervonaGetOrder(token, id);
  } catch (error) {
    if (error instanceof TervonaCustomerError && (error.status === 404 || error.status === 401)) {
      notFound();
    }
    throw error;
  }

  const order = mapCustomerOrder(
    body && typeof body === "object"
      ? (body as { order?: unknown }).order ?? body
      : body,
  );
  if (!order) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Link
        href="/hesabim/siparisler"
        className="text-sm font-semibold text-[var(--color-espresso)] underline-offset-2 hover:underline"
      >
        ← Siparişlerim
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)]">
        {order.reference}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-anthracite-soft)]">
        {formatDate(order.createdAt)}
      </p>

      <p
        className="mt-6 rounded-xl bg-black/[0.04] px-4 py-3 text-sm font-medium text-[var(--color-espresso)]"
        data-payment-status={order.paymentStatus}
        data-fulfillment-status={order.fulfillmentStatus}
        data-order-status={order.orderStatus}
      >
        {order.statusDescription}
      </p>

      <p className="mt-6 text-base font-semibold tabular-nums text-[var(--color-espresso)]">
        {formatTry(String(order.total))}
      </p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--color-anthracite-soft)]">
        Ürünler
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-[var(--color-anthracite)]">
        {order.lines.map((line, index) => (
          <li key={`${order.id}-${index}`}>
            {line.title}
            {line.variantTitle ? ` · ${line.variantTitle}` : ""} × {line.quantity}
          </li>
        ))}
      </ul>
    </article>
  );
}
