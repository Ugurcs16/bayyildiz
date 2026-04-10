"use client";

import Link from "next/link";

type Props = {
  message: string | null;
  /** true iken mesaj altında Sepet / Ana sayfa aksiyonları gösterilir */
  showCartActions?: boolean;
};

/**
 * Satış akışı için sabit konumlu bildirim (dependency yok).
 * Sepet aksiyonları tıklanabilir olduğunda pointer-events açılır.
 */
export function SalesToast({ message, showCartActions }: Props) {
  if (!message) return null;

  const interactive = Boolean(showCartActions);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[80] flex justify-center md:inset-x-auto md:bottom-8 md:right-8 md:justify-end ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border border-white/10 bg-[var(--color-espresso)] px-5 py-4 text-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] ${interactive ? "" : "text-center text-sm font-medium"}`}
      >
        <p className="text-sm font-medium leading-snug">{message}</p>
        {interactive ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Link
              href="/sepet"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-[var(--color-espresso)] transition hover:bg-[var(--color-cream)]"
            >
              Sepete git
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/35 bg-transparent px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Alışverişe devam et
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
