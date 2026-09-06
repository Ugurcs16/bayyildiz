import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  type ConsentCategory,
} from "@/lib/consent/catalog";

export type ConsentPreferences = {
  version: number;
  updatedAt: string;
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentDecision =
  | { status: "unknown" }
  | { status: "set"; preferences: ConsentPreferences };

export function createPreferences(input: {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}): ConsentPreferences {
  return {
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
    essential: true,
    functional: input.functional,
    analytics: input.analytics,
    marketing: input.marketing,
  };
}

export function acceptAllPreferences(): ConsentPreferences {
  return createPreferences({
    functional: true,
    analytics: true,
    marketing: true,
  });
}

export function necessaryOnlyPreferences(): ConsentPreferences {
  return createPreferences({
    functional: false,
    analytics: false,
    marketing: false,
  });
}

export function parseConsentRaw(raw: string | null | undefined): ConsentDecision {
  if (!raw) return { status: "unknown" };
  try {
    const data = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (typeof data.version !== "number" || data.version !== CONSENT_VERSION) {
      return { status: "unknown" };
    }
    if (data.essential !== true) return { status: "unknown" };
    if (
      typeof data.functional !== "boolean" ||
      typeof data.analytics !== "boolean" ||
      typeof data.marketing !== "boolean"
    ) {
      return { status: "unknown" };
    }
    return {
      status: "set",
      preferences: {
        version: CONSENT_VERSION,
        updatedAt:
          typeof data.updatedAt === "string"
            ? data.updatedAt
            : new Date().toISOString(),
        essential: true,
        functional: data.functional,
        analytics: data.analytics,
        marketing: data.marketing,
      },
    };
  } catch {
    return { status: "unknown" };
  }
}

export function readConsentFromLocalStorage(): ConsentDecision {
  if (typeof window === "undefined") return { status: "unknown" };
  try {
    return parseConsentRaw(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return { status: "unknown" };
  }
}

export function writeConsentToLocalStorage(preferences: ConsentPreferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
}

/** Clear optional first-party storage when consent is withdrawn. Never touches cart/auth/checkout. */
export function clearOptionalFirstPartyStorage(prefs: ConsentPreferences): void {
  if (typeof window === "undefined") return;
  try {
    if (!prefs.functional) {
      window.localStorage.removeItem("bayyildiz-favorites-v1");
    }
    // Analytics / marketing: no first-party optional cookies currently exist.
  } catch {
    // ignore
  }
}

export function categoryAllowed(
  prefs: ConsentPreferences | null,
  category: ConsentCategory,
): boolean {
  if (category === "essential") return true;
  if (!prefs) return false;
  if (category === "functional") return prefs.functional;
  if (category === "analytics") return prefs.analytics;
  if (category === "marketing") return prefs.marketing;
  return false;
}
