"use client";

import { useConsent } from "@/components/consent/ConsentProvider";

export function CookiePreferencesButton({
  className,
}: {
  className?: string;
}) {
  const { openPreferences } = useConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className={
        className ??
        "text-sm text-[var(--color-cream)]/85 transition-colors hover:text-white"
      }
    >
      Çerez Tercihleri
    </button>
  );
}
