"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConsentCategory } from "@/lib/consent/catalog";
import {
  acceptAllPreferences,
  categoryAllowed,
  clearOptionalFirstPartyStorage,
  createPreferences,
  necessaryOnlyPreferences,
  readConsentFromLocalStorage,
  writeConsentToLocalStorage,
  type ConsentPreferences,
} from "@/lib/consent/storage";

type ConsentUiMode = "hidden" | "banner" | "preferences";

type ConsentContextValue = {
  ready: boolean;
  preferences: ConsentPreferences | null;
  uiMode: ConsentUiMode;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (input: {
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => void;
  allows: (category: ConsentCategory) => boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [uiMode, setUiMode] = useState<ConsentUiMode>("hidden");

  useEffect(() => {
    // Client-only hydrate from localStorage (same pattern as cart persistence).
    const decision = readConsentFromLocalStorage();
    if (decision.status === "set") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount hydrate
      setPreferences(decision.preferences);
      setUiMode("hidden");
    } else {
      setPreferences(null);
      setUiMode("banner");
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: ConsentPreferences) => {
    writeConsentToLocalStorage(next);
    clearOptionalFirstPartyStorage(next);
    setPreferences(next);
    setUiMode("hidden");
  }, []);

  const acceptAll = useCallback(() => {
    persist(acceptAllPreferences());
  }, [persist]);

  const rejectOptional = useCallback(() => {
    persist(necessaryOnlyPreferences());
  }, [persist]);

  const savePreferences = useCallback(
    (input: { functional: boolean; analytics: boolean; marketing: boolean }) => {
      persist(createPreferences(input));
    },
    [persist],
  );

  const openPreferences = useCallback(() => {
    setUiMode("preferences");
  }, []);

  const closePreferences = useCallback(() => {
    setUiMode(preferences ? "hidden" : "banner");
  }, [preferences]);

  const allows = useCallback(
    (category: ConsentCategory) => categoryAllowed(preferences, category),
    [preferences],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      ready,
      preferences,
      uiMode,
      openPreferences,
      closePreferences,
      acceptAll,
      rejectOptional,
      savePreferences,
      allows,
    }),
    [
      ready,
      preferences,
      uiMode,
      openPreferences,
      closePreferences,
      acceptAll,
      rejectOptional,
      savePreferences,
      allows,
    ],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent within ConsentProvider");
  return ctx;
}
