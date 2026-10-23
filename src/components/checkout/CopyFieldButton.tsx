"use client";

import { useState } from "react";

export function CopyFieldButton({
  value,
  label = "Kopyala",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const text = value.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      disabled={!value.trim()}
      className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-black/12 bg-white px-3 text-xs font-semibold text-[var(--color-espresso)] transition hover:bg-[var(--color-cream)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {copied ? "Kopyalandı" : label}
    </button>
  );
}
