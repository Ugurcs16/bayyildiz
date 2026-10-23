import { readFileSync } from "node:fs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Match Tervona bankTransferDiscountMinor. */
function percentOfKurus(kurus, percent) {
  if (!Number.isFinite(kurus) || kurus <= 0) return 0;
  if (!Number.isFinite(percent) || percent <= 0) return 0;
  const minor = Math.trunc(kurus);
  return Math.floor((minor * percent + 50) / 100);
}

function tryAmountToKurus(amount) {
  if (typeof amount === "number") {
    if (!Number.isFinite(amount) || amount < 0) return 0;
    return Math.round(amount * 100);
  }
  const normalized = String(amount).trim().replace(",", ".");
  if (!normalized) return 0;
  const n = Number.parseFloat(normalized);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function previewHavaleDiscount(lines, percent = 5) {
  let merchandiseKurus = 0;
  for (const line of lines) {
    const qty =
      typeof line.quantity === "number" && Number.isFinite(line.quantity)
        ? Math.max(0, Math.floor(line.quantity))
        : 0;
    merchandiseKurus += tryAmountToKurus(line.price) * qty;
  }
  const discountKurus = percentOfKurus(merchandiseKurus, percent);
  return {
    merchandiseKurus,
    discountKurus,
    payableMerchandiseKurus: Math.max(0, merchandiseKurus - discountKurus),
  };
}

function checkoutViewKindFromPaymentStatus(paymentStatus) {
  const status = (paymentStatus ?? "").toLowerCase();
  if (status === "paid") return "paid";
  if (status === "failed" || status === "cancelled") return "failed";
  if (
    status === "awaiting_transfer" ||
    status === "awaiting_bank_transfer" ||
    status === "bank_transfer_pending"
  ) {
    return "awaiting_transfer";
  }
  if (status === "pending" || status === "processing") return "pending";
  return "unknown";
}

function shouldClearCart(kind) {
  return kind === "paid" || kind === "awaiting_transfer";
}

function testMoneyMatchesTervona() {
  assert(percentOfKurus(10000, 5) === 500, "5% of 100 TL");
  assert(percentOfKurus(199999, 5) === 10000, "half-up 1999.99");
  // Tervona: floor((minor * 5 + 50) / 100)
  assert(
    percentOfKurus(1, 5) === Math.floor((1 * 5 + 50) / 100),
    "1 kurus edge",
  );
  const breakdown = previewHavaleDiscount([
    { price: "1000", quantity: 2 },
    { price: "500.50", quantity: 1 },
  ]);
  assert(breakdown.merchandiseKurus === 250050, "merchandise");
  assert(breakdown.discountKurus === 12503, "discount");
  assert(
    breakdown.payableMerchandiseKurus === 250050 - 12503,
    "payable",
  );
}

function testStatusCartAndAccess() {
  assert(
    checkoutViewKindFromPaymentStatus("awaiting_transfer") === "awaiting_transfer",
    "awaiting kind",
  );
  assert(shouldClearCart("awaiting_transfer"), "clear cart on awaiting");
  assert(shouldClearCart("paid"), "clear on paid");
  assert(!shouldClearCart("pending"), "keep cart on pending card");
  assert(!shouldClearCart("unknown"), "keep cart on unknown");
}

function testSourceIntegration() {
  const features = readFileSync("src/lib/checkout/features.ts", "utf8");
  assert(features.includes("CHECKOUT_HAVALE_EFT_ENABLED"), "server flag");
  assert(
    features.includes("NEXT_PUBLIC_CHECKOUT_HAVALE_EFT_ENABLED"),
    "client flag",
  );

  const place = readFileSync("src/app/api/checkout/place/route.ts", "utf8");
  assert(place.includes("HAVALE_DISABLED"), "flag-off reject");
  assert(!place.includes("HAVALE_API_NOT_READY"), "501 gate removed");
  assert(
    place.includes('paymentMethod === "bank_transfer"'),
    "bank_transfer branch",
  );
  const disabledIdx = place.indexOf("HAVALE_DISABLED");
  const awaitInitIdx = place.indexOf("await initializePaymentForCheckout");
  const bankReturnIdx = place.indexOf("created.paymentStatus");
  assert(disabledIdx >= 0, "disabled guard present");
  assert(awaitInitIdx >= 0, "card still initializes iyzico");
  assert(
    bankReturnIdx >= 0 && bankReturnIdx < awaitInitIdx,
    "havale response before iyzico initialize call",
  );
  assert(place.includes("awaiting_transfer"), "awaiting_transfer status");

  const createPlace = readFileSync("src/lib/checkout/place.ts", "utf8");
  assert(
    createPlace.includes('paymentMethod: "bank_transfer"'),
    "forwards paymentMethod to Tervona",
  );
  assert(createPlace.includes("HAVALE_UNAVAILABLE"), "maps HAVALE_UNAVAILABLE");

  const form = readFileSync("src/components/checkout/CheckoutForm.tsx", "utf8");
  assert(form.includes("awaiting_transfer"), "redirect on awaiting");
  assert(form.includes("isHavaleEftEnabledClient"), "UI gated");
  assert(form.includes("previewHavaleDiscount"), "live discount preview");

  const panel = readFileSync(
    "src/components/checkout/HavalePendingPanel.tsx",
    "utf8",
  );
  assert(!/TR\d{2}\d{4}/.test(panel.replace(/\s/g, "")), "no hardcoded IBAN");
  assert(panel.includes("instructions.iban"), "iban from API");
  assert(panel.includes("CopyFieldButton"), "copy buttons");
  assert(panel.includes("Ayakkabı ücret bedeli"), "fixed transfer description");
  assert(
    panel.includes("HAVALE_TRANSFER_DESCRIPTION"),
    "description constant used for copy",
  );
  assert(
    !panel.includes("instructions.paymentReference"),
    "order ref not shown as transfer description",
  );
  assert(panel.includes("Fırat Coşkun"), "BTSO membership note");
  assert(
    panel.includes("Bursa Ticaret ve Sanayi Odası"),
    "short chamber membership copy",
  );
  assert(!panel.includes("şahıs işletmesidir"), "long BTSO paragraph removed");
  assert(panel.includes("expiresAt") || panel.includes("expiresLabel"), "expiry");

  const banner = readFileSync(
    "src/components/home/HavalePromoBanner.tsx",
    "utf8",
  );
  assert(banner.includes("isHavaleEftEnabledClient"), "banner gated");
  assert(banner.includes("%5 İndirim"), "promo copy");
  assert(!banner.includes("href="), "promo has no CTA link");
  assert(!banner.includes("Sepete"), "no sepete git CTA");
  assert(!banner.includes("Ödeme sayfasında"), "no checkout CTA");

  const home = readFileSync("src/app/page.tsx", "utf8");
  assert(home.includes("HavalePromoBanner"), "banner on home");

  const sonuc = readFileSync("src/app/odeme/sonuc/page.tsx", "utf8");
  assert(sonuc.includes("HavalePendingPanel"), "result panel");
  assert(
    sonuc.includes('kind === "awaiting_transfer"'),
    "awaiting clears / shows",
  );

  const load = readFileSync("src/lib/checkout/load-result.ts", "utf8");
  assert(load.includes("guestLookupMatchesCookie"), "HMAC guest cookie");
  assert(load.includes("bankTransfer"), "reads bankTransfer from status");
}

function testIdempotencyAndRegressionHints() {
  const parse = readFileSync("src/lib/checkout/parse.ts", "utf8");
  assert(parse.includes("paymentMethod"), "parse method");
  assert(
    parse.includes("amount !== undefined"),
    "client amount still rejected",
  );

  const initRoute = readFileSync(
    "src/app/api/checkout/payments/initialize/route.ts",
    "utf8",
  );
  assert(
    initRoute.includes("initializePaymentForCheckout"),
    "card initialize route intact",
  );
}

testMoneyMatchesTervona();
testStatusCartAndAccess();
testSourceIntegration();
testIdempotencyAndRegressionHints();
console.log("verify-havale-eft: ok");
