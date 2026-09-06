/**
 * Consent + legal route regression checks (no browser).
 * Run: npm run test:consent
 */

import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
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

const root = join(import.meta.dirname, "..");

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function assertFile(path: string) {
  assert.ok(existsSync(join(root, path)), `missing ${path}`);
}

function walkTsx(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walkTsx(full, out);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

console.log("consent catalog…");
assert.equal(CONSENT_VERSION, 1);
assert.ok(CONSENT_STORAGE_KEY.startsWith("bayyildiz_"));
assert.equal(HAS_ACTIVE_ANALYTICS, false);
assert.equal(HAS_ACTIVE_MARKETING, false);

const essential = TECHNOLOGY_CATALOG.filter((t) => t.category === "essential");
assert.ok(essential.length >= 5, "essential tech listed");
assert.equal(
  TECHNOLOGY_CATALOG.filter((t) => t.category === "analytics").length,
  0,
);
assert.equal(
  TECHNOLOGY_CATALOG.filter((t) => t.category === "marketing").length,
  0,
);

console.log("consent preferences…");
const all = acceptAllPreferences();
assert.equal(all.version, CONSENT_VERSION);
assert.equal(all.essential, true);
assert.equal(all.analytics, true);
assert.equal(all.marketing, true);

const necessary = necessaryOnlyPreferences();
assert.equal(necessary.analytics, false);
assert.equal(necessary.marketing, false);
assert.equal(categoryAllowed(necessary, "essential"), true);
assert.equal(categoryAllowed(null, "marketing"), false);

const custom = createPreferences({
  functional: true,
  analytics: false,
  marketing: false,
});
const roundTrip = parseConsentRaw(JSON.stringify(custom));
assert.equal(roundTrip.status, "set");
assert.equal(
  parseConsentRaw(JSON.stringify({ ...custom, version: 999 })).status,
  "unknown",
);

console.log("legal routes & UI wiring…");
assert.equal(LEGAL_ROUTES.cookies, "/cerez-politikasi");
assertFile("src/app/cerez-politikasi/page.tsx");
assertFile("src/app/sartlar-ve-kosullar/page.tsx");
assertFile("src/app/gizlilik-politikasi/page.tsx");
assertFile("src/components/consent/CookieConsent.tsx");

const banner = read("src/components/consent/CookieConsent.tsx");
assert.match(banner, /Tümünü kabul et/);
assert.match(banner, /Yalnızca gerekli/);
assert.match(banner, /Tercihleri yönet/);
assert.match(banner, /Çerez tercihleri/);

const footer = read("src/components/layout/Footer.tsx");
assert.match(footer, /Çerez Politikası/);
assert.match(footer, /CookiePreferencesButton/);

const privacy = read("src/app/gizlilik-politikasi/page.tsx");
assert.match(privacy, /iyzico/);
assert.match(privacy, /kart numarası|CVV/i);
assert.match(privacy, /CookiePreferencesButton/);
assert.doesNotMatch(privacy, /EKLENECEK|LegalPlaceholder|LEGAL_PLACEHOLDERS/);

const terms = read("src/app/sartlar-ve-kosullar/page.tsx");
assert.match(terms, /iyzico/);
assert.match(terms, /Kart numarası ve CVV/);
assert.match(terms, /1989/);
assert.doesNotMatch(terms, /EKLENECEK|LegalPlaceholder|LEGAL_PLACEHOLDERS|MERSİS/);

const returns = read("src/app/iade-degisim/page.tsx");
assert.match(returns, /ürünü göndermeden önce/);
assert.doesNotMatch(returns, /EKLENECEK|İADE ADRESİ|LegalPlaceholder/);

const distance = read("src/app/mesafeli-satis/page.tsx");
assert.doesNotMatch(distance, /EKLENECEK|LegalPlaceholder|LEGAL_PLACEHOLDERS/);

console.log("public placeholder scan…");
const publicRoots = [
  join(root, "src/app"),
  join(root, "src/components"),
];
const placeholderRe =
  /\[(?:ŞİRKET|VERGİ|MERSİS|TİCARET|İADE|KEP)[^\]]*EKLENECEK\]|ŞİRKET ÜNVANI EKLENECEK|VERGİ NUMARASI EKLENECEK|İADE ADRESİ EKLENECEK/;
let publicHits = 0;
for (const base of publicRoots) {
  for (const file of walkTsx(base)) {
    const text = readFileSync(file, "utf8");
    if (placeholderRe.test(text) || /LEGAL_PLACEHOLDERS|LegalPlaceholder/.test(text)) {
      // business.ts no longer has placeholders; LegalDocument no longer exports LegalPlaceholder
      if (/LEGAL_PLACEHOLDERS|LegalPlaceholder|EKLENECEK/.test(text)) {
        console.error("placeholder hit:", file);
        publicHits += 1;
      }
    }
  }
}
assert.equal(publicHits, 0, "no public placeholder tokens in app/components");

const layout = read("src/app/layout.tsx");
assert.doesNotMatch(layout, /gtag|GTM|facebook|fbq|SpeedInsights|@vercel\/analytics/i);
const pkg = read("package.json");
assert.doesNotMatch(pkg, /@vercel\/analytics|@vercel\/speed-insights/);

console.log("OK — consent + legal checks passed");
