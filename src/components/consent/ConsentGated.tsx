"use client";

import type { ReactNode } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";
import type { ConsentCategory } from "@/lib/consent/catalog";

/**
 * Extension point for future analytics/marketing scripts.
 * Renders children only when the category is allowed after consent.
 * Currently no third-party trackers ship in the storefront.
 */
export function ConsentGated({
  category,
  children,
}: {
  category: Exclude<ConsentCategory, "essential">;
  children: ReactNode;
}) {
  const { ready, allows } = useConsent();
  if (!ready || !allows(category)) return null;
  return <>{children}</>;
}
