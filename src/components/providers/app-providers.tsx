"use client";

import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { CartProvider } from "./cart-context";
import { FavoritesProvider } from "./favorites-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
          <CookieConsent />
        </FavoritesProvider>
      </CartProvider>
    </ConsentProvider>
  );
}
