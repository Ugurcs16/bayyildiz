"use client";

import { CartProvider } from "./cart-context";
import { FavoritesProvider } from "./favorites-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </CartProvider>
  );
}
