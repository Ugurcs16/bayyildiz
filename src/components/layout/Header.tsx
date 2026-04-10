"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/cart-context";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

function CartHeaderButton({ onNavigate }: { onNavigate?: () => void }) {
  const { totalQuantity } = useCart();
  const count = totalQuantity > 99 ? "99+" : String(totalQuantity);

  return (
    <Link
      href="/sepet"
      onClick={onNavigate}
      className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 p-2 text-[var(--color-espresso)] shadow-sm transition-colors hover:bg-white"
      aria-label={totalQuantity > 0 ? `Sepet, ${totalQuantity} ürün` : "Sepet"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[1.15rem] w-[1.15rem]"
        aria-hidden
      >
        <path d="M6 7h15l-1.5 9h-12z" />
        <path d="M6 7 5 3H2" />
        <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        <path d="M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
      {totalQuantity > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-[var(--color-espresso)] px-0.5 text-[0.625rem] font-bold leading-none text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function MobileSepetRow({ onNavigate }: { onNavigate: () => void }) {
  const { totalQuantity } = useCart();
  const count = totalQuantity > 99 ? "99+" : String(totalQuantity);

  return (
    <Link
      href="/sepet"
      onClick={onNavigate}
      className="mb-2 flex min-h-12 items-center justify-between rounded-2xl border border-black/8 bg-white/90 px-4 py-3 text-base font-semibold text-[var(--color-espresso)] shadow-sm"
    >
      <span>Sepet</span>
      {totalQuantity > 0 ? (
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--color-espresso)] px-2 text-sm text-white">
          {count}
        </span>
      ) : (
        <span className="text-xs font-medium text-[var(--color-taupe-muted)]">
          Boş
        </span>
      )}
    </Link>
  );
}

function NavLink({
  href,
  label,
  onNavigate,
  variant = "desktop",
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const isHash = href.includes("#");
  const active =
    href === "/"
      ? pathname === "/" && !isHash
      : isHash
        ? false
        : pathname === href;

  const base =
    variant === "mobile"
      ? "rounded-2xl px-4 py-3.5 text-base font-semibold tracking-wide"
      : "rounded-full px-3.5 py-2 text-[0.8125rem] font-medium tracking-wide";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`${base} transition-colors ${
        active
          ? "bg-[color-mix(in_srgb,var(--color-espresso)_14%,transparent)] text-[var(--color-espresso)]"
          : "text-[var(--color-anthracite-soft)] hover:bg-black/[0.06] hover:text-[var(--color-espresso)]"
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-[110] border-b border-black/[0.06] bg-[var(--color-cream)]/92 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="group min-w-0 shrink-0"
          onClick={() => setOpen(false)}
        >
          <span className="font-display block text-[1.35rem] font-semibold leading-none tracking-tight text-[var(--color-espresso)] sm:text-2xl">
            {SITE_NAME}
          </span>
          <span className="mt-1 block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[var(--color-taupe-muted)] sm:text-[0.7rem]">
            Bursa · Hakiki deri
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Ana menü"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              variant="desktop"
            />
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <CartHeaderButton />
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 p-2 shadow-sm transition-colors hover:bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav-overlay"
            onClick={() => setOpen((v) => !v)}
          >
          <span className="sr-only">Menü</span>
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span
              className={`block h-0.5 w-[1.35rem] rounded-full bg-[var(--color-espresso)] transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-[1.35rem] rounded-full bg-[var(--color-espresso)] transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-[1.35rem] rounded-full bg-[var(--color-espresso)] transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
        </div>
      </div>
    </header>

    <div
      id="mobile-nav-overlay"
      className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-200 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Menüyü kapat"
        onClick={() => setOpen(false)}
      />
      <div className="absolute left-0 right-0 top-[3.75rem] bottom-0 flex flex-col bg-[var(--color-cream)] shadow-[0_-4px_32px_rgba(0,0,0,0.12)] sm:top-[4.25rem]">
        <nav
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-1 overflow-y-auto px-4 py-6 sm:px-6"
          aria-label="Mobil menü"
        >
          <MobileSepetRow onNavigate={() => setOpen(false)} />
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              variant="mobile"
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>
        <p className="border-t border-black/[0.06] bg-[var(--color-cream)] px-6 py-4 text-center text-xs text-[var(--color-anthracite-soft)]">
          İki mağaza · WhatsApp ile hızlı iletişim
        </p>
      </div>
    </div>
    </>
  );
}
