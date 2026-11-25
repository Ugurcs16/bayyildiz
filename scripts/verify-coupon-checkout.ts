/**
 * Coupon checkout regression tests (mock/fixture — no real orders/payments).
 * Run: npm run test:coupon
 */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  checkoutAttemptFingerprintParts,
  expectedCouponMerchandiseMinor,
  normalizeCouponCode,
  parseCouponCodeInput,
  parseDiscountPreviewBody,
  previewMatchesOrderAmount,
} from "../src/lib/checkout/coupon.ts";
import { resolveCheckoutIdempotencyKey } from "../src/lib/checkout/idempotency-key.ts";
import { percentOfKurus, tryAmountToKurus } from "../src/lib/checkout/money.ts";
import { previewHavaleDiscount } from "../src/lib/checkout/havale-discount.ts";

const root = join(import.meta.dirname, "..");

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function assertFile(path: string) {
  assert.ok(existsSync(join(root, path)), `missing ${path}`);
}

function shaFp(raw: string) {
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

console.log("normalize / parse coupon…");
assert.equal(normalizeCouponCode("  bigm10 "), "BIGM10");
assert.equal(parseCouponCodeInput("bigm15"), "BIGM15");
assert.equal(parseCouponCodeInput(""), null);
assert.equal(parseCouponCodeInput("bad code"), null);

console.log("money fixtures (documented campaign math)…");
{
  const a = expectedCouponMerchandiseMinor({
    subtotalMinor: 1_000_000,
    percent: 10,
    applyRoundingFloor50: false,
  });
  assert.equal(a.percentDiscountMinor, 100_000);
  assert.equal(a.amountMinor, 900_000); // 10.000 → 9.000
}
{
  const a = expectedCouponMerchandiseMinor({
    subtotalMinor: 1_000_000,
    percent: 15,
    applyRoundingFloor50: true,
  });
  assert.equal(a.percentDiscountMinor, 150_000);
  assert.equal(a.amountMinor, 850_000); // 10.000 → 8.500
}
{
  const a = expectedCouponMerchandiseMinor({
    subtotalMinor: 350_000,
    percent: 10,
    applyRoundingFloor50: false,
  });
  assert.equal(a.amountMinor, 315_000); // 3.500 → 3.150
}
{
  const a = expectedCouponMerchandiseMinor({
    subtotalMinor: 350_000,
    percent: 15,
    applyRoundingFloor50: true,
  });
  // 3500 - 15% = 2975 → floor 50 = 2950
  assert.equal(a.percentDiscountMinor, 52_500);
  assert.equal(a.roundingDiscountMinor, 2_500);
  assert.equal(a.amountMinor, 295_000);
}
{
  const havale = previewHavaleDiscount([{ price: "3500", quantity: 1 }]);
  assert.equal(havale.payableMerchandiseKurus, 330_000); // 3.500 → 3.300
}

console.log("multi-line / multi-qty merchandise…");
{
  // 1 + 3 + 10 lines equivalent subtotal 10000 via qty mix
  const lines = [
    { price: "1000", quantity: 1 },
    { price: "1000", quantity: 3 },
    { price: "600", quantity: 10 },
  ];
  const subtotal = lines.reduce(
    (sum, line) => sum + tryAmountToKurus(line.price) * line.quantity,
    0,
  );
  assert.equal(subtotal, 1_000_000);
  const sameSkuMulti = expectedCouponMerchandiseMinor({
    subtotalMinor: tryAmountToKurus("2500") * 4,
    percent: 10,
    applyRoundingFloor50: false,
  });
  assert.equal(sameSkuMulti.amountMinor, 900_000);
}

console.log("parseDiscountPreviewBody…");
{
  const ok = parseDiscountPreviewBody({
    valid: true,
    code: "bigm10",
    percent: 10,
    percentDiscount: 1000,
    percentDiscountMinor: 100_000,
    roundingDiscount: 0,
    roundingDiscountMinor: 0,
    totalDiscount: 1000,
    totalDiscountMinor: 100_000,
    subtotal: 10000,
    amount: 9000,
    currency: "TRY",
    paymentMethod: "card",
  });
  assert.ok(ok && ok.valid);
  assert.equal(ok.code, "BIGM10");
  assert.equal(ok.amount, 9000);
}
{
  const badMethod = parseDiscountPreviewBody({
    valid: true,
    code: "X",
    percent: 10,
    percentDiscount: 1,
    percentDiscountMinor: 100,
    roundingDiscount: 0,
    roundingDiscountMinor: 0,
    totalDiscount: 1,
    totalDiscountMinor: 100,
    subtotal: 10,
    amount: 9,
    currency: "TRY",
    paymentMethod: "card",
  });
  // wrong payment for BIGM15 would be backend; parser accepts card
  assert.ok(badMethod && badMethod.valid);
}
{
  const invalid = parseDiscountPreviewBody({
    valid: false,
    code: "NOPE",
    error: "Geçersiz kod",
  });
  assert.ok(invalid && !invalid.valid);
  assert.equal(invalid.error, "Geçersiz kod");
}
{
  const malformed = parseDiscountPreviewBody({
    valid: true,
    code: "X",
    percent: 10,
    // missing minors
    amount: 1,
  });
  assert.equal(malformed, null);
}
{
  const mismatchMinors = parseDiscountPreviewBody({
    valid: true,
    code: "X",
    percent: 10,
    percentDiscount: 1,
    percentDiscountMinor: 100,
    roundingDiscount: 0,
    roundingDiscountMinor: 0,
    totalDiscount: 2,
    totalDiscountMinor: 200,
    subtotal: 10,
    amount: 9,
    currency: "TRY",
    paymentMethod: "card",
  });
  assert.equal(mismatchMinors, null);
}

console.log("preview vs order amount…");
assert.equal(previewMatchesOrderAmount(9000, 9000), true);
assert.equal(previewMatchesOrderAmount(9000, 9000.004), true);
assert.equal(previewMatchesOrderAmount(9000, 8999), false);

console.log("idempotency fingerprint includes pm + coupon…");
{
  const lines = ["p1:v1:1", "p2:v2:2"];
  const a = checkoutAttemptFingerprintParts({
    itemLines: lines,
    paymentMethod: "card",
    couponCode: "bigm10",
  });
  const b = checkoutAttemptFingerprintParts({
    itemLines: [...lines].reverse(),
    paymentMethod: "card",
    couponCode: "BIGM10",
  });
  assert.equal(a, b);
  const c = checkoutAttemptFingerprintParts({
    itemLines: lines,
    paymentMethod: "bank_transfer",
    couponCode: "BIGM10",
  });
  assert.notEqual(a, c);
  const d = checkoutAttemptFingerprintParts({
    itemLines: lines,
    paymentMethod: "card",
    couponCode: "",
  });
  assert.notEqual(a, d);

  const keyA = resolveCheckoutIdempotencyKey({
    fingerprint: shaFp(a),
    cookie: null,
    clientKey: "cko_same",
    mint: () => "cko_mint",
  });
  const keyRetry = resolveCheckoutIdempotencyKey({
    fingerprint: shaFp(a),
    cookie: keyA,
    clientKey: "cko_other",
    mint: () => "cko_mint",
  });
  assert.equal(keyRetry.key, "cko_same");

  const keyConflict = resolveCheckoutIdempotencyKey({
    fingerprint: shaFp(c),
    cookie: keyA,
    clientKey: "cko_new",
    mint: () => "cko_mint",
  });
  assert.equal(keyConflict.key, "cko_new");
  assert.notEqual(keyConflict.fingerprint, keyA.fingerprint);
}

console.log("stale response guard (request id pattern)…");
{
  let latest = 0;
  const results: Array<string | null> = [];
  function apply(id: number, value: string) {
    if (id !== latest) {
      results.push(null);
      return;
    }
    results.push(value);
  }
  const first = ++latest;
  const second = ++latest;
  apply(first, "stale");
  apply(second, "fresh");
  assert.deepEqual(results, [null, "fresh"]);
}

console.log("amount mismatch + idempotency reservation safety…");
{
  // Pure decision: mismatch must block payment; match must allow.
  assert.equal(previewMatchesOrderAmount(9000, 8500), false);
  assert.equal(previewMatchesOrderAmount(9000, 9000), true);
  assert.equal(
    previewMatchesOrderAmount(Number.NaN, 9000),
    false,
  );

  const placeSrc = read("src/lib/checkout/place.ts");
  assert.match(placeSrc, /COUPON_AMOUNT_MISMATCH/);
  assert.match(placeSrc, /orderId: input\.created\.orderId/);
  assert.match(placeSrc, /orderNumber: input\.created\.orderNumber/);
  assert.match(placeSrc, /amount: input\.created\.amount/);
  assert.match(placeSrc, /Keeps checkout cookies/);

  // Same cart+pm+coupon fingerprint reuses key after mismatch (no uncontrolled new order).
  const fp = checkoutAttemptFingerprintParts({
    itemLines: ["p:v:1"],
    paymentMethod: "card",
    couponCode: "BIGM10",
  });
  const first = resolveCheckoutIdempotencyKey({
    fingerprint: shaFp(fp),
    cookie: null,
    clientKey: "cko_first",
    mint: () => "cko_minted",
  });
  const retrySame = resolveCheckoutIdempotencyKey({
    fingerprint: shaFp(fp),
    cookie: first,
    clientKey: "cko_should_not_win",
    mint: () => "cko_minted_again",
  });
  assert.equal(retrySame.key, "cko_first");

  // Coupon removed/changed → new fingerprint → new key (conflict path, not silent reuse).
  const fpNoCoupon = checkoutAttemptFingerprintParts({
    itemLines: ["p:v:1"],
    paymentMethod: "card",
    couponCode: "",
  });
  const afterRemove = resolveCheckoutIdempotencyKey({
    fingerprint: shaFp(fpNoCoupon),
    cookie: first,
    clientKey: "cko_after_remove",
    mint: () => "cko_minted_remove",
  });
  assert.equal(afterRemove.key, "cko_after_remove");
  assert.notEqual(afterRemove.fingerprint, first.fingerprint);

  // Client must not auto-create a new attempt on amount mismatch.
  const formSrc = read("src/components/checkout/CheckoutForm.tsx");
  assert.match(formSrc, /COUPON_AMOUNT_MISMATCH/);
  assert.match(formSrc, /clearAppliedCoupon/);
  assert.doesNotMatch(
    formSrc,
    /COUPON_AMOUNT_MISMATCH[\s\S]{0,200}readOrCreateCheckoutAttemptKey/,
  );
}

console.log("place route keeps cookies / blocks payment on mismatch…");
{
  const placeRoute = read("src/app/api/checkout/place/route.ts");
  assert.match(placeRoute, /attachCheckoutCookies\(mismatch, created\)/);
  assert.match(placeRoute, /rejectCouponAmountMismatch/);
  // Call order (not imports): preview → create → mismatch → initialize.
  const previewCall = placeRoute.indexOf(
    "await tervonaPreviewCheckoutDiscount(",
  );
  const createCall = placeRoute.indexOf(
    "await createStorefrontOrderForCheckout(",
  );
  const mismatchCall = placeRoute.indexOf("rejectCouponAmountMismatch({");
  const initCall = placeRoute.indexOf("await initializePaymentForCheckout(");
  assert.ok(previewCall > 0 && createCall > previewCall);
  assert.ok(mismatchCall > createCall && initCall > mismatchCall);
}

console.log("source integration / security…");
assertFile("src/lib/checkout/coupon.ts");
assertFile("src/app/api/checkout/discounts/preview/route.ts");
assertFile("src/components/checkout/CouponCodeField.tsx");

const form = read("src/components/checkout/CheckoutForm.tsx");
assert.match(form, /CouponCodeField/);
assert.match(form, /couponCode/);
assert.match(form, /COUPON_AMOUNT_MISMATCH/);
assert.doesNotMatch(form, /BIGM10|BIGM15/);
assert.doesNotMatch(form, /TERVONA_STOREFRONT_BFF_KEY/);
assert.doesNotMatch(form, /localStorage/);

const couponField = read("src/components/checkout/CouponCodeField.tsx");
assert.match(couponField, /İndirim kodunuz var mı\?/);
assert.match(couponField, /Uygula/);
assert.match(couponField, /Kaldır/);
assert.doesNotMatch(couponField, /BIGM10|BIGM15/);

const previewRoute = read("src/app/api/checkout/discounts/preview/route.ts");
assert.match(previewRoute, /tervonaPreviewCheckoutDiscount/);
assert.match(previewRoute, /rejectCrossOrigin/);
assert.match(previewRoute, /discountPreview/);
assert.match(previewRoute, /valid: false/);
assert.doesNotMatch(previewRoute, /NEXT_PUBLIC_/);

const place = read("src/lib/checkout/place.ts");
assert.match(place, /couponCode/);
assert.match(place, /rejectCouponAmountMismatch/);
assert.match(place, /paymentMethod/);

const placeRoute = read("src/app/api/checkout/place/route.ts");
assert.match(placeRoute, /tervonaPreviewCheckoutDiscount/);
assert.match(placeRoute, /COUPON_AMOUNT_MISMATCH|rejectCouponAmountMismatch/);

const parse = read("src/lib/checkout/parse.ts");
assert.match(parse, /couponCode/);
assert.match(parse, /couponPercent/);

const client = read("src/lib/tervona/customer-client.ts");
assert.match(
  client,
  /\/api\/storefront\/checkout\/discounts\/preview/,
);
assert.match(client, /X-Tervona-BFF-Key|BFF_KEY_HEADER/);

const access = read("src/lib/checkout/access.ts");
assert.match(access, /pm:/);
assert.match(access, /coupon:/);

// Kuponsuz regression: havale math untouched
assert.equal(percentOfKurus(350_000, 5), 17_500);

console.log("OK — coupon checkout verified");
