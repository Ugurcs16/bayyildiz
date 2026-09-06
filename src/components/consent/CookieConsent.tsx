"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";
import {
  HAS_ACTIVE_ANALYTICS,
  HAS_ACTIVE_MARKETING,
} from "@/lib/consent/catalog";
import { LEGAL_ROUTES } from "@/lib/constants";
import type { ConsentPreferences } from "@/lib/consent/storage";

function CategoryRow({
  title,
  description,
  checked,
  disabled,
  onChange,
  id,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  id: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/90 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <label htmlFor={id} className="text-sm font-semibold text-[var(--color-espresso)]">
            {title}
          </label>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-anthracite-soft)]">
            {description}
          </p>
        </div>
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 rounded border-black/20 accent-[var(--color-espresso)] disabled:opacity-60"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
      </div>
    </div>
  );
}

function PreferencesPanel({
  preferences,
  onSave,
  onCancel,
}: {
  preferences: ConsentPreferences | null;
  onSave: (input: {
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => void;
  onCancel: () => void;
}) {
  const [functional, setFunctional] = useState(preferences?.functional ?? false);
  const [analytics, setAnalytics] = useState(preferences?.analytics ?? false);
  const [marketing, setMarketing] = useState(preferences?.marketing ?? false);

  return (
    <div className="mt-4 space-y-3">
      <CategoryRow
        id="consent-essential"
        title="Zorunlu"
        description="Sepet, oturum, güvenlik ve ödeme için gerekli. Kapatılamaz."
        checked
        disabled
      />
      <CategoryRow
        id="consent-functional"
        title="İşlevsel"
        description="Favori ürün listesi gibi kolaylık sağlayan yerel depolama."
        checked={functional}
        onChange={setFunctional}
      />
      <CategoryRow
        id="consent-analytics"
        title="Analitik"
        description={
          HAS_ACTIVE_ANALYTICS
            ? "Kullanım istatistikleri ve site iyileştirme ölçümleri."
            : "Şu an Bayyıldız vitrininde aktif analitik aracı yok. Tercih ileride kullanılmak üzere saklanır."
        }
        checked={analytics}
        onChange={setAnalytics}
      />
      <CategoryRow
        id="consent-marketing"
        title="Pazarlama"
        description={
          HAS_ACTIVE_MARKETING
            ? "Reklam ve yeniden pazarlama çerezleri."
            : "Şu an Bayyıldız vitrininde aktif pazarlama / reklam izleyicisi yok. Tercih ileride kullanılmak üzere saklanır."
        }
        checked={marketing}
        onChange={setMarketing}
      />
      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <button
          type="button"
          onClick={() => onSave({ functional, analytics, marketing })}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[var(--color-espresso)] px-4 text-sm font-semibold text-white"
        >
          Tercihleri Kaydet
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-black/12 bg-white px-4 text-sm font-semibold text-[var(--color-espresso)]"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
}

export function CookieConsent() {
  const {
    ready,
    preferences,
    uiMode,
    acceptAll,
    rejectOptional,
    openPreferences,
    closePreferences,
    savePreferences,
  } = useConsent();

  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (uiMode === "hidden") return;
    const node = panelRef.current;
    const focusable = node?.querySelector<HTMLElement>(
      "button, [href], input, select, textarea",
    );
    focusable?.focus();
  }, [uiMode]);

  if (!ready || uiMode === "hidden") return null;

  const showPreferences = uiMode === "preferences";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[120] flex justify-center p-3 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:p-6 md:pb-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={panelRef}
        className="max-h-[min(78vh,40rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-black/10 bg-[var(--color-cream)] p-4 shadow-[0_20px_60px_rgba(44,24,16,0.22)] sm:p-5"
      >
        <h2
          id={titleId}
          className="font-display text-xl font-semibold tracking-tight text-[var(--color-espresso)]"
        >
          {showPreferences ? "Çerez tercihleri" : "Çerezler ve gizlilik"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
          {showPreferences
            ? "Zorunlu teknolojiler site, sepet, güvenlik ve ödeme için gereklidir. İsteğe bağlı kategorileri açıp kapatabilirsiniz."
            : "Alışveriş, sepet ve güvenli ödeme için zorunlu teknolojiler kullanılır. İsteğe bağlı depolamayı kabul edebilir veya reddedebilirsiniz."}
        </p>
        <p className="mt-2 text-xs text-[var(--color-taupe-muted)]">
          <Link
            href={LEGAL_ROUTES.privacy}
            className="underline underline-offset-2 hover:text-[var(--color-espresso)]"
          >
            Gizlilik Politikası
          </Link>
          {" · "}
          <Link
            href={LEGAL_ROUTES.cookies}
            className="underline underline-offset-2 hover:text-[var(--color-espresso)]"
          >
            Çerez Politikası
          </Link>
        </p>

        {showPreferences ? (
          <PreferencesPanel
            key={preferences?.updatedAt ?? "unset"}
            preferences={preferences}
            onSave={savePreferences}
            onCancel={closePreferences}
          />
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-espresso)] px-4 text-sm font-semibold text-white"
            >
              Tümünü Kabul Et
            </button>
            <button
              type="button"
              onClick={rejectOptional}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/12 bg-white px-4 text-sm font-semibold text-[var(--color-espresso)]"
            >
              Yalnızca Gerekli Çerezler
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-[var(--color-espresso)] underline-offset-4 hover:underline"
            >
              Tercihleri Yönet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
