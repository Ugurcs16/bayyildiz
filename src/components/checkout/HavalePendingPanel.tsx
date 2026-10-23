import { CopyFieldButton } from "@/components/checkout/CopyFieldButton";
import { formatTryFromKurus, tryAmountToKurus } from "@/lib/checkout/money";
import type { TervonaBankTransferInstructions } from "@/lib/tervona/havale-types";

/** Fixed transfer description shown to customers — not the order number. */
export const HAVALE_TRANSFER_DESCRIPTION = "Ayakkabı ücret bedeli";

export type HavalePendingPanelProps = {
  orderNumber: string;
  /** Instructions from Tervona only — never invent IBAN / beneficiary. */
  instructions: TervonaBankTransferInstructions;
};

function amountLabel(instructions: TervonaBankTransferInstructions): string {
  if (
    typeof instructions.amountDueMinor === "number" &&
    Number.isFinite(instructions.amountDueMinor)
  ) {
    return formatTryFromKurus(Math.trunc(instructions.amountDueMinor));
  }
  return formatTryFromKurus(tryAmountToKurus(instructions.amountDue));
}

function formatExpiry(iso: string | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
}

export function HavalePendingPanel({
  orderNumber,
  instructions,
}: HavalePendingPanelProps) {
  const amount = amountLabel(instructions);
  const iban = (instructions.iban ?? "").trim();
  const beneficiary = (instructions.beneficiaryName ?? "").trim();
  const expiresLabel = formatExpiry(instructions.expiresAt);

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 px-5 py-6 sm:px-6 sm:py-7">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
        Ödeme bekleniyor
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-3xl">
        Havale / EFT bilgileri
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-anthracite-soft)] sm:text-base">
        Siparişiniz oluşturuldu. Ödemenizi aşağıdaki banka bilgileriyle
        gerçekleştirebilirsiniz. Havale açıklaması olarak{" "}
        <span className="font-semibold text-[var(--color-espresso)]">
          &ldquo;{HAVALE_TRANSFER_DESCRIPTION}&rdquo;
        </span>{" "}
        bilgisini kullanabilirsiniz. Ödemeniz banka hesabında doğrulandıktan
        sonra siparişiniz hazırlanmaya başlar.
      </p>

      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex flex-col gap-2 border-b border-black/[0.06] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
              Sipariş numarası
            </dt>
            <dd className="mt-1 font-semibold tabular-nums text-[var(--color-espresso)]">
              {orderNumber}
            </dd>
          </div>
          <CopyFieldButton value={orderNumber} />
        </div>

        <div className="flex flex-col gap-1 border-b border-black/[0.06] pb-3">
          <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
            Ödenecek tutar (%5 indirimli)
          </dt>
          <dd className="text-lg font-semibold tabular-nums text-[var(--color-espresso)]">
            {amount}
          </dd>
        </div>

        <div className="flex flex-col gap-2 border-b border-black/[0.06] pb-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
              Hesap sahibi
            </dt>
            <dd className="mt-1 font-medium text-[var(--color-anthracite)]">
              {beneficiary || "—"}
            </dd>
          </div>
          <CopyFieldButton value={beneficiary} />
        </div>

        <div className="flex flex-col gap-2 border-b border-black/[0.06] pb-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
              IBAN
            </dt>
            <dd className="mt-1 break-all font-mono text-[0.9rem] font-semibold tracking-wide text-[var(--color-espresso)]">
              {iban || "—"}
            </dd>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-taupe-muted)]">
              IBAN&apos;ı kolayca kopyalayabilirsiniz.
            </p>
          </div>
          <CopyFieldButton value={iban} />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
              Havale açıklaması
            </dt>
            <dd className="mt-1 font-semibold text-[var(--color-espresso)]">
              {HAVALE_TRANSFER_DESCRIPTION}
            </dd>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-taupe-muted)]">
              Havale açıklaması olarak &ldquo;{HAVALE_TRANSFER_DESCRIPTION}&rdquo;
              bilgisini kullanabilirsiniz.
            </p>
          </div>
          <CopyFieldButton value={HAVALE_TRANSFER_DESCRIPTION} />
        </div>
      </dl>

      {expiresLabel ? (
        <p className="mt-5 rounded-xl border border-amber-200/90 bg-white/70 px-3 py-2 text-xs leading-relaxed text-[var(--color-anthracite)]">
          Ödeme süresi: <span className="font-semibold">{expiresLabel}</span>{" "}
          tarihine kadar geçerlidir. Süre dolarsa sipariş iptal edilebilir;
          dilerseniz yeniden sipariş verebilirsiniz.
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-taupe-muted)]">
        Fırat Coşkun, Bayyıldız Ayakkabı olarak Bursa Ticaret ve Sanayi Odası
        üyesidir.
      </p>

      {instructions.bankName ? (
        <p className="mt-2 text-xs text-[var(--color-taupe-muted)]">
          Banka: {instructions.bankName}
        </p>
      ) : null}
    </div>
  );
}
