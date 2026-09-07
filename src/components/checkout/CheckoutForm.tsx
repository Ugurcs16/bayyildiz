"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/providers/cart-context";
import type { CartLine } from "@/components/providers/cart-context";
import type { CartValidationIssue } from "@/lib/cart-revalidate";
import {
  clientCartFingerprint,
  readOrCreateCheckoutAttemptKey,
} from "@/lib/checkout/client-idempotency";
import {
  isValidIdentityNumber,
  normalizeIdentityNumber,
} from "@/lib/checkout/identity-number";
import { SITE_NAME } from "@/lib/constants";
import {
  publicCartLineLabel,
  publicVariantSkuLabel,
} from "@/lib/public-product-identity";
import { formatTry } from "@/lib/woocommerce";

let checkoutPlaceInFlight = false;

const TRUST_POINTS = [
  "Hakiki deri ürünler",
  "Bursa mağaza güvencesi",
  "Kolay değişim / iade",
] as const;

const fieldClass =
  "mt-2.5 w-full min-h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-[var(--color-anthracite)] placeholder:text-[var(--color-taupe-muted)] focus:border-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/15";

type PlaceResponse = {
  error?: string;
  code?: string;
  status?: string;
  paymentPageUrl?: string;
  orderNumber?: string;
  items?: CartLine[];
  issues?: CartValidationIssue[];
};

export function CheckoutForm() {
  const { items, subtotal, totalQuantity, replaceItems } = useCart();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<CartValidationIssue[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const lock = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await fetch("/api/customer/auth/me", { cache: "no-store" });
        if (!me.ok) return;
        const body = (await me.json()) as {
          customer?: {
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
          };
        };
        if (cancelled || !body.customer) return;
        setSignedIn(true);
        setFirstName((value) => value || body.customer?.firstName || "");
        setLastName((value) => value || body.customer?.lastName || "");
        setEmail((value) => value || body.customer?.email || "");
        setPhone((value) => value || body.customer?.phone || "");
        const addresses = await fetch("/api/customer/addresses", {
          cache: "no-store",
        });
        if (!addresses.ok) return;
        const list = (await addresses.json()) as {
          addresses?: Array<{
            firstName?: string;
            lastName?: string;
            phone?: string;
            city?: string;
            district?: string;
            addressLine?: string;
          }>;
        };
        const first = list.addresses?.[0];
        if (!first || cancelled) return;
        setFirstName((value) => value || first.firstName || "");
        setLastName((value) => value || first.lastName || "");
        setPhone((value) => value || first.phone || "");
        setCity((value) => value || first.city || "");
        setDistrict((value) => value || first.district || "");
        setAddress((value) => value || first.addressLine || "");
      } catch {
        /* guest checkout remains available */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (checkoutPlaceInFlight) {
      lock.current = true;
      setSubmitting(true);
    }
  }, []);

  const empty = items.length === 0;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (checkoutPlaceInFlight || lock.current || submitting || empty) return;

    const tckn = normalizeIdentityNumber(identityNumber);
    if (!isValidIdentityNumber(tckn)) {
      setError("T.C. Kimlik No 11 haneli olmalıdır.");
      return;
    }

    checkoutPlaceInFlight = true;
    lock.current = true;
    setSubmitting(true);
    setError(null);
    setIssues([]);

    const checkoutAttemptKey = readOrCreateCheckoutAttemptKey(
      clientCartFingerprint(items),
    );

    const payload = {
      items,
      identityNumber: tckn,
      checkoutAttemptKey,
      customer: {
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
      },
      shippingAddress: {
        addressLine1: address,
        city,
        district,
      },
    };

    let holdLock = false;
    try {
      const response = await fetch("/api/checkout/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => ({}))) as PlaceResponse;

      if (response.status === 409) {
        if (body.code === "PAYMENT_IN_PROGRESS") {
          setError(
            body.error ||
              "Ödeme zaten başlatılıyor. Lütfen bekleyin.",
          );
          return;
        }
        if (Array.isArray(body.items) && body.issues) {
          replaceItems(body.items);
        }
        setIssues(Array.isArray(body.issues) ? body.issues : []);
        setError(
          body.error ||
            "Stok değişti. Lütfen sepetinizi kontrol edip tekrar deneyin.",
        );
        return;
      }

      if (!response.ok) {
        setError(body.error || "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
        return;
      }

      if (body.status === "paid") {
        const order = body.orderNumber
          ? `?order=${encodeURIComponent(body.orderNumber)}`
          : "";
        holdLock = true;
        window.location.assign(`/odeme/sonuc${order}`);
        return;
      }

      if (body.paymentPageUrl) {
        holdLock = true;
        window.location.assign(body.paymentPageUrl);
        return;
      }

      setError("Ödeme sayfası alınamadı. Lütfen tekrar deneyin.");
    } catch {
      setError("Bağlantı hatası. Sepetiniz korundu; lütfen tekrar deneyin.");
    } finally {
      if (!holdLock) {
        checkoutPlaceInFlight = false;
        lock.current = false;
        setSubmitting(false);
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="inline-flex rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-900">
        Misafir alışveriş · Hesap gerekmez
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        Teslimat ve ödeme
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-anthracite-soft)] sm:text-base">
        Teslimat bilgilerinizi girin. Kart bilgileri Bayyıldız sayfasında alınmaz;
        güvenli ödeme sayfasına yönlendirilirsiniz.
      </p>
      <p className="mt-3 text-sm text-[var(--color-anthracite-soft)]">
        {signedIn ? (
          "Hesabınızla devam ediyorsunuz. Teslimat adresiniz doldurulduysa kontrol edin."
        ) : (
          <>
            Zaten hesabınız var mı?{" "}
            <Link
              href="/giris?next=/odeme"
              className="font-semibold text-[var(--color-espresso)] underline-offset-2 hover:underline"
            >
              Giriş yap
            </Link>
          </>
        )}
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
                        {publicCartLineLabel(line)}
                      </span>
                      <span className="text-[var(--color-taupe-muted)]">
                        {" "}
                        · {line.size}
                      </span>
                      {publicVariantSkuLabel(line.variantSku) ? (
                        <span className="mt-0.5 block font-mono text-[0.7rem] tracking-wide text-[var(--color-taupe-muted)]">
                          {publicVariantSkuLabel(line.variantSku)}
                        </span>
                      ) : null}
                      <span className="block text-xs text-[var(--color-taupe-muted)]">
                        × {line.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-[var(--color-espresso)]">
                      {formatTry(
                        String(
                          (Number.parseFloat(line.price) || 0) * line.quantity,
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
              <p className="mt-3 text-xs text-[var(--color-taupe-muted)]">
                Gösterilen tutar sepet özetidir. Tahsilat Tervona sipariş
                toplamına göre yapılır.
              </p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="border-b border-black/[0.06] pb-2">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-taupe-muted)]">
                  İletişim
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-first" className="text-sm font-semibold text-[var(--color-espresso)]">
                    Ad
                  </label>
                  <input
                    id="co-first"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="co-last" className="text-sm font-semibold text-[var(--color-espresso)]">
                    Soyad
                  </label>
                  <input
                    id="co-last"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-phone" className="text-sm font-semibold text-[var(--color-espresso)]">
                    Telefon
                  </label>
                  <input
                    id="co-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={fieldClass}
                    placeholder="05xx xxx xx xx"
                  />
                </div>
                <div>
                  <label htmlFor="co-email" className="text-sm font-semibold text-[var(--color-espresso)]">
                    E-posta
                  </label>
                  <input
                    id="co-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass}
                    placeholder="ornek@eposta.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="co-tckn" className="text-sm font-semibold text-[var(--color-espresso)]">
                  T.C. Kimlik No
                </label>
                <input
                  id="co-tckn"
                  name="identityNumber"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  maxLength={11}
                  pattern="[0-9]{11}"
                  value={identityNumber}
                  onChange={(e) =>
                    setIdentityNumber(normalizeIdentityNumber(e.target.value).slice(0, 11))
                  }
                  className={fieldClass}
                  placeholder="11 haneli kimlik numarası"
                  aria-describedby="co-tckn-hint"
                />
                <p id="co-tckn-hint" className="mt-2 text-xs text-[var(--color-taupe-muted)]">
                  Ödeme sağlayıcısı için zorunludur. Sadece bu işlemde kullanılır; adreste
                  saklanmaz.
                </p>
              </div>

              <div className="border-b border-black/[0.06] pb-2 pt-2">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-taupe-muted)]">
                  Teslimat
                </h2>
              </div>
              <div>
                <label htmlFor="co-address" className="text-sm font-semibold text-[var(--color-espresso)]">
                  Adres
                </label>
                <textarea
                  id="co-address"
                  name="address"
                  rows={3}
                  autoComplete="street-address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`${fieldClass} resize-y py-3`}
                  placeholder="Mahalle, cadde, kapı no…"
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-city" className="text-sm font-semibold text-[var(--color-espresso)]">
                    İl
                  </label>
                  <input
                    id="co-city"
                    name="city"
                    autoComplete="address-level1"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={fieldClass}
                    placeholder="Bursa"
                  />
                </div>
                <div>
                  <label htmlFor="co-district" className="text-sm font-semibold text-[var(--color-espresso)]">
                    İlçe
                  </label>
                  <input
                    id="co-district"
                    name="district"
                    autoComplete="address-level2"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={fieldClass}
                    placeholder="Osmangazi"
                  />
                </div>
              </div>

              {issues.length > 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
                  <p className="font-semibold">Stok güncellendi</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {issues.map((issue) => (
                      <li key={`${issue.key}-${issue.action}`}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-900" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/sepet"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-white px-6 text-sm font-semibold text-[var(--color-espresso)] shadow-sm"
                >
                  Sepete dön
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center rounded-full bg-[var(--color-espresso)] px-8 text-sm font-semibold text-white shadow-[0_12px_36px_-14px_rgba(0,0,0,0.4)] transition hover:bg-[var(--color-espresso-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-xs"
                >
                  {submitting ? "Ödeme sayfasına yönlendiriliyorsunuz…" : "Ödemeye geç"}
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
            <p className="mt-5 text-xs leading-relaxed text-[var(--color-taupe-muted)]">
              Kart numarası ve CVV bu sitede işlenmez. Ödeme iyzico Checkout Form
              üzerinden alınır.
            </p>
          </aside>
        </div>
      )}

      <p className="mt-12 text-center text-xs text-[var(--color-taupe-muted)]">
        {SITE_NAME} — güvenli ödeme
      </p>
    </div>
  );
}
