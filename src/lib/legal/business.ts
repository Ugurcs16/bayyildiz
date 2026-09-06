/**
 * Verified customer-facing Bayyıldız contact used on public legal pages.
 * Do not invent tax / MERSİS / company title for the storefront UI.
 */

import {
  SITE_NAME,
  STORES,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from "@/lib/constants";

export const LEGAL_UPDATED_AT = "6 Eylül 2026";

export const LEGAL_BRAND_NAME = SITE_NAME;

export const VERIFIED_CONTACT = {
  brand: LEGAL_BRAND_NAME,
  foundedYear: 1989,
  city: "Bursa",
  stores: STORES,
  heykel: STORES[0],
  fsm: STORES[1],
  whatsappDisplay: WHATSAPP_DISPLAY,
  whatsappE164: WHATSAPP_NUMBER,
  whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}`,
  instagramHandle: INSTAGRAM_HANDLE,
  instagramUrl: INSTAGRAM_URL,
} as const;
