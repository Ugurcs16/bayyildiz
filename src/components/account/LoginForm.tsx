"use client";

import Link from "next/link";
import { safeReturnPath } from "@/lib/customer/paths";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  accountButtonClass,
  accountFieldClass,
  accountLabelClass,
} from "./form-styles";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeReturnPath(searchParams.get("next"), "/hesabim");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (searchParams.get("stale") !== "1") return;
    void fetch("/api/customer/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    }).then(() => {
      router.refresh();
    });
  }, [router, searchParams]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!email.trim() || password.length < 8) {
      setError("E-posta veya şifre hatalı.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/customer/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        customer?: unknown;
        sessionToken?: unknown;
      } | null;
      if (data && "sessionToken" in data && data.sessionToken) {
        setError("İşlem şu anda gerçekleştirilemiyor. Lütfen biraz sonra tekrar deneyin.");
        return;
      }
      if (!res.ok) {
        setError(data?.error || "E-posta veya şifre hatalı.");
        return;
      }
      router.push(nextPath);
      router.refresh();
    } catch {
      setError("İşlem şu anda gerçekleştirilemiyor. Lütfen biraz sonra tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="login-email" className={accountLabelClass}>
          E-posta
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={accountFieldClass}
        />
      </div>
      <div>
        <label htmlFor="login-password" className={accountLabelClass}>
          Şifre
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={accountFieldClass}
        />
      </div>
      <button type="submit" className={accountButtonClass} disabled={pending}>
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
      <p className="text-center text-sm text-[var(--color-anthracite-soft)]">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-[var(--color-espresso)] underline-offset-2 hover:underline">
          Kayıt olun
        </Link>
      </p>
      <p className="text-center text-xs text-[var(--color-taupe-muted)]">
        Şifremi unuttum özelliği yakında eklenecek.
      </p>
    </form>
  );
}
