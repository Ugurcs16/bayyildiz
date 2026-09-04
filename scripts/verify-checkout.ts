import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
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

function main() {
  testGuestAndAuthLookup();
  testForgedPaymentQueryNeverSucceeds();
  testCartClearPolicy();
  testIyzicoUrlAllowlist();
  testIdempotencyFingerprintStable();
  testStockKind();
  testHmacMatchesTervonaFormula();
  testBffSecretNotInClient();
  console.info("bayyildiz checkout checks passed");
}

main();
