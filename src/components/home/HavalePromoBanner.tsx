import { isHavaleEftEnabledClient } from "@/lib/checkout/features";

/**
 * Small home promo — only when public havale flag is on.
 * Informational only; no CTA / checkout link.
 */
export function HavalePromoBanner() {
  if (!isHavaleEftEnabledClient()) return null;

  return (
    <aside
      aria-label="Havale / EFT indirimi"
      className="border-b border-emerald-200/70 bg-emerald-50/80"
    >
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-6 sm:py-3.5">
        <p className="text-sm font-semibold tracking-tight text-emerald-950">
          Havale / EFT ile Ödemelerde %5 İndirim!
        </p>
      </div>
    </aside>
  );
}
