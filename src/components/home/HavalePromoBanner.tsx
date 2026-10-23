import Link from "next/link";
import { isHavaleEftEnabledClient } from "@/lib/checkout/features";

/**
 * Small home promo — only when public havale flag is on.
 * Does not invent bank details; points shoppers to checkout.
 */
export function HavalePromoBanner() {
  if (!isHavaleEftEnabledClient()) return null;

  return (
    <aside
      aria-label="Havale / EFT indirimi"
      className="border-b border-emerald-200/70 bg-emerald-50/80"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3.5">
        <p className="text-sm font-semibold tracking-tight text-emerald-950">
          Havale / EFT ile Ödemelerde %5 İndirim!
        </p>
        <Link
          href="/odeme"
          className="text-xs font-semibold text-emerald-900 underline-offset-2 hover:underline"
        >
          Ödeme sayfasında seçin →
        </Link>
      </div>
    </aside>
  );
}
