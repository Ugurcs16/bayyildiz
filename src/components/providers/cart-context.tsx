"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "bayyildiz-cart-v1";

export type CartLine = {
  key: string;
  productId: number;
  variationId?: number;
  quantity: number;
  name: string;
  slug: string;
  image: string;
  price: string;
};

type CartContextValue = {
  items: CartLine[];
  addItem: (line: Omit<CartLine, "key"> & { key?: string }) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  totalQuantity: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function makeKey(productId: number, variationId?: number) {
  return `${productId}-${variationId ?? "s"}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const addItem = useCallback(
    (line: Omit<CartLine, "key"> & { key?: string }) => {
      const key = line.key ?? makeKey(line.productId, line.variationId);
      setItems((prev) => {
        const next = [...prev];
        const i = next.findIndex((x) => x.key === key);
        if (i >= 0) {
          next[i] = {
            ...next[i],
            quantity: next[i].quantity + line.quantity,
          };
          return next;
        }
        return [...next, { ...line, key }];
      });
    },
    [],
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((x) => x.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((x) => (x.key === key ? { ...x, quantity } : x))
        .filter((x) => x.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalQuantity = useMemo(
    () => items.reduce((s, x) => s + x.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalQuantity,
    }),
    [items, addItem, removeItem, setQuantity, clear, totalQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
