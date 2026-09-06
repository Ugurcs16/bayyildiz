/**
 * Verified vs unknown business/legal fields for public legal pages.
 * Never invent tax/MERSIS/ünvan — use placeholders when unknown.
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

/** Brand display name — not confirmed as legal company title (ünvan). */
export const LEGAL_BRAND_NAME = SITE_NAME;

export const LEGAL_PLACEHOLDERS = {
  companyTitle: "[ŞİRKET ÜNVANI EKLENECEK]",
  taxOffice: "[VERGİ DAİRESİ EKLENECEK]",
  taxNumber: "[VERGİ NUMARASI EKLENECEK]",
  mersis: "[MERSİS NUMARASI EKLENECEK]",
  tradeRegistry: "[TİCARET SİCİL BİLGİSİ EKLENECEK]",
  legalEmail: "[KEP / GİZLİLİK E-POSTASI EKLENECEK]",
  registeredAddress: "[ŞİRKET MERKEZ ADRESİ EKLENECEK]",
  returnAddress: "[İADE ADRESİ EKLENECEK]",
} as const;

export const VERIFIED_CONTACT = {
  brand: LEGAL_BRAND_NAME,
  foundedYear: 1989,
  city: "Bursa",
  stores: STORES,
  whatsappDisplay: WHATSAPP_DISPLAY,
  whatsappE164: WHATSAPP_NUMBER,
  whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}`,
  instagramHandle: INSTAGRAM_HANDLE,
  instagramUrl: INSTAGRAM_URL,
  storePhones: STORES.map((s) => ({ name: s.name, phone: s.phone, href: s.phoneHref })),
} as const;

export const UNKNOWN_LEGAL_FIELDS = [
  "Şirket unvanı",
  "Vergi dairesi",
  "Vergi numarası",
  "MERSİS numarası",
  "Ticaret sicil bilgisi",
  "Şirket merkez adresi (yasal)",
  "İade / resmi yazışma adresi",
  "KVKK / gizlilik e-posta veya KEP",
] as const;

export const LEGAL_REVIEW_ITEMS = [
  "Şartlar, gizlilik ve mesafeli satış metinlerinin avukat incelemesi",
  "Tüketici cayma / iade sürelerinin mevzuata uygun netleştirilmesi",
  "TCKN’nin Tervona / iyzico tarafındaki saklama sürelerinin doğrulanması",
  "Şirket kimlik bilgilerinin (ünvan, VKN, MERSİS) yer tutucularının doldurulması",
] as const;
