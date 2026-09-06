/**
 * Consent + legal route regression checks (no browser).
 * Run: npm run test:consent
 */

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  HAS_ACTIVE_ANALYTICS,
  HAS_ACTIVE_MARKETING,
  TECHNOLOGY_CATALOG,
} from "../src/lib/consent/catalog.ts";
import {
  acceptAllPreferences,
  categoryAllowed,
  createPreferences,
  necessaryOnlyPreferences,
  parseConsentRaw,
} from "../src/lib/consent/storage.ts";
import { LEGAL_ROUTES } from "../src/lib/constants.ts";
import {
  LEGAL_PLACEHOLDERS,
  UNKNOWN_LEGAL_FIELDS,
} from "../src/lib/legal/business.ts";

const root = join(import.meta.dirname, "..");

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function assertFile(path: string) {
  assert.ok(existsSync(join(root, path)), `missing ${path}`);
}

console.log("consent catalog…");
assert.equal(CONSENT_VERSION, 1);
assert.ok(CONSENT_STORAGE_KEY.startsWith("bayyildiz_"));
assert.equal(HAS_ACTIVE_ANALYTICS, false);
assert.equal(HAS_ACTIVE_MARKETING, false);

const essential = TECHNOLOGY_CATALOG.filter((t) => t.category === "essential");
const functional = TECHNOLOGY_CATALOG.filter((t) => t.category === "functional");
const analytics = TECHNOLOGY_CATALOG.filter((t) => t.category === "analytics");
const marketing = TECHNOLOGY_CATALOG.filter((t) => t.category === "marketing");
assert.ok(essential.length >= 5, "essential tech listed");
assert.ok(functional.some((t) => t.id === "favorites"));
assert.equal(analytics.length, 0);
assert.equal(marketing.length, 0);
assert.ok(
  essential.every((t) => t.id !== "favorites"),
  "favorites not essential",
);

console.log("consent preferences…");
const all = acceptAllPreferences();
assert.equal(all.version, CONSENT_VERSION);
assert.equal(all.essential, true);
assert.equal(all.functional, true);
assert.equal(all.analytics, true);
assert.equal(all.marketing, true);

const necessary = necessaryOnlyPreferences();
assert.equal(necessary.functional, false);
assert.equal(necessary.analytics, false);
assert.equal(necessary.marketing, false);
assert.equal(categoryAllowed(necessary, "essential"), true);
assert.equal(categoryAllowed(necessary, "analytics"), false);
assert.equal(categoryAllowed(null, "marketing"), false);

const custom = createPreferences({
  functional: true,
  analytics: false,
  marketing: false,
});
const roundTrip = parseConsentRaw(JSON.stringify(custom));
assert.equal(roundTrip.status, "set");
if (roundTrip.status === "set") {
  assert.equal(roundTrip.preferences.functional, true);
  assert.equal(roundTrip.preferences.analytics, false);
}

assert.equal(parseConsentRaw(null).status, "unknown");
assert.equal(parseConsentRaw("{}").status, "unknown");
assert.equal(
  parseConsentRaw(JSON.stringify({ ...custom, version: 999 })).status,
  "unknown",
  "version mismatch forces re-consent",
);

console.log("legal routes & UI wiring…");
assert.equal(LEGAL_ROUTES.cookies, "/cerez-politikasi");
assertFile("src/app/cerez-politikasi/page.tsx");
assertFile("src/app/sartlar-ve-kosullar/page.tsx");
assertFile("src/app/gizlilik-politikasi/page.tsx");
assertFile("src/components/consent/CookieConsent.tsx");
assertFile("src/components/consent/ConsentProvider.tsx");

const banner = read("src/components/consent/CookieConsent.tsx");
assert.match(banner, /Tümünü Kabul Et/);
assert.match(banner, /Yalnızca Gerekli Çerezler/);
assert.match(banner, /Tercihleri Yönet/);
assert.match(banner, /Tercihleri Kaydet/);

const footer = read("src/components/layout/Footer.tsx");
assert.match(footer, /Çerez Politikası/);
assert.match(footer, /CookiePreferencesButton/);
assert.match(footer, /Şartlar ve Koşullar/);
assert.match(footer, /Gizlilik Politikası/);

const providers = read("src/components/providers/app-providers.tsx");
assert.match(providers, /ConsentProvider/);
assert.match(providers, /CookieConsent/);

const favorites = read("src/components/providers/favorites-context.tsx");
assert.match(favorites, /allows\("functional"\)/);

const privacy = read("src/app/gizlilik-politikasi/page.tsx");
assert.match(privacy, /T\.C\. Kimlik No/);
assert.match(privacy, /localStorage/);
assert.match(privacy, /iyzico/);
assert.ok(
  !/hiçbir yerde saklanmaz|asla saklamayız/i.test(privacy),
  "must not over-claim TCKN non-storage",
);

const terms = read("src/app/sartlar-ve-kosullar/page.tsx");
assert.match(terms, /iyzico/);
assert.match(terms, /Kart numarası ve CVV/);

const cookiesPage = read("src/app/cerez-politikasi/page.tsx");
assert.match(cookiesPage, /TECHNOLOGY_CATALOG|technologiesByCategory/);
assert.ok(
  TECHNOLOGY_CATALOG.some((t) => t.name === "bayyildiz-cart-v3"),
  "catalog includes cart storage",
);
assert.ok(
  TECHNOLOGY_CATALOG.some((t) => t.name === "bayyildiz_customer_session"),
  "catalog includes session cookie",
);

assert.ok(UNKNOWN_LEGAL_FIELDS.length > 0);
assert.match(LEGAL_PLACEHOLDERS.companyTitle, /ŞİRKET ÜNVANI/);

// No analytics SDKs in package/layout
const layout = read("src/app/layout.tsx");
assert.doesNotMatch(layout, /gtag|GTM|facebook|fbq|SpeedInsights|@vercel\/analytics/i);
const pkg = read("package.json");
assert.doesNotMatch(pkg, /@vercel\/analytics|@vercel\/speed-insights/);

console.log("OK — consent + legal checks passed");
