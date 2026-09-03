"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await fetch("/api/customer/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center rounded-xl border border-black/12 bg-white px-5 text-sm font-semibold text-[var(--color-espresso)] disabled:opacity-60"
    >
      {pending ? "Çıkış yapılıyor…" : "Çıkış yap"}
    </button>
  );
}
