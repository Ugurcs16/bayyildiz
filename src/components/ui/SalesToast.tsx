"use client";

/**
 * Satış akışı için sabit konumlu kısa bildirim (dependency yok).
 */
export function SalesToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[80] flex justify-center md:inset-x-auto md:bottom-8 md:right-8 md:justify-end"
    >
      <div className="max-w-md rounded-2xl border border-white/10 bg-[var(--color-espresso)] px-5 py-3.5 text-center text-sm font-medium text-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)]">
        {message}
      </div>
    </div>
  );
}
