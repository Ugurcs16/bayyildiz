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

const HAVALE_EFT_ROUNDING_MINOR = 5_000;

function bankTransferRoundingDiscountMinor(afterPercentMinor) {
  if (!Number.isInteger(afterPercentMinor) || afterPercentMinor < 0) return 0;
  const rounded =
    Math.floor(afterPercentMinor / HAVALE_EFT_ROUNDING_MINOR) *
    HAVALE_EFT_ROUNDING_MINOR;
  if (rounded <= 0) return 0;
  return afterPercentMinor - rounded;
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
  const percentDiscountKurus = percentOfKurus(merchandiseKurus, percent);
  const afterPercentKurus = Math.max(0, merchandiseKurus - percentDiscountKurus);
  const roundingDiscountKurus =
    bankTransferRoundingDiscountMinor(afterPercentKurus);
  return {
    merchandiseKurus,
    percentDiscountKurus,
    roundingDiscountKurus,
    totalDiscountKurus: percentDiscountKurus + roundingDiscountKurus,
    afterPercentKurus,
    payableMerchandiseKurus: Math.max(
      0,
      afterPercentKurus - roundingDiscountKurus,
    ),
    discountKurus: percentDiscountKurus,
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

  // After-%5 amounts → floor to 50 TL
  assert(bankTransferRoundingDiscountMinor(399_650) === 4_650, "3996.50→3950");
  assert(bankTransferRoundingDiscountMinor(394_450) === 4_450, "3944.50→3900");
  assert(bankTransferRoundingDiscountMinor(393_650) === 3_650, "3936.50→3900");
  assert(bankTransferRoundingDiscountMinor(569_050) === 4_050, "5690.50→5650");
  assert(bankTransferRoundingDiscountMinor(400_000) === 0, "exact 50 TL step");
  assert(bankTransferRoundingDiscountMinor(4_000) === 0, "below 50 TL");
  assert(bankTransferRoundingDiscountMinor(0) === 0, "zero");

  // Full cart: 5990 → %5 then floor
  const example = previewHavaleDiscount([{ price: "5990", quantity: 1 }]);
  assert(example.merchandiseKurus === 599_000, "5990 merchandise");
  assert(example.percentDiscountKurus === 29_950, "5990 %5");
  assert(example.afterPercentKurus === 569_050, "after %5");
  assert(example.roundingDiscountKurus === 4_050, "rounding 40.50");
  assert(example.payableMerchandiseKurus === 565_000, "payable 5650");

  const multi = previewHavaleDiscount([
    { price: "1000", quantity: 2 },
    { price: "500.50", quantity: 1 },
  ]);
  assert(multi.merchandiseKurus === 250_050, "multi merchandise");
  assert(multi.percentDiscountKurus === 12_503, "multi %5");
  assert(
    multi.payableMerchandiseKurus ===
      multi.afterPercentKurus - multi.roundingDiscountKurus,
    "multi payable",
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
  assert(form.includes("Size özel ek indirim"), "rounding line in checkout");
  assert(form.includes("Ödenecek toplam"), "payable total label");
  assert(
    form.includes("roundingDiscountKurus > 0"),
    "hide zero rounding campaign pieces",
  );

  const discountLib = readFileSync("src/lib/checkout/havale-discount.ts", "utf8");
  assert(discountLib.includes("HAVALE_EFT_ROUNDING_MINOR"), "rounding step");
  assert(
    discountLib.includes("bankTransferRoundingDiscountMinor"),
    "rounding helper",
  );

  const types = readFileSync("src/lib/tervona/havale-types.ts", "utf8");
  assert(types.includes("TervonaBankTransferDiscount"), "discount type");
  assert(types.includes("roundingDiscountMinor"), "rounding field");
  assert(types.includes("discount?:"), "optional discount");

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
  assert(panel.includes("instructions.discount"), "API discount only");
  assert(panel.includes("amountDueMinor"), "authoritative payable");
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
  assert(load.includes("readBankTransferDiscount"), "parses optional discount");
  assert(
    load.includes("never invent") || load.includes("Accept complete API discount"),
    "no invented discount",
  );
}

function testLegacyDiscountOmitted() {
  const load = readFileSync("src/lib/checkout/load-result.ts", "utf8");
  // Incomplete discount must not be invented — validation requires all minors.
  assert(load.includes("percentDiscountMinor + roundingDiscountMinor"), "sum check");
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
testLegacyDiscountOmitted();
console.log("verify-havale-eft: ok");
