"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  accountButtonClass,
  accountFieldClass,
  accountLabelClass,
} from "./form-styles";

export function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Lütfen bilgilerinizi kontrol edin.");
      return;
    }
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }
    if (password !== password2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/customer/auth/register", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        sessionToken?: unknown;
      } | null;
      if (data && "sessionToken" in data && data.sessionToken) {
        setError("İşlem şu anda gerçekleştirilemiyor. Lütfen biraz sonra tekrar deneyin.");
        return;
      }
      if (!res.ok) {
        setError(data?.error || "Lütfen bilgilerinizi kontrol edin.");
        return;
      }
      router.push("/hesabim");
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-first" className={accountLabelClass}>
            Ad
          </label>
          <input
            id="reg-first"
            name="firstName"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={accountFieldClass}
          />
        </div>
        <div>
          <label htmlFor="reg-last" className={accountLabelClass}>
            Soyad
          </label>
          <input
            id="reg-last"
            name="lastName"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={accountFieldClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="reg-email" className={accountLabelClass}>
          E-posta
        </label>
        <input
          id="reg-email"
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
        <label htmlFor="reg-phone" className={accountLabelClass}>
          Telefon <span className="font-normal text-[var(--color-taupe-muted)]">(isteğe bağlı)</span>
        </label>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={accountFieldClass}
          placeholder="05xx xxx xx xx"
        />
      </div>
      <div>
        <label htmlFor="reg-password" className={accountLabelClass}>
          Şifre
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={accountFieldClass}
        />
      </div>
      <div>
        <label htmlFor="reg-password2" className={accountLabelClass}>
          Şifre tekrar
        </label>
        <input
          id="reg-password2"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className={accountFieldClass}
        />
      </div>
      <button type="submit" className={accountButtonClass} disabled={pending}>
        {pending ? "Hesap oluşturuluyor…" : "Hesap oluştur"}
      </button>
      <p className="text-center text-sm text-[var(--color-anthracite-soft)]">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-semibold text-[var(--color-espresso)] underline-offset-2 hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
