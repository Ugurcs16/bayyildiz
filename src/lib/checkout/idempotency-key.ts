/**
 * Pure checkout attempt / order idempotency key resolution.
 * Cookie association must survive payment initialize failures.
 */

export type CheckoutIdempotencyCookie = {
  fingerprint: string;
  key: string;
};

/**
 * Prefer cookie key when fingerprint matches; else client attempt key; else mint.
 * Once an order is created, the same key must be reused on retry.
 */
export function resolveCheckoutIdempotencyKey(input: {
  fingerprint: string;
  cookie: CheckoutIdempotencyCookie | null;
  clientKey?: string;
  mint: () => string;
}): CheckoutIdempotencyCookie {
  if (input.cookie && input.cookie.fingerprint === input.fingerprint) {
    return input.cookie;
  }
  if (input.clientKey) {
    return { fingerprint: input.fingerprint, key: input.clientKey };
  }
  return { fingerprint: input.fingerprint, key: input.mint() };
}

/**
 * Simulates place-route behavior: after order create, initialize failure
 * still retains the same idempotency association for retry.
 */
export function retainIdempotencyAfterInitializeFailure(input: {
  fingerprint: string;
  createdOrderId: string;
  firstKey: string;
}): { orderId: string; idempotency: CheckoutIdempotencyCookie; reuseOnRetry: string } {
  const cookie: CheckoutIdempotencyCookie = {
    fingerprint: input.fingerprint,
    key: input.firstKey,
  };
  const retry = resolveCheckoutIdempotencyKey({
    fingerprint: input.fingerprint,
    cookie,
    clientKey: "cko_should_not_win",
    mint: () => "cko_minted_new",
  });
  return {
    orderId: input.createdOrderId,
    idempotency: cookie,
    reuseOnRetry: retry.key,
  };
}
