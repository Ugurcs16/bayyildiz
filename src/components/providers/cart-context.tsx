"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "bayyildiz-cart-v2";

export type CartLine = {
  key: string;
  /** Tervona / katalog ürün kimliği. */
  productId: string;
  /** Tervona varyant kimliği. */
  variationId: string;
  name: string;
  slug: string;
  /** Model kodu (ör. aile SKU). */
  model: string;
  /** Seçilen numara / beden. */
  size: string;
  /** Varyant SKU. */
  variantSku: string;
  image: string;
  /** Birim fiyat, ondalık string. */
  price: string;
  quantity: number;
  /** Son bilinen canlı stok tavanı (Tervona availableStock). */
  availableStock?: number;
};

type CartContextValue = {
  items: CartLine[];
  addItem: (line: Omit<CartLine, "key"> & { key?: string }) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  replaceItems: (items: CartLine[]) => void;
  clear: () => void;
  totalQuantity: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function cartLineKey(productId: string, variationId: string) {
  return `${productId}::${variationId}`;
}

function parsePrice(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function clampQty(qty: number, availableStock?: number): number {
  const base = Math.max(0, Math.floor(qty));
  if (availableStock == null) return base;
  return Math.min(base, Math.max(0, availableStock));
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
      const key = line.key ?? cartLineKey(line.productId, line.variationId);
      setItems((prev) => {
        const next = [...prev];
        const i = next.findIndex((x) => x.key === key);
        if (i >= 0) {
          const mergedQty = next[i].quantity + line.quantity;
          const cap = line.availableStock ?? next[i].availableStock;
          next[i] = {
            ...next[i],
            ...line,
            key,
            availableStock: cap,
            quantity: clampQty(mergedQty, cap),
          };
          return next;
        }
        const qty = clampQty(line.quantity, line.availableStock);
        if (qty <= 0) return prev;
        return [...next, { ...line, key, quantity: qty }];
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
        .map((x) =>
          x.key === key
            ? { ...x, quantity: clampQty(quantity, x.availableStock) }
            : x,
        )
        .filter((x) => x.quantity > 0),
    );
  }, []);

  const replaceItems = useCallback((next: CartLine[]) => {
    setItems(next);
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalQuantity = useMemo(
    () => items.reduce((s, x) => s + x.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((s, x) => s + parsePrice(x.price) * x.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      replaceItems,
      clear,
      totalQuantity,
      subtotal,
    }),
    [
      items,
      addItem,
      removeItem,
      setQuantity,
      replaceItems,
      clear,
      totalQuantity,
      subtotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
