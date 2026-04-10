"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import { useCart } from "@/components/providers/cart-context";
import { formatTry } from "@/lib/woocommerce";

const TRUST_POINTS = [
  "Hakiki deri ürünler",
  "Bursa mağaza güvencesi",
  "Kolay değişim / iade",
] as const;

export default function CheckoutPage() {
  const { items, subtotal, totalQuantity } = useCart();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");

  const empty = items.length === 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="inline-flex rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-900">
        Misafir alışveriş · Hesap gerekmez
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        Teslimat ve ödeme
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-anthracite-soft)] sm:text-base">
        Bilgilerinizi girin; üyelik zorunlu değil. Ödeme altyapısı çok yakında.
      </p>

      {empty ? (
        <div className="mt-10 rounded-3xl border border-black/[0.07] bg-gradient-to-b from-white to-[var(--color-cream-dark)]/30 px-6 py-12 text-center shadow-sm">
          <p className="text-[var(--color-anthracite-soft)]">
            Sepetiniz boş. Önce ürün ekleyin.
          </p>
          <Link
            href="/sepet"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-espresso)] px-8 text-sm font-semibold text-white shadow-md"
          >
            Sepete git
          </Link>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_17rem] lg:items-start lg:gap-10">
          <div className="min-w-0 space-y-6">
            <div className="rounded-2xl border border-black/[0.08] bg-[var(--color-cream-dark)]/45 p-5 sm:p-6">
              <p className="text-sm font-semibold text-[var(--color-espresso)]">
                Sipariş özeti
              </p>
              <ul className="mt-4 space-y-3 text-sm text-[var(--color-anthracite-soft)]">
                {items.map((line) => (
                  <li
                    key={line.key}
                    className="flex justify-between gap-4 border-b border-black/[0.06] pb-3 last:border-0 last:pb-0"
                  >
                    <span className="min-w-0 leading-snug">
                      <span className="font-medium text-[var(--color-espresso)]">
                        {line.name}
                      </span>
                      <span className="text-[var(--color-taupe-muted)]">
                        {" "}
                        · {line.size}
                      </span>
                      <span className="block text-xs text-[var(--color-taupe-muted)]">
                        × {line.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-[var(--color-espresso)]">
                      {formatTry(
                        String(
                          (Number.parseFloat(line.price) || 0) *
                            line.quantity,
                        ),
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4">
                <span className="text-sm font-medium text-[var(--color-anthracite-soft)]">
                  Toplam ({totalQuantity} ürün)
                </span>
                <span className="text-lg font-semibold tabular-nums text-[var(--color-espresso)]">
                  {formatTry(String(subtotal))}
                </span>
              </div>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="border-b border-black/[0.06] pb-2">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-taupe-muted)]">
                  İletişim
                </h2>
              </div>
              <div>
                <label
                  htmlFor="co-name"
                  className="text-sm font-semibold text-[var(--color-espresso)]"
                >
                  Ad soyad
                </label>
                <input
                  id="co-name"
                  name="fullName"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2.5 w-full min-h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-[var(--color-anthracite)] placeholder:text-[var(--color-taupe-muted)] focus:border-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/15"
                  placeholder="Adınız ve soyadınız"
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="co-phone"
                    className="text-sm font-semibold text-[var(--color-espresso)]"
                  >
                    Telefon
                  </label>
                  <input
                    id="co-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2.5 w-full min-h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-[var(--color-anthracite)] placeholder:text-[var(--color-taupe-muted)] focus:border-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/15"
                    placeholder="05xx xxx xx xx"
                  />
                </div>
                <div>
                  <label
                    htmlFor="co-email"
                    className="text-sm font-semibold text-[var(--color-espresso)]"
                  >
                    E-posta
                  </label>
                  <input
                    id="co-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2.5 w-full min-h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-[var(--color-anthracite)] placeholder:text-[var(--color-taupe-muted)] focus:border-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/15"
                    placeholder="ornek@eposta.com"
                  />
                </div>
              </div>

              <div className="border-b border-black/[0.06] pb-2 pt-2">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-taupe-muted)]">
                  Teslimat
                </h2>
              </div>
              <div>
                <label
                  htmlFor="co-address"
                  className="text-sm font-semibold text-[var(--color-espresso)]"
                >
                  Adres
                </label>
                <textarea
                  id="co-address"
                  name="address"
                  rows={3}
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2.5 w-full resize-y rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-[var(--color-anthracite)] placeholder:text-[var(--color-taupe-muted)] focus:border-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/15"
                  placeholder="Mahalle, cadde, kapı no…"
                />
              </div>
              <div>
                <label
                  htmlFor="co-city"
                  className="text-sm font-semibold text-[var(--color-espresso)]"
                >
                  Şehir
                </label>
                <input
                  id="co-city"
                  name="city"
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2.5 w-full min-h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-[var(--color-anthracite)] placeholder:text-[var(--color-taupe-muted)] focus:border-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/15"
                  placeholder="İl / ilçe"
                />
              </div>
              <div>
                <label
                  htmlFor="co-note"
                  className="text-sm font-semibold text-[var(--color-espresso)]"
                >
                  Not <span className="font-normal text-[var(--color-taupe-muted)]">(isteğe bağlı)</span>
                </label>
                <textarea
                  id="co-note"
                  name="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-2.5 w-full resize-y rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-[var(--color-anthracite)] placeholder:text-[var(--color-taupe-muted)] focus:border-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/15"
                  placeholder="Teslimat ile ilgili kısa not"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/sepet"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-white px-6 text-sm font-semibold text-[var(--color-espresso)] shadow-sm"
                >
                  Sepete dön
                </Link>
                <button
                  type="submit"
                  className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center rounded-full bg-[var(--color-espresso)] px-8 text-sm font-semibold text-white shadow-[0_12px_36px_-14px_rgba(0,0,0,0.4)] transition hover:bg-[var(--color-espresso-hover)] sm:max-w-xs"
                >
                  Ödeme altyapısı yakında
                </button>
              </div>
            </form>
          </div>

          <aside className="rounded-2xl border border-black/[0.08] bg-white/90 p-5 shadow-sm lg:sticky lg:top-28 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-taupe-muted)]">
              Neden biz
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-anthracite)]">
              {TRUST_POINTS.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]"
                    aria-hidden
                  />
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      <p className="mt-12 text-center text-xs text-[var(--color-taupe-muted)]">
        {SITE_NAME} — ödeme partneri entegrasyonu hazırlanıyor.
      </p>
    </div>
  );
}
