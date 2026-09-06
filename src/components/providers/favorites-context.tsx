"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useConsent } from "@/components/consent/ConsentProvider";

const STORAGE_KEY = "bayyildiz-favorites-v1";

type FavoritesContextValue = {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { ready: consentReady, allows } = useConsent();
  const functionalAllowed = allows("functional");
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!consentReady) return;
    if (!functionalAllowed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- favorites reset when functional consent off
      setIds([]);
      setReady(true);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setIds(JSON.parse(raw) as number[]);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [consentReady, functionalAllowed]);

  useEffect(() => {
    if (!ready || !consentReady) return;
    if (!functionalAllowed) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids, ready, consentReady, functionalAllowed]);

  const toggle = useCallback((id: number) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const has = useCallback((id: number) => ids.includes(id), [ids]);

  const value = useMemo(() => ({ ids, toggle, has }), [ids, toggle, has]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites within FavoritesProvider");
  return ctx;
}
