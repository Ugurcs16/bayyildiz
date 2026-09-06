/**
 * Cookie / storage classification from repository audit (Phase 1).
 * No analytics or marketing trackers were found in the codebase.
 */

export type ConsentCategory = "essential" | "functional" | "analytics" | "marketing";

export type StorageKind = "cookie" | "localStorage" | "sessionStorage";

export type TechnologyRecord = {
  id: string;
  name: string;
  category: ConsentCategory;
  kind: StorageKind;
  party: "first" | "third";
  purpose: string;
  /** Technical duration when known; otherwise session/persistent. */
  duration: string;
  essentialReason?: string;
};

export const CONSENT_VERSION = 1;

export const CONSENT_STORAGE_KEY = "bayyildiz_cookie_consent_v1";

export const TECHNOLOGY_CATALOG: TechnologyRecord[] = [
  {
    id: "consent",
    name: CONSENT_STORAGE_KEY,
    category: "essential",
    kind: "localStorage",
    party: "first",
    purpose: "Çerez ve depolama tercihlerinizi hatırlamak",
    duration: "Kalıcı (tercih silinene veya sürüm değişene kadar)",
    essentialReason: "Tercihinizin saklanması için gerekli",
  },
  {
    id: "cart",
    name: "bayyildiz-cart-v3",
    category: "essential",
    kind: "localStorage",
    party: "first",
    purpose: "Sepet içeriğini cihazınızda tutmak",
    duration: "Kalıcı (sepet temizlenene kadar)",
    essentialReason: "Alışveriş sepeti hizmeti",
  },
  {
    id: "customer-session",
    name: "bayyildiz_customer_session",
    category: "essential",
    kind: "cookie",
    party: "first",
    purpose: "Müşteri oturumu (giriş)",
    duration: "Oturum süresine bağlı (genellikle en fazla 30 gün)",
    essentialReason: "Hesap güvenliği ve kimlik doğrulama",
  },
  {
    id: "checkout-access",
    name: "bayyildiz_checkout_access",
    category: "essential",
    kind: "cookie",
    party: "first",
    purpose: "Misafir ödeme sonucu sayfasına güvenli erişim",
    duration: "Yaklaşık 2 saat",
    essentialReason: "Ödeme sonucu / sipariş erişimi",
  },
  {
    id: "checkout-idem",
    name: "bayyildiz_checkout_idem",
    category: "essential",
    kind: "cookie",
    party: "first",
    purpose: "Çift sipariş / ödeme denemesini önlemek (idempotency)",
    duration: "Yaklaşık 2 saat",
    essentialReason: "Güvenli ödeme akışı",
  },
  {
    id: "checkout-attempt",
    name: "bayyildiz_checkout_attempt_v1",
    category: "essential",
    kind: "sessionStorage",
    party: "first",
    purpose: "Ödeme denemesi anahtarını sekme oturumunda tutmak",
    duration: "Oturum (sekme kapanınca)",
    essentialReason: "Ödeme güvenliği",
  },
  {
    id: "cart-cleared",
    name: "bayyildiz-cart-cleared-v1:*",
    category: "essential",
    kind: "sessionStorage",
    party: "first",
    purpose: "Ödeme sonrası sepet temizliğinin bir kez uygulanması",
    duration: "Oturum (sekme kapanınca)",
    essentialReason: "Sipariş sonrası sepet tutarlılığı",
  },
  {
    id: "favorites",
    name: "bayyildiz-favorites-v1",
    category: "functional",
    kind: "localStorage",
    party: "first",
    purpose: "Favori ürün listesini cihazınızda saklamak",
    duration: "Kalıcı (temizlenene kadar)",
  },
];

export function technologiesByCategory(category: ConsentCategory): TechnologyRecord[] {
  return TECHNOLOGY_CATALOG.filter((t) => t.category === category);
}

export const HAS_ACTIVE_ANALYTICS = false;
export const HAS_ACTIVE_MARKETING = false;
