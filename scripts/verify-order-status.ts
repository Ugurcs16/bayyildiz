import {
  CUSTOMER_ORDER_STATUS,
  customerOrderStatusMessage,
} from "../src/lib/customer/order-status.ts";
import { mapCustomerOrder } from "../src/lib/customer/map-dto.ts";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function testExactMappings() {
  assert(
    customerOrderStatusMessage({
      paymentStatus: "awaiting_transfer",
      fulfillmentStatus: "unfulfilled",
      orderStatus: "pending",
    }) === CUSTOMER_ORDER_STATUS.awaitingTransfer,
    "awaiting_transfer",
  );

  assert(
    customerOrderStatusMessage({
      paymentStatus: "paid",
      fulfillmentStatus: "unfulfilled",
      orderStatus: "pending",
    }) === CUSTOMER_ORDER_STATUS.paidPreparing,
    "paid + unfulfilled",
  );

  assert(
    customerOrderStatusMessage({
      paymentStatus: "paid",
      fulfillmentStatus: "preparing",
      orderStatus: "confirmed",
    }) === CUSTOMER_ORDER_STATUS.paidPreparing,
    "paid + preparing",
  );

  assert(
    customerOrderStatusMessage({
      paymentStatus: "paid",
      fulfillmentStatus: "shipped",
      orderStatus: "confirmed",
    }) === CUSTOMER_ORDER_STATUS.shipped,
    "shipped",
  );

  assert(
    customerOrderStatusMessage({
      paymentStatus: "paid",
      fulfillmentStatus: "delivered",
      orderStatus: "completed",
    }) === CUSTOMER_ORDER_STATUS.delivered,
    "delivered",
  );

  assert(
    customerOrderStatusMessage({
      paymentStatus: "paid",
      fulfillmentStatus: "cancelled",
      orderStatus: "cancelled",
    }) === CUSTOMER_ORDER_STATUS.cancelled,
    "cancelled fulfillment",
  );

  assert(
    customerOrderStatusMessage({
      paymentStatus: "awaiting_transfer",
      fulfillmentStatus: "unfulfilled",
      orderStatus: "cancelled",
    }) === CUSTOMER_ORDER_STATUS.cancelled,
    "cancelled orderStatus wins over awaiting_transfer",
  );

  assert(
    customerOrderStatusMessage({
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      orderStatus: "pending",
    }) === CUSTOMER_ORDER_STATUS.paymentPending,
    "card pending",
  );

  assert(
    customerOrderStatusMessage({
      paymentStatus: "processing",
      fulfillmentStatus: "unfulfilled",
      orderStatus: "pending",
    }) === CUSTOMER_ORDER_STATUS.paymentPending,
    "card processing",
  );
}

function testUnfulfilledNeverDelivered() {
  const message = customerOrderStatusMessage({
    paymentStatus: "awaiting_transfer",
    fulfillmentStatus: "unfulfilled",
    orderStatus: "pending",
  });
  assert(!message.includes("teslim edildi"), "unfulfilled is not delivered");
  assert(
    message === CUSTOMER_ORDER_STATUS.awaitingTransfer,
    "unfulfilled + awaiting_transfer stays havale wait",
  );

  const paidUnfulfilled = customerOrderStatusMessage({
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    orderStatus: "pending",
  });
  assert(
    paidUnfulfilled === CUSTOMER_ORDER_STATUS.paidPreparing,
    "paid unfulfilled is preparing copy",
  );
  assert(
    !/teslim edildi/i.test(paidUnfulfilled),
    "paid unfulfilled must not say delivered",
  );
}

function testMapDtoUsesPaymentStatus() {
  const mapped = mapCustomerOrder({
    id: "ord-1",
    orderNumber: "BY-1",
    createdAt: "2026-10-23T12:00:00.000Z",
    grandTotal: 100,
    currency: "TRY",
    orderStatus: "pending",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    lines: [{ productTitle: "Model", quantity: 1 }],
  });
  assert(mapped, "maps order");
  assert(
    mapped.status === CUSTOMER_ORDER_STATUS.paidPreparing,
    "list badge after payment confirm",
  );
  assert(
    mapped.statusDescription === mapped.status,
    "list badge and detail description match",
  );
  assert(mapped.paymentStatus === "paid", "keeps paymentStatus from API");
  assert(
    mapped.fulfillmentStatus === "unfulfilled",
    "keeps fulfillmentStatus from API",
  );
}

function testNoIncludesFulfillBugInSource() {
  const source = readFileSync(
    join(process.cwd(), "src/lib/customer/map-dto.ts"),
    "utf8",
  );
  assert(!source.includes('includes("fulfill")'), "old fulfill includes removed");
  assert(!source.includes('includes("deliver")'), "old deliver includes removed");
  assert(
    source.includes("customerOrderStatusMessage"),
    "map-dto uses shared mapper",
  );
}

testExactMappings();
testUnfulfilledNeverDelivered();
testMapDtoUsesPaymentStatus();
testNoIncludesFulfillBugInSource();
console.info("verify-order-status: ok");
