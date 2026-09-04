import "server-only";

import type { CustomerAddressInput } from "@/lib/customer/types";

const DEFAULT_TIMEOUT_MS = 8_000;
const BFF_KEY_HEADER = "X-Tervona-BFF-Key";

export class TervonaCustomerError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly remoteMessage?: string,
    readonly code?: string,
    readonly items?: unknown,
  ) {
    super(message);
    this.name = "TervonaCustomerError";
  }
}

export type TervonaAuthSuccess = {
  customer: unknown;
  sessionToken: string;
  expiresAt?: string;
};

function apiRoot(): string {
  const raw = (process.env.TERVONA_STOREFRONT_API_URL ?? "").trim();
  if (!raw) {
    throw new TervonaCustomerError("Tervona is not configured", 503);
  }
  return raw.replace(/\/$/, "");
}

function bffKey(): string {
  const key = (process.env.TERVONA_STOREFRONT_BFF_KEY ?? "").trim();
  if (!key) {
    throw new TervonaCustomerError("Tervona BFF key is not configured", 503);
  }
  return key;
}

function isJsonContentType(value: string | null): boolean {
  return Boolean(value && value.toLowerCase().includes("application/json"));
}

function remoteErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const error = (body as { error?: unknown }).error;
  return typeof error === "string" ? error : undefined;
}

export async function tervonaCustomerFetch<T>(
  path: string,
  init: {
    method?: string;
    body?: unknown;
    sessionToken?: string | null;
    clientIp?: string;
    idempotencyKey?: string;
    checkoutAccess?: string | null;
    timeoutMs?: number;
  } = {},
): Promise<T> {
  const root = apiRoot();
  const key = bffKey();
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    init.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  const headers: Record<string, string> = {
    Accept: "application/json",
    [BFF_KEY_HEADER]: key,
  };
  if (init.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (init.sessionToken) {
    headers.Authorization = `Bearer ${init.sessionToken}`;
  }
  if (init.clientIp) {
    headers["X-Forwarded-For"] = init.clientIp;
  }
  if (init.idempotencyKey) {
    headers["Idempotency-Key"] = init.idempotencyKey;
  }
  if (init.checkoutAccess) {
    headers["X-Tervona-Checkout-Access"] = init.checkoutAccess;
  }

  try {
    const res = await fetch(`${root}${path}`, {
      method: init.method ?? "GET",
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: controller.signal,
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");
    let body: unknown = null;
    if (isJsonContentType(contentType)) {
      try {
        body = await res.json();
      } catch {
        body = null;
      }
    }

    if (!res.ok) {
      const record = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
      throw new TervonaCustomerError(
        `Tervona customer HTTP ${res.status}`,
        res.status,
        remoteErrorMessage(body),
        typeof record?.code === "string" ? record.code : undefined,
        record?.items,
      );
    }

    return body as T;
  } catch (error) {
    if (error instanceof TervonaCustomerError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new TervonaCustomerError("Tervona customer request timeout", 504);
    }
    throw new TervonaCustomerError("Tervona customer request failed", 503);
  } finally {
    clearTimeout(timer);
  }
}

function requireAuthPayload(body: unknown): TervonaAuthSuccess {
  if (!body || typeof body !== "object") {
    throw new TervonaCustomerError("Invalid auth payload", 502);
  }
  const data = body as Record<string, unknown>;
  const token = typeof data.sessionToken === "string" ? data.sessionToken.trim() : "";
  if (!token) {
    throw new TervonaCustomerError("Invalid auth payload", 502);
  }
  return {
    customer: data.customer ?? null,
    sessionToken: token,
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : undefined,
  };
}

export async function tervonaRegister(
  payload: Record<string, unknown>,
  clientIp?: string,
): Promise<TervonaAuthSuccess> {
  const body = await tervonaCustomerFetch<unknown>("/api/storefront/auth/register", {
    method: "POST",
    body: payload,
    clientIp,
  });
  return requireAuthPayload(body);
}

export async function tervonaLogin(
  payload: Record<string, unknown>,
  clientIp?: string,
): Promise<TervonaAuthSuccess> {
  const body = await tervonaCustomerFetch<unknown>("/api/storefront/auth/login", {
    method: "POST",
    body: payload,
    clientIp,
  });
  return requireAuthPayload(body);
}

export async function tervonaLogout(
  sessionToken: string | null,
  clientIp?: string,
): Promise<void> {
  try {
    await tervonaCustomerFetch("/api/storefront/auth/logout", {
      method: "POST",
      sessionToken,
      clientIp,
    });
  } catch {
    // Cookie is cleared locally even if remote logout fails.
  }
}

export async function tervonaMe(sessionToken: string): Promise<unknown> {
  return tervonaCustomerFetch("/api/storefront/auth/me", {
    sessionToken,
  });
}

export async function tervonaListAddresses(sessionToken: string): Promise<unknown> {
  return tervonaCustomerFetch("/api/storefront/customer/addresses", {
    sessionToken,
  });
}

export async function tervonaCreateAddress(
  sessionToken: string,
  payload: CustomerAddressInput,
): Promise<unknown> {
  return tervonaCustomerFetch("/api/storefront/customer/addresses", {
    method: "POST",
    sessionToken,
    body: payload,
  });
}

export async function tervonaUpdateAddress(
  sessionToken: string,
  id: string,
  payload: Partial<CustomerAddressInput>,
): Promise<unknown> {
  return tervonaCustomerFetch(
    `/api/storefront/customer/addresses/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      sessionToken,
      body: payload,
    },
  );
}

export async function tervonaDeleteAddress(
  sessionToken: string,
  id: string,
): Promise<unknown> {
  return tervonaCustomerFetch(
    `/api/storefront/customer/addresses/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      sessionToken,
    },
  );
}

export async function tervonaListOrders(sessionToken: string): Promise<unknown> {
  return tervonaCustomerFetch("/api/storefront/customer/orders", {
    sessionToken,
  });
}

export async function tervonaGetOrder(
  sessionToken: string,
  id: string,
): Promise<unknown> {
  return tervonaCustomerFetch(
    `/api/storefront/customer/orders/${encodeURIComponent(id)}`,
    { sessionToken },
  );
}

export type TervonaCreateOrderResponse = {
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  amount: number;
  currency: string;
};

export type TervonaInitializePaymentResponse = {
  provider?: string;
  status: string;
  paymentPageUrl?: string;
};

export type TervonaCheckoutStatusResponse = {
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  amount: number;
  currency: string;
};

export async function tervonaCreateStorefrontOrder(input: {
  payload: Record<string, unknown>;
  idempotencyKey: string;
  sessionToken?: string | null;
  clientIp?: string;
}): Promise<TervonaCreateOrderResponse> {
  const body = await tervonaCustomerFetch<TervonaCreateOrderResponse>(
    "/api/storefront/orders",
    {
      method: "POST",
      body: input.payload,
      idempotencyKey: input.idempotencyKey,
      sessionToken: input.sessionToken,
      clientIp: input.clientIp,
      timeoutMs: 20_000,
    },
  );
  if (!body?.orderId || !body.orderNumber) {
    throw new TervonaCustomerError("Invalid order payload", 502);
  }
  return body;
}

export async function tervonaInitializeCheckoutPayment(input: {
  orderId: string;
  sessionToken?: string | null;
  clientIp?: string;
}): Promise<TervonaInitializePaymentResponse> {
  const body = await tervonaCustomerFetch<TervonaInitializePaymentResponse>(
    "/api/storefront/checkout/payments/initialize",
    {
      method: "POST",
      body: { orderId: input.orderId },
      sessionToken: input.sessionToken,
      clientIp: input.clientIp,
      timeoutMs: 25_000,
    },
  );
  if (!body?.status) {
    throw new TervonaCustomerError("Invalid payment payload", 502);
  }
  if ("checkoutToken" in (body as object) || "token" in (body as object)) {
    throw new TervonaCustomerError("Unsafe payment payload", 502);
  }
  return {
    provider: body.provider,
    status: body.status,
    paymentPageUrl: body.paymentPageUrl,
  };
}

export async function tervonaCheckoutStatus(input: {
  orderId: string;
  sessionToken?: string | null;
  checkoutAccess?: string | null;
}): Promise<TervonaCheckoutStatusResponse> {
  return tervonaCustomerFetch<TervonaCheckoutStatusResponse>(
    `/api/storefront/checkout/orders/${encodeURIComponent(input.orderId)}`,
    {
      sessionToken: input.sessionToken,
      checkoutAccess: input.checkoutAccess,
      timeoutMs: 12_000,
    },
  );
}
