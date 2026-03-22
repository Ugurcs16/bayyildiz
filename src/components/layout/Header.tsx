"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

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
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[var(--color-cream)]/92 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Link
          href="/"
          className="group shrink-0"
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
          className="hidden items-center gap-0.5 lg:flex"
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

      <div
        id="mobile-nav-overlay"
        className={`fixed inset-0 top-[3.75rem] z-40 flex flex-col bg-[var(--color-cream)]/98 backdrop-blur-lg transition-[visibility,opacity] duration-200 sm:top-[4.25rem] lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <nav
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-1 overflow-y-auto px-4 py-6 sm:px-6"
          aria-label="Mobil menü"
        >
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
        <p className="border-t border-black/[0.06] px-6 py-4 text-center text-xs text-[var(--color-anthracite-soft)]">
          İki mağaza · WhatsApp ile hızlı iletişim
        </p>
      </div>
    </header>
  );
}
