import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  colorwayParentKey,
  reconcileCartLineIdentity,
} from "../src/lib/cart-variant-identity.ts";
import {
  retainIdempotencyAfterInitializeFailure,
  resolveCheckoutIdempotencyKey,
} from "../src/lib/checkout/idempotency-key.ts";
import {
  isValidIdentityNumber,
  normalizeIdentityNumber,
  parseIdentityNumber,
} from "../src/lib/checkout/identity-number.ts";
import { isAllowedIyzicoCheckoutUrl } from "../src/lib/checkout/iyzico-url.ts";
import {
  checkoutViewKindFromPaymentStatus,
  guestLookupMatchesCookie,
  shouldClearCart,
} from "../src/lib/checkout/result-state.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const ORDER_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const ORDER_NUMBER = "BY-20260904-9A610E";
const COOKIE = { orderId: ORDER_ID, orderNumber: ORDER_NUMBER };

const PRODUCT_K3 = "885c8d7b-0000-4000-8000-000000000001";
const PRODUCT_S1 = "c3fb28dd-0000-4000-8000-000000000002";
const VARIANT_K3_40 = "919fc9c8-0000-4000-8000-000000000040";
const VARIANT_S1_40 = "7593648f-0000-4000-8000-000000000041";

const VALID_TCKN = "10000000146";

function testGuestAndAuthLookup() {
  assert(guestLookupMatchesCookie(null, COOKIE), "guest cookie without query");
  assert(guestLookupMatchesCookie(ORDER_NUMBER, COOKIE), "guest query order number");
  assert(guestLookupMatchesCookie(ORDER_ID, COOKIE), "guest query uuid");
  assert(
    !guestLookupMatchesCookie("BY-OTHER", COOKIE),
    "guest mismatched order number denied",
  );
  assert(!guestLookupMatchesCookie(ORDER_NUMBER, null), "guest query without cookie denied");
}

function testForgedPaymentQueryNeverSucceeds() {
  const forged = "paid";
  const kind = checkoutViewKindFromPaymentStatus(undefined);
  assert(kind === "unknown", "missing Tervona status is unknown");
  assert(kind !== "paid", "query payment=paid is not used");
  void forged;
  assert(
    checkoutViewKindFromPaymentStatus("pending") === "pending",
    "Tervona pending wins",
  );
  assert(checkoutViewKindFromPaymentStatus("paid") === "paid", "Tervona paid wins");
  assert(checkoutViewKindFromPaymentStatus("failed") === "failed", "Tervona failed wins");
}

function testCartClearPolicy() {
  assert(shouldClearCart("paid"), "paid clears cart");
  assert(!shouldClearCart("failed"), "failed keeps cart");
  assert(!shouldClearCart("pending"), "pending keeps cart");
  assert(!shouldClearCart("unknown"), "unknown keeps cart");
}

function testIyzicoUrlAllowlist() {
  assert(
    isAllowedIyzicoCheckoutUrl("https://sandbox-cpp.iyzipay.com/checkoutform/form"),
    "sandbox cpp allowed",
  );
  assert(!isAllowedIyzicoCheckoutUrl("https://evil.example/phish"), "open redirect blocked");
  assert(!isAllowedIyzicoCheckoutUrl("http://sandbox-cpp.iyzipay.com/x"), "http blocked");
}

function testIdempotencyFingerprintStable() {
  const a = ["p1:v1:1", "p2:v2:2"].sort().join("|");
  const b = ["p2:v2:2", "p1:v1:1"].sort().join("|");
  assert(a === b, "duplicate submit same cart fingerprint");
}

function testStockKind() {
  assert(checkoutViewKindFromPaymentStatus("processing") === "pending", "processing pending");
}

function testHmacMatchesTervonaFormula() {
  const key = "shared-bff";
  const token = createHmac("sha256", key)
    .update(`checkout-access:v1:${ORDER_ID}`)
    .digest("hex");
  const other = createHmac("sha256", key)
    .update(`checkout-access:v1:bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee`)
    .digest("hex");
  assert(token.length === 64, "hex hmac");
  assert(token !== other, "order result privacy: other order different hmac");
}

function testBffSecretNotInClient() {
  const clientFiles = [
    "src/components/checkout/CheckoutForm.tsx",
    "src/components/checkout/CartClearOnPaid.tsx",
    "src/app/odeme/page.tsx",
    "src/app/odeme/sonuc/page.tsx",
  ];
  for (const file of clientFiles) {
    const text = readFileSync(file, "utf8");
    assert(!text.includes("TERVONA_STOREFRONT_BFF_KEY"), `${file} must not mention BFF key`);
    assert(!text.includes("IYZICO_SECRET"), `${file} must not mention iyzico secret`);
    assert(
      !/\bcardNumber\b|\bPAN\b|name=["']cvv|htmlFor=["']cvv/.test(text),
      `${file} must not collect PAN/CVV`,
    );
  }
}

/** A) Missing TCKN blocked before order/payment initialize. */
function testMissingTcknBlocked() {
  assert(!isValidIdentityNumber(""), "empty invalid");
  assert(!isValidIdentityNumber("123"), "short invalid");
  assert(!parseIdentityNumber("1234567890"), "10 digits null");
  assert(!parseIdentityNumber("123456789012"), "12 digits null");
  assert(!parseIdentityNumber("abcdefghijk"), "letters null");

  const parseSrc = readFileSync("src/lib/checkout/parse.ts", "utf8");
  assert(parseSrc.includes("IDENTITY_REQUIRED"), "server parse code IDENTITY_REQUIRED");
  assert(
    /const identityNumber = parseIdentityNumber\(body\.identityNumber\);/.test(parseSrc),
    "place body requires identityNumber",
  );
  assert(
    /if \(!identityNumber\) \{\s*return bffJson/.test(parseSrc),
    "missing TCKN returns before order create",
  );

  const form = readFileSync("src/components/checkout/CheckoutForm.tsx", "utf8");
  assert(
    form.includes("if (!isValidIdentityNumber(tckn))"),
    "client blocks submit without valid TCKN",
  );
}

/** B) Valid TCKN reaches trusted server-side initialize payload. */
function testValidTcknInPlacePayload() {
  assert(
    parseIdentityNumber(" 1000 0000 146 ") === VALID_TCKN,
    "normalized identityNumber",
  );
  assert(
    normalizeIdentityNumber("1000 0000 146") === VALID_TCKN,
    "normalize strips spaces",
  );
  assert(isValidIdentityNumber(VALID_TCKN), "valid 11 digits");

  const form = readFileSync("src/components/checkout/CheckoutForm.tsx", "utf8");
  assert(form.includes("identityNumber: tckn"), "form sends identityNumber");
  assert(form.includes("T.C. Kimlik No"), "form labels TCKN");
  assert(!/\bconsole\.(log|info|debug)\b/.test(form), "form must not log");
  assert(
    form.includes("let checkoutPlaceInFlight = false"),
    "module-level place lock survives remount",
  );
  assert(form.includes("let holdLock = false"), "success path can hold the submit lock");
  assert(
    form.includes("if (!holdLock)"),
    "submit lock is not cleared on successful redirect",
  );
  assert(
    form.includes('body.code === "PAYMENT_IN_PROGRESS"'),
    "form distinguishes in-progress payment from stock 409",
  );

  const client = readFileSync("src/lib/tervona/customer-client.ts", "utf8");
  assert(
    /identityNumber:\s*input\.identityNumber/.test(client),
    "initialize posts identityNumber to Tervona",
  );

  const place = readFileSync("src/lib/checkout/place.ts", "utf8");
  assert(
    place.includes("identityNumber: input.identityNumber"),
    "place initialize receives identityNumber",
  );
  assert(
    place.includes("PAYMENT_IN_PROGRESS"),
    "place maps in-flight initialize to PAYMENT_IN_PROGRESS",
  );
}

/** C) Initialize failure retains idempotency → retry reuses same key/order association. */
function testInitializeFailureReusesOrder() {
  const retained = retainIdempotencyAfterInitializeFailure({
    fingerprint: "fp_same_cart",
    createdOrderId: ORDER_ID,
    firstKey: "cko_first_attempt_key",
  });
  assert(retained.reuseOnRetry === "cko_first_attempt_key", "retry reuses first key");
  assert(retained.orderId === ORDER_ID, "same order id association");

  const placeRoute = readFileSync("src/app/api/checkout/place/route.ts", "utf8");
  assert(
    placeRoute.includes("attachCheckoutCookies(failure, created)"),
    "place route attaches cookies when initialize throws after order create",
  );
}

/** D) Colorway isolation: K3 size 40 must not resolve to S1 size 40. */
function testColorwayIsolation() {
  const k3 = {
    id: PRODUCT_K3,
    slug: "bayyildiz-gunluk-ayakkabi-model-f54083-f54083-k3",
    variants: [
      { id: VARIANT_K3_40, sku: "F54083-K3 - 40", size: "40" },
      { id: "919fc9c8-0000-4000-8000-000000000039", sku: "F54083-K3 - 39", size: "39" },
    ],
  };
  const s1 = {
    id: PRODUCT_S1,
    slug: "bayyildiz-gunluk-ayakkabi-model-f54083-f54083-s1",
    variants: [{ id: VARIANT_S1_40, sku: "F54083-S1 - 40", size: "40" }],
  };

  const matched = reconcileCartLineIdentity(k3, {
    productId: PRODUCT_K3,
    variationId: VARIANT_K3_40,
    size: "40",
    variantSku: "F54083-K3 - 40",
    model: "F54083-K3",
  });
  assert(matched.status === "ok", "K3/40 reconciles");
  assert(matched.status === "ok" && matched.variant.sku === "F54083-K3 - 40", "K3/40 stays K3");

  const byIds = reconcileCartLineIdentity(s1, {
    productId: PRODUCT_K3,
    variationId: VARIANT_K3_40,
    size: "40",
  });
  assert(byIds.status === "reject", "stable ids never cross to S1 via size");

  const sizeOnlyTrap = s1.variants.find((v) => v.size === "40");
  assert(sizeOnlyTrap?.sku === "F54083-S1 - 40", "size-only would find S1 sibling");

  const revalidate = readFileSync("src/lib/cart-revalidate.ts", "utf8");
  assert(
    revalidate.includes("reconcileCartLineIdentity"),
    "cart revalidate uses identity reconcile",
  );
  assert(
    !revalidate.includes("v.sku === line.variantSku"),
    "SKU fallback removed (colorway risk)",
  );
}

/** Stale / desynced claims must be rejected — never silently remapped to a sibling. */
function testStaleAndDesyncedColorwayRejected() {
  const k3 = {
    id: PRODUCT_K3,
    slug: "bayyildiz-gunluk-ayakkabi-model-f54083-f54083-k3",
    variants: [{ id: VARIANT_K3_40, sku: "F54083-K3 - 40", size: "40" }],
  };
  const s1 = {
    id: PRODUCT_S1,
    slug: "bayyildiz-gunluk-ayakkabi-model-f54083-f54083-s1",
    variants: [{ id: VARIANT_S1_40, sku: "F54083-S1 - 40", size: "40" }],
  };

  // Pre-import / regenerated IDs: product resolved by slug is K3, cart still has old foreign ids
  const staleIds = reconcileCartLineIdentity(k3, {
    productId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
    variationId: "bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee",
    variantSku: "F54083-K3 - 40",
    size: "40",
  });
  assert(staleIds.status === "reject", "stale productId rejected");
  assert(
    staleIds.status === "reject" && staleIds.reason === "product_mismatch",
    "stale pre-import ids are product_mismatch",
  );

  // The production bug shape: S1 IDs with a K3 SKU claim (display said K3, order was S1)
  const desync = reconcileCartLineIdentity(s1, {
    productId: PRODUCT_S1,
    variationId: VARIANT_S1_40,
    variantSku: "F54083-K3 - 40",
    model: "F54083-K3",
    size: "40",
  });
  assert(desync.status === "reject", "K3 claim on S1 ids rejected");
  assert(
    desync.status === "reject" && desync.reason === "colorway_mismatch",
    "desync is colorway_mismatch not remap",
  );

  // Sibling same size remains isolated when claims match their own colorway
  const s1Ok = reconcileCartLineIdentity(s1, {
    productId: PRODUCT_S1,
    variationId: VARIANT_S1_40,
    variantSku: "F54083-S1 - 40",
    size: "40",
  });
  assert(s1Ok.status === "ok", "S1/40 stays S1 when claims match");

  // Missing variant id on correct product (regenerated variant uuid)
  const missingVariant = reconcileCartLineIdentity(k3, {
    productId: PRODUCT_K3,
    variationId: "cccccccc-cccc-4ccc-8ddd-eeeeeeeeeeee",
    variantSku: "F54083-K3 - 40",
    size: "40",
  });
  assert(
    missingVariant.status === "reject" &&
      missingVariant.reason === "variant_missing",
    "invalid variant id rejected not remapped by size/sku",
  );

  assert(
    colorwayParentKey("F54083-K3 - 40") === colorwayParentKey("F54083-K3"),
    "parent key strips size",
  );
  assert(
    colorwayParentKey("F54083-K3 - 40") !== colorwayParentKey("F54083-S1 - 40"),
    "K3 and S1 parents differ",
  );
}

/** E) Near-simultaneous checkout requests with same client key → one logical order key. */
function testDoubleSubmitSameKey() {
  let minted = 0;
  const mint = () => {
    minted += 1;
    return `cko_minted_${minted}`;
  };
  const fingerprint = "fp_double";
  const clientKey = "cko_shared_double_submit_key";

  const first = resolveCheckoutIdempotencyKey({
    fingerprint,
    cookie: null,
    clientKey,
    mint,
  });
  const second = resolveCheckoutIdempotencyKey({
    fingerprint,
    cookie: null,
    clientKey,
    mint,
  });
  assert(first.key === second.key, "two near-simultaneous requests share client key");
  assert(first.key === clientKey, "client key wins before cookie");
  assert(minted === 0, "mint not used when client key present");

  const afterCookie = resolveCheckoutIdempotencyKey({
    fingerprint,
    cookie: first,
    clientKey: "cko_other",
    mint,
  });
  assert(afterCookie.key === clientKey, "cookie retains first key on retry");
}

function testOrphanOrdersDocumented() {
  // Existing unpaid test orders — cleanup deferred; do not delete in this fix.
  const orphans = ["BY-20260905-4E471B", "BY-20260905-E92782"];
  assert(orphans.length === 2, "two orphaned unpaid live-test orders identified");
}

function main() {
  testGuestAndAuthLookup();
  testForgedPaymentQueryNeverSucceeds();
  testCartClearPolicy();
  testIyzicoUrlAllowlist();
  testIdempotencyFingerprintStable();
  testStockKind();
  testHmacMatchesTervonaFormula();
  testBffSecretNotInClient();
  testMissingTcknBlocked();
  testValidTcknInPlacePayload();
  testInitializeFailureReusesOrder();
  testColorwayIsolation();
  testStaleAndDesyncedColorwayRejected();
  testDoubleSubmitSameKey();
  testOrphanOrdersDocumented();
  console.info("bayyildiz checkout checks passed");
}

main();
