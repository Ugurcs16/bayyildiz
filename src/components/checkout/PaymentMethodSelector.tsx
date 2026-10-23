"use client";

import type { CheckoutPaymentMethod } from "@/lib/checkout/payment-method";

type Props = {
  value: CheckoutPaymentMethod;
  onChange: (method: CheckoutPaymentMethod) => void;
  disabled?: boolean;
};

const optionClass = (active: boolean) =>
  [
    "flex w-full cursor-pointer flex-col gap-1 rounded-2xl border px-4 py-4 text-left transition",
    active
      ? "border-[var(--color-espresso)] bg-[var(--color-cream-dark)]/50 ring-2 ring-[var(--color-espresso)]/20"
      : "border-black/10 bg-white hover:border-black/20",
  ].join(" ");

export function PaymentMethodSelector({ value, onChange, disabled }: Props) {
  return (
    <fieldset disabled={disabled} className="space-y-3">
      <legend className="text-sm font-semibold uppercase tracking-widest text-[var(--color-taupe-muted)]">
        Ödeme yöntemi
      </legend>

      <label className={optionClass(value === "card")}>
        <span className="flex items-start gap-3">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={value === "card"}
            onChange={() => onChange("card")}
            className="mt-1 h-4 w-4 accent-[var(--color-espresso)]"
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-[var(--color-espresso)]">
              Kredi / Banka Kartı
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-[var(--color-anthracite-soft)]">
              iyzico güvenli ödeme sayfasına yönlendirilirsiniz. Kart bilgisi bu
              sitede alınmaz.
            </span>
          </span>
        </span>
      </label>

      <label className={optionClass(value === "bank_transfer")}>
        <span className="flex items-start gap-3">
          <input
            type="radio"
            name="paymentMethod"
            value="bank_transfer"
            checked={value === "bank_transfer"}
            onChange={() => onChange("bank_transfer")}
            className="mt-1 h-4 w-4 accent-[var(--color-espresso)]"
          />
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[var(--color-espresso)]">
                Havale / EFT ile Öde
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-900 ring-1 ring-emerald-200/80">
                %5 İndirim
              </span>
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-[var(--color-anthracite-soft)]">
              Sipariş sonrası IBAN ve ödeme açıklaması gösterilir. Onay manuel
              yapılır; iyzico çağrılmaz.
            </span>
          </span>
        </span>
      </label>
    </fieldset>
  );
}
