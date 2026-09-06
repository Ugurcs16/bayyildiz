import type { ReactNode } from "react";
import { LEGAL_UPDATED_AT } from "@/lib/legal/business";

export function LegalDocument({
  title,
  children,
  intro,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-[var(--color-taupe-muted)]">
        Son güncelleme: {LEGAL_UPDATED_AT}
      </p>
      {intro ? (
        <p className="mt-6 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
          {intro}
        </p>
      ) : null}
      <div className="mt-10 space-y-8 text-base leading-relaxed text-[var(--color-anthracite-soft)] [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--color-espresso)] [&_h2]:sm:text-2xl [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_p]:mt-3 [&_address]:not-italic">
        {children}
      </div>
    </article>
  );
}
