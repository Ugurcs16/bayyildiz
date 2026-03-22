"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isHash = href.includes("#");
  const active =
    href === "/"
      ? pathname === "/" && !isHash
      : isHash
        ? false
        : pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[color-mix(in_srgb,var(--color-espresso)_12%,transparent)] text-[var(--color-espresso)]"
          : "text-[var(--color-anthracite-soft)] hover:bg-black/5 hover:text-[var(--color-espresso)]"
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--color-cream)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-semibold tracking-tight text-[var(--color-espresso)]"
          onClick={() => setOpen(false)}
        >
          <span className="text-base sm:text-lg">{SITE_NAME}</span>
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
            />
          ))}
        </nav>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-black/10 bg-white/90 p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menü</span>
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span
              className={`block h-0.5 w-6 rounded-full bg-[var(--color-espresso)] transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-[var(--color-espresso)] transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-[var(--color-espresso)] transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-black/5 bg-[var(--color-cream)] lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6"
          aria-label="Mobil menü"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}
