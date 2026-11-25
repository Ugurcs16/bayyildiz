"use client";

type Props = {
  inputValue: string;
  onInputChange: (value: string) => void;
  appliedCode: string | null;
  applying: boolean;
  disabled?: boolean;
  error: string | null;
  successMessage: string | null;
  onApply: () => void;
  onRemove: () => void;
};

const fieldClass =
  "min-h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm uppercase tracking-wide text-[var(--color-anthracite)] placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--color-taupe-muted)] focus:border-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/15 disabled:opacity-60";

export function CouponCodeField({
  inputValue,
  onInputChange,
  appliedCode,
  applying,
  disabled,
  error,
  successMessage,
  onApply,
  onRemove,
}: Props) {
  const locked = Boolean(appliedCode);

  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white/90 p-4 sm:p-5">
      <p className="text-sm font-semibold text-[var(--color-espresso)]">
        İndirim kodunuz var mı?
      </p>
      <p className="mt-1 text-xs text-[var(--color-taupe-muted)]">
        Kodunuz varsa girip uygulayın. Kampanya koşulları ödeme yöntemine göre
        değişebilir.
      </p>

      {locked ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-950">
              Kod uygulandı:{" "}
              <span className="font-mono tracking-wide">{appliedCode}</span>
            </p>
            {successMessage ? (
              <p className="mt-1 text-xs text-emerald-900">{successMessage}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled || applying}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-300/80 bg-white px-4 text-xs font-semibold text-emerald-950 disabled:opacity-60"
          >
            Kaldır
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <label className="sr-only" htmlFor="co-coupon">
            İndirim kodu
          </label>
          <input
            id="co-coupon"
            name="couponCode"
            autoComplete="off"
            spellCheck={false}
            value={inputValue}
            disabled={disabled || applying}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!applying && !disabled) onApply();
              }
            }}
            className={fieldClass}
            placeholder="İndirim kodu"
            maxLength={40}
          />
          <button
            type="button"
            onClick={onApply}
            disabled={disabled || applying || !inputValue.trim()}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-espresso)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--color-espresso-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {applying ? "Uygulanıyor…" : "Uygula"}
          </button>
        </div>
      )}

      {error ? (
        <p
          className="mt-3 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-900"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
